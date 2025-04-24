import { Store } from '@/entities/store.entity';
import { EOrderType } from '../enums';
import { ElfaApiOrderResponseModel } from '../models';
import { ImportWarehouseOrderDetailsDto } from './import-warehouse-order-details.dto';

export class ProductImport {
  constructor(
    public readonly code: number,
    public readonly lot: string,
    public readonly amount: number,
    public readonly unitCost: number,
    public readonly totalValue: number,
    public readonly identifications: string[],
    public readonly sellerName: string,
    public readonly consignmentItem: string,
    public readonly consignmentCode: string,
  ) {}
}

export class ImportOrderDto {
  constructor(
    public readonly code: string,
    public readonly type: EOrderType,
    public readonly requestedAt: Date,
    public readonly store: Store,
    public readonly products?: ProductImport[],
    public readonly order?: ElfaApiOrderResponseModel,
    public readonly warehouseId?: number,
    public readonly armazemId?: number,
    public readonly username?: string,
    public readonly paymentTerm?: string,
    public readonly operationDate?: string,
    public readonly patientName?: string,
  ) {}

  static fromElfaApiOrderResponse(
    model: ElfaApiOrderResponseModel,
    dto: ImportWarehouseOrderDetailsDto,
    store: Store,
    warehouseId: number,
  ): ImportOrderDto {
    const removeLeadingZeros = (str: string) => str.replace(/^0+/, '');

    const products = model.products.map((orderProduct) => {
      const cleanedLot = removeLeadingZeros(orderProduct.lot);
      const productRead = dto.products.find((product) => {
        const lotMatch = product.lot ? removeLeadingZeros(product.lot) === cleanedLot : true;
        const codeMatch = product.code === orderProduct.code;

        if (!codeMatch || !lotMatch) {
          console.debug('[product.find] produto ignorado', {
            productCode: product.code,
            orderProductCode: orderProduct.code,
            productLot: product.lot,
            cleanedProductLot: product.lot ? removeLeadingZeros(product.lot) : null,
            cleanedLot,
            codeMatch,
            lotMatch,
          });
        }

        return codeMatch && lotMatch;
      });

      if (!productRead) {
        console.warn('[fromElfaApiOrderResponse] Nenhum productRead encontrado para:', {
          orderProduct,
          cleanedLot,
          dtoProducts: dto.products,
        });
      } else if (productRead.identifications.length === 0) {
        console.warn('[fromElfaApiOrderResponse] productRead encontrado mas sem identifications:', {
          productRead,
        });
      }

      const identifications = productRead ? productRead.identifications : [];

      return new ProductImport(
        orderProduct.code,
        cleanedLot,
        orderProduct.amount,
        orderProduct.unitCost,
        orderProduct.totalValue,
        identifications,
        orderProduct.sellerName,
        orderProduct.consignmentItem,
        orderProduct.consignmentCode,
      );
    });

    return new ImportOrderDto(
      model.code,
      model.type,
      model.requestedAt,
      store,
      products,
      model,
      warehouseId,
      warehouseId,
      'RFID',
      model.paymentTerm,
      model.operationDate,
      model.patientName,
    );
  }
}
