import { BadRequestException } from '@nestjs/common';

export const padHex = (num: number, length: number): string => num.toString(16).padStart(length, '0');

export const padInput = (input: string | number, start: number, end: number): string =>
  input.toString().padStart(end - start, '0');

export const constructFinalString = (...args: string[]): string => args.join('').toUpperCase();

export const validateFinalStringLength = (str: string, maxLength: number): void => {
  if (str.length !== maxLength) {
    throw new BadRequestException(
      `The final string is not the correct length. It should be ${maxLength} characters but it's ${str.length} characters.`,
    );
  }
};

export const validateInputLength = (input: string | number, maxLength: number, errorMessage: string): void => {
  if (input.toString().length > maxLength) {
    throw new BadRequestException(errorMessage);
  }
};
