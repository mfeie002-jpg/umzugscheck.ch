import { useState, memo } from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProviderChatWidget } from './ProviderChatWidget';
import { AnimatePresence } from 'framer-motion';

interface ChatButtonProps {
  providerId: string;
  providerName: string;
  providerLogo?: string;
  isOnline?: boolean;
  variant?: 'floating' | 'inline' | 'icon';
  className?: string;
}

export const ChatButton = memo(function ChatButton({
  providerId,
  providerName,
  providerLogo,
  isOnline = true,
  variant = 'inline',
  className = '',
}: ChatButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (variant === 'floating') {
    return (
      <>
        <Button
          onClick={() => setIsOpen(true)}
          className={`fixed bottom-4 left-4 z-40 rounded-full h-14 w-14 shadow-lg ${className}`}
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
          {isOnline && (
            <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
          )}
        </Button>
        
        <AnimatePresence>
          {isOpen && (
            <ProviderChatWidget
              providerId={providerId}
              providerName={providerName}
              providerLogo={providerLogo}
              isOnline={isOnline}
              onClose={() => setIsOpen(false)}
            />
          )}
        </AnimatePresence>
      </>
    );
  }

  if (variant === 'icon') {
    return (
      <>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(true)}
          className={className}
        >
          <MessageCircle className="h-4 w-4" />
        </Button>
        
        <AnimatePresence>
          {isOpen && (
            <ProviderChatWidget
              providerId={providerId}
              providerName={providerName}
              providerLogo={providerLogo}
              isOnline={isOnline}
              onClose={() => setIsOpen(false)}
            />
          )}
        </AnimatePresence>
      </>
    );
  }

  // Inline variant (default)
  return (
    <>
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
        className={`gap-2 ${className}`}
      >
        <MessageCircle className="h-4 w-4" />
        Chat starten
        {isOnline && (
          <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
            Online
          </Badge>
        )}
      </Button>
      
      <AnimatePresence>
        {isOpen && (
          <ProviderChatWidget
            providerId={providerId}
            providerName={providerName}
            providerLogo={providerLogo}
            isOnline={isOnline}
            onClose={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
});

export default ChatButton;
