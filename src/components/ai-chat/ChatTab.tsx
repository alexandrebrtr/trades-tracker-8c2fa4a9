
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { Message } from './Message';
import { supabase } from '@/integrations/supabase/client';
import { usePremium } from '@/context/PremiumContext';
import { useAuth } from '@/context/AuthContext';

interface ChatTabProps {
  analysisPrompt?: string | null;
}

export function ChatTab({ analysisPrompt }: ChatTabProps) {
  const { toast } = useToast();
  const { isPremium } = usePremium();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Bonjour, je suis votre assistant IA spécialisé en trading. Comment puis-je vous aider aujourd\'hui?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [modelType, setModelType] = useState<string>('gpt-4o-mini');

  // Handle processing an analysis request that comes from the AnalysisTab
  useEffect(() => {
    if (analysisPrompt && !isProcessing && isPremium) {
      handleSendMessage(analysisPrompt);
    }
  }, [analysisPrompt]);

  const handleSendMessage = async (inputValue: string) => {
    if (!user) {
      toast({
        title: "Non connecté",
        description: "Vous devez être connecté pour utiliser l'assistant IA.",
        variant: "destructive"
      });
      return;
    }
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Add loading message
    const loadingMessageId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: loadingMessageId,
      content: '',
      sender: 'bot',
      timestamp: new Date(),
      isLoading: true
    }]);
    
    setIsProcessing(true);
    
    try {
      console.log('Calling Supabase Edge Function chat-with-ai');
      
      // Call Supabase Edge Function with better error handling
      const { data, error } = await supabase.functions.invoke('chat-with-ai', {
        body: { 
          prompt: inputValue, 
          model: modelType 
        }
      });
      
      if (error) {
        console.error('Error calling AI assistant:', error);
        throw new Error(error.message || "Une erreur est survenue lors de la communication avec l'assistant IA");
      }
      
      if (!data || !data.response) {
        console.error('Invalid response from AI assistant:', data);
        throw new Error("La réponse de l'assistant IA est invalide");
      }
      
      console.log('Response from AI assistant received');
      
      // Remove loading message and add response
      setMessages(prev => prev.filter(msg => msg.id !== loadingMessageId));
      
      const botMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: data.response,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error generating AI response:', error);
      
      // Remove loading message
      setMessages(prev => prev.filter(msg => msg.id !== loadingMessageId));
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: 'Désolé, une erreur est survenue lors de la génération de la réponse. Veuillez réessayer.',
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Erreur",
        description: error.message || "Impossible de générer une réponse. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="border">
      <CardContent className="p-6">
        <MessageList messages={messages} />
        <MessageInput 
          isProcessing={isProcessing} 
          onSendMessage={handleSendMessage} 
        />
      </CardContent>
    </Card>
  );
}
