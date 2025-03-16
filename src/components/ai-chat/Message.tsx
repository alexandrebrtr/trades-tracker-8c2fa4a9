
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2 } from 'lucide-react';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isLoading?: boolean;
}

interface MessageProps {
  message: Message;
}

export function Message({ message }: MessageProps) {
  return (
    <div
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
  );
}
