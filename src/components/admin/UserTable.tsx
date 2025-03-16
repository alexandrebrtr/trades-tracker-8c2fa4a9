
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Loader2, Calendar, Star } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface UserTableProps {
  users: any[];
  onRefresh: () => void;
}

export function UserTable({ users, onRefresh }: UserTableProps) {
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Format date function
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };
  
  const togglePremium = async (userId: string, currentStatus: boolean) => {
    try {
      // Prevent multiple simultaneous operations
      if (isProcessing) return;
      setIsProcessing(userId);
      
      const now = new Date();
      const oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(now.getFullYear() + 1);
      
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
        title: !currentStatus ? "Abonnement premium activé" : "Abonnement premium désactivé",
        description: `Le statut premium de l'utilisateur a été ${!currentStatus ? 'activé' : 'désactivé'} avec succès.`,
      });
      
      // Refresh the user list
      onRefresh();
        
    } catch (error: any) {
      console.error('Error updating premium status:', error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la mise à jour du statut premium.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(null);
    }
  };
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom d'utilisateur</TableHead>
            <TableHead>Premium</TableHead>
            <TableHead>Date d'expiration</TableHead>
            <TableHead>Solde</TableHead>
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
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  {user.username || 'Utilisateur sans nom'}
                </TableCell>
                <TableCell>
                  {user.premium ? (
                    <div className="flex items-center text-yellow-500">
                      <Star className="h-4 w-4 mr-1 fill-yellow-500" />
                      Premium
                    </div>
                  ) : 'Standard'}
                </TableCell>
                <TableCell>
                  {user.premium ? formatDate(user.premium_expires) : 'N/A'}
                </TableCell>
                <TableCell>
                  {user.balance ? `${Number(user.balance).toLocaleString('fr-FR')} €` : '0 €'}
                </TableCell>
                <TableCell>
                  {user.trades_count || 0}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end items-center gap-2">
                    {isProcessing === user.id ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Switch
                        checked={!!user.premium}
                        onCheckedChange={() => togglePremium(user.id, !!user.premium)}
                        disabled={isProcessing !== null}
                      />
                    )}
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                      <Calendar className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
