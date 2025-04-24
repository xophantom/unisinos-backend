import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({ name: 'VW_ESTADOS_DISPONIVEIS' })
export class StateView {
  @ViewColumn({ name: 'UF' })
  UF: string;
}
