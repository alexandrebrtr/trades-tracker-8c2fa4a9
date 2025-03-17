
/**
 * Formats a number as currency in EUR with French locale
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
};
