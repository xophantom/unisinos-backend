import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductHistory } from '../entities';

@Injectable()
export class ProductHistoryService {
  constructor(
    @InjectRepository(ProductHistory)
    private readonly productHistoryRepository: Repository<ProductHistory>,
  ) {}

  async createHistory(productHistoryData: Partial<ProductHistory>): Promise<ProductHistory> {
    const historyRecord = this.productHistoryRepository.create(productHistoryData);
    return await this.productHistoryRepository.save(historyRecord);
  }

  async getHistoryByProductId(epc: string): Promise<ProductHistory[]> {
    return await this.productHistoryRepository.find({
      where: { epc },
    });
  }
}
