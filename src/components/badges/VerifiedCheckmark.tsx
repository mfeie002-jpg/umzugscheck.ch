import { CheckCircle, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface VerifiedCheckmarkProps {
  isVerified: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'check' | 'shield';
  showTooltip?: boolean;
  className?: string;
}

export const VerifiedCheckmark = ({
  isVerified,
  size = 'md',
  variant = 'check',
  showTooltip = true,
  className,
}: VerifiedCheckmarkProps) => {
  if (!isVerified) return null;

  const sizes = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const Icon = variant === 'shield' ? ShieldCheck : CheckCircle;

  const checkmark = (
    <Icon
      className={cn(
        sizes[size],
        "text-blue-600 fill-blue-100",
        className
      )}
    />
  );

  if (!showTooltip) {
    return checkmark;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex">{checkmark}</span>
        </TooltipTrigger>
        <TooltipContent>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-blue-600" />
            <span>Verifizierter Anbieter</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Identität und Dokumente geprüft
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default VerifiedCheckmark;
