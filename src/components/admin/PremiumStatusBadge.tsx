
import { Badge } from '@/components/ui/badge';
import { Star, Check, X } from 'lucide-react';

interface PremiumStatusBadgeProps {
  isPremium: boolean;
}

export function PremiumStatusBadge({ isPremium }: PremiumStatusBadgeProps) {
  return isPremium ? (
    <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20 flex items-center gap-1">
      <Star className="h-3 w-3 fill-yellow-500" />
      Premium
    </Badge>
  ) : (
    <Badge variant="outline" className="bg-slate-500/10 text-slate-600 border-slate-500/20">
      Standard
    </Badge>
  );
}
