import { parseBarcode } from 'gs1-barcode-parser-mod';
import { logger } from './app-logger';

interface IParsedElement {
  ai: string;
  data: string | Date;
}

interface IParsedData {
  parsedCodeItems: IParsedElement[];
}

export interface IDecodedBarcode {
  gtin: string;
  lot?: string;
  exp?: string;
}

// Doc: https://www.npmjs.com/package/gs1-barcode-parser-mod
export const decodeBarcode = (barcode: string): IDecodedBarcode => {
  const result: IDecodedBarcode = { gtin: '', lot: '', exp: '' };

  try {
    const parsedData: IParsedData = parseBarcode(barcode);

    parsedData.parsedCodeItems.forEach((element) => {
      const { ai, data } = element;

      if (ai === '01') {
        // GTIN
        result.gtin = data as string;
      }
      if (ai === '10') {
        // BATCH/LOT
        result.lot = data as string;
      }
      if (ai === '17') {
        // USE BY OR EXPIRY
        result.exp = data instanceof Date ? data.toISOString().split('T')[0] : '';
      }
    });
  } catch (error) {
    logger.error('Falha ao ler os dados do código de barras', { error });
  }

  return result;
};
