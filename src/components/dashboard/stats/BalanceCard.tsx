
import { useEffect, useState } from "react";
import { DataCard } from "@/components/ui/data-card";
import { Wallet } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface BalanceCardProps {
  balance: number;
  monthlyPnL: number;
}

export function BalanceCard({ balance: initialBalance, monthlyPnL }: BalanceCardProps) {
  const [balance, setBalance] = useState(initialBalance);
  const { user } = useAuth();

  useEffect(() => {
    // Update balance when props change
    setBalance(initialBalance);
  }, [initialBalance]);

  useEffect(() => {
    if (!user) return;

    // Subscribe to profile balance changes
    const profileChannel = supabase
      .channel('profile-balance-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user.id}`
        },
        (payload) => {
          console.log('Balance update received:', payload);
          if (payload.new && typeof payload.new === 'object' && 'balance' in payload.new) {
            setBalance(Number(payload.new.balance));
          }
        }
      )
      .subscribe();

    // Also subscribe to trades changes
    const tradesChannel = supabase
      .channel('trades-balance-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'trades',
          filter: `user_id=eq.${user.id}`
        },
        async () => {
          console.log('Trade update detected, refreshing balance');
          try {
            // Get the latest profile data to ensure we have the most recent balance
            const { data, error } = await supabase
              .from('profiles')
              .select('balance')
              .eq('id', user.id)
              .single();
            
            if (error) throw error;
            
            if (data) {
              setBalance(Number(data.balance));
            }
          } catch (error) {
            console.error('Error fetching updated balance after trade change:', error);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(profileChannel);
      supabase.removeChannel(tradesChannel);
    };
  }, [user]);

  return (
    <DataCard
      title="Solde du portefeuille"
      value={formatCurrency(balance)}
      icon={<Wallet className="w-4 h-4" />}
      trend={monthlyPnL !== 0 ? { 
        value: Math.abs((monthlyPnL / (balance || 1)) * 100), 
        isPositive: monthlyPnL >= 0 
      } : undefined}
    />
  );
}
