/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Repository } from 'typeorm';
import { Product } from '../entities';
import { In } from 'typeorm';

export async function applyProductConversion(products: any[], productRepository: Repository<Product>): Promise<any[]> {
  const productCodes = products.map((product) => product.code);
  const productEntities = await productRepository.find({
    where: { code: In(productCodes) },
    select: ['code', 'description', 'conversionFactor', 'conversionType', 'canConvert'],
  });

  return products.map((product) => {
    const productEntity = productEntities.find((p) => p.code === product.code);

    if (productEntity) {
      const { conversionFactor, conversionType, canConvert } = productEntity;

      if (canConvert && conversionType === 'D' && conversionFactor) {
        const convertedAmount = product.amount / conversionFactor;
        if (convertedAmount > 0 && Number.isInteger(convertedAmount)) {
          product.amount = convertedAmount;
        }
      }
    }
    return product;
  });
}
