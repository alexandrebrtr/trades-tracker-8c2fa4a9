
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/context/AuthContext';
import { Header } from '@/components/navigation/Header';
import { Sidebar } from '@/components/navigation/Sidebar';
import { Loader2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  // Rediriger si déjà connecté
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await signIn(email, password, stayLoggedIn);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await signUp(email, password, name);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 flex flex-col ml-20 transition-all duration-300">
          <Header />
          <div className="flex-1 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
              <Tabs defaultValue="login" className="w-full">
                <CardHeader>
                  <div className="flex justify-center">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="login">Se connecter</TabsTrigger>
                      <TabsTrigger value="signup">Créer un compte</TabsTrigger>
                    </TabsList>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <TabsContent value="login">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">Email</label>
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="exemple@email.com" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={loading}
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label htmlFor="password" className="text-sm font-medium">Mot de passe</label>
                          <Link to="/forgot-password" className="text-sm text-primary underline-offset-4 hover:underline">
                            Mot de passe oublié?
                          </Link>
                        </div>
                        <Input 
                          id="password" 
                          type="password" 
                          placeholder="••••••••" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          disabled={loading}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="stayLoggedIn" 
                          checked={stayLoggedIn}
                          onCheckedChange={(checked) => setStayLoggedIn(checked === true)}
                        />
                        <label
                          htmlFor="stayLoggedIn"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Rester connecté
                        </label>
                      </div>
                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Connexion en cours...
                          </>
                        ) : (
                          "Se connecter"
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="signup">
                    <form onSubmit={handleSignup} className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">Nom</label>
                        <Input 
                          id="name" 
                          type="text" 
                          placeholder="Votre nom" 
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          disabled={loading}
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email-signup" className="text-sm font-medium">Email</label>
                        <Input 
                          id="email-signup" 
                          type="email" 
                          placeholder="exemple@email.com" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={loading}
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="password-signup" className="text-sm font-medium">Mot de passe</label>
                        <Input 
                          id="password-signup" 
                          type="password" 
                          placeholder="••••••••" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          disabled={loading}
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Création du compte...
                          </>
                        ) : (
                          "Créer un compte"
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                </CardContent>
                
                <CardFooter className="flex flex-col space-y-4 border-t p-6">
                  <div className="text-sm text-center text-muted-foreground">
                    En continuant, vous acceptez nos{" "}
                    <Link to="/terms" className="underline underline-offset-4 hover:text-primary">
                      conditions d'utilisation
                    </Link>{" "}
                    et notre{" "}
                    <Link to="/privacy" className="underline underline-offset-4 hover:text-primary">
                      politique de confidentialité
                    </Link>
                    .
                  </div>
                </CardFooter>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
