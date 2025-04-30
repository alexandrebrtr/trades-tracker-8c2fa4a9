
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

/**
 * Formats a number with thousands separators
 */
export const formatWithThousandsSeparator = (value: number): string => {
  return new Intl.NumberFormat('fr-FR').format(value);
};

/**
 * Formats a number as a compact representation (e.g., 1.2k, 1.5M)
 */
export const formatCompact = (value: number): string => {
  return new Intl.NumberFormat('fr-FR', { 
    notation: 'compact',
    compactDisplay: 'short' 
  }).format(value);
};

/**
 * Formats a date string to a localized date format
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
