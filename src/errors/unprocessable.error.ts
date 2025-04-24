import { BaseError } from './base.error';

export class UnprocessableError extends BaseError {
  constructor({ title, detail }: { title: string; detail: string }) {
    super(422, 'UNPROCESSABLE_ENTITY', title, detail);
  }
}
