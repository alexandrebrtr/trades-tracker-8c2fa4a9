
import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Users, CheckCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { UserTable } from '@/components/admin/UserTable';
import { UserSearch } from '@/components/admin/UserSearch';

const AdminPanel = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Admin IDs - hardcoded for simplicity
  const adminIds = ['9ce47b0c-0d0a-4834-ae81-e103dff2e386'];
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Check if current user is admin
    const checkAdmin = () => {
      const isUserAdmin = adminIds.includes(user.id);
      setIsAdmin(isUserAdmin);
      
      if (!isUserAdmin) {
        toast({
          title: "Accès refusé",
          description: "Vous n'avez pas les droits d'administrateur pour accéder à cette page.",
          variant: "destructive"
        });
        navigate('/dashboard');
      }
    };
    
    checkAdmin();
    
    // If user is admin, fetch all users
    if (adminIds.includes(user.id)) {
      fetchUsers();
    }
  }, [user, navigate]);
  
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
        
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la récupération des utilisateurs.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const filteredUsers = users.filter(user => {
    if (!searchTerm) return true;
    
    const searchTermLower = searchTerm.toLowerCase();
    return (
      (user.username && user.username.toLowerCase().includes(searchTermLower)) ||
      (user.id && user.id.toLowerCase().includes(searchTermLower)) ||
      (user.phone && user.phone.toLowerCase().includes(searchTermLower)) ||
      (user.address && user.address.toLowerCase().includes(searchTermLower))
    );
  });
  
  if (!isAdmin) {
    return null; // Redirect happens in useEffect
  }
  
  return (
    <AppLayout>
      <div className="page-transition space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">Panneau d'administration</h1>
            <div className="flex items-center text-xs bg-blue-500/10 text-blue-500 px-2 py-1 rounded-full border border-blue-500/20">
              <Users className="h-3 w-3 mr-1" />
              {users.length} Utilisateurs
            </div>
          </div>
          <Button onClick={fetchUsers} variant="outline" size="sm">
            Rafraîchir
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Gestion des utilisateurs</CardTitle>
            <CardDescription>
              Attribuez le statut premium gratuitement aux utilisateurs sélectionnés
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <UserTable users={filteredUsers} onRefresh={fetchUsers} />
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Intégration d'une IA par API</CardTitle>
            <CardDescription>
              Guide pour intégrer une IA à votre application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">1. Choisissez un fournisseur d'IA</h3>
                <p className="text-muted-foreground">
                  Des services comme OpenAI (GPT), Google (Gemini), Anthropic (Claude) ou Perplexity offrent des API simples à intégrer.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">2. Utilisez des Edge Functions Supabase</h3>
                <p className="text-muted-foreground">
                  Le moyen le plus sécurisé d'intégrer une IA est d'utiliser les Edge Functions de Supabase pour protéger vos clés API.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">3. Implémentation</h3>
                <div className="bg-muted p-4 rounded-md">
                  <p className="font-mono text-sm">
                    Pour implémenter une IA avec OpenAI, suivez ces étapes :<br />
                    1. Créez une Edge Function dans Supabase<br />
                    2. Ajoutez votre clé API OpenAI dans les secrets Supabase<br />
                    3. Créez un composant React pour interagir avec l'IA
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Voir l'exemple complet
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default AdminPanel;
