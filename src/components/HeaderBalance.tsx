import { usePremium } from '@/context/PremiumContext';
import { useAccount } from '@/context/AccountContext';
import { Badge } from '@/components/ui/badge';
import { Star, Wallet } from 'lucide-react';

const currencySymbols: Record<string, string> = { EUR: '€', USD: '$', GBP: '£' };

export function HeaderBalance() {
  const { isPremium } = usePremium();
  const { activeAccount } = useAccount();

  const balance = activeAccount ? Number(activeAccount.balance) : undefined;
  const symbol = activeAccount ? (currencySymbols[activeAccount.currency] || activeAccount.currency) : '€';

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
          <span>{balance.toLocaleString('fr-FR')} {symbol}</span>
        </div>
      )}
    </div>
  );
}
