import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AssistantStatus } from '@/hooks/useVoiceAssistant';

interface MicrophoneButtonProps {
  status: AssistantStatus;
  onStart: () => void;
  onStop: () => void;
  disabled?: boolean;
}

export const MicrophoneButton = ({ status, onStart, onStop, disabled }: MicrophoneButtonProps) => {
  const isListening = status === 'listening';
  
  return (
    <div className="relative flex items-center justify-center">
      {isListening && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full bg-primary/20 animate-pulse-glow" />
        </div>
      )}
      <Button
        size="lg"
        onClick={isListening ? onStop : onStart}
        disabled={disabled || status === 'processing' || status === 'speaking'}
        className={`
          relative w-24 h-24 rounded-full transition-all duration-300
          ${isListening 
            ? 'bg-accent hover:bg-accent/90 shadow-pulse scale-110' 
            : 'bg-primary hover:bg-primary/90'
          }
          ${status === 'processing' ? 'opacity-50' : ''}
        `}
      >
        {isListening ? (
          <MicOff className="w-10 h-10" />
        ) : (
          <Mic className="w-10 h-10" />
        )}
      </Button>
    </div>
  );
};
