import { IsNotEmpty, IsString, ValidateNested, IsOptional, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { TagInventoryEventDto } from './tag-inventory-event.dto';

export class TagEventBodyDto {
  @ApiProperty({ description: 'Data da leitura' })
  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  timestamp: Date;

  @ApiProperty({ description: 'Tipo de evento emitido pela antena' })
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim().toLowerCase())
  eventType: string;

  @ApiProperty({ description: 'Evento de leitura das tags' })
  @IsOptional()
  @ValidateNested()
  @Type(() => TagInventoryEventDto)
  tagInventoryEvent?: TagInventoryEventDto;
}
