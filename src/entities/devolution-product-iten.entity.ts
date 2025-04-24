import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'DEVOLUCAO_PRODUTO_ITEM' })
export class DevolutionProductIten {
  @PrimaryGeneratedColumn({ name: 'DevolucaoItemId' })
  id: number;

  @Column({ name: 'DevolucaoId' })
  devolution: number;

  @Column({ name: 'ProdutoItemId' })
  productIten: number;

  @Column({ name: 'PedidoOrigem' })
  originalOrderNumber: string;

  @Column({ name: 'FaturaOrigem' })
  originalInvoiceNumber: string;

  @Column({ name: 'FaturaDigitoOrigem' })
  originalInvoiceSeries: string;
}
