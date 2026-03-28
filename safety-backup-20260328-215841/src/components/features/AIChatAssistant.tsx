import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const initialMessages: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: 'Hallo! 👋 Ich bin Ihr KI-Umzugsassistent. Wie kann ich Ihnen heute helfen? Ich kann Ihnen bei Fragen zu Umzugskosten, Firmenvergleichen oder dem Buchungsprozess behilflich sein.',
    timestamp: new Date()
  }
];

const quickReplies = [
  "Was kostet ein Umzug?",
  "Wie funktioniert der Vergleich?",
  "Welche Firma ist die beste?",
  "Wann ist der beste Umzugszeitpunkt?"
];

export const AIChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses: Record<string, string> = {
        "Was kostet ein Umzug?": "Die Kosten für einen Umzug in der Schweiz variieren je nach Entfernung, Wohnungsgrösse und Zusatzleistungen. Für eine 3-Zimmer-Wohnung liegen die Preise typischerweise zwischen CHF 800 und CHF 2'500. Nutzen Sie unseren KI-Rechner für eine genaue Schätzung! 📊",
        "Wie funktioniert der Vergleich?": "Unser Vergleich ist einfach: 1️⃣ Geben Sie Ihre Umzugsdetails ein, 2️⃣ Erhalten Sie bis zu 6 Offerten von geprüften Firmen, 3️⃣ Vergleichen Sie Preise und Bewertungen, 4️⃣ Wählen Sie die beste Option. Alles kostenlos und unverbindlich!",
        "Welche Firma ist die beste?": "Die 'beste' Firma hängt von Ihren individuellen Bedürfnissen ab. Unsere Top-bewerteten Partner haben alle mindestens 4.5 Sterne und sind vollständig versichert. Ich empfehle, mehrere Offerten zu vergleichen und auf Bewertungen zu achten. ⭐",
        "Wann ist der beste Umzugszeitpunkt?": "Die günstigsten Zeiten sind: Mitte des Monats (nicht zum Monatsende), Dienstag bis Donnerstag, und ausserhalb der Hauptsaison (März-Juni). Sie können bis zu 30% sparen! 💰"
      };

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responses[text] || "Vielen Dank für Ihre Frage! Unser Team wird sich in Kürze bei Ihnen melden. In der Zwischenzeit können Sie unseren Preisrechner nutzen, um eine erste Schätzung zu erhalten. 🚚",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 p-4 bg-primary text-primary-foreground rounded-full shadow-xl hover:shadow-2xl transition-shadow"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: isOpen ? 0 : 1, scale: isOpen ? 0 : 1 }}
      >
        <MessageCircle className="h-6 w-6" />
        <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-pulse" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-4 right-4 z-50 w-[380px] h-[600px] bg-background border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-primary text-primary-foreground flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-foreground/20 rounded-full">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">KI-Umzugsassistent</h3>
                  <p className="text-xs opacity-80">Immer für Sie da</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-primary-foreground hover:bg-primary-foreground/20"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}
                  >
                    {message.role === 'assistant' && (
                      <div className="p-2 bg-primary/10 rounded-full h-fit">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground rounded-br-md'
                          : 'bg-muted rounded-bl-md'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                    {message.role === 'user' && (
                      <div className="p-2 bg-muted rounded-full h-fit">
                        <User className="h-4 w-4" />
                      </div>
                    )}
                  </motion.div>
                ))}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3"
                  >
                    <div className="p-2 bg-primary/10 rounded-full h-fit">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                    <div className="bg-muted p-3 rounded-2xl rounded-bl-md">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" />
                        <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:0.1s]" />
                        <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:0.2s]" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </ScrollArea>

            {/* Quick Replies */}
            <div className="px-4 py-2 flex gap-2 overflow-x-auto scrollbar-hide">
              {quickReplies.map((reply) => (
                <button
                  key={reply}
                  onClick={() => handleSend(reply)}
                  className="px-3 py-1.5 text-xs bg-muted hover:bg-muted/80 rounded-full whitespace-nowrap transition-colors"
                >
                  {reply}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex gap-2"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Schreiben Sie eine Nachricht..."
                  className="flex-1"
                />
                <Button type="submit" size="icon" disabled={!input.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
