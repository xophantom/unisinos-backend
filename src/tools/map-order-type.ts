import { EOrderType } from 'src/domain';

export function mapToEOrderType(lastWord: string): EOrderType {
  switch (lastWord) {
    case 'ELETIVO':
      return EOrderType.ELECTIVE;
    case 'FIXO':
      return EOrderType.FIXED;
    case 'S/WMS':
      return EOrderType.ADJUSTMENT;
    case 'RETORNO':
      return EOrderType.RETURN;

    default:
      throw new Error(`Valor inesperado para type: ${lastWord}`);
  }
}
