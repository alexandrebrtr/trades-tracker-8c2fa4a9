
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { getStartDateFromTimeframe } from '@/utils/dateUtils';
import { toast } from 'sonner';

export interface Trade {
  id: string;
  user_id: string;
  symbol: string;
  type: string;
  direction: 'long' | 'short';
  entry_price: number;
  exit_price: number;
  quantity: number;
  date: string;
  entry_date?: string;
  exit_date?: string;
  pnl: number;
  fees?: number;
  strategy?: string;
  notes?: string;
  tags?: string[];
  status: 'open' | 'closed';
  risk_reward_ratio?: number;
  stop_loss?: number;
  take_profit?: number;
  trade_duration?: number;
  created_at: string;
}

/**
 * Hook to fetch trade data from Supabase with enhanced filtering options
 */
export const useTradesFetcher = (userId: any, selectedPeriod: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [trades, setTrades] = useState<Trade[]>([]);
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
        
        // Fetch user trades with enhanced query parameters
        const { data, error } = await supabase
          .from('trades')
          .select('*')
          .eq('user_id', userId)
          .gte('date', startDate.toISOString())
          .order('date', { ascending: true });

        if (error) throw error;
        
        // Map the data to match the Trade interface
        const mappedTrades: Trade[] = (data || []).map(trade => ({
          id: trade.id,
          user_id: trade.user_id,
          symbol: trade.symbol,
          type: trade.type,
          direction: trade.type as 'long' | 'short', // Use type as direction
          entry_price: trade.entry_price,
          exit_price: trade.exit_price,
          quantity: trade.size, // Map size to quantity
          date: trade.date || '',
          pnl: trade.pnl || 0,
          fees: trade.fees,
          strategy: trade.strategy,
          notes: trade.notes,
          status: 'closed', // Default to closed
          created_at: trade.created_at || '',
        }));
        
        setTrades(mappedTrades);
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
    toast.error("Impossible de mettre à jour le nombre de trades.");
  }
};

/**
 * Function to fetch trade statistics grouped by a specific field
 */
export const fetchTradeStatsByField = async (userId: string, field: string, period: string) => {
  if (!userId) return [];
  
  try {
    const startDate = getStartDateFromTimeframe(period);
    
    const { data, error } = await supabase
      .from('trades')
      .select(`${field}, pnl, quantity, entry_price, exit_price`)
      .eq('user_id', userId)
      .gte('date', startDate.toISOString());
    
    if (error) throw error;
    
    // Group and process data by the specified field
    const result = processTradeStats(data || [], field);
    return result;
  } catch (err) {
    console.error(`Error fetching trade stats by ${field}:`, err);
    return [];
  }
};

// Helper function to process trade statistics
const processTradeStats = (trades: any[], field: string) => {
  const stats: Record<string, any> = {};
  
  // Group trades by the specified field
  trades.forEach(trade => {
    const key = trade[field] || 'Non défini';
    
    if (!stats[key]) {
      stats[key] = {
        name: key,
        totalPnL: 0,
        tradeCount: 0,
        winCount: 0,
        lossCount: 0,
        volume: 0,
      };
    }
    
    stats[key].totalPnL += (trade.pnl || 0);
    stats[key].tradeCount += 1;
    stats[key].volume += (trade.quantity * trade.entry_price) || 0;
    
    if (trade.pnl > 0) {
      stats[key].winCount += 1;
    } else if (trade.pnl < 0) {
      stats[key].lossCount += 1;
    }
  });
  
  // Convert to array and calculate additional metrics
  return Object.values(stats).map(item => ({
    ...item,
    winRate: item.tradeCount > 0 ? (item.winCount / item.tradeCount) * 100 : 0,
    avgPnL: item.tradeCount > 0 ? item.totalPnL / item.tradeCount : 0,
  }));
};
