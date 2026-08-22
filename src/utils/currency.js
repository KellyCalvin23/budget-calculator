export const CURRENCIES = {
  RWF: { code: 'RWF', symbol: 'FRw', name: 'Rwandan Franc', rateToUSD: 0.000725, locale: 'fr-RW', decimals: 0 },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', rateToUSD: 1.0, locale: 'en-US', decimals: 2 },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', rateToUSD: 1.08, locale: 'de-DE', decimals: 2 },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', rateToUSD: 1.27, locale: 'en-GB', decimals: 2 }
};

export const PAY_FREQUENCIES = {
  monthly: { label: 'Monthly', periodsPerYear: 12, hint: '12 paychecks / year' },
  biweekly: { label: 'Every 2 Weeks (Bi-weekly)', periodsPerYear: 26, hint: '26 paychecks / year' },
  semimonthly: { label: 'Twice a Month (Semi-monthly)', periodsPerYear: 24, hint: '24 paychecks / year' },
  weekly: { label: 'Weekly', periodsPerYear: 52, hint: '52 paychecks / year' },
  annual: { label: 'Annual', periodsPerYear: 1, hint: '1 salary / year' }
};

/**
 * Format raw monetary value based on selected currency
 */
export function formatCurrency(amount, currencyCode = 'RWF') {
  if (isNaN(amount) || amount === null || amount === undefined) {
    amount = 0;
  }
  
  const curr = CURRENCIES[currencyCode] || CURRENCIES.RWF;
  
  if (currencyCode === 'RWF') {
    // Format RWF cleanly with whole numbers and FRw suffix or prefix
    const rounded = Math.round(amount);
    const formatted = rounded.toLocaleString('en-US');
    return `${formatted} FRw`;
  }

  return new Intl.NumberFormat(curr.locale, {
    style: 'currency',
    currency: curr.code,
    minimumFractionDigits: curr.decimals,
    maximumFractionDigits: curr.decimals
  }).format(amount);
}

/**
 * Convert value between currencies based on USD rate
 */
export function convertCurrency(amount, fromCode, toCode) {
  if (fromCode === toCode) return amount;
  const fromRate = CURRENCIES[fromCode]?.rateToUSD || 1;
  const toRate = CURRENCIES[toCode]?.rateToUSD || 1;
  
  // Convert from source to USD then USD to target
  const usdVal = amount * fromRate;
  return usdVal / toRate;
}
