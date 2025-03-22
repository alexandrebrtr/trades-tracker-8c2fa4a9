
import { AIAssistant } from './AIAssistant';

interface AITradingAssistantProps {
  title?: string;
  description?: string;
}

export function AITradingAssistant({ title, description }: AITradingAssistantProps) {
  return <AIAssistant 
    title={title || "Assistant Trading IA"} 
    description={description || "Posez vos questions sur le trading et la finance"} 
  />;
}
