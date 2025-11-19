import { useVoiceAssistant } from '@/hooks/useVoiceAssistant';
import { MicrophoneButton } from '@/components/MicrophoneButton';
import { StatusIndicator } from '@/components/StatusIndicator';
import { AudioWaveform } from '@/components/AudioWaveform';
import { ConversationHistory } from '@/components/ConversationHistory';
import { Card } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

const Index = () => {
  const { status, messages, isSupported, startListening, stopListening } = useVoiceAssistant();

  if (!isSupported) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold mb-4">Browser Not Supported</h1>
          <p className="text-muted-foreground">
            Your browser doesn't support speech recognition. Please use Google Chrome or Microsoft Edge.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Voice Assistant
            </h1>
          </div>
          <p className="text-muted-foreground">
            Your personal AI assistant powered by voice commands
          </p>
        </div>

        {/* Main Control Card */}
        <Card className="p-8 mb-6">
          <div className="flex flex-col items-center gap-6">
            {/* Audio Waveform */}
            <AudioWaveform status={status} />

            {/* Microphone Button */}
            <MicrophoneButton
              status={status}
              onStart={startListening}
              onStop={stopListening}
            />

            {/* Status Indicator */}
            <StatusIndicator status={status} />

            {/* Quick Help */}
            {messages.length === 0 && (
              <div className="text-center text-sm text-muted-foreground mt-4 space-y-2">
                <p className="font-medium">Try saying:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {[
                    'What time is it?',
                    'Tell me a joke',
                    'Open YouTube',
                    'What can you do?',
                  ].map((example) => (
                    <span
                      key={example}
                      className="px-3 py-1 bg-secondary rounded-full text-xs"
                    >
                      "{example}"
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Conversation History */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Conversation</h2>
          <ConversationHistory messages={messages} />
        </Card>

        {/* Footer Info */}
        <div className="text-center mt-8 text-xs text-muted-foreground space-y-1">
          <p>
            Supports: Time, Date, Jokes, Browser, YouTube, Google Search, Music Control, and more
          </p>
          <p>
            Say "What can you do?" to see all available commands
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
