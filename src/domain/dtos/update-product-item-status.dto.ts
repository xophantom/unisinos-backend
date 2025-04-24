import { IsEnum, IsString } from 'class-validator';
import { EProductItemStatus } from '../enums';

export class UpdateProductItemStatusDto {
  @IsString()
  epc: string;

  @IsEnum(EProductItemStatus)
  status: EProductItemStatus;
}
