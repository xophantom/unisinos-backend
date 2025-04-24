import { EOrderType } from '../enums';

interface Product {
  code: number;

  lot: string;

  amount: number;

  unitCost: number;

  identifications: string[];
}

export interface ImportOrder {
  code: number;

  storeId: number;

  type: EOrderType;

  requestedAt: Date;

  products: Product[];
}
