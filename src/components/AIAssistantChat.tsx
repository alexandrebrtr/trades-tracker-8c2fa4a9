
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bot, Loader2, Send, User, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIAssistantChatProps {
  title?: string;
  description?: string;
}

export function AIAssistantChat({
  title = "Assistant Trading IA",
  description = "Posez vos questions sur le trading et la finance"
}: AIAssistantChatProps) {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Bonjour, je suis votre assistant IA spécialisé en trading. Comment puis-je vous aider aujourd\'hui?',
      timestamp: new Date(),
    },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;
  const { toast } = useToast();
  const { user } = useAuth();

  const callAssistantAPI = async (message: string, attempt: number = 0): Promise<string> => {
    try {
      console.log(`Appel à l'API d'assistance IA (tentative ${attempt + 1}/${MAX_RETRIES + 1})`);
      
      const { data, error } = await supabase.functions.invoke('trade-assistant', {
        body: { 
          message, 
          model: 'gpt-4o-mini' 
        }
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
        return callAssistantAPI(message, attempt + 1);
      }
      
      throw error;
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);
    
    try {
      const aiResponse = await callAssistantAPI(inputValue);
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
      setRetryCount(0); // Reset retry count on success
    } catch (error) {
      console.error('Erreur lors de l\'appel à l\'assistant IA:', error);
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Désolé, une erreur est survenue. Veuillez réessayer.',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la communication avec l'assistant IA.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isProcessing) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: 'Bonjour, je suis votre assistant IA spécialisé en trading. Comment puis-je vous aider aujourd\'hui?',
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bot className="h-5 w-5 mr-2 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-auto mb-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`flex items-start gap-2 max-w-[80%] ${
                  message.role === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted'
                } p-3 rounded-lg`}
              >
                <div className="w-6 h-6 mt-0.5 flex-shrink-0">
                  {message.role === 'user' ? (
                    <User className="w-full h-full" />
                  ) : (
                    <Bot className="w-full h-full" />
                  )}
                </div>
                <div className="whitespace-pre-wrap">
                  {message.content}
                </div>
              </div>
            </div>
          ))}
          
          {isProcessing && (
            <div className="flex justify-start">
              <div className="bg-muted p-3 rounded-lg flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>L'assistant réfléchit...</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 flex flex-col gap-4">
        <div className="flex justify-end w-full">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearChat}
            disabled={isProcessing || messages.length <= 1}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Nouvelle conversation
          </Button>
        </div>
        <div className="flex w-full items-center space-x-2">
          <Input
            placeholder="Posez votre question sur le trading ou la finance..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isProcessing}
          />
          <Button 
            onClick={handleSendMessage} 
            size="icon"
            disabled={isProcessing || !inputValue.trim()}
          >
            {isProcessing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
