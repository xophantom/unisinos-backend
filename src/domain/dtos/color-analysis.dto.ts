import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsNotEmpty, ArrayMinSize, ArrayMaxSize } from 'class-validator';

export class ColorAnalysisDto {
  @ApiProperty({ description: 'ID do totem' })
  @IsString()
  @IsNotEmpty()
  totemId: string;

  @ApiProperty({
    description: 'Array de cores selecionadas pelo usuário',
    example: ['laranja', 'laranja', 'verde', 'verde', 'verde', 'vermelho', 'azul'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(7)
  colors: string[];
}
