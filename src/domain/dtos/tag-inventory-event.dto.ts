import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, IsIn } from 'class-validator';
import { IAntennaName } from '../interfaces';

export class TagInventoryEventDto {
  @ApiProperty({
    description: 'Código Hex do EPC vinculado a tag. Case insensitive',
  })
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim().toUpperCase())
  epcHex: string;

  @ApiProperty({
    description: 'Nome da antena. Case insensitive',
    enum: ['dentro', 'fora'],
  })
  @IsNotEmpty()
  @IsString()
  @IsIn(['dentro', 'fora'])
  @Transform(({ value }) => value.trim().toLowerCase())
  antennaName: IAntennaName;
}
