import { AssistantStatus } from '@/hooks/useVoiceAssistant';

interface AudioWaveformProps {
  status: AssistantStatus;
}

export const AudioWaveform = ({ status }: AudioWaveformProps) => {
  const isActive = status === 'listening' || status === 'speaking';
  
  return (
    <div className="flex items-center justify-center gap-1 h-16">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={`w-1 bg-gradient-to-t from-primary to-accent rounded-full transition-all duration-300 ${
            isActive ? 'animate-wave' : 'h-2'
          }`}
          style={{
            animationDelay: `${i * 0.1}s`,
            height: isActive ? undefined : '8px',
          }}
        />
      ))}
    </div>
  );
};
