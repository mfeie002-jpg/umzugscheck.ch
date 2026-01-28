import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, X, Bot, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "@/hooks/use-toast";
import { useRateLimitedSubmit } from "@/hooks/useRateLimitedSubmit";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface MovingAssistantChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const MAX_MESSAGE_LENGTH = 500;

const MovingAssistantChat = ({ isOpen, onClose }: MovingAssistantChatProps) => {
  const { language, t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Client-side rate limiting for AI chat
  const { state: rateLimitState, recordAttempt, canSubmit } = useRateLimitedSubmit({
    maxAttempts: 10,
    windowMs: 60000, // 10 messages per minute
    cooldownMs: 15000,
  });

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Limit input length
    if (value.length <= MAX_MESSAGE_LENGTH) {
      setInput(value);
    }
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    // Check client-side rate limit
    if (!canSubmit()) {
      toast({
        title: t("chat.rateLimited") || "Zu viele Anfragen",
        description: `${t("chat.tryAgainLater") || "Bitte warten Sie"} ${rateLimitState.timeUntilReset || 15} ${t("seconds") || "Sekunden"}.`,
        variant: "destructive",
      });
      return;
    }

    // Record this attempt
    if (!recordAttempt()) {
      toast({
        title: t("chat.rateLimited") || "Zu viele Anfragen",
        description: t("chat.tryAgainLater") || "Bitte warten Sie einen Moment.",
        variant: "destructive",
      });
      return;
    }

    const userMessage = input.trim().substring(0, MAX_MESSAGE_LENGTH);
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("moving-assistant", {
        body: {
          messages: [...messages, { role: "user", content: userMessage }],
          language,
        },
      });

      if (error) throw error;

      if (data?.error) {
        if (data.error.includes("Rate limit") || data.error.includes("429")) {
          toast({
            title: t("chat.rateLimited") || "Zu viele Anfragen",
            description: t("chat.tryAgainLater") || "Bitte versuchen Sie es später erneut.",
            variant: "destructive",
          });
        } else if (data.error.includes("402") || data.error.includes("Payment")) {
          toast({
            title: "AI Credits erschöpft",
            description: "Bitte kontaktieren Sie uns für weitere Hilfe.",
            variant: "destructive",
          });
        } else {
          throw new Error(data.error);
        }
        return;
      }

      setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: t("chat.error") || "Fehler",
        description: t("chat.errorDescription") || "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickQuestions = [
    t("chat.quickCost"),
    t("chat.quickPacking"),
    t("chat.quickTips"),
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-4 right-4 z-50 w-[90vw] max-w-md"
        >
          <div className="bg-background border-2 border-alpine/20 rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-alpine to-alpine/80 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-full">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">{t("chat.title")}</h3>
                  <p className="text-xs text-white/80">{t("chat.subtitle")}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={onClose}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="h-[350px] p-4" ref={scrollRef}>
              {messages.length === 0 ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground text-center">
                    {t("chat.welcome")}
                  </p>
                  <div className="space-y-2">
                    {quickQuestions.map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full justify-start text-left text-sm h-auto py-2 px-3"
                        onClick={() => {
                          setInput(question);
                          setTimeout(() => sendMessage(), 100);
                        }}
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {message.role === "assistant" && (
                        <div className="p-1.5 bg-alpine/10 rounded-full h-fit">
                          <Bot className="h-4 w-4 text-alpine" />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                          message.role === "user"
                            ? "bg-alpine text-white rounded-br-md"
                            : "bg-muted rounded-bl-md"
                        }`}
                      >
                        {message.content}
                      </div>
                      {message.role === "user" && (
                        <div className="p-1.5 bg-alpine/10 rounded-full h-fit">
                          <User className="h-4 w-4 text-alpine" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-2 items-center"
                    >
                      <div className="p-1.5 bg-alpine/10 rounded-full">
                        <Bot className="h-4 w-4 text-alpine" />
                      </div>
                      <div className="bg-muted p-3 rounded-2xl rounded-bl-md">
                        <Loader2 className="h-4 w-4 animate-spin text-alpine" />
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder={t("chat.placeholder")}
                  disabled={isLoading || rateLimitState.isBlocked}
                  maxLength={MAX_MESSAGE_LENGTH}
                  className="flex-1"
                />
                <Button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className="bg-alpine hover:bg-alpine/90"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MovingAssistantChat;
