import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, IsNumber, ArrayMinSize } from 'class-validator';

export class RegisterInteractionDto {
  @ApiProperty({
    description: 'Cores selecionadas pelo usuário',
    type: [String],
    example: ['azul', 'vermelho'],
  })
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  selectedColors: string[];

  @ApiProperty({
    description: 'IDs dos cursos selecionados pelo usuário',
    type: [Number],
    example: [1, 2, 3],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  courseIds: number[];
}
