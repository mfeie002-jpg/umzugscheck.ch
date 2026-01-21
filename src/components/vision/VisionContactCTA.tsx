/**
 * VisionContactCTA - Floating contact & PDF download section
 * Investor-focused: Book meeting + Download deck
 */

import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Download, Mail, Phone, ExternalLink, X, FileText, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { VisionLanguage } from "@/lib/vision-translations";

interface VisionContactCTAProps {
  language: VisionLanguage;
  variant?: 'family' | 'investor' | 'full';
}

const content = {
  de: {
    title: "Interesse geweckt?",
    subtitle: "Lassen Sie uns sprechen",
    bookMeeting: "Termin buchen",
    bookMeetingDesc: "30 Min. Videocall mit dem Gründer",
    downloadDeck: "Pitch Deck (PDF)",
    downloadDeckDesc: "Executive Summary & Financials",
    email: "E-Mail senden",
    emailAddress: "invest@umzugscheck.ch",
    phone: "Direkt anrufen",
    phoneNumber: "+41 79 XXX XX XX",
    close: "Schliessen",
    availability: "Verfügbar Mo-Fr, 9-18 Uhr"
  },
  bg: {
    title: "Заинтересувани?",
    subtitle: "Нека поговорим",
    bookMeeting: "Запази среща",
    bookMeetingDesc: "30 мин. видео разговор с основателя",
    downloadDeck: "Pitch Deck (PDF)",
    downloadDeckDesc: "Executive Summary & Financials",
    email: "Изпрати имейл",
    emailAddress: "invest@umzugscheck.ch",
    phone: "Обади се директно",
    phoneNumber: "+41 79 XXX XX XX",
    close: "Затвори",
    availability: "На разположение Пон-Пет, 9-18 ч."
  },
  it: {
    title: "Interessato?",
    subtitle: "Parliamone",
    bookMeeting: "Prenota un incontro",
    bookMeetingDesc: "30 min. videochiamata con il fondatore",
    downloadDeck: "Pitch Deck (PDF)",
    downloadDeckDesc: "Executive Summary & Financials",
    email: "Invia email",
    emailAddress: "invest@umzugscheck.ch",
    phone: "Chiama direttamente",
    phoneNumber: "+41 79 XXX XX XX",
    close: "Chiudi",
    availability: "Disponibile Lun-Ven, 9-18"
  }
};

export const VisionContactCTA = memo(({ language, variant = 'full' }: VisionContactCTAProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const t = content[language] || content.de;
  
  // Only show on investor-relevant pages
  if (variant === 'family') return null;
  
  return (
    <>
      {/* Floating Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, type: "spring", stiffness: 200 }}
      >
        <Button
          onClick={() => setIsExpanded(true)}
          size="lg"
          className="rounded-full h-14 w-14 md:h-auto md:w-auto md:px-6 bg-secondary hover:bg-secondary/90 shadow-2xl group"
        >
          <Calendar className="w-6 h-6 md:mr-2" />
          <span className="hidden md:inline font-bold">{t.bookMeeting}</span>
        </Button>
      </motion.div>
      
      {/* Expanded Modal */}
      <AnimatePresence>
        {isExpanded && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExpanded(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className="fixed bottom-0 left-0 right-0 md:bottom-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-50 w-full md:w-[480px] max-h-[90vh] overflow-y-auto"
            >
              <div className="bg-card rounded-t-3xl md:rounded-2xl shadow-2xl border border-border p-6 md:p-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-black text-foreground">{t.title}</h3>
                    <p className="text-muted-foreground">{t.subtitle}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsExpanded(false)}
                    className="rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                
                {/* Actions */}
                <div className="space-y-3">
                  {/* Book Meeting */}
                  <motion.a
                    href="https://calendly.com" // Replace with actual Calendly
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-secondary/10 hover:bg-secondary/20 border border-secondary/30 transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-secondary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-foreground group-hover:text-secondary transition-colors">
                        {t.bookMeeting}
                      </p>
                      <p className="text-sm text-muted-foreground">{t.bookMeetingDesc}</p>
                    </div>
                    <ExternalLink className="w-5 h-5 text-muted-foreground" />
                  </motion.a>
                  
                  {/* Download Deck */}
                  <motion.a
                    href="/vision-deck.pdf" // Replace with actual PDF
                    download
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-primary/10 hover:bg-primary/20 border border-primary/30 transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-foreground group-hover:text-primary transition-colors">
                        {t.downloadDeck}
                      </p>
                      <p className="text-sm text-muted-foreground">{t.downloadDeckDesc}</p>
                    </div>
                    <Download className="w-5 h-5 text-muted-foreground" />
                  </motion.a>
                  
                  {/* Email */}
                  <motion.a
                    href={`mailto:${t.emailAddress}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-muted hover:bg-muted/80 border border-border transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-full bg-muted-foreground/10 flex items-center justify-center">
                      <Mail className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-foreground">{t.email}</p>
                      <p className="text-sm text-muted-foreground">{t.emailAddress}</p>
                    </div>
                  </motion.a>
                  
                  {/* Phone */}
                  <motion.a
                    href={`tel:${t.phoneNumber.replace(/\s/g, '')}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-muted hover:bg-muted/80 border border-border transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-full bg-muted-foreground/10 flex items-center justify-center">
                      <Phone className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-foreground">{t.phone}</p>
                      <p className="text-sm text-muted-foreground">{t.phoneNumber}</p>
                    </div>
                  </motion.a>
                </div>
                
                {/* Availability */}
                <div className="mt-6 pt-4 border-t border-border flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{t.availability}</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
});

VisionContactCTA.displayName = 'VisionContactCTA';
