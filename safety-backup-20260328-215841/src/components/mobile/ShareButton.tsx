import { motion } from 'framer-motion';
import { Share2, Check, Copy } from 'lucide-react';
import { useShareAPI } from '@/hooks/useShareAPI';
import { useClipboard } from '@/hooks/useClipboard';
import { useHaptic } from '@/hooks/use-haptic';
import { cn } from '@/lib/utils';

interface ShareButtonProps {
  title: string;
  text?: string;
  url?: string;
  className?: string;
  variant?: 'icon' | 'button';
}

export const ShareButton = ({
  title,
  text,
  url = window.location.href,
  className,
  variant = 'icon',
}: ShareButtonProps) => {
  const { isSupported: shareSupported, share } = useShareAPI();
  const { copy, hasCopied } = useClipboard();
  const { trigger } = useHaptic();

  const handleShare = async () => {
    trigger('light');
    
    if (shareSupported) {
      await share({ title, text, url });
    } else {
      await copy(url);
    }
  };

  if (variant === 'button') {
    return (
      <motion.button
        onClick={handleShare}
        whileTap={{ scale: 0.95 }}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors',
          className
        )}
      >
        {hasCopied ? (
          <>
            <Check className="w-4 h-4 text-green-500" />
            <span className="text-sm">Kopiert!</span>
          </>
        ) : (
          <>
            <Share2 className="w-4 h-4" />
            <span className="text-sm">Teilen</span>
          </>
        )}
      </motion.button>
    );
  }

  return (
    <motion.button
      onClick={handleShare}
      whileTap={{ scale: 0.9 }}
      className={cn(
        'p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors',
        className
      )}
      aria-label="Teilen"
    >
      {hasCopied ? (
        <Check className="w-5 h-5 text-green-500" />
      ) : (
        <Share2 className="w-5 h-5" />
      )}
    </motion.button>
  );
};
