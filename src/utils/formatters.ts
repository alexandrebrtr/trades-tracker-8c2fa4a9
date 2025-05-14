
import { useCurrencySettings } from '@/hooks/useCurrencySettings';

export function formatCurrency(value: number): string {
  // We need to use a try-catch because this could be called outside of a component
  try {
    // Try to use the context
    const { currency } = useCurrencySettings();
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: currency.code
    }).format(value);
  } catch (error) {
    // Fallback to EUR if context isn't available
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR'
    }).format(value);
  }
}

// Create a version that doesn't use the hook for non-component contexts
export function formatCurrencyWithCode(value: number, currencyCode: string = 'EUR'): string {
  return new Intl.NumberFormat('fr-FR', { 
    style: 'currency', 
    currency: currencyCode
  }).format(value);
}
