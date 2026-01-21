import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  generateWhatsAppUrl,
  trackWhatsAppClick,
  WhatsAppLead,
  WHATSAPP_CONFIG,
} from "@/lib/whatsapp-flow";

interface WhatsAppButtonProps {
  lead?: Partial<WhatsAppLead>;
  variant?: 'default' | 'floating' | 'inline' | 'cta';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
  context?: 'homepage' | 'calculator' | 'provider' | 'urgent' | 'general';
}

export const WhatsAppButton = ({
  lead,
  variant = 'default',
  size = 'md',
  label,
  className,
  context = 'general',
}: WhatsAppButtonProps) => {
  const handleClick = () => {
    trackWhatsAppClick('chat_open', {
      context,
      hasLead: lead ? 'true' : 'false',
    });
    
    const url = generateWhatsAppUrl(WHATSAPP_CONFIG, lead);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const sizeClasses = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base',
  };

  const iconSizes = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  // Floating button (fixed position)
  if (variant === 'floating') {
    return (
      <button
        onClick={handleClick}
        className={cn(
          "fixed bottom-20 right-4 z-50",
          "w-14 h-14 rounded-full",
          "bg-[#25D366] hover:bg-[#20BD5A] text-white",
          "flex items-center justify-center",
          "shadow-lg hover:shadow-xl transition-all",
          "animate-in fade-in slide-in-from-bottom-4",
          className
        )}
        aria-label="WhatsApp Chat öffnen"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    );
  }

  // CTA variant (prominent green)
  if (variant === 'cta') {
    return (
      <Button
        onClick={handleClick}
        className={cn(
          "bg-[#25D366] hover:bg-[#20BD5A] text-white border-0",
          sizeClasses[size],
          className
        )}
      >
        <MessageCircle className={cn(iconSizes[size], "mr-2")} />
        {label || 'Per WhatsApp anfragen'}
      </Button>
    );
  }

  // Inline variant (subtle)
  if (variant === 'inline') {
    return (
      <button
        onClick={handleClick}
        className={cn(
          "inline-flex items-center gap-1.5 text-[#25D366] hover:underline",
          size === 'sm' && 'text-xs',
          size === 'md' && 'text-sm',
          size === 'lg' && 'text-base',
          className
        )}
      >
        <MessageCircle className={iconSizes[size]} />
        {label || 'WhatsApp'}
      </button>
    );
  }

  // Default variant
  return (
    <Button
      onClick={handleClick}
      variant="outline"
      className={cn(
        "border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white",
        sizeClasses[size],
        className
      )}
    >
      <MessageCircle className={cn(iconSizes[size], "mr-2")} />
      {label || 'WhatsApp'}
    </Button>
  );
};

export default WhatsAppButton;
