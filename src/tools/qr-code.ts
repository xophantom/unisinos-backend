import { constructFinalString, padInput, validateFinalStringLength, validateInputLength } from './string';

// ---- Constants -----
const VERSION: number = 1;
const VERSION_START: number = 0;
const VERSION_END: number = VERSION_START + 2;

const PRODUCT_CODE_START: number = VERSION_END;
const PRODUCT_CODE_END: number = PRODUCT_CODE_START + 7;

const LOT_START: number = PRODUCT_CODE_END;
const LOT_END: number = LOT_START + 14;

const EXPIRATION_DATE_START: number = LOT_END;
const EXPIRATION_DATE_END: number = EXPIRATION_DATE_START + 8;

const EPC_START: number = EXPIRATION_DATE_END;
const EPC_END: number = EPC_START + 24;

const MAX_LENGTH: number = 55;

// ---- Encode -----
export const encodeQrCode = (productCode: number, lot: string, expirationDate: Date, epc: string): string => {
  // Format the expiration date to YYYY-MM-DD
  const formattedExpirationDate = expirationDate.toISOString().slice(0, 10).replaceAll('-', '');

  // Validate inputs
  validateInputLength(productCode, 7, 'The product code must have a maximum of 7 digits.');
  validateInputLength(lot, 14, 'The lot must have a maximum of 14 characters.');
  validateInputLength(formattedExpirationDate, 8, 'The expiration date must have a maximum of 8 characters.');
  validateInputLength(epc, 24, 'The EPC must have a maximum of 24 characters.');

  // Convert each input to a string and pad with zeros to ensure it's the correct length
  const strVersion = padInput(VERSION, VERSION_START, VERSION_END);
  const strProductCode = padInput(productCode, PRODUCT_CODE_START, PRODUCT_CODE_END);
  const strLot = padInput(lot, LOT_START, LOT_END);
  const strExpirationDate = padInput(formattedExpirationDate, EXPIRATION_DATE_START, EXPIRATION_DATE_END);
  const strEpc = padInput(epc, EPC_START, EPC_END);

  // Concatenate the strings to form the final QR code string
  const finalString = constructFinalString(strVersion, strProductCode, strLot, strExpirationDate, strEpc);

  validateFinalStringLength(finalString, MAX_LENGTH);

  return finalString;
};
