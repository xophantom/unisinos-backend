import { BaseError } from './base.error';

export class ServiceUnavailableError extends BaseError {
  constructor({ title, detail }: { title: string; detail: string }) {
    super(503, 'SERVICE_UNAVAILABLE', title, detail);
  }
}
