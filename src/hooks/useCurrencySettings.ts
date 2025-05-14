
import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';

export type CurrencyCode = 'EUR' | 'USD' | 'GBP' | 'JPY' | 'CHF' | 'CAD' | 'AUD';

export interface CurrencySettings {
  code: CurrencyCode;
  symbol: string;
}

export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  EUR: '€',
  USD: '$',
  GBP: '£',
  JPY: '¥',
  CHF: 'CHF',
  CAD: 'CA$',
  AUD: 'A$'
};

export const CURRENCY_OPTIONS = [
  { value: 'EUR', label: 'Euro (€)' },
  { value: 'USD', label: 'Dollar US ($)' },
  { value: 'GBP', label: 'Livre Sterling (£)' },
  { value: 'JPY', label: 'Yen Japonais (¥)' },
  { value: 'CHF', label: 'Franc Suisse (CHF)' },
  { value: 'CAD', label: 'Dollar Canadien (CA$)' },
  { value: 'AUD', label: 'Dollar Australien (A$)' },
];

// Create context for currency settings
export const CurrencyContext = createContext<{
  currency: CurrencySettings;
  setCurrency: (code: CurrencyCode) => Promise<void>;
}>({
  currency: { code: 'EUR', symbol: '€' },
  setCurrency: async () => {}
});

export const useCurrencySettings = () => {
  return useContext(CurrencyContext);
};

export const useInitCurrencySettings = () => {
  const { user } = useAuth();
  const [currency, setCurrencyState] = useState<CurrencySettings>({ code: 'EUR', symbol: '€' });
  
  useEffect(() => {
    const fetchCurrencySettings = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('settings')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        
        if (data?.settings?.currency) {
          const currencyCode = data.settings.currency as CurrencyCode;
          setCurrencyState({
            code: currencyCode,
            symbol: CURRENCY_SYMBOLS[currencyCode] || '€'
          });
        }
      } catch (err) {
        console.error('Error fetching currency settings:', err);
      }
    };
    
    fetchCurrencySettings();
  }, [user]);
  
  const setCurrency = async (code: CurrencyCode) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          settings: {
            currency: code,
            // Preserve other settings by spreading them first
            ...await getCurrentSettings()
          }
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      setCurrencyState({
        code,
        symbol: CURRENCY_SYMBOLS[code] || '€'
      });
      
      toast({
        title: "Devise mise à jour",
        description: `La devise a été changée en ${CURRENCY_OPTIONS.find(c => c.value === code)?.label || code}`,
      });
    } catch (err) {
      console.error('Error updating currency settings:', err);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la devise",
        variant: "destructive",
      });
    }
  };
  
  // Helper function to get current settings to preserve other fields
  const getCurrentSettings = async () => {
    if (!user) return {};
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('settings')
        .eq('id', user.id)
        .single();
        
      if (error) throw error;
      
      return data?.settings || {};
    } catch (err) {
      console.error('Error fetching current settings:', err);
      return {};
    }
  };
  
  return { currency, setCurrency };
};
