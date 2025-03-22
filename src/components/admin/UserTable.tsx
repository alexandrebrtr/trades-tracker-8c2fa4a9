
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { usePremium } from '@/context/PremiumContext';
import { UserTableRow } from './UserTableRow';

interface UserTableProps {
  users: any[];
  onRefresh: () => void;
}

export function UserTable({ users, onRefresh }: UserTableProps) {
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { setPremiumStatus } = usePremium();
  
  const togglePremium = async (userId: string, currentStatus: boolean) => {
    try {
      // Prevent multiple simultaneous operations
      if (isProcessing) return;
      setIsProcessing(userId);
      
      const now = new Date();
      const oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(now.getFullYear() + 1);
      
      console.log(`Toggling premium status for user ${userId} from ${currentStatus} to ${!currentStatus}`);
      
      // Update premium status in the database
      const { error } = await supabase
        .from('profiles')
        .update({
          premium: !currentStatus,
          premium_since: !currentStatus ? now.toISOString() : null,
          premium_expires: !currentStatus ? oneYearFromNow.toISOString() : null,
          updated_at: now.toISOString()
        })
        .eq('id', userId);
        
      if (error) throw error;
      
      // Success notification
      toast({
        title: !currentStatus ? "Premium activé" : "Premium désactivé",
        description: `Le statut premium de l'utilisateur a été ${!currentStatus ? 'activé' : 'désactivé'} avec succès.`,
      });
      
      // Refresh the user list
      onRefresh();
        
    } catch (error: any) {
      console.error('Error updating premium status:', error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur s'est produite lors de la mise à jour du statut premium.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(null);
    }
  };

  // View user profile (redirect to profile page)
  const viewUserData = (userId: string) => {
    // Navigate to a detailed view or user profile
    navigate(`/profile/${userId}`);
    
    toast({
      title: "Navigation",
      description: `Redirection vers le profil utilisateur: ${userId}`,
    });
  };
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Utilisateur</TableHead>
            <TableHead>Premium</TableHead>
            <TableHead>Date d'expiration</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead>Trades</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                Aucun utilisateur trouvé
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <UserTableRow
                key={user.id}
                user={user}
                isProcessing={isProcessing}
                onTogglePremium={togglePremium}
                onViewUserData={viewUserData}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
