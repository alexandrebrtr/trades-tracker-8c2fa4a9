
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Send, Bot, ArrowDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface AIAssistantProps {
  title?: string;
  description?: string;
}

export function AIAssistant({ 
  title = "Assistant Trading IA", 
  description = "Posez vos questions sur le trading et la finance" 
}: AIAssistantProps) {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;
  const { toast } = useToast();
  const { user } = useAuth();

  const callAssistantAPI = async (attempt: number = 0): Promise<string> => {
    try {
      console.log(`Appel à l'API d'assistance IA (tentative ${attempt + 1}/${MAX_RETRIES + 1})`);
      
      const { data, error } = await supabase.functions.invoke('trade-assistant', {
        body: { message, model: 'gpt-4o-mini' }
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
        return callAssistantAPI(attempt + 1);
      }
      
      throw error;
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast({
        title: "Message vide",
        description: "Veuillez entrer une question pour l'assistant IA.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    setResponse('');
    
    try {
      const aiResponse = await callAssistantAPI();
      setResponse(aiResponse);
      
    } catch (error) {
      console.error('Erreur lors de l\'appel à l\'assistant IA:', error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la communication avec l'assistant IA.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bot className="h-5 w-5 mr-2 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Posez votre question sur le trading ou la finance ici..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-24"
            disabled={isLoading}
          />
          
          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading || !message.trim()}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Traitement en cours...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Envoyer
                </>
              )}
            </Button>
          </div>
        </form>
        
        {response && (
          <div className="mt-6">
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <ArrowDown className="h-4 w-4 mr-1" />
              Réponse de l'assistant
            </div>
            <div className="bg-muted p-4 rounded-md whitespace-pre-wrap">
              {response}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Propulsé par l'intelligence artificielle
      </CardFooter>
    </Card>
  );
}
