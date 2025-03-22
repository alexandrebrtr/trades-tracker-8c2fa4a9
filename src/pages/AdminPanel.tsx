
import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Users, CheckCircle, Code } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { UserTable } from '@/components/admin/UserTable';
import { UserSearch } from '@/components/admin/UserSearch';

// Vérification si l'application est en mode développement
const isDevelopmentMode = window.location.hostname === 'localhost' || 
                         window.location.hostname === '127.0.0.1';

const AdminPanel = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDeveloper, setIsDeveloper] = useState(false);
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
    
    // Vérifier si l'utilisateur est en mode développement sur localhost
    if (isDevelopmentMode) {
      console.log('Mode développement détecté sur localhost');
      setIsDeveloper(true);
    }
    
    // Vérifier si l'utilisateur est admin
    const checkAdmin = () => {
      const isUserAdmin = adminIds.includes(user.id);
      setIsAdmin(isUserAdmin);
      
      // Rediriger seulement si l'utilisateur n'est ni admin ni en mode développement
      if (!isUserAdmin && !isDevelopmentMode) {
        toast({
          title: "Accès refusé",
          description: "Vous n'avez pas les permissions d'administrateur pour accéder à cette page.",
          variant: "destructive"
        });
        navigate('/dashboard');
      }
    };
    
    checkAdmin();
    
    // Si l'utilisateur est admin ou en mode développement, récupérer tous les utilisateurs
    if (adminIds.includes(user.id) || isDevelopmentMode) {
      console.log('Récupération des utilisateurs autorisée, chargement des profils');
      fetchUsers();
      
      // Configurer l'abonnement en temps réel pour les changements de profils
      const channel = supabase
        .channel('schema-db-changes')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'profiles' }, 
          () => {
            console.log('Changement de profil détecté, actualisation de la liste des utilisateurs');
            fetchUsers();
          }
        )
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, navigate]);
  
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      console.log('Récupération de tous les utilisateurs pour le panneau administrateur');
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
        
      if (error) throw error;
      
      console.log(`${data?.length || 0} profils d'utilisateurs récupérés`);
      setUsers(data || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la récupération des utilisateurs.",
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
  
  // Si l'utilisateur n'est ni admin ni en mode développement, rediriger
  if (!isAdmin && !isDeveloper) {
    return null; // La redirection se fait dans useEffect
  }
  
  return (
    <AppLayout>
      <div className="page-transition space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">Panneau d'Administration</h1>
            <div className="flex items-center text-xs bg-blue-500/10 text-blue-500 px-2 py-1 rounded-full border border-blue-500/20">
              <Users className="h-3 w-3 mr-1" />
              {users.length} Utilisateurs
            </div>
            {isDeveloper && !isAdmin && (
              <div className="flex items-center text-xs bg-amber-500/10 text-amber-500 px-2 py-1 rounded-full border border-amber-500/20">
                <Code className="h-3 w-3 mr-1" />
                Mode Développement
              </div>
            )}
          </div>
          <Button onClick={fetchUsers} variant="outline" size="sm">
            Actualiser
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Gestion des Utilisateurs</CardTitle>
            <CardDescription>
              {isAdmin ? (
                "Attribuer le statut premium aux utilisateurs sélectionnés gratuitement"
              ) : (
                "Mode développement: visualisation de tous les comptes utilisateurs"
              )}
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
            <CardTitle>AI Integration via API</CardTitle>
            <CardDescription>
              Guide to integrating AI into your application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">1. Choose an AI Provider</h3>
                <p className="text-muted-foreground">
                  Services like OpenAI (GPT), Google (Gemini), Anthropic (Claude) or Perplexity offer simple APIs to integrate.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">2. Use Supabase Edge Functions</h3>
                <p className="text-muted-foreground">
                  The most secure way to integrate AI is to use Supabase Edge Functions to protect your API keys.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">3. Implementation</h3>
                <div className="bg-muted p-4 rounded-md">
                  <p className="font-mono text-sm">
                    To implement AI with OpenAI, follow these steps:<br />
                    1. Create an Edge Function in Supabase<br />
                    2. Add your OpenAI API key to Supabase secrets<br />
                    3. Create a React component to interact with the AI
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  See complete example
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
