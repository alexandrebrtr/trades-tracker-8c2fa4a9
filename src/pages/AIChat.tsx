
import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, BarChart3, Brain, PlusCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Bonjour, je suis votre assistant IA pour l\'analyse de trading. Comment puis-je vous aider aujourd\'hui?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    // Simulate bot response after a short delay
    setTimeout(() => {
      const botResponses = [
        "D'après mon analyse, le marché montre une tendance haussière. Considérez de diversifier votre portefeuille.",
        "Les indicateurs techniques suggèrent un point d'entrée potentiel pour cette action.",
        "Je recommande d'attendre avant d'investir davantage. Le marché présente des signes de volatilité.",
        "Vos performances de trading ont augmenté de 12% ce mois-ci par rapport au mois précédent.",
        "Analysant votre dernier trade, j'ai remarqué que vous auriez pu sortir à un meilleur prix en utilisant un trailing stop."
      ];
      
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      
      const botMessage: Message = {
        id: Date.now().toString(),
        content: randomResponse,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <AppLayout>
      <div className="page-transition space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Assistant IA</h1>
        </div>

        <Tabs defaultValue="chat" className="space-y-6">
          <TabsList>
            <TabsTrigger value="chat" className="flex gap-2 items-center">
              <Brain className="w-4 h-4" />
              <span>Chat</span>
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex gap-2 items-center">
              <BarChart3 className="w-4 h-4" />
              <span>Analyses</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="chat" className="space-y-4">
            <Card className="border">
              <CardContent className="p-6">
                <div className="flex flex-col space-y-4 mb-4 h-[60vh] overflow-y-auto">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`flex items-start space-x-2 max-w-[80%] ${
                          message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                        }`}
                      >
                        <Avatar className="h-8 w-8 mt-0.5">
                          {message.sender === 'bot' ? (
                            <AvatarImage src="/ai-avatar.png" alt="AI" />
                          ) : null}
                          <AvatarFallback>
                            {message.sender === 'user' ? 'T' : 'AI'}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`p-3 rounded-lg ${
                            message.sender === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p>{message.content}</p>
                          <div
                            className={`text-xs mt-1 ${
                              message.sender === 'user'
                                ? 'text-primary-foreground/75'
                                : 'text-muted-foreground'
                            }`}
                          >
                            {message.timestamp.toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Posez une question sur vos trades..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analysis" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Analyses IA</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Card className="border border-muted-foreground/20">
                    <CardHeader>
                      <CardTitle className="text-base">Demander une analyse</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4">
                        <Button variant="outline" className="justify-start text-left">
                          <BarChart3 className="mr-2 h-4 w-4" />
                          Analyser mes performances récentes
                        </Button>
                        <Button variant="outline" className="justify-start text-left">
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Suggérer des opportunités de trading
                        </Button>
                        <Button variant="outline" className="justify-start text-left">
                          <Brain className="mr-2 h-4 w-4" />
                          Prédire les tendances du marché
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border border-muted-foreground/20">
                    <CardHeader>
                      <CardTitle className="text-base">Fonctionnalité à venir</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Notre équipe travaille activement sur de nouvelles fonctionnalités d'analyse basées sur l'IA. 
                        Restez à l'écoute pour des mises à jour.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
