import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MessageCircle, Mail, X, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function QuickContact() {
  const [isOpen, setIsOpen] = useState(false);

  const contacts = [
    {
      name: 'Anrufen',
      description: 'Direkt verbinden',
      icon: Phone,
      color: 'bg-green-500',
      action: () => window.location.href = 'tel:+41765681302',
    },
    {
      name: 'WhatsApp',
      description: 'Chat starten',
      icon: MessageCircle,
      color: 'bg-green-600',
      action: () => window.open('https://wa.me/41765681302', '_blank'),
    },
    {
      name: 'E-Mail',
      description: 'Nachricht senden',
      icon: Mail,
      color: 'bg-blue-500',
      action: () => window.location.href = 'mailto:info@feierabend-umzuege.ch',
    },
    {
      name: 'Termin',
      description: 'Beratung buchen',
      icon: Calendar,
      color: 'bg-purple-500',
      action: () => window.location.href = '/booking',
    },
  ];

  return (
    <div className="md:hidden">
      <Button
        variant="default"
        size="icon"
        className="fixed bottom-20 right-4 z-40 rounded-full shadow-lg h-14 w-14"
        onClick={() => setIsOpen(!isOpen)}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div
              key="phone"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <Phone className="h-6 w-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-30"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="fixed bottom-36 right-4 z-40 bg-background rounded-xl shadow-2xl border overflow-hidden"
            >
              <div className="p-3 bg-muted/50 border-b">
                <p className="text-sm font-medium">Kontaktieren Sie uns</p>
              </div>
              <div className="p-2">
                {contacts.map((contact, index) => (
                  <motion.button
                    key={contact.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => {
                      contact.action();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className={`w-10 h-10 rounded-full ${contact.color} flex items-center justify-center`}>
                      <contact.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-sm">{contact.name}</p>
                      <p className="text-xs text-muted-foreground">{contact.description}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

