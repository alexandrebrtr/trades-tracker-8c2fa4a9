
import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Send, Check, Clock, RefreshCw, ChevronRight } from 'lucide-react';
import { ContactMessages } from '@/components/admin/ContactMessages';

type Message = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  response?: string;
  response_at?: string;
};

const Contact = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userMessages, setUserMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tab, setTab] = useState('form');
  
  // Populate the form with user data if available
  useEffect(() => {
    if (user && profile) {
      // Use the username from profile if available, otherwise use email from user
      setName(profile.username || user.email?.split('@')[0] || '');
      
      // Use email from user auth
      setEmail(user.email || '');
    }
  }, [user, profile]);

  // Fetch user's messages if logged in
  useEffect(() => {
    if (user) {
      fetchUserMessages();
      
      // Set up real-time subscription for updates to messages
      const subscription = supabase
        .channel('contact_messages_updates')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'contact_messages',
            filter: `email=eq.${user.email}` 
          }, 
          (payload) => {
            console.log('Message update received:', payload);
            setUserMessages(prevMessages => {
              // If it's an update, replace the message
              if (payload.eventType === 'UPDATE') {
                return prevMessages.map(msg => 
                  msg.id === payload.new.id ? payload.new as Message : msg
                );
              }
              // If it's a new message, add it
              else if (payload.eventType === 'INSERT') {
                return [payload.new as Message, ...prevMessages];
              }
              // If it's a delete, remove it
              else if (payload.eventType === 'DELETE') {
                return prevMessages.filter(msg => msg.id !== payload.old.id);
              }
              return prevMessages;
            });
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(subscription);
      };
    }
  }, [user]);

  const fetchUserMessages = async () => {
    if (!user?.email) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .eq('email', user.email)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setUserMessages(data as Message[]);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer vos messages",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !message) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .insert([
          { name, email, message }
        ])
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Message envoyé",
        description: "Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.",
      });
      
      // Clear form
      setMessage('');
      
      // If user is logged in, refresh messages
      if (user) {
        fetchUserMessages();
        // Switch to messages tab
        setTab('messages');
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer votre message",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AppLayout>
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Contactez-nous</h1>
          <p className="text-muted-foreground">
            Vous avez une question ou besoin d'aide ? N'hésitez pas à nous contacter. Notre équipe vous répondra dans les plus brefs délais.
          </p>
          
          {user ? (
            <Tabs value={tab} onValueChange={setTab} className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="form">Formulaire</TabsTrigger>
                <TabsTrigger value="messages">
                  Mes messages
                  {userMessages.length > 0 && (
                    <Badge variant="outline" className="ml-2">{userMessages.length}</Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="form">
                <Card>
                  <CardHeader>
                    <CardTitle>Envoyer un message</CardTitle>
                    <CardDescription>
                      Nous vous répondrons dans les plus brefs délais.
                    </CardDescription>
                  </CardHeader>
                  <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nom</Label>
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Votre nom"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="votreemail@exemple.com"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Votre message"
                          rows={6}
                          required
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Envoi en cours...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Envoyer
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>

              <TabsContent value="messages">
                <Card>
                  <CardHeader>
                    <CardTitle>Historique de mes messages</CardTitle>
                    <CardDescription>
                      Retrouvez ici l'historique de vos échanges avec notre équipe.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="flex justify-center p-4">
                        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                      </div>
                    ) : userMessages.length === 0 ? (
                      <div className="text-center p-4">
                        <p className="text-muted-foreground">Vous n'avez pas encore envoyé de message.</p>
                        <Button 
                          variant="outline" 
                          className="mt-2" 
                          onClick={() => setTab('form')}
                        >
                          Envoyer un message <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {userMessages.map((msg) => (
                          <Card key={msg.id} className="overflow-hidden">
                            <CardHeader className="bg-muted/30 py-3 px-4">
                              <div className="flex justify-between items-center">
                                <div>
                                  <CardTitle className="text-base">Votre message</CardTitle>
                                  <p className="text-xs text-muted-foreground">
                                    {formatDate(msg.created_at)}
                                  </p>
                                </div>
                                <div>
                                  {msg.response ? (
                                    <Badge className="bg-green-500">Répondu</Badge>
                                  ) : (
                                    <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-200">
                                      <Clock className="mr-1 h-3 w-3" /> En attente
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="py-3 px-4">
                              <p className="whitespace-pre-wrap">{msg.message}</p>
                              
                              {msg.response && (
                                <>
                                  <Separator className="my-4" />
                                  <div className="bg-muted/20 p-4 rounded-md">
                                    <div className="flex items-center mb-2">
                                      <Badge variant="outline" className="bg-primary/10 text-primary">
                                        <Check className="mr-1 h-3 w-3" /> Réponse de l'équipe
                                      </Badge>
                                      {msg.response_at && (
                                        <span className="text-xs text-muted-foreground ml-2">
                                          {formatDate(msg.response_at)}
                                        </span>
                                      )}
                                    </div>
                                    <p className="whitespace-pre-wrap">{msg.response}</p>
                                  </div>
                                </>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            // Non-authenticated user only sees the form
            <Card>
              <CardHeader>
                <CardTitle>Envoyer un message</CardTitle>
                <CardDescription>
                  Nous vous répondrons dans les plus brefs délais.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Votre nom"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="votreemail@exemple.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Votre message"
                      rows={6}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Envoyer
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          )}
        </div>
        
        {/* Admin section only visible for admin users */}
        {user && profile?.role === 'admin' && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Administration des messages</h2>
            <ContactMessages />
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Contact;
