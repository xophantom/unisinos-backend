import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsNumber } from 'class-validator';
import dayjs from 'dayjs';

export class MovementBillingDto {
  @ApiProperty({ description: 'Id da movimentação' })
  @IsNumber()
  movementId: number;

  @ApiProperty({
    description: 'Data de faturamento do produto',
  })
  @IsDate()
  @Transform(({ value }) => dayjs(value).toDate())
  billedAt: Date;
}
