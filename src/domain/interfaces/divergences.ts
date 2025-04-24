export interface GroupedDivergence {
  divergenceIds: number[];
  type: string;
  productCode: number;
  productLot: string;
  quantity: number;
  productExpirationDate: Date | null;
  productDescription: string | null;
  originStoreId: number | null;
  createdAt: Date | null;
  concludedAt: Date | null;
}
