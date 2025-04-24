export interface IStoreOrder {
  storeId: number;
  orderId: number;
  orderCode: number;
  requestedAt: Date;
  totalValue: number;
  requestedAmount: number;
  consumedAmount: number;
  divergentAmount: number;
  shippedAmount: number;
  confirmedBalance: number;
  divergentBalance: number;
}
