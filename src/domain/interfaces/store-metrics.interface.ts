import { EProductItemStatus } from '../enums';

export interface IStoreMetrics {
  storeId: string;
  status: EProductItemStatus;
  quantity: number;
  value: number;
}
