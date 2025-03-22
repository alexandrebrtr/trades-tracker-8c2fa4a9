
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';
import { formatDate, isExpired } from './utils/dateUtils';

interface ExpirationDateDisplayProps {
  expiryDate: string | null;
}

export function ExpirationDateDisplay({ expiryDate }: ExpirationDateDisplayProps) {
  if (!expiryDate) return <span>N/A</span>;
  
  const hasExpired = isExpired(expiryDate);
  
  return (
    <div className="flex items-center gap-1">
      {formatDate(expiryDate)}
      {hasExpired ? (
        <Badge variant="outline" className="ml-2 bg-red-500/10 text-red-600 border-red-500/20">
          <X className="h-3 w-3 mr-1" />
          Expiré
        </Badge>
      ) : (
        <Badge variant="outline" className="ml-2 bg-green-500/10 text-green-600 border-green-500/20">
          <Check className="h-3 w-3 mr-1" />
          Actif
        </Badge>
      )}
    </div>
  );
}
