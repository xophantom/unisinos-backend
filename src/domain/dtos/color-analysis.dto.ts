import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, ArrayMinSize, ArrayMaxSize } from 'class-validator';

export class ColorAnalysisDto {
  @ApiProperty({ description: 'ID do totem' })
  @IsString()
  totemId: string;

  @ApiProperty({
    description: 'Array de cores selecionadas pelo usuário',
    example: ['laranja', 'laranja', 'verde', 'verde', 'verde', 'vermelho', 'azul'],
  })
  @IsArray()
  @ArrayMinSize(7)
  @ArrayMaxSize(7)
  @IsString({ each: true })
  colors: string[];
}
