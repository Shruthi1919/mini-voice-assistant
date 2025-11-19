import { Message } from '@/hooks/useVoiceAssistant';
import { Card } from '@/components/ui/card';
import { User, Bot } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ConversationHistoryProps {
  messages: Message[];
}

export const ConversationHistory = ({ messages }: ConversationHistoryProps) => {
  if (messages.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <p>No conversation yet. Click the microphone to start!</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px] w-full">
      <div className="space-y-4 p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.type === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.type === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
            )}
            <Card
              className={`p-3 max-w-[80%] ${
                message.type === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: true,
                })}
              </p>
            </Card>
            {message.type === 'user' && (
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-secondary-foreground" />
              </div>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
