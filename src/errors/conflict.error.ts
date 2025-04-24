import { BaseError } from './base.error';

export class ConflictError extends BaseError {
  constructor({ title, detail }: { title: string; detail: string }) {
    super(409, 'CONFLICT', title, detail);
  }
}
