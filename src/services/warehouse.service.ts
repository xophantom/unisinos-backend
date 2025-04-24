import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Warehouse } from '../entities';

@Injectable()
export class WarehouseService {
  constructor(
    @InjectRepository(Warehouse)
    private readonly warehouseRepository: Repository<Warehouse>,
  ) {}

  async listWarehouses(page: number, pageSize: number) {
    return this.warehouseRepository.find({
      select: {
        id: true,
        code: true,
        name: true,
      },
      order: {
        id: 'ASC',
      },
      take: pageSize,
      skip: (page - 1) * pageSize,
    });
  }
}
