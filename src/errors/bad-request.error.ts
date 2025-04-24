import { BaseError } from './base.error';

export class BadRequestError extends BaseError {
  constructor({
    title = 'Bad Request',
    detail = 'A requisição foi mal formada.',
  }: {
    title?: string;
    detail?: string;
  } = {}) {
    super(400, 'BAD_REQUEST', title, detail);
  }
}
