import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export const VoiceSearch = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Nicht unterstützt",
        description: "Ihr Browser unterstützt keine Sprachsuche.",
        variant: "destructive",
      });
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'de-CH';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      
      // Process voice commands
      if (text.toLowerCase().includes('preis') || text.toLowerCase().includes('rechner')) {
        navigate('/rechner');
      } else if (text.toLowerCase().includes('firma') || text.toLowerCase().includes('unternehmen')) {
        navigate('/firmen');
      } else if (text.toLowerCase().includes('kontakt')) {
        navigate('/kontakt');
      }
      
      toast({
        title: "Verstanden",
        description: `"${text}"`,
        duration: 3000,
      });
    };

    recognition.onerror = () => {
      toast({
        title: "Fehler",
        description: "Die Sprachsuche konnte nicht gestartet werden.",
        variant: "destructive",
      });
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  return (
    <div className="fixed bottom-32 right-6 z-40">
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          onClick={handleVoiceSearch}
          className={`w-14 h-14 rounded-full shadow-2xl ${
            isListening 
              ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
              : 'bg-primary hover:bg-primary/90'
          }`}
        >
          {isListening ? (
            <MicOff className="w-6 h-6" />
          ) : (
            <Mic className="w-6 h-6" />
          )}
        </Button>
      </motion.div>

      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-16 right-0 bg-card border-2 border-primary rounded-lg p-4 shadow-xl min-w-[200px]"
          >
            <p className="text-sm text-muted-foreground mb-2">Ich höre zu...</p>
            <div className="flex gap-1 justify-center">
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-primary rounded-full"
                  animate={{
                    height: [10, 20, 10],
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                />
              ))}
            </div>
            {transcript && (
              <p className="text-xs text-foreground mt-2 italic">"{transcript}"</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
