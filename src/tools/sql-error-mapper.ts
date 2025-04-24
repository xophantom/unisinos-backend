import { QueryFailedError, TypeORMError } from 'typeorm';

export const sqlErrorMapper = (error: TypeORMError) => {
  if (error instanceof QueryFailedError) {
    const driverErrorMessage = error.driverError.message.toLowerCase();

    if (driverErrorMessage.includes('unique key')) {
      return 'Item duplicado';
    }

    if (driverErrorMessage.includes('timeout')) {
      return 'Timeout de conexão com o banco de dados';
    }
  }

  return 'Causa desconhecido';
};
