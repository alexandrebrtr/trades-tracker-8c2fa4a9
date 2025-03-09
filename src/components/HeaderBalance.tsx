
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
    
    // Subscribe to real-time changes on the profiles table
    if (user) {
      const channel = supabase
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
            // Add type checking to ensure payload.new has balance property
            if (payload.new && typeof payload.new === 'object' && 'balance' in payload.new) {
              setBalance(Number(payload.new.balance));
            }
          }
        )
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, profile]);

  // Update when isPremium changes
  useEffect(() => {
    console.log('Premium status in HeaderBalance:', isPremium);
  }, [isPremium]);
  
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
