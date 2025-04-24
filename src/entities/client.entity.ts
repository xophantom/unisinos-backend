import { Column, Entity, Index, JoinColumn, OneToMany, PrimaryGeneratedColumn, Relation, Unique } from 'typeorm';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Store } from './store.entity';

@Unique('UQ_CLIENTE_CODIGO', ['code'])
@Entity({ name: 'CLIENTE' })
export class Client {
  @ApiProperty({ description: 'Id do cliente' })
  @PrimaryGeneratedColumn({ name: 'ClienteId' })
  id: number;

  @ApiProperty({ description: 'Código do cliente' })
  @Index('INDEX_CLIENTE_CODIGO')
  @Column({ name: 'Codigo', unique: true })
  code: number;

  @ApiProperty({ description: 'Nome do cliente' })
  @Column({ name: 'Nome', length: 255 })
  name: string;

  @ApiProperty({ description: 'Nome fantasia' })
  @Column({ name: 'NomeFantasia', length: 255 })
  tradingName: string;

  @ApiHideProperty()
  @OneToMany(() => Store, (store) => store.client)
  @JoinColumn()
  stores: Relation<Store[]>;
}
