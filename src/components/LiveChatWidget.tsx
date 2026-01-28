import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, X, Send, Bot, User, Minimize2 } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const quickReplies = [
  'Offerte anfragen',
  'Umzugstermin',
  'Preisauskunft',
  'Kontakt'
];

const botResponses: Record<string, string> = {
  'offerte': 'Gerne erstelle ich Ihnen eine Offerte! Bitte besuchen Sie unseren Kostenrechner oder füllen Sie das Kontaktformular aus.',
  'termin': 'Für eine Terminvereinbarung rufen Sie uns an unter 044 XXX XX XX oder nutzen Sie unser Online-Buchungssystem.',
  'preis': 'Unsere Preise starten ab CHF 800. Nutzen Sie unseren Kostenrechner für eine genaue Schätzung!',
  'kontakt': 'Sie erreichen uns telefonisch, per E-Mail an info@feierabend-umzuege.ch oder über WhatsApp.',
  'default': 'Vielen Dank für Ihre Nachricht! Unser Team meldet sich in Kürze bei Ihnen. Für dringende Anfragen: 044 XXX XX XX'
};

const LiveChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Willkommen bei Feierabend Umzüge! 👋 Wie kann ich Ihnen helfen?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getBotResponse = (text: string): string => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('offerte') || lowerText.includes('angebot')) return botResponses.offerte;
    if (lowerText.includes('termin') || lowerText.includes('datum')) return botResponses.termin;
    if (lowerText.includes('preis') || lowerText.includes('kosten') || lowerText.includes('chf')) return botResponses.preis;
    if (lowerText.includes('kontakt') || lowerText.includes('telefon') || lowerText.includes('email')) return botResponses.kontakt;
    return botResponses.default;
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(text),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleQuickReply = (reply: string) => {
    sendMessage(reply);
  };

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-24 right-4 z-50 md:bottom-8"
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="w-14 h-14 rounded-full shadow-lg bg-primary hover:bg-primary/90"
            >
              <MessageCircle className="w-6 h-6" />
            </Button>
            <Badge className="absolute -top-1 -right-1 bg-destructive">1</Badge>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? 'auto' : '500px'
            }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-24 right-4 z-50 w-[350px] bg-card border rounded-2xl shadow-2xl overflow-hidden md:bottom-8"
          >
            {/* Header */}
            <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Feierabend Support</h3>
                  <div className="flex items-center gap-1 text-xs opacity-80">
                    <span className="w-2 h-2 bg-green-400 rounded-full" />
                    Online
                  </div>
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
                  onClick={() => setIsMinimized(!isMinimized)}
                >
                  <Minimize2 className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="h-[320px] overflow-y-auto p-4 space-y-3 bg-muted/30">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-2xl ${
                          message.sender === 'user'
                            ? 'bg-primary text-primary-foreground rounded-br-sm'
                            : 'bg-card border rounded-bl-sm'
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <span className="text-[10px] opacity-60 mt-1 block">
                          {message.timestamp.toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                  
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-1 p-3 bg-card border rounded-2xl rounded-bl-sm w-fit"
                    >
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </motion.div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Replies */}
                <div className="px-4 py-2 flex gap-2 overflow-x-auto border-t scrollbar-hide snap-x touch-pan-x" style={{ WebkitOverflowScrolling: 'touch' }}>
                  {quickReplies.map((reply) => (
                    <Button
                      key={reply}
                      variant="outline"
                      size="sm"
                      className="whitespace-nowrap text-xs"
                      onClick={() => handleQuickReply(reply)}
                    >
                      {reply}
                    </Button>
                  ))}
                </div>

                {/* Input */}
                <div className="p-3 border-t flex gap-2">
                  <Input
                    placeholder="Nachricht schreiben..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage(input)}
                    className="flex-1"
                  />
                  <Button size="icon" onClick={() => sendMessage(input)}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LiveChatWidget;
