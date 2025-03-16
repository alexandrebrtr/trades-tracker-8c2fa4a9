
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
          title: "Access denied",
          description: "You don't have administrator permissions to access this page.",
          variant: "destructive"
        });
        navigate('/dashboard');
      }
    };
    
    checkAdmin();
    
    // If user is admin, fetch all users
    if (adminIds.includes(user.id)) {
      console.log('Admin user detected, fetching all users');
      fetchUsers();
      
      // Set up real-time subscription for profiles changes
      const channel = supabase
        .channel('schema-db-changes')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'profiles' }, 
          () => {
            console.log('Profiles change detected, refreshing user list');
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
      console.log('Fetching all users for admin panel');
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
        
      if (error) throw error;
      
      console.log(`Retrieved ${data?.length || 0} user profiles`);
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "An error occurred while retrieving users.",
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
            <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
            <div className="flex items-center text-xs bg-blue-500/10 text-blue-500 px-2 py-1 rounded-full border border-blue-500/20">
              <Users className="h-3 w-3 mr-1" />
              {users.length} Users
            </div>
          </div>
          <Button onClick={fetchUsers} variant="outline" size="sm">
            Refresh
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              Assign premium status to selected users for free
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
