
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Send, Bot, ArrowDown } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface AIAssistantProps {
  title?: string;
  description?: string;
}

export function AIAssistant({ title = "Assistant IA", description = "Posez vos questions sur le trading et la finance" }: AIAssistantProps) {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 2;
  const { toast } = useToast();
  const { user } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast({
        title: "Message vide",
        description: "Veuillez entrer une question pour l'assistant IA.",
        variant: "destructive"
      });
      return;
    }
    
    if (!user) {
      toast({
        title: "Non connecté",
        description: "Vous devez être connecté pour utiliser l'assistant IA.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    setResponse('');
    
    try {
      // Call Supabase Edge Function with retry logic
      const callAPI = async (attempt: number) => {
        try {
          console.log(`Calling AI assistant API (attempt ${attempt + 1})`);
          const { data, error } = await supabase.functions.invoke('chat-with-ai', {
            body: { prompt, model: 'gpt-4o-mini' }
          });
          
          if (error) {
            console.error(`Error from edge function (attempt ${attempt + 1}):`, error);
            throw error;
          }
          
          if (!data || !data.response) {
            console.error(`Invalid response data (attempt ${attempt + 1}):`, data);
            throw new Error("Réponse invalide de l'assistant IA");
          }
          
          return data;
        } catch (error) {
          if (attempt < MAX_RETRIES) {
            console.log(`Retrying API call, attempt ${attempt + 1} of ${MAX_RETRIES}`);
            // Wait a bit before retrying
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            return callAPI(attempt + 1);
          }
          throw error;
        }
      };
      
      const data = await callAPI(0);
      setResponse(data.response);
      setRetryCount(0); // Reset retry count on success
      
    } catch (error) {
      console.error('Error calling AI assistant:', error);
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
            placeholder="Posez votre question ici..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-24"
            disabled={isLoading}
          />
          
          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading || !prompt.trim()}>
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
