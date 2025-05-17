import { IsArray, IsString, IsNotEmpty, ArrayMinSize, ArrayMaxSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ColorAnalysisDto {
  @ApiProperty({
    description: 'Lista de cores selecionadas pelo usuário',
    example: ['laranja', 'verde', 'vermelho'],
    type: [String],
    minItems: 1,
    maxItems: 7,
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(7)
  colors: string[];
}
