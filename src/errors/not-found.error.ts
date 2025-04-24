import { BaseError } from './base.error';

export class NotFoundError extends BaseError {
  constructor({
    title = 'Recurso não encontrado',
    detail = 'O Recurso solicitado não foi encontrado.',
  }: {
    title?: string;
    detail?: string;
  } = {}) {
    super(404, 'NOT_FOUND', title, detail);
  }
}
