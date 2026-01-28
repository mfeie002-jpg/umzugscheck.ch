import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, X, Send, Phone, Clock, CheckCheck } from 'lucide-react';
import { openWhatsApp, generateWhatsAppLink } from '@/utils/whatsapp';

interface QuickMessage {
  label: string;
  message: string;
}

const quickMessages: QuickMessage[] = [
  { label: 'Offerte anfragen', message: 'Ich möchte eine kostenlose Offerte anfragen.' },
  { label: 'Termin vereinbaren', message: 'Ich möchte einen Besichtigungstermin vereinbaren.' },
  { label: 'Preisauskunft', message: 'Ich hätte gerne eine Preisauskunft für meinen Umzug.' },
  { label: 'Frage stellen', message: 'Ich habe eine Frage zu Ihren Dienstleistungen.' },
];

const WhatsAppChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');

  const handleSendMessage = () => {
    openWhatsApp({ name, service: message || 'Allgemeine Anfrage' });
    setIsOpen(false);
  };

  const handleQuickMessage = (msg: string) => {
    openWhatsApp({ name, service: msg });
    setIsOpen(false);
  };

  return (
    <>
      {/* WhatsApp Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-40 right-4 z-50 md:bottom-24"
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="w-14 h-14 rounded-full shadow-lg bg-[#25D366] hover:bg-[#20BD5A] text-white"
            >
              <MessageCircle className="w-6 h-6" />
            </Button>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full animate-pulse" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-40 right-4 z-50 w-[350px] bg-card border rounded-2xl shadow-2xl overflow-hidden md:bottom-24"
          >
            {/* Header */}
            <div className="bg-[#075E54] text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Feierabend Umzüge</h3>
                    <div className="flex items-center gap-2 text-xs opacity-90">
                      <span className="w-2 h-2 bg-green-400 rounded-full" />
                      <span>Online • Antwortet sofort</span>
                    </div>
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-white hover:bg-white/20"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Chat Body */}
            <div className="bg-[#ECE5DD] dark:bg-muted p-4 min-h-[200px]">
              {/* Welcome Message */}
              <div className="bg-white dark:bg-card p-3 rounded-lg rounded-tl-none shadow-sm max-w-[90%] mb-4">
                <p className="text-sm text-foreground">
                  👋 Hallo! Wie können wir Ihnen helfen?
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Wählen Sie eine Option oder schreiben Sie uns direkt.
                </p>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-2 justify-end">
                  <Clock className="w-3 h-3" />
                  <span>Jetzt</span>
                  <CheckCheck className="w-3 h-3 text-[#53BDEB]" />
                </div>
              </div>

              {/* Quick Messages */}
              <div className="space-y-2">
                {quickMessages.map((qm, index) => (
                  <motion.button
                    key={qm.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleQuickMessage(qm.message)}
                    className="w-full text-left p-3 bg-white dark:bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow text-sm border border-[#25D366]/20 hover:border-[#25D366]"
                  >
                    {qm.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="p-3 bg-card border-t space-y-2">
              <Input
                placeholder="Ihr Name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-sm"
              />
              <div className="flex gap-2">
                <Input
                  placeholder="Nachricht eingeben..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 text-sm"
                />
                <Button 
                  onClick={handleSendMessage}
                  className="bg-[#25D366] hover:bg-[#20BD5A]"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground text-center">
                Öffnet WhatsApp in einem neuen Fenster
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default WhatsAppChat;
