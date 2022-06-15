interface Currency {
  code: string;
  currency: string;
}

type LanguageCode = Record<string, Currency>;

export const LANGUAGE_CODE: LanguageCode = {
  // lv-LV
  EUR: {
    code: "de-DE",
    currency: "EUR",
  },
  CHF: {
    code: "de-CH",
    currency: "CHF",
  },
};

export const DASHBOARD_LANGUAGE = ["en", "de", "it", "fr"];

//link code: http://www.lingoes.net/en/translator/langcode.htm
//currency code: https://taxsummaries.pwc.com/glossary/currency-codes
