
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { Message } from './Message';
import { supabase } from '@/integrations/supabase/client';
import { usePremium } from '@/context/PremiumContext';
import { useAuth } from '@/context/AuthContext';
import { AIAssistant } from '@/components/AIAssistant';

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
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 2;

  // Handle processing an analysis request that comes from the AnalysisTab
  useEffect(() => {
    if (analysisPrompt && !isProcessing && isPremium) {
      handleSendMessage(analysisPrompt);
    }
  }, [analysisPrompt]);

  const callAssistantAPI = async (inputValue: string, attempt: number = 0): Promise<string> => {
    try {
      console.log(`Appel à l'API d'assistance IA (tentative ${attempt + 1}/${MAX_RETRIES + 1})`);
      
      const { data, error } = await supabase.functions.invoke('trade-assistant', {
        body: { message: inputValue, model: modelType }
      });
      
      if (error) {
        console.error(`Erreur de la fonction edge (tentative ${attempt + 1}):`, error);
        throw new Error(error.message || "Erreur lors de la communication avec l'assistant IA");
      }
      
      if (!data || !data.response) {
        console.error(`Réponse invalide (tentative ${attempt + 1}):`, data);
        throw new Error("Réponse invalide de l'assistant IA");
      }
      
      return data.response;
    } catch (error) {
      console.error(`Erreur lors de l'appel API (tentative ${attempt + 1}):`, error);
      
      // Si nous n'avons pas dépassé le nombre maximum de tentatives, réessayons
      if (attempt < MAX_RETRIES) {
        // Attendre un peu plus longtemps entre chaque tentative
        const delay = 1000 * Math.pow(2, attempt);
        console.log(`Nouvelle tentative dans ${delay/1000} secondes...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return callAssistantAPI(inputValue, attempt + 1);
      }
      
      throw error;
    }
  };

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
      const aiResponse = await callAssistantAPI(inputValue);
      
      // Remove loading message and add response
      setMessages(prev => prev.filter(msg => msg.id !== loadingMessageId));
      
      const botMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: aiResponse,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
      setRetryCount(0); // Reset retry count on success
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
