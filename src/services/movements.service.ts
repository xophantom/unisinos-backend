import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Movement, ProductItem } from '../entities';

@Injectable()
export class MovementService {
  private static readonly CHUNK_SIZE = 100;

  constructor() {}

  async saveMovements(entityManager: EntityManager, orderId: number, productItems: ProductItem[]) {
    const formattedMovements = productItems.map(({ id }) => ({
      productItem: { id },
      order: { id: orderId },
    }));
    const movementEntities = entityManager.create(Movement, formattedMovements);
    return entityManager.save(movementEntities, { chunk: MovementService.CHUNK_SIZE });
  }

  updateMovements(entityManager: EntityManager, productItems: ProductItem[]) {
    const productItemIds = productItems.map(({ id }) => id);
    return entityManager
      .createQueryBuilder()
      .update(Movement)
      .set({ isDevolved: true })
      .where('ProdutoItemId IN (:...productItemIds)', { productItemIds })
      .execute();
  }

  // --- Private methods ---
}
