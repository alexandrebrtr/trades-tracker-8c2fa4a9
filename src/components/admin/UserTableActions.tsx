
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Loader2, Calendar, Eye, Ban } from 'lucide-react';

interface UserTableActionsProps {
  userId: string;
  isPremium: boolean;
  isBanned: boolean;
  isProcessing: boolean;
  onTogglePremium: () => void;
  onViewUserData: () => void;
  onToggleBan: () => void;
}

export function UserTableActions({ 
  userId, 
  isPremium, 
  isBanned,
  isProcessing, 
  onTogglePremium, 
  onViewUserData,
  onToggleBan 
}: UserTableActionsProps) {
  return (
    <div className="flex justify-end items-center gap-2">
      {isProcessing ? (
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground mr-1">{isPremium ? 'Actif' : 'Inactif'}</span>
          <Switch
            checked={isPremium}
            onCheckedChange={onTogglePremium}
            disabled={isProcessing}
          />
        </div>
      )}
      <Button 
        variant="outline" 
        size="sm" 
        className={`h-8 w-8 p-0 ${isBanned ? 'bg-red-100/20 border-red-200 text-red-600' : ''}`}
        onClick={onToggleBan}
        title={isBanned ? "Débloquer l'utilisateur" : "Bannir l'utilisateur"}
      >
        <Ban className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={onViewUserData}>
        <Eye className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="sm" className="h-8 w-8 p-0">
        <Calendar className="h-4 w-4" />
      </Button>
    </div>
  );
}
