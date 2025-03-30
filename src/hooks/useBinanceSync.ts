
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useBinanceSync = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastSyncDate, setLastSyncDate] = useState<Date | null>(null);
  const { toast } = useToast();

  const synchronizeTrades = async (userId: string, apiKey: string, secretKey: string) => {
    if (!userId || !apiKey || !secretKey) {
      toast({
        title: "Erreur de synchronisation",
        description: "Informations d'API manquantes. Veuillez configurer votre compte Binance.",
        variant: "destructive",
      });
      return false;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('sync-binance-trades', {
        body: {
          userId,
          apiKey,
          secretKey,
          startTime: null // Utilise la valeur par défaut (30 derniers jours)
        }
      });

      if (error) throw error;

      setLastSyncDate(new Date());
      
      const newTradesCount = data.newTradesCount || 0;
      
      toast({
        title: "Synchronisation réussie",
        description: `${newTradesCount} nouveaux trades ont été importés depuis Binance.`,
        variant: newTradesCount > 0 ? "default" : "destructive",
      });
      
      return newTradesCount > 0;

    } catch (error) {
      console.error('Erreur lors de la synchronisation des trades:', error);
      toast({
        title: "Erreur de synchronisation",
        description: error.message || "Une erreur est survenue lors de la synchronisation des trades.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    synchronizeTrades,
    isLoading,
    lastSyncDate
  };
};
