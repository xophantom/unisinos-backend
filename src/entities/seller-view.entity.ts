import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({ name: 'VW_REPRESENTANTES' })
export class SellerView {
  @ViewColumn({ name: 'Representante' })
  sellerName: string;
}
