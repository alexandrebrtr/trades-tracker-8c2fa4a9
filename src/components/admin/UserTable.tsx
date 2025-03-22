
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Loader2, Calendar, Star, Eye, Check, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { usePremium } from '@/context/PremiumContext';
import { Badge } from '@/components/ui/badge';

interface UserTableProps {
  users: any[];
  onRefresh: () => void;
}

export function UserTable({ users, onRefresh }: UserTableProps) {
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { setPremiumStatus } = usePremium();
  
  // Format date function
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };
  
  const isExpired = (expiryDate: string | null): boolean => {
    if (!expiryDate) return true;
    const now = new Date();
    const expiry = new Date(expiryDate);
    return now > expiry;
  };
  
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
            users.map((user) => {
              const isPremiumExpired = isExpired(user.premium_expires);
              const premiumStatus = user.premium && !isPremiumExpired;
              
              return (
                <TableRow key={user.id} className={premiumStatus ? "bg-yellow-50/10" : ""}>
                  <TableCell className="font-medium">
                    {user.username || 'Utilisateur sans nom'}
                  </TableCell>
                  <TableCell>
                    {premiumStatus ? (
                      <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20 flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-500" />
                        Premium
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-slate-500/10 text-slate-600 border-slate-500/20">
                        Standard
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {user.premium_expires ? (
                      <div className="flex items-center gap-1">
                        {formatDate(user.premium_expires)}
                        {isPremiumExpired ? (
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
                    ) : (
                      'N/A'
                    )}
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
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground mr-1">{premiumStatus ? 'Actif' : 'Inactif'}</span>
                          <Switch
                            checked={premiumStatus}
                            onCheckedChange={() => togglePremium(user.id, premiumStatus)}
                            disabled={isProcessing !== null}
                          />
                        </div>
                      )}
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => viewUserData(user.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                        <Calendar className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
