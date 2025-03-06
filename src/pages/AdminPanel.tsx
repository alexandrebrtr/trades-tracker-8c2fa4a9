
import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Loader2, Search, Star, Calendar, CheckCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Admin IDs - hardcoded for simplicity. In a real app, this should be in a database
  const adminIds = ['9ce47b0c-0d0a-4834-ae81-e103dff2e386']; // Replace with your actual admin user ID
  
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
  
  const togglePremium = async (userId: string, currentStatus: boolean) => {
    try {
      const now = new Date();
      const oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(now.getFullYear() + 1);
      
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
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, premium: !currentStatus, premium_since: !currentStatus ? now.toISOString() : null, premium_expires: !currentStatus ? oneYearFromNow.toISOString() : null } : user
      ));
      
      toast({
        title: "Statut premium mis à jour",
        description: `L'utilisateur a été ${!currentStatus ? 'promu' : 'rétrogradé'} avec succès.`,
      });
    } catch (error) {
      console.error('Error updating premium status:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du statut premium.",
        variant: "destructive"
      });
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
  
  // Format date function
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };
  
  if (!isAdmin) {
    return null; // Redirect happens in useEffect
  }
  
  return (
    <AppLayout>
      <div className="page-transition space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Panneau d'administration</h1>
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
            <div className="mb-4 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                placeholder="Rechercher un utilisateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
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
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          Aucun utilisateur trouvé
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
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
                              <Switch
                                checked={!!user.premium}
                                onCheckedChange={() => togglePremium(user.id, !!user.premium)}
                              />
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
          <CardContent className="space-y-4">
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
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default AdminPanel;
