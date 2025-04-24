import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Like, Not, Repository } from 'typeorm';
import { ClientNotFoundError } from 'src/errors';
import { Client, Store } from '../entities';
import { ElfaApiService } from './elfa-api.service';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    private readonly elfaApiService: ElfaApiService,
  ) {}

  async listClients(page: number, pageSize: number, search: string, searchByDocument?: string) {
    const where: FindOptionsWhere<Client> = { stores: { document: Not('0') } };

    if (search) {
      if (this.onlyNumbers(search)) {
        where.code = Number(search);
      } else {
        where.tradingName = Like(`%${search}%`);
      }
    }

    if (searchByDocument) {
      where.stores = { document: Like(`%${searchByDocument}%`) };
    }

    return this.clientRepository.find({
      select: {
        id: true,
        code: true,
        tradingName: true,
        stores: {
          id: true,
          code: true,
          document: true,
          city: true,
          state: true,
          address: true,
          cep: true,
        },
      },
      relations: {
        stores: true,
      },
      where,
      order: { id: 'ASC' },
      take: pageSize,
      skip: (page - 1) * pageSize,
    });
  }

  async getClientByCode(code: number): Promise<Client> {
    const client = this.clientRepository.findOne({
      select: { id: true, code: true, tradingName: true },
      where: {
        code,
      },
    });

    if (!client) {
      throw new ClientNotFoundError();
    }

    return client;
  }

  async listClientStores(clientId: number, page: number, pageSize: number) {
    return this.storeRepository.find({
      select: {
        id: true,
        code: true,
        document: true,
      },
      where: {
        client: {
          id: clientId,
        },
      },
      order: {
        code: 'ASC',
      },
      take: pageSize,
      skip: (page - 1) * pageSize,
    });
  }

  onlyNumbers(search: string): boolean {
    if (search) return /^\d+$/.test(search);
    return false;
  }

  async getElfaCustomer(clientId: string) {
    const elfaCutomer = await this.elfaApiService.getElfaCustomer(clientId);

    const elfaCustomerStore = await this.storeRepository.findOne({
      where: {
        document: elfaCutomer.CGC,
      },
    });

    return {
      ...elfaCutomer,
      Store: elfaCustomerStore.code,
    };
  }

  async listStores(page: number, pageSize: number, search?: string, searchByDocument?: string, code?: string) {
    const where: FindOptionsWhere<Store> = {};

    if (search) {
      where.client = {
        tradingName: Like(`%${search}%`),
      };
    }

    if (searchByDocument) {
      where.document = Like(`%${searchByDocument}%`);
    }

    if (code) {
      where.client = {
        code: Number(code),
      };
    }

    const stores = await this.storeRepository.find({
      select: {
        id: true,
        code: true,
        document: true,
        client: {
          code: true,
          tradingName: true,
        },
      },
      relations: {
        client: true,
      },
      where,
      order: { id: 'ASC' },
      take: pageSize,
      skip: (page - 1) * pageSize,
    });

    return stores.map((store) => ({
      tradingName: store.client.tradingName,
      code: store.client.code,
      document: store.document,
    }));
  }
}
