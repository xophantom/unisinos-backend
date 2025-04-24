import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'LOG_INVENTARIO_PRODUTO' })
export class ProductInventoryLog {
  @PrimaryGeneratedColumn({ name: 'IdLog', type: 'int' })
  id: number;

  @Column({ name: 'StoreId', type: 'int' })
  storeId: number;

  @Column({ name: 'NomeUsuario', length: 255 })
  userName: string;

  @Column({ name: 'NomeArquivo', length: 255 })
  fileName: string;

  @Column({ name: 'URL', length: 'max' })
  URL: string;

  @Column({ name: 'ConciliacaoURL', length: 'max' })
  conciliationURL: string;

  @CreateDateColumn({ type: 'datetime', name: 'DataCriacao' })
  createdAt: Date;
}
