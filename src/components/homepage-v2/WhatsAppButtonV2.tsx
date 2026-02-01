/**
 * WhatsApp Button V2 - Prominent placement
 * "In der Schweiz das Vertrauensmedium Nr. 1"
 */
import { memo } from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WhatsAppButtonV2Props {
  phoneNumber?: string;
  message?: string;
  variant?: 'floating' | 'inline';
}

export const WhatsAppButtonV2 = memo(function WhatsAppButtonV2({
  phoneNumber = '41780980000',
  message = 'Hallo! Ich interessiere mich für einen Umzug und hätte gerne eine Offerte.',
  variant = 'inline',
}: WhatsAppButtonV2Props) {
  const handleClick = () => {
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  if (variant === 'floating') {
    return (
      <button
        onClick={handleClick}
        className="fixed bottom-24 md:bottom-6 right-4 z-40 w-14 h-14 bg-[#25D366] hover:bg-[#20BD5A] rounded-full shadow-lg flex items-center justify-center text-white transition-all hover:scale-110"
        aria-label="WhatsApp Kontakt"
      >
        <MessageCircle className="w-7 h-7" fill="white" />
      </button>
    );
  }

  return (
    <Button
      onClick={handleClick}
      variant="outline"
      className="h-12 px-6 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white gap-2"
    >
      <MessageCircle className="w-5 h-5" />
      Per WhatsApp anfragen
    </Button>
  );
});
