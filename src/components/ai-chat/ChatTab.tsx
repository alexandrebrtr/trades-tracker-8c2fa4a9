
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { Message } from './Message';
import { aiResponseGenerator } from '@/utils/aiResponseGenerator';

export function ChatTab() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Bonjour, je suis votre assistant IA spécialisé en trading. Comment puis-je vous aider aujourd\'hui?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisType, setAnalysisType] = useState<string | null>(null);

  const handleSendMessage = async (inputValue: string) => {
    // Use analysis type or input value
    const messageContent = analysisType || inputValue;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageContent,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setAnalysisType(null);
    
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
      // Simulate AI processing with sophisticated trading responses
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate response based on message content
      const response = aiResponseGenerator(messageContent);
      
      // Remove loading message and add response
      setMessages(prev => prev.filter(msg => msg.id !== loadingMessageId));
      
      const botMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: response,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error generating AI response:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer une réponse. Veuillez réessayer.",
        variant: "destructive",
      });
      
      // Remove loading message
      setMessages(prev => prev.filter(msg => msg.id !== loadingMessageId));
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
