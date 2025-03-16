
import { useEffect } from 'react';
import { Message as MessageType } from './Message';
import { Message } from './Message';

interface MessageListProps {
  messages: MessageType[];
}

export function MessageList({ messages }: MessageListProps) {
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    const messageContainer = document.getElementById('message-container');
    if (messageContainer) {
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }
  }, [messages]);

  return (
    <div id="message-container" className="flex flex-col space-y-4 mb-4 h-[60vh] overflow-y-auto">
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
    </div>
  );
}
