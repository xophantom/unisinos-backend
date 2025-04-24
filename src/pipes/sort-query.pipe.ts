import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { BadRequestError } from '../errors';

@Injectable()
export class SortQueryPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    if (value && value.toLowerCase() !== 'asc' && value.toLowerCase() !== 'desc') {
      throw new BadRequestError({
        detail: `Parâmetro ${metadata.data} não é um valor válido para ordenação.`,
      });
    }

    return value;
  }
}
