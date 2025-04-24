import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Not, Repository } from 'typeorm';
import { Antenna, Movement, Order, ProductItem } from '../entities';
import { logger } from '../tools';
import { EProductItemStatus, IAntennaName, TagEventBodyDto } from '../domain';

type ITagMapItem = {
  antennaName: IAntennaName;
  timestamp: Date;
};

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Movement)
    private readonly movementRepository: Repository<Movement>,
    @InjectRepository(ProductItem)
    private readonly productItemRepository: Repository<ProductItem>,
    @InjectRepository(Antenna)
    private readonly antennaRepository: Repository<Antenna>,
  ) {}

  getHighestDate(tagMapItems: ITagMapItem[]) {
    const highestInside = tagMapItems
      .filter(({ antennaName }) => antennaName === 'dentro')

      .sort((a, b) => (b.timestamp > a.timestamp ? 1 : -1))[0];

    const highestOutside = tagMapItems
      .filter(({ antennaName }) => antennaName === 'fora')
      .sort((a, b) => (b.timestamp > a.timestamp ? 1 : -1))[0];

    if (highestInside && highestOutside) {
      if (highestInside.timestamp > highestOutside.timestamp) {
        return {
          antennaName: 'dentro',
          timestamp: highestInside.timestamp,
        };
      }

      return {
        antennaName: 'fora',
        timestamp: highestOutside.timestamp,
      };
    }

    if (highestInside?.timestamp) {
      return {
        antennaName: 'dentro',
        timestamp: highestInside.timestamp,
      };
    }

    return {
      antennaName: 'fora',
      timestamp: highestOutside.timestamp,
    };
  }

  groupTags(body: TagEventBodyDto[]) {
    const tagsMap = new Map<string, ITagMapItem[]>();

    body.forEach(({ timestamp, tagInventoryEvent }) => {
      const { epcHex, antennaName } = tagInventoryEvent;

      if (tagsMap.has(epcHex)) {
        const item = tagsMap.get(epcHex);

        item.push({ timestamp: new Date(timestamp), antennaName });

        tagsMap.set(epcHex, item);
      } else {
        tagsMap.set(epcHex, [{ timestamp: new Date(timestamp), antennaName }]);
      }
    });

    return tagsMap;
  }

  getTagsByAntenna(tagMap: Map<string, ITagMapItem[]>, antennaName: IAntennaName) {
    const selectedTags = new Map<string, Date>();

    tagMap.forEach((value, epcHex) => {
      const highestDate = this.getHighestDate(value);

      if (highestDate.antennaName === antennaName) {
        selectedTags.set(epcHex, highestDate.timestamp);
      }
    });

    return selectedTags;
  }

  async checkTags(antennaId: number, tagEvents: TagEventBodyDto[]) {
    if (tagEvents.length) {
      const inventoryEvents = tagEvents.filter(({ eventType }) => eventType === 'taginventory');

      const groupedEpcs = this.groupTags(inventoryEvents);

      const enteredEpcs = this.getTagsByAntenna(groupedEpcs, 'dentro');

      logger.debug('EPCs detectados pela pela antena de entrada', {
        epcs: enteredEpcs.size,
      });

      const leftEpcs = this.getTagsByAntenna(groupedEpcs, 'fora');

      logger.debug('EPCs detectados pela pela antena de saida', {
        epcs: leftEpcs.size,
      });

      const orderIds = await this.getOrderIds(antennaId);

      if (enteredEpcs.size) {
        logger.debug('EPCs dentro', { epcs: enteredEpcs.keys() });

        await this.updateTagsReading(orderIds, enteredEpcs, 'dentro');
      }

      if (leftEpcs.size) {
        logger.debug('EPCs fora', { epcs: leftEpcs.keys() });

        await this.updateTagsReading(orderIds, leftEpcs, 'fora');
      }

      await this.updateOrdersStatus([...enteredEpcs.keys(), ...leftEpcs.keys()]);
    } else {
      logger.debug('Nenhum evento foi enviado, ignorando rotina de atualização');
    }

    await this.updateAntennaLastReading(antennaId);
  }

  private async getOrderIds(antennaId: number) {
    const orders = await this.orderRepository.find({
      where: {
        store: {
          antennas: {
            id: In([antennaId]),
          },
        },
      },
      select: {
        id: true,
      },
    });

    const orderIds = orders.map(({ id }) => id);

    logger.debug('Ids Solicitação', { orderIds });

    return orderIds;
  }

  private async updateTagsReading(orderIds: number[], filteredTags: Map<string, Date>, antennaName: IAntennaName) {
    const productItems = await this.productItemRepository.find({
      relations: { tag: true },
      where: {
        movements: {
          order: {
            id: In(orderIds),
          },
        },
      },
      select: {
        id: true,
      },
    });

    const filteredProductItems = productItems.filter(({ tag }) => filteredTags.has(tag.epc.toUpperCase()));

    logger.debug('Ids ProdutoItem', {
      productItemsIds: filteredProductItems.map(({ id }) => id),
    });

    if (filteredProductItems.length) {
      logger.debug('Atualizando movimentações');

      await Promise.all(
        filteredProductItems.map(async ({ id, tag }) => {
          const time = tag.epc.toUpperCase();

          const timestamp = filteredTags.get(time);

          return this.movementRepository.update(
            {
              productItem: {
                id,
              },
            },
            {
              [antennaName === 'dentro' ? 'enteredAt' : 'leftAt']: timestamp,
            },
          );
        }),
      );

      await this.processMovements(filteredProductItems);
    }
  }

  private async updateAntennaLastReading(antennaId: number) {
    try {
      logger.debug('Atualizando data da última leitura da antena', {
        antennaId,
      });

      await this.antennaRepository.update(
        {
          id: antennaId,
        },
        {
          lastReading: new Date(),
        },
      );
    } catch (error) {
      logger.error('Falha ao atualizar data da última leitura da antena', {
        error,
      });
    }
  }

  private async updateOrdersStatus(epcs: string[]) {
    if (!epcs.length) return;

    logger.debug('Iniciando o processo de atualização dos status dos pedidos.');

    const movements = await this.getMovementsByEpcs(epcs);

    logger.debug(`Encontrados ${movements.length} pedidos que precisam ser atualizados.`);

    if (!movements.length) return;

    logger.debug('Iniciando o processo de atualização dos pedidos.');

    await this.updateOrders(movements);
    await this.updateProductItems(movements);
  }

  private async updateOrders(movements: Movement[]) {
    const arrivedOrderIds = movements.map(({ order }) => order.id);
    const result = await this.orderRepository.update({ id: In(arrivedOrderIds) }, { receivedAt: new Date() });
    logger.debug('Pedidos atualizados', { result });
  }

  private async updateProductItems(movements: Movement[]) {
    const productItemIds = movements.map(({ productItem }) => productItem.id);
    if (productItemIds.length > 0) {
      await this.updateProductItemStatus(productItemIds, EProductItemStatus.IN_CLIENT_STOCK);
    }
  }

  private async processMovements(productItems: ProductItem[]) {
    const movements = await this.getMovementsByProductItemIds(productItems);

    const { stockDiscrepancyIds, inClientStockIds } = this.classifyMovements(movements);

    if (stockDiscrepancyIds.length > 0) {
      await this.updateProductItemStatus(stockDiscrepancyIds, EProductItemStatus.STOCK_DISCREPANCY);
    }
    if (inClientStockIds.length > 0) {
      await this.updateProductItemStatus(inClientStockIds, EProductItemStatus.IN_CLIENT_STOCK);
    }
  }

  private async getMovementsByProductItemIds(productItems: ProductItem[]) {
    const productItemIds = productItems.map(({ id }) => id);

    return this.movementRepository.find({
      where: { productItem: { id: In(productItemIds) } },
      relations: { productItem: true },
    });
  }

  private async getMovementsByEpcs(epcs: string[]) {
    return this.movementRepository.find({
      relations: { order: true, productItem: true },
      where: { order: { receivedAt: IsNull() }, productItem: { tag: { epc: In(epcs) } } },
      select: { id: true, order: { id: true } },
    });
  }

  private classifyMovements(movements: Movement[]) {
    const stockDiscrepancyIds: number[] = [];
    const inClientStockIds: number[] = [];

    movements.forEach(({ productItem, enteredAt, leftAt }) => {
      if (leftAt && enteredAt) {
        if (leftAt > enteredAt) {
          stockDiscrepancyIds.push(productItem.id);
        }
        if (leftAt < enteredAt) {
          inClientStockIds.push(productItem.id);
        }
      }
    });

    return { stockDiscrepancyIds, inClientStockIds };
  }

  private async updateProductItemStatus(productItemIds: number[], status: EProductItemStatus) {
    const { affected } = await this.productItemRepository.update({ id: In(productItemIds), status: Not(In([EProductItemStatus.PRE_INVOICED,EProductItemStatus.INVOICED, EProductItemStatus.IN_ELFA_STOCK])) }, { status });
    logger.debug(`Atualizados ${affected} itens de produto para o status ${status}.`);
  }
}
