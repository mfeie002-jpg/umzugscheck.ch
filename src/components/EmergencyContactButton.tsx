import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Phone, X, MessageCircle, Mail, AlertCircle } from 'lucide-react';

const EmergencyContactButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-40 right-4 z-40 hidden md:block">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-16 right-0 w-64 bg-card border rounded-xl shadow-xl overflow-hidden mb-2"
          >
            <div className="p-4 bg-destructive/10 border-b">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="w-5 h-5" />
                <span className="font-semibold text-sm">Notfall-Kontakt</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                24/7 erreichbar für dringende Anfragen
              </p>
            </div>
            
            <div className="p-3 space-y-2">
              <a href="tel:+41765681302" className="block">
                <Button variant="outline" className="w-full justify-start gap-2" size="sm">
                  <Phone className="w-4 h-4 text-green-500" />
                  +41 76 568 13 02
                </Button>
              </a>
              
              <a href="https://wa.me/41765681302" target="_blank" rel="noopener noreferrer" className="block">
                <Button variant="outline" className="w-full justify-start gap-2" size="sm">
                  <MessageCircle className="w-4 h-4 text-green-500" />
                  WhatsApp
                </Button>
              </a>
              
              <a href="mailto:notfall@feierabend-umzuege.ch" className="block">
                <Button variant="outline" className="w-full justify-start gap-2" size="sm">
                  <Mail className="w-4 h-4 text-primary" />
                  Notfall E-Mail
                </Button>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="icon"
          className={`w-12 h-12 rounded-full shadow-lg ${
            isOpen 
              ? 'bg-muted text-muted-foreground' 
              : 'bg-destructive hover:bg-destructive/90'
          }`}
        >
          {isOpen ? <X className="w-5 h-5" /> : <Phone className="w-5 h-5" />}
        </Button>
      </motion.div>
    </div>
  );
};

export default EmergencyContactButton;
