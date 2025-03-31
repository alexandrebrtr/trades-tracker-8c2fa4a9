
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { getStartDateFromTimeframe } from '@/utils/dateUtils';
import { RealtimeService } from '@/services/RealtimeService';

/**
 * Hook to fetch trade data from Supabase
 */
export const useTradesFetcher = (userId: any, selectedPeriod: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [trades, setTrades] = useState<any[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      setTrades([]);
      return;
    }

    const fetchTrades = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Calculate start date based on selected timeframe
        const startDate = getStartDateFromTimeframe(selectedPeriod);
        
        // Fetch user trades
        const { data, error } = await supabase
          .from('trades')
          .select('*')
          .eq('user_id', userId)
          .gte('date', startDate.toISOString())
          .order('date', { ascending: true });

        if (error) throw error;
        
        setTrades(data || []);
      } catch (err: any) {
        console.error('Error fetching trades data:', err.message);
        setError(err);
        setTrades([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Subscribe to trades changes
    const subscription = RealtimeService.subscribeToTrades(userId, (payload) => {
      // Rechargement complet lors d'un changement
      fetchTrades();
    });

    fetchTrades();

    // Cleanup subscription
    return () => {
      subscription();
    };
  }, [userId, selectedPeriod]);

  /**
   * Synchroniser manuellement les trades depuis un broker connecté
   * @param brokerSettings Paramètres du broker
   */
  const syncTradesFromBroker = async (brokerSettings: {
    name: string;
    apiKey: string;
    secretKey: string;
  }) => {
    if (!userId || !brokerSettings.name || !brokerSettings.apiKey || !brokerSettings.secretKey) {
      return { success: false, error: "Informations manquantes" };
    }

    setIsSyncing(true);
    try {
      const result = await RealtimeService.syncTradesFromBroker(userId, brokerSettings);
      return result;
    } catch (err) {
      console.error('Error syncing trades:', err);
      return { success: false, error: err };
    } finally {
      setIsSyncing(false);
    }
  };

  return { isLoading, trades, error, isSyncing, syncTradesFromBroker };
};
