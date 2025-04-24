import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { PreInvoicingProduct } from './pre-invoice.product.entity';

@Entity({ name: 'PRE_FATURAMENTO' })
export class PreInvoicing {
  @PrimaryGeneratedColumn('uuid')
  OperationId: string;

  @Column()
  StoreId: number;

  @Column()
  DataProcedimento: string;

  @Column({ length: 255 })
  Procedimento: string;

  @Column({ length: 255 })
  NomeMedico: string;

  @Column({ length: 255 })
  CRM: string;

  @Column({ length: 255 })
  NomePaciente: string;

  @Column({ type: 'text' })
  Observacao: string;

  @Column({ length: 255 })
  NomeConvenio: string;

  @CreateDateColumn({ type: 'datetime' })
  CreatedAt: Date;

  @Column({ length: 50, default: 'WAITING' })
  Status: string;

  @Column({ type: 'text', nullable: true })
  Description?: string;

  @Column({ type: 'text', nullable: true })
  Usuario?: string;

  @OneToMany(() => PreInvoicingProduct, (product) => product.preInvoicing, { cascade: true })
  produtos: PreInvoicingProduct[];
}
