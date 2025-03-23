
import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  email: z.string().email({ message: "Adresse email invalide" }),
  message: z.string().min(10, { message: "Le message doit contenir au moins 10 caractères" }),
});

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  read: boolean;
  response?: string;
  response_at?: string;
};

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userMessages, setUserMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  // Fetch user's messages if logged in
  useEffect(() => {
    const fetchUserMessages = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data: profile } = await supabase
          .from('profiles')
          .select('username, email')
          .eq('id', user.id)
          .single();

        if (profile) {
          form.setValue('name', profile.username || '');
          form.setValue('email', profile.email || '');
        }

        const { data, error } = await supabase
          .from('contact_messages')
          .select('*')
          .eq('email', profile?.email || user.email)
          .order('created_at', { ascending: false });

        if (error) throw error;

        setUserMessages(data || []);
      } catch (error) {
        console.error('Error fetching user messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserMessages();

    // Set up real-time subscription for new responses
    const subscription = supabase
      .channel('contact_messages_changes')
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'contact_messages',
        filter: user?.email ? `email=eq.${user.email}` : undefined
      }, (payload) => {
        const updatedMessage = payload.new as ContactMessage;
        
        setUserMessages(prev => 
          prev.map(msg => msg.id === updatedMessage.id ? updatedMessage : msg)
        );
        
        if (updatedMessage.response && !prev.find(m => m.id === updatedMessage.id)?.response) {
          toast({
            title: "Nouvelle réponse",
            description: "Un administrateur a répondu à votre message",
          });
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert({
          name: values.name,
          email: values.email,
          message: values.message
        });
      
      if (error) throw error;
      
      toast({
        title: "Message envoyé",
        description: "Nous vous répondrons dans les plus brefs délais.",
      });
      
      form.reset();
      
      // Refresh user messages if logged in
      if (user) {
        const { data } = await supabase
          .from('contact_messages')
          .select('*')
          .eq('email', values.email)
          .order('created_at', { ascending: false });
          
        setUserMessages(data || []);
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
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
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h1 className="text-3xl font-bold mb-6">Contactez-nous</h1>
            <p className="text-muted-foreground mb-4">
              Vous avez des questions, des suggestions ou besoin d'assistance ? 
              N'hésitez pas à nous contacter en remplissant le formulaire ci-dessous.
            </p>
            
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Nos coordonnées</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="text-muted-foreground">trades.tracker.officiel@gmail.com</p>
                </div>
                <div>
                  <h3 className="font-medium">WhatsApp</h3>
                  <p className="text-muted-foreground">+33 (0)7 78 40 67 10</p>
                </div>
                <div>
                  <h3 className="font-medium">Réseaux sociaux</h3>
                  <h4 className="font-medium">Instagram</h4>
                  <p className="text-muted-foreground">@trades.tracker_official</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Formulaire de contact</CardTitle>
                <CardDescription>
                  Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom</FormLabel>
                          <FormControl>
                            <Input placeholder="Votre nom" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="votre.email@exemple.com" type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Votre message..." 
                              rows={5}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* User's Message History Section */}
        {user && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Historique de vos messages</h2>
            
            {loading ? (
              <p>Chargement de vos messages...</p>
            ) : userMessages.length > 0 ? (
              <div className="space-y-6">
                {userMessages.map((msg) => (
                  <Card key={msg.id} className="overflow-hidden">
                    <CardHeader className="bg-muted/50">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{msg.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{formatDate(msg.created_at)}</p>
                        </div>
                        {msg.response ? (
                          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                            Répondu
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                            En attente
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-sm text-muted-foreground mb-2">Votre message :</h4>
                          <p className="whitespace-pre-wrap">{msg.message}</p>
                        </div>
                        
                        {msg.response && (
                          <>
                            <Separator className="my-4" />
                            <div>
                              <h4 className="font-medium text-sm text-muted-foreground mb-2">Réponse :</h4>
                              <p className="whitespace-pre-wrap">{msg.response}</p>
                              {msg.response_at && (
                                <p className="text-xs text-muted-foreground mt-2">
                                  Répondu le {formatDate(msg.response_at)}
                                </p>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-6 text-center">
                <p className="text-muted-foreground">Vous n'avez pas encore envoyé de message.</p>
              </Card>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
