
import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, BarChart3, Crown } from 'lucide-react';
import { ChatTab } from '@/components/ai-chat/ChatTab';
import { AnalysisTab } from '@/components/ai-chat/AnalysisTab';
import { usePremium } from '@/context/PremiumContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function AIChat() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisType, setAnalysisType] = useState<string | null>(null);
  const { isPremium } = usePremium();
  const navigate = useNavigate();

  const handleAnalysisRequest = (type: string) => {
    setAnalysisType(type);
    // This will be picked up by the ChatTab
  };

  const handleRedirectToPremium = () => {
    navigate('/premium');
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
              {!isPremium && <Crown className="w-3 h-3 ml-1 text-yellow-500" />}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="chat" className="space-y-4">
            <ChatTab />
          </TabsContent>
          
          <TabsContent value="analysis" className="space-y-4">
            {isPremium ? (
              <AnalysisTab 
                isProcessing={isProcessing} 
                onRequestAnalysis={handleAnalysisRequest} 
              />
            ) : (
              <div className="bg-card rounded-lg border p-6 space-y-4">
                <div className="text-center space-y-2">
                  <Crown className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
                  <h3 className="text-xl font-bold">Fonctionnalité Premium</h3>
                  <p className="text-muted-foreground">
                    L'accès aux analyses IA avancées est réservé aux utilisateurs premium.
                    Améliorez votre abonnement pour débloquer cette fonctionnalité.
                  </p>
                </div>
                <Button 
                  className="w-full" 
                  onClick={handleRedirectToPremium}
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Passer à l'abonnement Premium
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
