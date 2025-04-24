import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Relation } from 'typeorm';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Store } from './store.entity';

@Entity({ name: 'ANTENA' })
export class Antenna {
  @ApiProperty({ description: 'Id da antena' })
  @PrimaryGeneratedColumn({ name: 'AntenaId' })
  id: number;

  @ApiProperty({ description: 'Descrição da antena' })
  @Column({ name: 'Descricao', length: 255 })
  description: string;

  @ApiProperty({ description: 'Data da última leitura' })
  @Column({ name: 'DataUltimaLeitura', nullable: true })
  lastReading?: Date;

  @ApiHideProperty()
  @ManyToOne(() => Store, (store) => store.antennas)
  @JoinColumn({ name: 'LojaId' })
  store: Relation<Store>;
}
