
import { useState, useEffect, useContext, createContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from "@/components/ui/use-toast";

// Types
export type CurrencyCode = 'EUR' | 'USD' | 'GBP' | 'JPY' | 'CHF' | 'CAD' | 'AUD';

export interface CurrencyOption {
  value: CurrencyCode;
  label: string;
  symbol: string;
}

export interface CurrencySettings {
  code: CurrencyCode;
  symbol: string;
}

export const CURRENCY_OPTIONS: CurrencyOption[] = [
  { value: 'EUR', label: 'EUR (Euro)', symbol: '€' },
  { value: 'USD', label: 'USD (Dollar US)', symbol: '$' },
  { value: 'GBP', label: 'GBP (Livre Sterling)', symbol: '£' },
  { value: 'JPY', label: 'JPY (Yen Japonais)', symbol: '¥' },
  { value: 'CHF', label: 'CHF (Franc Suisse)', symbol: 'CHF' },
  { value: 'CAD', label: 'CAD (Dollar Canadien)', symbol: 'C$' },
  { value: 'AUD', label: 'AUD (Dollar Australien)', symbol: 'A$' },
];

export const DEFAULT_CURRENCY: CurrencySettings = {
  code: 'EUR',
  symbol: '€'
};

interface CurrencyContextType {
  currency: CurrencySettings;
  setCurrency: (code: CurrencyCode) => Promise<void>;
}

export const CurrencyContext = createContext<CurrencyContextType>({
  currency: DEFAULT_CURRENCY,
  setCurrency: async () => {}
});

export const useCurrencySettings = () => useContext(CurrencyContext);

export function useInitCurrencySettings(): CurrencyContextType {
  const [currency, setCurrencyState] = useState<CurrencySettings>(DEFAULT_CURRENCY);
  const { user } = useAuth();

  useEffect(() => {
    const loadCurrencySettings = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('currency')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        
        if (data && data.currency) {
          const currencyData = data.currency as CurrencySettings;
          setCurrencyState(currencyData);
        }
      } catch (error) {
        console.error('Error loading currency settings:', error);
      }
    };

    loadCurrencySettings();
  }, [user]);

  const setCurrency = async (code: CurrencyCode): Promise<void> => {
    if (!user) {
      toast({
        title: 'Erreur',
        description: 'Vous devez être connecté pour changer la devise.',
        variant: 'destructive'
      });
      return;
    }

    try {
      const currencyOption = CURRENCY_OPTIONS.find(opt => opt.value === code);
      
      if (!currencyOption) {
        throw new Error('Code devise invalide');
      }

      const newCurrencySettings = {
        code,
        symbol: currencyOption.symbol
      };

      // Mettre à jour dans la base de données
      const { error } = await supabase
        .from('profiles')
        .update({ currency: newCurrencySettings })
        .eq('id', user.id);

      if (error) throw error;

      // Mettre à jour l'état local
      setCurrencyState(newCurrencySettings);
      
      toast({
        title: 'Devise mise à jour',
        description: `La devise a été changée en ${code}.`
      });
    } catch (error: any) {
      console.error('Error updating currency:', error);
      toast({
        title: 'Erreur',
        description: error.message || 'Une erreur est survenue lors de la mise à jour de la devise.',
        variant: 'destructive'
      });
    }
  };

  return { currency, setCurrency };
}
