import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'PRODUTO_HISTORICO' })
export class ProductHistory {
  @ApiProperty({ description: 'Unique ID for the history entry' })
  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number;

  ///

  @ApiProperty({ description: 'Product ID' })
  @Column({ name: 'IdProduto' })
  productId: number;

  @ApiProperty({ description: 'EPC of the product' })
  @Column({ name: 'Epc' })
  epc: string;

  @ApiProperty({ description: 'Type of history' })
  @Column({ name: 'Tipo' })
  type: string;

  @ApiProperty({ description: 'Warehouse ID' })
  @Column({ name: 'Armazem' })
  warehouseId: number;

  ///

  @ApiProperty({ description: 'Creation date of the EPC' })
  @Column({ name: 'DataCriacaoEpc' })
  epcCreatedAt?: Date;

  @ApiProperty({ description: 'User who created the EPC' })
  @Column({ name: 'UsuarioCriacaoEpc' })
  epcCreatedBy?: string;

  ///

  @ApiProperty({ description: 'Order link date' })
  @Column({ name: 'DataVinculoPedido' })
  orderLinkedAt?: Date;

  @ApiProperty({ description: 'Order number' })
  @Column({ name: 'NumeroPedido' })
  orderNumber?: string;

  @ApiProperty({ description: 'User who linked the order' })
  @Column({ name: 'UsuarioPedido' })
  orderLinkedBy?: string;

  ///

  @ApiProperty({ description: 'Inventory date' })
  @Column({ name: 'DataInventario' })
  inventoryDate?: Date;

  @ApiProperty({ description: 'Inventory order' })
  @Column({ name: 'RemessaInventario' })
  inventoryOrder?: string;

  @ApiProperty({ description: 'Inventory user' })
  @Column({ name: 'UsuarioInventario' })
  inventoryUser?: string;

  ///

  @ApiProperty({ description: 'Inventory reverse date' })
  @Column({ name: 'DataEstornoInventario' })
  reverseInventoryAt?: Date;

  @ApiProperty({ description: 'Reverse client' })
  @Column({ name: 'ClienteEstorno' })
  reverseClient?: string;

  ///

  @ApiProperty({ description: 'Devolution date' })
  @Column({ name: 'DataDevolucao' })
  devolutionDate?: Date;

  @ApiProperty({ description: 'Devolution invoice' })
  @Column({ name: 'NotaFiscalDevolucao' })
  devolutionInvoice?: string;

  @ApiProperty({ description: 'Devolution user' })
  @Column({ name: 'UsuarioDevolucao' })
  devolutionUser?: string;

  @ApiProperty({ description: 'Devolution adjustment' })
  @Column({ name: 'AjusteDevolucao' })
  devolutionAdjustment?: string;

  @ApiProperty({ description: 'Devolution adjustment invoice' })
  @Column({ name: 'NotaFiscalDevolucaoAjuste' })
  devolutionAdjustmentInvoice?: string;

  @ApiProperty({ description: 'Client ID of Devolution adjustment' })
  @Column({ name: 'IdClienteAjusteDevolucao' })
  devolutionAjustmentClientId?: number;

  @ApiProperty({ description: 'Devolution adjustment date' })
  @Column({ name: 'DataAjusteDevolucao' })
  devolutionAdjustmentDate?: Date;

  @ApiProperty({ description: 'Devolution adjustment user' })
  @Column({ name: 'UsuarioAjusteDevolucao' })
  devolutionAdjustmentUser?: string;

  ///

  @ApiProperty({ description: 'Record creation date' })
  @Column({ name: 'CreatedAt' })
  createdAt?: Date;
}
