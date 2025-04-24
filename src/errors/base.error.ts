export class BaseError extends Error {
  readonly statusCode: number;

  readonly code: string;

  readonly title: string;

  readonly detail: string;

  constructor(statusCode: number, code: string, title: string, detail: string) {
    super(`Erro ${code}: ${detail}`);

    this.statusCode = statusCode;
    this.code = code;
    this.title = title;
    this.detail = detail;
  }
}
