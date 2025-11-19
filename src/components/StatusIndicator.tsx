import { Loader2, Volume2, Ear } from 'lucide-react';
import { AssistantStatus } from '@/hooks/useVoiceAssistant';

interface StatusIndicatorProps {
  status: AssistantStatus;
}

export const StatusIndicator = ({ status }: StatusIndicatorProps) => {
  const statusConfig = {
    idle: {
      text: 'Ready to listen',
      icon: null,
      color: 'text-muted-foreground',
    },
    listening: {
      text: 'Listening...',
      icon: Ear,
      color: 'text-listening',
    },
    processing: {
      text: 'Processing...',
      icon: Loader2,
      color: 'text-processing',
    },
    speaking: {
      text: 'Speaking...',
      icon: Volume2,
      color: 'text-success',
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-2 text-sm font-medium ${config.color} transition-colors`}>
      {Icon && (
        <Icon className={`w-4 h-4 ${status === 'processing' ? 'animate-spin' : ''}`} />
      )}
      <span>{config.text}</span>
    </div>
  );
};
