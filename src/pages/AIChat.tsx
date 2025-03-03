
import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, BarChart3, Brain, PlusCircle, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isLoading?: boolean;
}

export default function AIChat() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Bonjour, je suis votre assistant IA spécialisé en trading. Comment puis-je vous aider aujourd\'hui?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisType, setAnalysisType] = useState<string | null>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    const messageContainer = document.getElementById('message-container');
    if (messageContainer) {
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() && !analysisType) return;
    
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
    setInputValue('');
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
      
      // Generate appropriate response based on user query
      let response = '';
      
      if (messageContent.toLowerCase().includes('analyse') || messageContent.toLowerCase().includes('performance')) {
        response = generateTradingAnalysis();
      } else if (messageContent.toLowerCase().includes('tendance') || messageContent.toLowerCase().includes('marché')) {
        response = generateMarketTrends();
      } else if (messageContent.toLowerCase().includes('stratégie') || messageContent.toLowerCase().includes('conseil')) {
        response = generateTradingAdvice();
      } else if (messageContent.toLowerCase().includes('risque') || messageContent.toLowerCase().includes('position')) {
        response = generateRiskManagement();
      } else {
        // Default responses for other queries
        const tradingResponses = [
          "D'après mon analyse des données récentes, le marché montre une tendance de consolidation. Je recommande d'attendre une cassure claire avant de prendre position.",
          "Les indicateurs techniques suggèrent une légère sur-extension du marché. Envisagez de prendre des bénéfices partiels si vous êtes en position longue depuis un certain temps.",
          "J'observe une divergence entre le prix et le RSI sur le timeframe journalier. Cela pourrait indiquer un renversement potentiel dans les prochains jours.",
          "Votre ratio risque/récompense moyen de 1.5 est bon, mais pourrait être amélioré. Essayez d'identifier des points d'entrée plus précis pour augmenter ce ratio à 2 ou plus.",
          "L'analyse des volumes récents montre une accumulation significative. Cela pourrait présager un mouvement haussier à court terme.",
          "Je remarque que vos performances sont meilleures sur les trades de breakout. Considérez vous spécialiser davantage dans cette stratégie tout en maintenant une gestion de risque stricte."
        ];
        response = tradingResponses[Math.floor(Math.random() * tradingResponses.length)];
      }
      
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isProcessing) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleAnalysisRequest = (type: string) => {
    setAnalysisType(type);
    handleSendMessage();
  };
  
  // Functions to generate detailed trading responses
  const generateTradingAnalysis = () => {
    return `Basé sur l'analyse de vos 20 derniers trades:

1. Win Rate: 65% (13 trades gagnants, 7 perdants)
2. Ratio Risque/Récompense moyen: 1.8
3. Profit Factor: 2.3
4. Drawdown maximum: 4.8%

Points forts:
- Excellentes performances sur les trades Bitcoin et Ethereum
- Bonne discipline de sortie sur les trades gagnants

Axes d'amélioration:
- Les trades sur le Forex ont un win rate inférieur (45%)
- Tendance à couper les gains trop tôt sur certains trades à fort potentiel

Recommandation: Concentrez-vous davantage sur les crypto-monnaies où vous montrez un avantage statistique, et travaillez sur votre patience pour laisser courir les profits plus longtemps.`;
  };
  
  const generateMarketTrends = () => {
    return `Analyse des tendances actuelles du marché:

Crypto-monnaies:
- BTC: Tendance haussière à moyen terme, consolidation à court terme
- ETH: Support important à 3,200$, résistance à 3,500$
- Altcoins: Momentum mixte, suivent généralement BTC

Forex:
- EUR/USD: Range-bound entre 1.08 et 1.10, biais légèrement baissier
- GBP/USD: Tendance haussière, test récent de résistance clé

Actions:
- Indices américains: Tendance haussière, quelques signes de ralentissement
- Technologie: Surperformance continue, valorisations élevées

Matières premières:
- Or: Support solide, potentiel haussier en cas de volatilité accrue
- Pétrole: Tendance latérale, sensible aux développements géopolitiques

Le contexte macro-économique suggère une prudence accrue avec les politiques monétaires en évolution.`;
  };
  
  const generateTradingAdvice = () => {
    return `Conseils stratégiques pour améliorer vos performances:

1. Gestion du risque:
   - Limitez chaque trade à 1-2% de votre capital
   - Définissez toujours vos stops avant d'entrer en position
   - Utilisez des trailing stops pour protéger vos gains

2. Psychologie du trading:
   - Tenez un journal détaillé pour identifier vos modèles comportementaux
   - Prenez des pauses après des pertes significatives
   - Célébrez les victoires, mais analysez aussi vos réussites

3. Stratégies efficaces:
   - Breakouts avec confirmation de volume
   - Trades de tendance sur timeframes multiples
   - Stratégies de mean reversion sur marchés latéraux

4. Organisation:
   - Planifiez vos trades à l'avance
   - Créez une routine quotidienne d'analyse
   - Réservez du temps pour l'éducation continue

L'amélioration constante vient de la discipline et de l'apprentissage itératif.`;
  };
  
  const generateRiskManagement = () => {
    return `Principes de gestion des risques pour traders:

1. Position Sizing:
   - Formule recommandée: Risque par trade (%) × Capital ÷ Distance au stop-loss
   - Example: 1% × 10,000€ ÷ 100 pips = 1€ par pip

2. Corrélation:
   - Évitez d'ouvrir plusieurs positions fortement corrélées
   - Diversifiez entre classes d'actifs et instruments

3. Ratios essentiels:
   - Visez un minimum de 1:2 risque/récompense
   - Maintenez un drawdown maximum de 15-20%
   - Objectif de profit factor > 1.5

4. Protection du capital:
   - Règle des 2% par trade
   - Règle des 6% de risque quotidien maximum
   - Réduisez la taille des positions après une série de pertes

5. Plan de récupération:
   - Prenez une pause après avoir atteint votre seuil de drawdown
   - Revenez avec des positions réduites (50%)
   - Augmentez progressivement à mesure que vous regagnez en confiance

Une gestion des risques solide est plus importante que la stratégie d'entrée elle-même.`;
  };

  return (
    <AppLayout>
      <div className="page-transition space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Assistant IA Trading</h1>
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
                <div id="message-container" className="flex flex-col space-y-4 mb-4 h-[60vh] overflow-y-auto">
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
                          {message.isLoading ? (
                            <div className="flex items-center justify-center h-6">
                              <Loader2 className="h-4 w-4 animate-spin" />
                            </div>
                          ) : (
                            <>
                              <p className="whitespace-pre-line">{message.content}</p>
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
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Posez une question sur vos trades ou le marché..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1"
                    disabled={isProcessing}
                  />
                  <Button 
                    onClick={handleSendMessage} 
                    size="icon"
                    disabled={isProcessing || (!inputValue.trim() && !analysisType)}
                  >
                    {isProcessing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
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
                        <Button 
                          variant="outline" 
                          className="justify-start text-left"
                          onClick={() => handleAnalysisRequest("Analyse mes performances récentes et donne-moi des conseils pour m'améliorer.")}
                          disabled={isProcessing}
                        >
                          <BarChart3 className="mr-2 h-4 w-4" />
                          Analyser mes performances récentes
                        </Button>
                        <Button 
                          variant="outline" 
                          className="justify-start text-left"
                          onClick={() => handleAnalysisRequest("Quelles sont les tendances actuelles du marché et les opportunités à surveiller?")}
                          disabled={isProcessing}
                        >
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Tendances du marché & opportunités
                        </Button>
                        <Button 
                          variant="outline" 
                          className="justify-start text-left"
                          onClick={() => handleAnalysisRequest("Donne-moi des conseils stratégiques pour améliorer mon trading.")}
                          disabled={isProcessing}
                        >
                          <Brain className="mr-2 h-4 w-4" />
                          Conseils stratégiques personnalisés
                        </Button>
                        <Button 
                          variant="outline" 
                          className="justify-start text-left"
                          onClick={() => handleAnalysisRequest("Explique-moi comment mieux gérer les risques et dimensionner mes positions.")}
                          disabled={isProcessing}
                        >
                          <Brain className="mr-2 h-4 w-4" />
                          Gestion des risques avancée
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border border-muted-foreground/20">
                    <CardHeader>
                      <CardTitle className="text-base">Fonctionnalités premium</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        Débloquez des analyses avancées et des prédictions de marché en temps réel avec notre abonnement premium.
                      </p>
                      <Button className="w-full">
                        Explorer les options premium
                      </Button>
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
