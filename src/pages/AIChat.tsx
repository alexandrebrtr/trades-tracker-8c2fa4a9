
import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, BarChart3 } from 'lucide-react';
import { ChatTab } from '@/components/ai-chat/ChatTab';
import { AnalysisTab } from '@/components/ai-chat/AnalysisTab';

export default function AIChat() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisType, setAnalysisType] = useState<string | null>(null);

  const handleAnalysisRequest = (type: string) => {
    setAnalysisType(type);
    // This will be picked up by the ChatTab
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
            <ChatTab />
          </TabsContent>
          
          <TabsContent value="analysis" className="space-y-4">
            <AnalysisTab 
              isProcessing={isProcessing} 
              onRequestAnalysis={handleAnalysisRequest} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
