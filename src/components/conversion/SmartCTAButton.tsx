/**
 * SmartCTAButton - A/B Tested Call-to-Action Button
 * Step 5.5 - Automatic variant selection for testing
 */
import { memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCTAABTest } from '@/hooks/useCTAABTest';

interface SmartCTAButtonProps {
  to?: string;
  onClick?: () => void;
  className?: string;
  size?: 'default' | 'lg' | 'xl';
  location?: string;
  showSubtext?: boolean;
}

export const SmartCTAButton = memo(function SmartCTAButton({
  to = '/umzugsofferten',
  onClick,
  className,
  size = 'lg',
  location = 'unknown',
  showSubtext = true,
}: SmartCTAButtonProps) {
  const { text, subtext, color, trackClick } = useCTAABTest();

  const handleClick = () => {
    trackClick(location);
    onClick?.();
  };

  const getColorClasses = () => {
    switch (color) {
      case 'urgent':
        return 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-orange-500/25';
      case 'benefit':
        return 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-green-500/25';
      case 'social':
        return 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-blue-500/25';
      default:
        return 'bg-gradient-to-r from-secondary to-secondary/90 hover:from-secondary/90 hover:to-secondary shadow-secondary/25';
    }
  };

  const getIcon = () => {
    switch (color) {
      case 'urgent': return Clock;
      case 'benefit': return Sparkles;
      case 'social': return Users;
      default: return ArrowRight;
    }
  };

  const Icon = getIcon();

  const sizeClasses = {
    default: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base',
    xl: 'h-14 px-8 text-lg',
  };

  const ButtonContent = (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="w-full"
    >
      <Button
        size="lg"
        onClick={handleClick}
        className={cn(
          'w-full text-white font-semibold shadow-lg transition-all duration-300',
          getColorClasses(),
          sizeClasses[size],
          className
        )}
      >
        <span className="flex flex-col items-center gap-0.5">
          <span className="flex items-center gap-2">
            {text}
            <Icon className="w-4 h-4" />
          </span>
          {showSubtext && (
            <span className="text-xs opacity-90 font-normal">
              {subtext}
            </span>
          )}
        </span>
      </Button>
    </motion.div>
  );

  if (to && !onClick) {
    return (
      <Link to={to} className="w-full block">
        {ButtonContent}
      </Link>
    );
  }

  return ButtonContent;
});
