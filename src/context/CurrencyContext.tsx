
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "@/integrations/supabase/client";

export type Currency = "EUR" | "USD" | "GBP";

interface CurrencyContextProps {
  currency: Currency;
  changeCurrency: (newCurrency: Currency) => Promise<void>;
  formatCurrency: (amount: number) => string;
  currencySymbol: string;
}

const CurrencyContext = createContext<CurrencyContextProps>({
  currency: "EUR",
  changeCurrency: async () => {},
  formatCurrency: () => "",
  currencySymbol: "€",
});

export const useCurrency = () => useContext(CurrencyContext);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [currency, setCurrency] = useState<Currency>("EUR");
  
  // Chargement de la devise à partir du profil utilisateur
  useEffect(() => {
    const loadUserCurrency = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("settings")
          .eq("id", user.id)
          .single();
          
        if (error) throw error;
        
        if (data?.settings?.currency) {
          setCurrency(data.settings.currency as Currency);
        }
      } catch (error) {
        console.error("Erreur lors du chargement de la devise:", error);
      }
    };
    
    loadUserCurrency();
  }, [user]);

  // Obtenir le symbole de la devise
  const getCurrencySymbol = (curr: Currency): string => {
    switch (curr) {
      case "EUR": return "€";
      case "USD": return "$";
      case "GBP": return "£";
      default: return "€";
    }
  };
  
  // Obtenir le code de langue pour le formattage
  const getLocale = (): string => {
    switch (currency) {
      case "EUR": return "fr-FR";
      case "USD": return "en-US";
      case "GBP": return "en-GB";
      default: return "fr-FR";
    }
  };
  
  // Fonction pour formater les montants selon la devise
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat(getLocale(), {
      style: "currency",
      currency: currency
    }).format(amount);
  };
  
  // Fonction pour changer la devise et mettre à jour le profil utilisateur
  const changeCurrency = async (newCurrency: Currency): Promise<void> => {
    if (!user) return;
    
    try {
      // Récupérer les paramètres actuels
      const { data, error: fetchError } = await supabase
        .from("profiles")
        .select("settings")
        .eq("id", user.id)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Mettre à jour les paramètres avec la nouvelle devise
      const updatedSettings = { 
        ...data.settings, 
        currency: newCurrency 
      };
      
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ settings: updatedSettings })
        .eq("id", user.id);
        
      if (updateError) throw updateError;
      
      setCurrency(newCurrency);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la devise:", error);
      throw error;
    }
  };

  return (
    <CurrencyContext.Provider value={{
      currency,
      changeCurrency,
      formatCurrency,
      currencySymbol: getCurrencySymbol(currency)
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};
