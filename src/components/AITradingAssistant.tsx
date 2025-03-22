
import { AIAssistant } from './AIAssistant';

interface AITradingAssistantProps {
  title?: string;
  description?: string;
}

export function AITradingAssistant({ title, description }: AITradingAssistantProps) {
  return <AIAssistant title={title} description={description} />;
}
