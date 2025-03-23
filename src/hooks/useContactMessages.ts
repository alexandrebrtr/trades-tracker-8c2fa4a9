
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  read: boolean;
  response?: string;
  response_at?: string;
};

export function useContactMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
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
    
    // Configure real-time subscription for new messages
    const subscription = supabase
      .channel('contact_messages_changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'contact_messages' }, (payload) => {
        setMessages((prevMessages) => [payload.new as ContactMessage, ...prevMessages]);
        toast({
          title: "Nouveau message",
          description: `Message reçu de ${(payload.new as ContactMessage).name}`,
        });
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'contact_messages' }, (payload) => {
        setMessages((prevMessages) => 
          prevMessages.map(msg => msg.id === payload.new.id ? payload.new as ContactMessage : msg)
        );
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
    } catch (error) {
      console.error('Error marking message as read:', error);
      toast({
        title: "Erreur",
        description: "Impossible de marquer le message comme lu",
        variant: "destructive",
      });
    }
  };

  const respondToMessage = async (id: string, response: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ 
          response: response,
          response_at: new Date().toISOString(),
          read: true 
        })
        .eq('id', id);
      
      if (error) throw error;
      
      setMessages(messages.map(msg => 
        msg.id === id ? { 
          ...msg, 
          response: response,
          response_at: new Date().toISOString(),
          read: true 
        } : msg
      ));
      
      toast({
        title: "Réponse envoyée",
        description: "La réponse a été envoyée avec succès",
      });
    } catch (error) {
      console.error('Error responding to message:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer la réponse",
        variant: "destructive",
      });
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setMessages(messages.filter(msg => msg.id !== id));
      
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

  return {
    messages,
    loading,
    fetchMessages,
    markAsRead,
    respondToMessage,
    deleteMessage
  };
}
