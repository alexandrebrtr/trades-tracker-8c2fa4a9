
/**
 * Format a number as a percentage
 * @param value - The value to format
 * @param fractionDigits - The number of decimal places to show (default: 2)
 * @returns A formatted percentage string (e.g. "42.50%")
 */
export function formatPercentage(value: number, fractionDigits: number = 2): string {
  return `${value.toFixed(fractionDigits)}%`;
}

/**
 * Format a number as currency
 * @param value - The value to format
 * @param currency - The currency code (default: EUR)
 * @param locale - The locale to use for formatting (default: fr-FR)
 * @returns A formatted currency string
 */
export function formatCurrency(value: number, currency: string = 'EUR', locale: string = 'fr-FR'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(value);
}

/**
 * Format a number with thousands separators
 * @param value - The value to format
 * @param fractionDigits - The number of decimal places to show (default: 0)
 * @returns A formatted number string
 */
export function formatNumber(value: number, fractionDigits: number = 0): string {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits
  }).format(value);
}

/**
 * Format a date as a string
 * @param date - The date to format
 * @param options - Intl.DateTimeFormatOptions
 * @returns A formatted date string
 */
export function formatDate(date: Date, options: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric'
}): string {
  return new Intl.DateTimeFormat('fr-FR', options).format(date);
}
