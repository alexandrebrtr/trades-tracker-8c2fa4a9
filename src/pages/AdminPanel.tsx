
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

export default function AdminPanel() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Admin IDs - hardcoded for simplicity
  const adminIds = ['9ce47b0c-0d0a-4834-ae81-e103dff2e386'];
  
  // Fetch users data
  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Get users from profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      
      if (error) throw error;
      
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Erreur',
        description: "Impossible de récupérer la liste des utilisateurs.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (user) {
      const isAdmin = adminIds.includes(user.id);
      setIsAuthorized(isAdmin);
      
      if (!isAdmin) {
        navigate('/dashboard');
      } else {
        // Fetch users if admin
        fetchUsers();
      }
    }
  }, [user, navigate]);
  
  if (!isAuthorized) {
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
        <h1 className="text-3xl font-bold mb-6">Panneau d'administration</h1>
        
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
