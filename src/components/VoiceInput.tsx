import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Loader2, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

// Extend Window interface for SpeechRecognition
interface IWindow extends Window {
  SpeechRecognition?: new () => SpeechRecognition;
  webkitSpeechRecognition?: new () => SpeechRecognition;
}

interface SpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  onstart: ((this: SpeechRecognition, ev: Event) => void) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null;
  onend: ((this: SpeechRecognition, ev: Event) => void) | null;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface VoiceInputProps {
  onCommand: (command: VoiceCommand) => void;
  isListening: boolean;
  setIsListening: (listening: boolean) => void;
}

export interface VoiceCommand {
  type: 'rooms' | 'distance' | 'floor' | 'lift' | 'moveType' | 'service' | 'unknown';
  value?: number | string | boolean;
  raw: string;
}

// Check if speech recognition is supported
const getSpeechRecognition = (): (new () => SpeechRecognition) | null => {
  if (typeof window === 'undefined') return null;
  const w = window as IWindow;
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
};

const VoiceInput = ({ onCommand, isListening, setIsListening }: VoiceInputProps) => {
  const [transcript, setTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    setIsSupported(!!getSpeechRecognition());
  }, []);

  const parseCommand = useCallback((text: string): VoiceCommand => {
    const lowerText = text.toLowerCase().trim();
    
    // Room commands
    const roomMatch = lowerText.match(/(\d+(?:[.,]\d+)?)\s*(?:zimmer|räume|raum)/);
    if (roomMatch) {
      return { type: 'rooms', value: parseFloat(roomMatch[1].replace(',', '.')), raw: text };
    }
    
    // Distance commands
    const distanceMatch = lowerText.match(/(\d+)\s*(?:kilometer|km|kilo)/);
    if (distanceMatch) {
      return { type: 'distance', value: parseInt(distanceMatch[1]), raw: text };
    }
    
    // Floor commands
    const floorMatch = lowerText.match(/(\d+)(?:\.|\s*ter?)?\s*(?:stock|etage|og|obergeschoss)/i);
    if (floorMatch) {
      return { type: 'floor', value: parseInt(floorMatch[1]), raw: text };
    }
    if (lowerText.includes('erdgeschoss') || lowerText.includes('parterre')) {
      return { type: 'floor', value: 0, raw: text };
    }
    
    // Lift commands
    if (lowerText.includes('lift') || lowerText.includes('aufzug') || lowerText.includes('fahrstuhl')) {
      const hasLift = !lowerText.includes('kein') && !lowerText.includes('ohne') && !lowerText.includes('nicht');
      return { type: 'lift', value: hasLift, raw: text };
    }
    
    // Move type commands
    if (lowerText.includes('premium') || lowerText.includes('vip')) {
      return { type: 'moveType', value: 'premium', raw: text };
    }
    if (lowerText.includes('express') || lowerText.includes('schnell') || lowerText.includes('eilig')) {
      return { type: 'moveType', value: 'express', raw: text };
    }
    if (lowerText.includes('standard') || lowerText.includes('normal')) {
      return { type: 'moveType', value: 'standard', raw: text };
    }
    
    // Service commands
    if (lowerText.includes('einpack') || lowerText.includes('verpack')) {
      const enable = !lowerText.includes('kein') && !lowerText.includes('ohne');
      return { type: 'service', value: enable ? 'packing' : 'no-packing', raw: text };
    }
    if (lowerText.includes('montage') || lowerText.includes('zusammenbau') || lowerText.includes('aufbau')) {
      const enable = !lowerText.includes('kein') && !lowerText.includes('ohne');
      return { type: 'service', value: enable ? 'assembly' : 'no-assembly', raw: text };
    }
    if (lowerText.includes('lager') || lowerText.includes('zwischenlager')) {
      const enable = !lowerText.includes('kein') && !lowerText.includes('ohne');
      return { type: 'service', value: enable ? 'storage' : 'no-storage', raw: text };
    }
    
    return { type: 'unknown', raw: text };
  }, []);

  const startListening = useCallback(() => {
    const SpeechRecognitionClass = getSpeechRecognition();
    if (!SpeechRecognitionClass) {
      toast({
        title: "Nicht unterstützt",
        description: "Ihr Browser unterstützt keine Spracherkennung.",
        variant: "destructive",
      });
      return;
    }

    const recognition = new SpeechRecognitionClass();
    recognition.lang = 'de-DE';
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript("");
    };

    recognition.onresult = (event: any) => {
      const result = event.results[event.results.length - 1];
      const transcriptText = result[0].transcript;
      setTranscript(transcriptText);

      if (result.isFinal) {
        setIsProcessing(true);
        const command = parseCommand(transcriptText);
        
        setTimeout(() => {
          onCommand(command);
          setIsProcessing(false);
          
          if (command.type === 'unknown') {
            toast({
              title: "Nicht verstanden",
              description: `"${transcriptText}" - Versuchen Sie z.B. "3 Zimmer" oder "50 Kilometer"`,
            });
          } else {
            toast({
              title: "Verstanden",
              description: `${transcriptText}`,
            });
          }
        }, 300);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      if (event.error === 'not-allowed') {
        toast({
          title: "Mikrofon blockiert",
          description: "Bitte erlauben Sie den Zugriff auf das Mikrofon.",
          variant: "destructive",
        });
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [onCommand, parseCommand, setIsListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, [setIsListening]);

  if (!isSupported) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Button
          variant={isListening ? "destructive" : "outline"}
          size="sm"
          onClick={isListening ? stopListening : startListening}
          disabled={isProcessing}
          className={cn(
            "gap-2 transition-all",
            isListening && "animate-pulse"
          )}
        >
          {isProcessing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isListening ? (
            <MicOff className="h-4 w-4" />
          ) : (
            <Mic className="h-4 w-4" />
          )}
          {isListening ? "Stoppen" : "Spracheingabe"}
        </Button>
        
        {isListening && (
          <motion.div 
            className="flex items-center gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                className="w-1 bg-alpine rounded-full"
                animate={{
                  height: [8, 16, 8],
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
            ))}
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {(isListening || transcript) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-3 rounded-lg bg-muted/50 border text-sm">
              <div className="flex items-start gap-2">
                <Volume2 className="h-4 w-4 text-alpine mt-0.5 shrink-0" />
                <div>
                  {transcript || (
                    <span className="text-muted-foreground italic">
                      Sprechen Sie jetzt... (z.B. "3.5 Zimmer", "40 Kilometer", "mit Lift")
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isListening && (
        <p className="text-xs text-muted-foreground">
          Beispiele: "4 Zimmer", "30 km", "3. Stock", "mit Lift", "Express", "Einpackservice"
        </p>
      )}
    </div>
  );
};

export default VoiceInput;
