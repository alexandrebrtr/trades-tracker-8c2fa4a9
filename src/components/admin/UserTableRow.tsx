
import { TableRow, TableCell } from '@/components/ui/table';
import { PremiumStatusBadge } from './PremiumStatusBadge';
import { ExpirationDateDisplay } from './ExpirationDateDisplay';
import { UserTableActions } from './UserTableActions';
import { isExpired } from './utils/dateUtils';

interface UserTableRowProps {
  user: any;
  isProcessing: string | null;
  onTogglePremium: (userId: string, currentStatus: boolean) => void;
  onViewUserData: (userId: string) => void;
}

export function UserTableRow({ user, isProcessing, onTogglePremium, onViewUserData }: UserTableRowProps) {
  const isPremiumExpired = isExpired(user.premium_expires);
  const premiumStatus = user.premium && !isPremiumExpired;
  
  return (
    <TableRow key={user.id} className={premiumStatus ? "bg-yellow-50/10" : ""}>
      <TableCell className="font-medium">
        {user.username || 'Utilisateur sans nom'}
      </TableCell>
      <TableCell>
        <PremiumStatusBadge isPremium={premiumStatus} />
      </TableCell>
      <TableCell>
        <ExpirationDateDisplay expiryDate={user.premium_expires} />
      </TableCell>
      <TableCell>
        {user.balance ? `${Number(user.balance).toLocaleString('fr-FR')} €` : '0 €'}
      </TableCell>
      <TableCell>
        {user.trades_count || 0}
      </TableCell>
      <TableCell className="text-right">
        <UserTableActions
          userId={user.id}
          isPremium={premiumStatus}
          isProcessing={isProcessing === user.id}
          onTogglePremium={() => onTogglePremium(user.id, premiumStatus)}
          onViewUserData={() => onViewUserData(user.id)}
        />
      </TableCell>
    </TableRow>
  );
}
