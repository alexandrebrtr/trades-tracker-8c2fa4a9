
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

/**
 * Function to update the trades count in the user profile
 */
export const updateTradesCount = async (userId: string): Promise<void> => {
  if (!userId) return;
  
  try {
    // First, get the current count of trades for this user
    const { count, error: countError } = await supabase
      .from('trades')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);
    
    if (countError) throw countError;
    
    // Then update the profile with the new count
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ trades_count: count })
      .eq('id', userId);
    
    if (updateError) throw updateError;
    
    console.log('Trades count updated successfully:', count);
  } catch (err) {
    console.error('Error updating trades count:', err);
  }
};
