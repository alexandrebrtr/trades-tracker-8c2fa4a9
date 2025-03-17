
/**
 * Formats a number as currency in EUR with French locale
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
};

/**
 * Formats a percentage value with 1 decimal place
 */
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

/**
 * Formats a number with a specified number of decimal places
 */
export const formatNumber = (value: number, decimals: number = 0): string => {
  return value.toFixed(decimals);
};
