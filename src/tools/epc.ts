import { constructFinalString, padHex, validateFinalStringLength, validateInputLength } from './string';

// ---- Constants -----
const PREFIX: string = 'E1FA3';
const PREFIX_START: number = 0;
const PREFIX_END: number = PREFIX_START + 5;

const VERSION: number = 1;
const VERSION_START: number = PREFIX_END;
const VERSION_END: number = VERSION_START + 2;

const PRODUCT_ID_START: number = VERSION_END;
const PRODUCT_ID_END: number = PRODUCT_ID_START + 7;

const PRODUCT_ITEM_ID_START: number = PRODUCT_ID_END;
const PRODUCT_ITEM_ID_END: number = PRODUCT_ITEM_ID_START + 10;

const MAX_LENGTH: number = 24;

// ---- Encode -----
export const encodeHexEPC = (productId: number, productItemId: number): string => {
  // Validate inputs
  validateInputLength(productId, 7, 'The product ID must have a maximum of 7 digits.');
  validateInputLength(productItemId, 10, 'The product item ID must have a maximum of 10 digits.');

  // Convert version and productId to hexadecimal and pad with zeros
  const hexVersion = padHex(VERSION, VERSION_END - VERSION_START);
  const hexProductId = padHex(productId, PRODUCT_ID_END - PRODUCT_ID_START);
  const hexProductItemId = padHex(productItemId, PRODUCT_ITEM_ID_END - PRODUCT_ITEM_ID_START);

  // Concatenate the strings to form the final EPC string
  const finalString = constructFinalString(PREFIX, hexVersion, hexProductId, hexProductItemId);

  validateFinalStringLength(finalString, MAX_LENGTH);

  return finalString;
};
