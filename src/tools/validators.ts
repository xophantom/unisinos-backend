export function validateCNPJ(cnpj: string): boolean {
  cnpj = cnpj.replace(/[^\d]+/g, '');

  if (cnpj.length !== 14) return false;

  if (/^(\d)\1{13}$/.test(cnpj)) return false;

  const validateDigits = (cnpj: string, factor: number): number => {
    let total = 0;
    let pos = factor - 7;

    for (let i = factor; i >= 1; i--) {
      total += parseInt(cnpj.charAt(factor - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    const result = total % 11;
    return result < 2 ? 0 : 11 - result;
  };

  const digit1 = validateDigits(cnpj.slice(0, 12), 12);
  if (digit1 !== parseInt(cnpj.charAt(12))) return false;

  const digit2 = validateDigits(cnpj.slice(0, 13), 13);
  if (digit2 !== parseInt(cnpj.charAt(13))) return false;

  return true;
}
