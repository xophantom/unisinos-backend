import { BaseError } from './base.error';

export class InternalServerError extends BaseError {
  constructor() {
    super(500, 'INT_ERR', 'Erro interno do servidor', 'Ocorreu um erro desconhecido no servidor');
  }
}
