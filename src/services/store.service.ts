import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryLogNotFoundError, StoreNotFoundError } from 'src/errors';
import { Antenna, ProductInventoryLog, SellerView, StateView, Store } from '../entities';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    @InjectRepository(Antenna)
    private readonly antennaRepository: Repository<Antenna>,
    @InjectRepository(ProductInventoryLog)
    private readonly productInventoryLogRepository: Repository<ProductInventoryLog>,
    @InjectRepository(SellerView)
    private readonly sellerRepository: Repository<SellerView>,
    @InjectRepository(StateView)
    private readonly stateRepository: Repository<StateView>,
  ) {}

  async getStoreInfo(storeId: number) {
    return this.storeRepository.findOne({
      relations: {
        client: true,
      },
      where: {
        id: storeId,
      },
    });
  }

  async getStoreAntennaStatus(storeId: number) {
    return this.antennaRepository.findOne({
      where: {
        store: {
          id: storeId,
        },
      },
      select: {
        id: true,
        lastReading: true,
      },
    });
  }

  async getStoreByDocument(document: string) {
    const store = await this.storeRepository.findOne({
      relations: ['client'],
      where: { document, isActive: true },
    });
    if (!store) throw new StoreNotFoundError();
    return store;
  }

  async getStoreById(storeId: number): Promise<Store> {
    const client = await this.storeRepository.findOne({
      where: {
        id: storeId,
      },
    });

    if (!client) {
      throw new StoreNotFoundError();
    }

    return client;
  }

  async getStoreLogs(storeId: number) {
    const logs = await this.productInventoryLogRepository.find({
      where: {
        storeId,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    if (logs.length === 0) {
      throw new InventoryLogNotFoundError();
    }

    return logs;
  }

  async getSellers(): Promise<SellerView[]> {
    return this.sellerRepository.find();
  }

  async getStates(): Promise<StateView[]> {
    return this.stateRepository.find();
  }
}
