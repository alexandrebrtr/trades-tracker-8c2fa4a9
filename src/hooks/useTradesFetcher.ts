
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { getStartDateFromTimeframe } from '@/utils/dateUtils';

/**
 * Hook to fetch trade data from Supabase
 */
export const useTradesFetcher = (userId: any, selectedPeriod: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [trades, setTrades] = useState<any[]>([]);
  const [error, setError] = useState<Error | null>(null);

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

    fetchTrades();
  }, [userId, selectedPeriod]);

  return { isLoading, trades, error };
};
