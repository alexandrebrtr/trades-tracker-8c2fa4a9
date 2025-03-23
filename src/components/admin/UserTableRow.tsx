
import { TableRow, TableCell } from '@/components/ui/table';
import { PremiumStatusBadge } from './PremiumStatusBadge';
import { ExpirationDateDisplay } from './ExpirationDateDisplay';
import { UserTableActions } from './UserTableActions';
import { isExpired } from './utils/dateUtils';
import { useNavigate } from 'react-router-dom';

interface UserTableRowProps {
  user: any;
  isProcessing: string | null;
  onTogglePremium: (userId: string, currentStatus: boolean) => void;
  onViewUserData: (userId: string) => void;
  onToggleBan: (userId: string, currentStatus: boolean) => void;
}

export function UserTableRow({ 
  user, 
  isProcessing, 
  onTogglePremium, 
  onViewUserData,
  onToggleBan
}: UserTableRowProps) {
  const navigate = useNavigate();
  const isPremiumExpired = isExpired(user.premium_expires);
  const premiumStatus = user.premium && !isPremiumExpired;
  const isBanned = user.banned || false;
  
  const handleViewCalendar = () => {
    navigate(`/admin/calendar/${user.id}`);
  };
  
  return (
    <TableRow 
      key={user.id} 
      className={`${premiumStatus ? "bg-yellow-50/10" : ""} ${isBanned ? "bg-red-50/10" : ""}`}
    >
      <TableCell className="font-medium">
        {user.username || 'Utilisateur sans nom'}
        {isBanned && <span className="ml-2 text-xs text-red-500 font-semibold">(Banni)</span>}
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
          isBanned={isBanned}
          isProcessing={isProcessing === user.id}
          onTogglePremium={() => onTogglePremium(user.id, premiumStatus)}
          onViewUserData={() => onViewUserData(user.id)}
          onToggleBan={() => onToggleBan(user.id, isBanned)}
          onViewCalendar={handleViewCalendar}
        />
      </TableCell>
    </TableRow>
  );
}
