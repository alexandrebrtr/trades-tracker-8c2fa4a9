
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Loader2, Calendar, Star, Eye } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface UserTableProps {
  users: any[];
  onRefresh: () => void;
}

export function UserTable({ users, onRefresh }: UserTableProps) {
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
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
        title: !currentStatus ? "Premium subscription activated" : "Premium subscription deactivated",
        description: `The user's premium status has been ${!currentStatus ? 'activated' : 'deactivated'} successfully.`,
      });
      
      // Refresh the user list
      onRefresh();
        
    } catch (error: any) {
      console.error('Error updating premium status:', error);
      toast({
        title: "Error",
        description: error.message || "An error occurred while updating premium status.",
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
      description: `Redirecting to user profile: ${userId}`,
    });
  };
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Premium</TableHead>
            <TableHead>Expiration Date</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead>Trades</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No users found
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  {user.username || 'Unnamed user'}
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
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => viewUserData(user.id)}>
                      <Eye className="h-4 w-4" />
                    </Button>
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
