
import { useAuth } from '@/context/AuthContext';
import { usePremium } from '@/context/PremiumContext';
import { Badge } from '@/components/ui/badge';
import { Star, Wallet } from 'lucide-react';

export function HeaderBalance() {
  const { profile } = useAuth();
  const { isPremium } = usePremium();
  
  return (
    <div className="flex items-center gap-2">
      {isPremium && (
        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
          <Star className="h-3.5 w-3.5 mr-1 fill-yellow-500" />
          Premium
        </Badge>
      )}
      
      {profile?.balance !== undefined && (
        <div className="flex items-center text-sm text-muted-foreground">
          <Wallet className="h-4 w-4 mr-1" />
          <span>{Number(profile.balance).toLocaleString('fr-FR')} €</span>
        </div>
      )}
    </div>
  );
}
