import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiNoContentResponse,
  ApiOperation,
  ApiParam,
  getSchemaPath,
} from '@nestjs/swagger';
import { TagEventBodyDto } from '../domain';

export const CheckTagsSwagger = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Atualizar status das tags RFID',
    }),
    ApiBody({
      schema: {
        type: 'array',
        items: {
          $ref: getSchemaPath(TagEventBodyDto),
        },
      },
    }),
    ApiParam({
      name: 'antennaId',
      description: 'Id da antena',
      type: 'number',
      format: 'integer',
    }),
    ApiNoContentResponse({
      description: 'Tags atualizadas com sucesso',
    }),
  );
