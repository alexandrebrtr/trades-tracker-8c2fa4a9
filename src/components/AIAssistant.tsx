
import { AITradingAssistant } from './AITradingAssistant';

interface AIAssistantProps {
  title?: string;
  description?: string;
}

export function AIAssistant({ title, description }: AIAssistantProps) {
  return <AITradingAssistant title={title} description={description} />;
}
