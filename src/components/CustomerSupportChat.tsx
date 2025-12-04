import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, X, Bot, User, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const QUICK_REPLIES = [
  "Wie funktioniert der Vergleich?",
  "Kosten schätzen",
  "Firma kontaktieren",
  "Termin vereinbaren",
];

const BOT_RESPONSES: Record<string, string> = {
  default: "Danke für Ihre Nachricht! Ein Mitarbeiter wird sich in Kürze bei Ihnen melden. In der Zwischenzeit können Sie unseren Preisrechner nutzen.",
  "Wie funktioniert der Vergleich?": "Ganz einfach: 1) Füllen Sie unser kurzes Formular aus, 2) Erhalten Sie bis zu 5 Offerten, 3) Vergleichen Sie und wählen Sie die beste Firma. Alles kostenlos und unverbindlich!",
  "Kosten schätzen": "Nutzen Sie unseren Preisrechner für eine sofortige Kostenschätzung. Für einen 3-Zimmer-Umzug innerhalb der Stadt rechnen Sie mit CHF 800-1500.",
  "Firma kontaktieren": "Sie können jede Firma direkt über ihr Profil kontaktieren oder eine Sammelanfrage an mehrere Firmen senden.",
  "Termin vereinbaren": "Nach Erhalt der Offerten können Sie direkt mit den Firmen Besichtigungstermine vereinbaren. Diese sind kostenlos!",
};

export const CustomerSupportChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hallo! 👋 Wie kann ich Ihnen bei Ihrem Umzug helfen?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate bot response
    setTimeout(() => {
      const response = BOT_RESPONSES[text] || BOT_RESPONSES.default;
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 800);
  };

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="fixed bottom-20 right-4 z-50 md:bottom-6"
          >
            <Button
              size="lg"
              className="rounded-full h-14 w-14 shadow-lg"
              onClick={() => setIsOpen(true)}
            >
              <MessageCircle className="h-6 w-6" />
            </Button>
            <Badge className="absolute -top-1 -right-1 animate-pulse">
              <Sparkles className="h-3 w-3 mr-1" />
              Live
            </Badge>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-20 right-4 z-50 w-[350px] max-w-[calc(100vw-2rem)] md:bottom-6"
          >
            <Card className="shadow-2xl border-primary/20">
              <CardHeader className="pb-2 bg-primary text-primary-foreground rounded-t-lg">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    Umzugs-Assistent
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs opacity-80">Durchschnittliche Antwortzeit: &lt; 2 Min</p>
              </CardHeader>
              
              <CardContent className="p-0">
                {/* Messages */}
                <div className="h-[300px] overflow-y-auto p-4 space-y-3">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-2 ${message.sender === "user" ? "justify-end" : ""}`}
                    >
                      {message.sender === "bot" && (
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Bot className="h-4 w-4 text-primary" />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] rounded-lg p-3 text-sm ${
                          message.sender === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        {message.text}
                      </div>
                      {message.sender === "user" && (
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                          <User className="h-4 w-4" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Quick Replies */}
                <div className="px-4 pb-2">
                  <div className="flex flex-wrap gap-1">
                    {QUICK_REPLIES.map((reply) => (
                      <Button
                        key={reply}
                        variant="outline"
                        size="sm"
                        className="text-xs h-7"
                        onClick={() => sendMessage(reply)}
                      >
                        {reply}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Input */}
                <div className="p-4 pt-2 border-t">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      sendMessage(input);
                    }}
                    className="flex gap-2"
                  >
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Nachricht eingeben..."
                      className="flex-1"
                    />
                    <Button type="submit" size="icon">
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CustomerSupportChat;
