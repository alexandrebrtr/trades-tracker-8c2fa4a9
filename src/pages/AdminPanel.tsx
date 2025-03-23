
import { AppLayout } from '@/components/layout/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { UserTable } from '@/components/admin/UserTable';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ContactMessages } from '@/components/admin/ContactMessages';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw } from 'lucide-react';

export default function AdminPanel() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Admin IDs - hardcoded for simplicity
  // For dev purposes, consider all users as admin temporarily
  const adminIds = ['9ce47b0c-0d0a-4834-ae81-e103dff2e386'];
  const isDev = true; // Toggle this for development mode
  
  // Fetch users data
  const fetchUsers = async () => {
    setRefreshing(true);
    try {
      // Get users from profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setUsers(data || []);
      console.log(`Loaded ${data?.length || 0} users from database`);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Erreur',
        description: "Impossible de récupérer la liste des utilisateurs.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  useEffect(() => {
    if (user) {
      const isAdmin = isDev || adminIds.includes(user.id);
      setIsAuthorized(isAdmin);
      
      if (!isAdmin && !isDev) {
        navigate('/dashboard');
      } else {
        // Fetch users if admin
        fetchUsers();
      }
    }
  }, [user, navigate]);
  
  if (!isAuthorized && !isDev) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Card className="p-6 max-w-md text-center">
            <h2 className="text-xl font-bold mb-2">Accès non autorisé</h2>
            <p className="text-muted-foreground">
              Vous n'avez pas les droits nécessaires pour accéder à cette page.
            </p>
          </Card>
        </div>
      </AppLayout>
    );
  }
  
  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold">Panneau d'administration</h1>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchUsers}
              disabled={refreshing}
              className="flex items-center gap-2"
            >
              {refreshing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Rafraîchir
            </Button>
            {isDev && (
              <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                Mode Développement
              </Badge>
            )}
          </div>
        </div>
        
        <Tabs defaultValue="users">
          <TabsList className="mb-6">
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="messages">Messages de contact</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users">
            <UserTable users={users} onRefresh={fetchUsers} />
          </TabsContent>
          
          <TabsContent value="messages">
            <ContactMessages />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
