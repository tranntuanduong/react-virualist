import { LANGUAGE_CODE } from './../constant/languageCode';

export const formatCurrency = (number: number, currency: string) => {
  const awaitCurrency = currency || 'EUR';

  return new Intl.NumberFormat(LANGUAGE_CODE[awaitCurrency].code, {
    minimumFractionDigits: 2,
    style: 'currency',
    currency: awaitCurrency,
  }).format(number);
};
