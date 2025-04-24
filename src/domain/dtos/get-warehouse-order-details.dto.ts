import { Store } from '@/entities/store.entity';
import { ElfaApiOrderProductModel, ElfaApiOrderResponseModel } from '../models';

class ClientDto {
  code: number;

  tradingName: string;
}

class StoreDto {
  code: number;

  document: string;

  documentType: string;

  city: string;

  state: string;

  client: ClientDto;
}

export class GetWarehouseOrderDetailsDto {
  code: string;

  invoiceNumber: string;

  invoiceSeries: string;

  totalValue: number;

  totalAmount: number;

  store: StoreDto;

  products: ElfaApiOrderProductModel[];
}

export function mapToGetWarehouseOrderDetailsDto({
  order,
  store,
}: {
  order: ElfaApiOrderResponseModel;
  store: Store;
}): GetWarehouseOrderDetailsDto {
  return {
    code: order.code,
    invoiceNumber: order.invoiceNumber,
    invoiceSeries: order.invoiceSeries,
    totalValue: order.totalValue,
    totalAmount: order.totalAmount,
    store: {
      code: store.code,
      document: store.document,
      documentType: store.documentType,
      city: store.city,
      state: store.state,
      client: {
        code: store.client.code,
        tradingName: store.client.tradingName,
      },
    },
    products: order.products,
  };
}
