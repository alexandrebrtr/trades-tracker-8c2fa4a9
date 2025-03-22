
import { AppLayout } from '@/components/layout/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { UserTable } from '@/components/admin/UserTable';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ContactMessages } from '@/components/admin/ContactMessages';

export default function AdminPanel() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Admin IDs - hardcoded for simplicity
  const adminIds = ['9ce47b0c-0d0a-4834-ae81-e103dff2e386'];
  
  useEffect(() => {
    if (user) {
      const isAdmin = adminIds.includes(user.id);
      setIsAuthorized(isAdmin);
      
      if (!isAdmin) {
        navigate('/dashboard');
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
            <UserTable />
          </TabsContent>
          
          <TabsContent value="messages">
            <ContactMessages />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
