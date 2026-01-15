/**
 * WhatsApp Business Link Component
 * Direct chat links for companies and lead notifications
 */

import { MessageCircle, Phone, Clock, CheckCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface WhatsAppBusinessLinkProps {
  phoneNumber: string; // Format: 41XXXXXXXXX (no + or spaces)
  companyName?: string;
  prefilledMessage?: string;
  variant?: 'button' | 'icon' | 'card' | 'inline';
  size?: 'sm' | 'default' | 'lg';
  showStatus?: boolean;
  className?: string;
}

// Check if company is likely available based on Swiss business hours
const getAvailabilityStatus = (): { isOpen: boolean; message: string } => {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay(); // 0 = Sunday
  
  // Closed on Sunday
  if (day === 0) {
    return { isOpen: false, message: "Sonntag - Antwort am Montag" };
  }
  
  // Saturday: 09:00 - 14:00
  if (day === 6) {
    if (hour >= 9 && hour < 14) {
      return { isOpen: true, message: "Heute bis 14:00 erreichbar" };
    }
    return { isOpen: false, message: "Antwort am Montag" };
  }
  
  // Weekdays: 08:00 - 18:00
  if (hour >= 8 && hour < 18) {
    return { isOpen: true, message: "Jetzt erreichbar" };
  }
  
  // Before 8am
  if (hour < 8) {
    return { isOpen: false, message: "Ab 08:00 erreichbar" };
  }
  
  // After 18:00
  return { isOpen: false, message: "Antwort morgen früh" };
};

// Generate WhatsApp URL
const generateWhatsAppUrl = (phoneNumber: string, message?: string): string => {
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
  const encodedMessage = message ? encodeURIComponent(message) : '';
  return `https://wa.me/${cleanNumber}${encodedMessage ? `?text=${encodedMessage}` : ''}`;
};

// Default message templates
const MESSAGE_TEMPLATES = {
  inquiry: (companyName?: string) => 
    `Hallo${companyName ? ` ${companyName}` : ''},\n\nIch habe eine Anfrage über umzugscheck.ch gestellt und würde gerne mehr über Ihre Umzugsdienstleistungen erfahren.\n\nKönnen Sie mir bitte ein Angebot unterbreiten?\n\nVielen Dank!`,
  
  quote: (companyName?: string) =>
    `Hallo${companyName ? ` ${companyName}` : ''},\n\nIch habe Ihre Offerte auf umzugscheck.ch gesehen. Können wir die Details besprechen?\n\nBeste Grüsse`,
  
  quickQuestion: () =>
    `Hallo, ich habe eine kurze Frage zu meinem geplanten Umzug.`,
};

export const WhatsAppBusinessLink = ({
  phoneNumber,
  companyName,
  prefilledMessage,
  variant = 'button',
  size = 'default',
  showStatus = true,
  className,
}: WhatsAppBusinessLinkProps) => {
  const status = getAvailabilityStatus();
  const message = prefilledMessage || MESSAGE_TEMPLATES.inquiry(companyName);
  const whatsappUrl = generateWhatsAppUrl(phoneNumber, message);

  // Icon only variant
  if (variant === 'icon') {
    return (
      <a 
        href={whatsappUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className={cn(
          "inline-flex items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors",
          size === 'sm' && "h-8 w-8",
          size === 'default' && "h-10 w-10",
          size === 'lg' && "h-12 w-12",
          className
        )}
        aria-label="WhatsApp Chat öffnen"
      >
        <MessageCircle className={cn(
          size === 'sm' && "h-4 w-4",
          size === 'default' && "h-5 w-5",
          size === 'lg' && "h-6 w-6"
        )} />
      </a>
    );
  }

  // Inline text link
  if (variant === 'inline') {
    return (
      <a 
        href={whatsappUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className={cn(
          "inline-flex items-center gap-1.5 text-green-600 hover:text-green-700 hover:underline font-medium",
          className
        )}
      >
        <MessageCircle className="h-4 w-4" />
        WhatsApp Chat
        <ExternalLink className="h-3 w-3" />
      </a>
    );
  }

  // Card variant with status
  if (variant === 'card') {
    return (
      <div className={cn(
        "p-4 rounded-lg border border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800",
        className
      )}>
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-green-500 rounded-full">
            <MessageCircle className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="font-semibold text-foreground">WhatsApp Support</div>
            <div className="text-sm text-muted-foreground">Schnelle Antworten garantiert</div>
          </div>
        </div>
        
        {showStatus && (
          <div className={cn(
            "flex items-center gap-2 mb-3 p-2 rounded text-sm",
            status.isOpen 
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
              : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
          )}>
            <div className={cn(
              "w-2 h-2 rounded-full",
              status.isOpen ? "bg-green-500 animate-pulse" : "bg-amber-500"
            )} />
            <Clock className="h-3.5 w-3.5" />
            <span>{status.message}</span>
          </div>
        )}
        
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="block">
          <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
            <MessageCircle className="mr-2 h-4 w-4" />
            Chat starten
          </Button>
        </a>
        
        <div className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <CheckCircle className="h-3 w-3 text-green-500" />
          Durchschnittliche Antwort: &lt; 5 Min
        </div>
      </div>
    );
  }

  // Default button variant
  return (
    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={className}>
      <Button 
        className={cn(
          "bg-green-500 hover:bg-green-600 text-white",
          size === 'sm' && "h-9 px-3 text-sm",
          size === 'default' && "h-10 px-4",
          size === 'lg' && "h-12 px-6 text-lg"
        )}
      >
        <MessageCircle className={cn(
          "mr-2",
          size === 'sm' && "h-4 w-4",
          size === 'default' && "h-4 w-4",
          size === 'lg' && "h-5 w-5"
        )} />
        WhatsApp
        {showStatus && status.isOpen && (
          <Badge className="ml-2 bg-green-600 text-xs">Online</Badge>
        )}
      </Button>
    </a>
  );
};

// Floating WhatsApp Button for pages
export const FloatingWhatsAppButton = ({
  phoneNumber,
  companyName,
  className,
}: {
  phoneNumber: string;
  companyName?: string;
  className?: string;
}) => {
  const message = MESSAGE_TEMPLATES.quickQuestion();
  const whatsappUrl = generateWhatsAppUrl(phoneNumber, message);
  const status = getAvailabilityStatus();

  return (
    <a 
      href={whatsappUrl} 
      target="_blank" 
      rel="noopener noreferrer"
      className={cn(
        "fixed bottom-20 right-4 z-40 flex items-center gap-2 p-3 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-all hover:scale-105",
        "md:bottom-6 md:right-6",
        className
      )}
      aria-label="WhatsApp Chat"
    >
      <MessageCircle className="h-6 w-6" />
      <span className="hidden sm:inline font-medium pr-1">Chat</span>
      {status.isOpen && (
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-300 rounded-full animate-pulse" />
      )}
    </a>
  );
};

export default WhatsAppBusinessLink;
