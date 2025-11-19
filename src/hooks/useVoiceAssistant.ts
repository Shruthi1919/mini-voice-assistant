import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

// Web Speech API type declarations
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

declare global {
  interface Window {
    SpeechRecognition: {
      new (): SpeechRecognition;
    };
    webkitSpeechRecognition: {
      new (): SpeechRecognition;
    };
  }
}

export type AssistantStatus = 'idle' | 'listening' | 'processing' | 'speaking';

export interface Message {
  id: string;
  text: string;
  type: 'user' | 'assistant';
  timestamp: Date;
}

export const useVoiceAssistant = () => {
  const [status, setStatus] = useState<AssistantStatus>('idle');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSupported, setIsSupported] = useState(true);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Check browser support
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setIsSupported(false);
      toast({
        title: "Not Supported",
        description: "Speech recognition is not supported in your browser. Please use Chrome or Edge.",
        variant: "destructive",
      });
      return;
    }

    // Initialize speech recognition
    const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognitionConstructor();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onstart = () => {
      setStatus('listening');
    };

    recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      handleCommand(transcript);
    };

    recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      setStatus('idle');
      
      if (event.error !== 'no-speech') {
        toast({
          title: "Error",
          description: "Failed to recognize speech. Please try again.",
          variant: "destructive",
        });
      }
    };

    recognitionRef.current.onend = () => {
      if (status === 'listening') {
        setStatus('idle');
      }
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const addMessage = (text: string, type: 'user' | 'assistant') => {
    const message: Message = {
      id: Date.now().toString(),
      text,
      type,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, message]);
  };

  const speak = (text: string) => {
    return new Promise<void>((resolve) => {
      setStatus('speaking');
      
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        utterance.onend = () => {
          setStatus('idle');
          resolve();
        };
        
        utterance.onerror = () => {
          setStatus('idle');
          resolve();
        };
        
        synthesisRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      } else {
        setStatus('idle');
        resolve();
      }
    });
  };

  const playMusic = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFA==';
    }
    audioRef.current.play();
    return 'Playing music!';
  };

  const stopMusic = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    return 'Music stopped!';
  };

  const handleCommand = async (command: string) => {
    setStatus('processing');
    addMessage(command, 'user');

    const lowerCommand = command.toLowerCase();
    let response = '';

    try {
      // Time command
      if (lowerCommand.includes('time')) {
        const time = new Date().toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: 'numeric',
          hour12: true 
        });
        response = `The current time is ${time}`;
      }
      // Date command
      else if (lowerCommand.includes('date') || lowerCommand.includes('today')) {
        const date = new Date().toLocaleDateString('en-US', { 
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        response = `Today is ${date}`;
      }
      // Joke command
      else if (lowerCommand.includes('joke')) {
        const jokes = [
          "Why don't scientists trust atoms? Because they make up everything!",
          "Why did the scarecrow win an award? He was outstanding in his field!",
          "Why don't eggs tell jokes? They'd crack each other up!",
          "What do you call a bear with no teeth? A gummy bear!",
          "Why did the math book look so sad? Because it had too many problems!"
        ];
        response = jokes[Math.floor(Math.random() * jokes.length)];
      }
      // Browser command
      else if (lowerCommand.includes('open browser')) {
        window.open('about:blank', '_blank');
        response = 'Opening browser for you!';
      }
      // YouTube command
      else if (lowerCommand.includes('youtube')) {
        window.open('https://www.youtube.com', '_blank');
        response = 'Opening YouTube!';
      }
      // Google search
      else if (lowerCommand.includes('search') || lowerCommand.includes('google')) {
        const searchQuery = lowerCommand.replace(/search|google|for|on/gi, '').trim();
        if (searchQuery) {
          window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, '_blank');
          response = `Searching Google for ${searchQuery}`;
        } else {
          response = "What would you like me to search for?";
        }
      }
      // Music commands
      else if (lowerCommand.includes('play music')) {
        response = playMusic();
      }
      else if (lowerCommand.includes('stop music')) {
        response = stopMusic();
      }
      // Repeat command
      else if (lowerCommand.includes('repeat after me')) {
        const repeatText = command.replace(/repeat after me/gi, '').trim();
        response = repeatText || "I didn't hear anything to repeat!";
      }
      // Help command
      else if (lowerCommand.includes('what can you do') || lowerCommand.includes('help')) {
        response = "I can tell you the time and date, tell jokes, open your browser or YouTube, search Google, play and stop music, and repeat what you say. Just ask me!";
      }
      // Exit command
      else if (lowerCommand.includes('goodbye') || lowerCommand.includes('exit')) {
        response = "Goodbye! It was nice talking to you!";
        addMessage(response, 'assistant');
        await speak(response);
        setTimeout(() => {
          setMessages([]);
        }, 2000);
        return;
      }
      // Unknown command
      else {
        response = "I'm not sure how to help with that. Try asking 'What can you do?' to see my commands.";
      }

      addMessage(response, 'assistant');
      await speak(response);
    } catch (error) {
      console.error('Error processing command:', error);
      response = "Sorry, I encountered an error processing that command.";
      addMessage(response, 'assistant');
      await speak(response);
    }
  };

  const startListening = useCallback(() => {
    if (!isSupported || !recognitionRef.current) return;
    
    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error('Error starting recognition:', error);
      toast({
        title: "Error",
        description: "Failed to start listening. Please try again.",
        variant: "destructive",
      });
    }
  }, [isSupported]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && status === 'listening') {
      recognitionRef.current.stop();
    }
  }, [status]);

  return {
    status,
    messages,
    isSupported,
    startListening,
    stopListening,
  };
};
