
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Trash, Check, MailOpen } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  created_at: string;
}

export function ContactMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const { toast } = useToast();

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data as ContactMessage[] || []);
    } catch (error) {
      console.error('Error fetching contact messages:', error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les messages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    
    // Set up realtime subscription for new messages
    const subscription = supabase
      .channel('contact_messages_changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'contact_messages' }, (payload) => {
        setMessages((prevMessages) => [payload.new as ContactMessage, ...prevMessages]);
        toast({
          title: "Nouveau message",
          description: `Message reçu de ${(payload.new as ContactMessage).name}`,
        });
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ read: true })
        .eq('id', id);
      
      if (error) throw error;
      
      setMessages(messages.map(msg => 
        msg.id === id ? { ...msg, read: true } : msg
      ));
      
      if (selectedMessage?.id === id) {
        setSelectedMessage({ ...selectedMessage, read: true });
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
      toast({
        title: "Erreur",
        description: "Impossible de marquer le message comme lu",
        variant: "destructive",
      });
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) return;
    
    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setMessages(messages.filter(msg => msg.id !== id));
      
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
      
      toast({
        title: "Message supprimé",
        description: "Le message a été supprimé avec succès",
      });
    } catch (error) {
      console.error('Error deleting message:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le message",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Messages de contact</h2>
        <Badge variant="outline">{messages.length} message(s)</Badge>
      </div>
      
      {loading ? (
        <div className="text-center py-8">Chargement des messages...</div>
      ) : messages.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">Aucun message reçu</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-2">
            {messages.map((msg) => (
              <Card 
                key={msg.id} 
                className={`cursor-pointer hover:bg-accent/50 transition-colors ${!msg.read ? 'border-primary' : ''}`}
                onClick={() => setSelectedMessage(msg)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{msg.name}</h3>
                      <p className="text-sm text-muted-foreground truncate">{msg.email}</p>
                    </div>
                    {!msg.read && (
                      <Badge className="ml-2">Nouveau</Badge>
                    )}
                  </div>
                  <p className="text-sm mt-2 truncate">{msg.message}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {format(new Date(msg.created_at), 'PPp', { locale: fr })}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="md:col-span-2">
            {selectedMessage ? (
              <Card>
                <CardHeader className="flex flex-row items-start justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {selectedMessage.name}
                      {!selectedMessage.read && <Badge>Nouveau</Badge>}
                    </CardTitle>
                    <CardDescription>
                      {selectedMessage.email} - {format(new Date(selectedMessage.created_at), 'PPp', { locale: fr })}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {!selectedMessage.read && (
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => markAsRead(selectedMessage.id)}
                        title="Marquer comme lu"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button 
                      variant="destructive" 
                      size="icon"
                      onClick={() => deleteMessage(selectedMessage.id)}
                      title="Supprimer"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="whitespace-pre-wrap">
                    {selectedMessage.message}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center p-8 text-muted-foreground">
                  <MailOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Sélectionnez un message pour le lire</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
