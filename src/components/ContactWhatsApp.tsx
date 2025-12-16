import { MessageCircle, Clock, Phone, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface OfficeHours {
  day: string;
  hours: string;
  isToday?: boolean;
}

interface ContactWhatsAppProps {
  phoneNumber?: string;
  whatsappNumber?: string;
  className?: string;
}

const defaultHours: OfficeHours[] = [
  { day: "Montag - Freitag", hours: "08:00 - 18:00" },
  { day: "Samstag", hours: "09:00 - 14:00" },
  { day: "Sonntag", hours: "Geschlossen" },
];

const getCurrentDayStatus = (): { isOpen: boolean; message: string } => {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday
  const hour = now.getHours();

  if (day === 0) {
    return { isOpen: false, message: "Heute geschlossen" };
  }
  
  if (day === 6) {
    // Saturday
    if (hour >= 9 && hour < 14) {
      return { isOpen: true, message: "Jetzt geöffnet • Schliesst um 14:00" };
    }
    return { isOpen: false, message: "Heute geschlossen" };
  }
  
  // Weekday
  if (hour >= 8 && hour < 18) {
    return { isOpen: true, message: `Jetzt geöffnet • Schliesst um 18:00` };
  }
  
  return { isOpen: false, message: "Derzeit geschlossen" };
};

export const ContactWhatsApp = ({
  phoneNumber = "+41445555555",
  whatsappNumber = "41445555555",
  className,
}: ContactWhatsAppProps) => {
  const status = getCurrentDayStatus();
  
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    "Hallo, ich habe eine Frage zu meinem Umzug."
  )}`;

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MessageCircle className="h-5 w-5" />
          WhatsApp & Live-Support
        </CardTitle>
        <p className="text-sm text-white/90 mt-1">
          Schnelle Antworten auf Ihre Fragen
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {/* Status indicator */}
        <div className={cn(
          "flex items-center gap-2 p-3 rounded-lg",
          status.isOpen ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
        )}>
          <div className={cn(
            "w-2 h-2 rounded-full",
            status.isOpen ? "bg-green-500 animate-pulse" : "bg-amber-500"
          )} />
          <span className="text-sm font-medium">{status.message}</span>
        </div>

        {/* WhatsApp Button */}
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
          <Button className="w-full bg-green-500 hover:bg-green-600 text-white h-12">
            <MessageCircle className="mr-2 h-5 w-5" />
            WhatsApp Chat starten
          </Button>
        </a>

        {/* Phone alternative */}
        <div className="text-center">
          <span className="text-sm text-muted-foreground">oder rufen Sie uns an:</span>
          <a
            href={`tel:${phoneNumber}`}
            className="flex items-center justify-center gap-2 mt-2 text-primary hover:underline font-medium"
          >
            <Phone className="h-4 w-4" />
            {phoneNumber.replace(/(\+41)(\d{2})(\d{3})(\d{2})(\d{2})/, "$1 $2 $3 $4 $5")}
          </a>
        </div>

        {/* Office hours */}
        <div className="pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-sm font-medium mb-3">
            <Clock className="h-4 w-4 text-muted-foreground" />
            Öffnungszeiten
          </div>
          <div className="space-y-2">
            {defaultHours.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{item.day}</span>
                <span className={item.hours === "Geschlossen" ? "text-muted-foreground" : "font-medium"}>
                  {item.hours}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Trust badges */}
        <div className="pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span>Durchschnittliche Antwortzeit: &lt; 5 Minuten</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
