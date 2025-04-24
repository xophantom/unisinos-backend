import { BadRequestException, Injectable } from '@nestjs/common';
import { SaveOrderProductsDTO } from 'src/domain';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderProduct } from '../entities';

@Injectable()
export class OrderProductService {
  constructor(
    @InjectRepository(OrderProduct)
    private readonly orderProductRepository: Repository<OrderProduct>,
  ) {}

  async saveOrderProducts(orderId: number, products: SaveOrderProductsDTO): Promise<OrderProduct> {
    const orderProduct = await this.getProductByOrderId(orderId, products.id);

    if (!orderProduct) {
      const newOrderProduct = {
        amount: products.amount,
        unitCost: products.unitCost,
        product: { id: products.id },
        order: { id: orderId },
      };

      try {
        const savedOrderProduct = await this.orderProductRepository.save(newOrderProduct);
        return savedOrderProduct;
      } catch (error) {
        throw new BadRequestException('Falha ao salvar o novo orderProduct.');
      }
    }

    orderProduct.amount += products.amount;

    try {
      const updatedOrderProduct = await this.orderProductRepository.save(orderProduct);
      return updatedOrderProduct;
    } catch (error) {
      throw new BadRequestException('Falha ao atualizar o orderProduct.');
    }
  }

  async getProductByOrderId(orderId: number, productId: number): Promise<OrderProduct> {
    const orderProduct = await this.orderProductRepository
      .createQueryBuilder('orderProduct')
      .select()
      .where('orderProduct.SolicitacaoId = :orderId', { orderId })
      .andWhere('orderProduct.ProdutoId = :productId', { productId })
      .getOne();

    return orderProduct;
  }
}
