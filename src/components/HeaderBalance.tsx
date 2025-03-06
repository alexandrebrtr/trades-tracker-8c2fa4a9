
import { useAuth } from '@/context/AuthContext';
import { usePremium } from '@/context/PremiumContext';
import { Badge } from '@/components/ui/badge';
import { Star, Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function HeaderBalance() {
  const { profile, user } = useAuth();
  const { isPremium } = usePremium();
  const [balance, setBalance] = useState<number | undefined>(profile?.balance);
  
  useEffect(() => {
    // Initialize balance from profile
    if (profile?.balance !== undefined) {
      setBalance(profile.balance);
    }
    
    // Subscribe to real-time changes on the profiles table
    if (user) {
      const channel = supabase
        .channel('profile-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'profiles',
            filter: `id=eq.${user.id}`
          },
          (payload) => {
            if (payload.new && payload.new.balance !== undefined) {
              setBalance(payload.new.balance);
            }
          }
        )
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, profile]);
  
  return (
    <div className="flex items-center gap-2">
      {isPremium && (
        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
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
