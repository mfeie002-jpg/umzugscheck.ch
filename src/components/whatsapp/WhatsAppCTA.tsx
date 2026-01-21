import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Clock, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { WhatsAppButton } from "./WhatsAppButton";
import { WhatsAppLead } from "@/lib/whatsapp-flow";

interface WhatsAppCTAProps {
  title?: string;
  subtitle?: string;
  lead?: Partial<WhatsAppLead>;
  variant?: 'card' | 'banner' | 'minimal';
  className?: string;
}

export const WhatsAppCTA = ({
  title = "Lieber persönlich?",
  subtitle = "Schreiben Sie uns direkt per WhatsApp",
  lead,
  variant = 'card',
  className,
}: WhatsAppCTAProps) => {
  if (variant === 'minimal') {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <WhatsAppButton lead={lead} variant="cta" size="md" />
        <span className="text-xs text-muted-foreground">
          Antwort in &lt;2 Stunden
        </span>
      </div>
    );
  }

  if (variant === 'banner') {
    return (
      <div className={cn(
        "bg-[#25D366]/10 border border-[#25D366]/20 rounded-lg p-4",
        "flex items-center justify-between gap-4",
        className
      )}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center">
            <MessageCircle className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-medium text-sm">{title}</p>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        <WhatsAppButton lead={lead} variant="cta" size="sm" label="Chat starten" />
      </div>
    );
  }

  // Card variant (default)
  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className="h-1 bg-[#25D366]" />
      <CardContent className="p-4 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center flex-shrink-0">
            <MessageCircle className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Antwort in &lt;2h
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Kostenlos
          </span>
        </div>

        <WhatsAppButton 
          lead={lead} 
          variant="cta" 
          size="lg" 
          label="Jetzt per WhatsApp anfragen"
          className="w-full"
        />

        <p className="text-[10px] text-center text-muted-foreground">
          Mo-Fr 8-18 Uhr • Keine Wartezeit
        </p>
      </CardContent>
    </Card>
  );
};

export default WhatsAppCTA;
