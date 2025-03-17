
import { useAuth } from '@/context/AuthContext';
import { usePremium } from '@/context/PremiumContext';
import { Badge } from '@/components/ui/badge';
import { Star, Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function HeaderBalance() {
  const { profile, user } = useAuth();
  const { isPremium } = usePremium();
  const [balance, setBalance] = useState<number | undefined>(profile?.balance !== undefined ? Number(profile.balance) : undefined);
  
  useEffect(() => {
    // Initialize balance from profile
    if (profile?.balance !== undefined) {
      setBalance(Number(profile.balance));
    }
    
    // Subscribe to real-time changes on both profiles and portfolios tables
    if (user) {
      // Subscribe to profiles table changes
      const profilesChannel = supabase
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
            console.log('Profile update received in HeaderBalance:', payload);
            if (payload.new && typeof payload.new === 'object' && 'balance' in payload.new) {
              setBalance(Number(payload.new.balance));
            }
          }
        )
        .subscribe();
      
      // Subscribe to portfolios table changes to ensure balance remains in sync
      const portfoliosChannel = supabase
        .channel('portfolio-balance-updates')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'portfolios',
            filter: `user_id=eq.${user.id}`
          },
          async (payload) => {
            console.log('Portfolio update received in HeaderBalance:', payload);
            // When portfolio is updated, refresh the profile data to ensure consistency
            if (payload.new && typeof payload.new === 'object') {
              try {
                // Get the latest profile data to ensure we have the most recent balance
                const { data: latestProfile, error } = await supabase
                  .from('profiles')
                  .select('balance')
                  .eq('id', user.id)
                  .single();
                
                if (error) throw error;
                
                if (latestProfile) {
                  setBalance(Number(latestProfile.balance));
                }
              } catch (error) {
                console.error('Error fetching updated profile after portfolio change:', error);
              }
            }
          }
        )
        .subscribe();
        
      return () => {
        supabase.removeChannel(profilesChannel);
        supabase.removeChannel(portfoliosChannel);
      };
    }
  }, [user, profile]);
  
  return (
    <div className="flex items-center gap-2">
      {isPremium && (
        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 animate-fadeIn">
          <Star className="h-3.5 w-3.5 mr-1 fill-yellow-500" />
          Premium
        </Badge>
      )}
      
      {balance !== undefined && (
        <div className="flex items-center text-sm text-muted-foreground">
          <Wallet className="h-4 w-4 mr-1" />
          <span>{Number(balance).toLocaleString('fr-FR')} €</span>
        </div>
      )}
    </div>
  );
}
