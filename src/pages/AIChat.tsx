
import { AppLayout } from '@/components/layout/AppLayout';
import { AIAssistantChat } from '@/components/AIAssistantChat';

export default function AIChat() {
  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Assistant IA de Trading</h1>
        <div className="grid grid-cols-1">
          <AIAssistantChat />
        </div>
      </div>
    </AppLayout>
  );
}
