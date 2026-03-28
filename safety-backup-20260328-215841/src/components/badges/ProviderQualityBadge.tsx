import { Badge } from "@/components/ui/badge";
import { Shield, Award, Crown, Star, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BadgeLevel, getBadgeColorClasses, BADGE_DEFINITIONS } from "@/lib/quality-badge";

interface ProviderQualityBadgeProps {
  level: BadgeLevel;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showTooltip?: boolean;
  className?: string;
}

export const ProviderQualityBadge = ({
  level,
  size = 'md',
  showLabel = true,
  showTooltip = true,
  className,
}: ProviderQualityBadgeProps) => {
  if (level === 'none') return null;

  const badgeInfo = BADGE_DEFINITIONS[level];
  const colors = getBadgeColorClasses(level);

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const textSizes = {
    sm: 'text-[10px]',
    md: 'text-xs',
    lg: 'text-sm',
  };

  const paddings = {
    sm: 'px-1.5 py-0.5',
    md: 'px-2 py-1',
    lg: 'px-3 py-1.5',
  };

  const getIcon = () => {
    const iconClass = cn(iconSizes[size], "flex-shrink-0");
    switch (badgeInfo.icon) {
      case 'crown':
        return <Crown className={iconClass} />;
      case 'award':
        return <Award className={iconClass} />;
      case 'shield':
        return <Shield className={iconClass} />;
      default:
        return <Star className={iconClass} />;
    }
  };

  const badgeContent = (
    <Badge
      variant="outline"
      className={cn(
        "gap-1 font-medium border",
        colors.bg,
        colors.text,
        colors.border,
        paddings[size],
        className
      )}
    >
      {getIcon()}
      {showLabel && (
        <span className={textSizes[size]}>{badgeInfo.label}</span>
      )}
    </Badge>
  );

  if (!showTooltip) {
    return badgeContent;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {badgeContent}
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {getIcon()}
              <span className="font-semibold">{badgeInfo.label}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {badgeInfo.description}
            </p>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <CheckCircle className="h-3 w-3" />
              <span>Qualitätsgeprüft von Umzugscheck</span>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ProviderQualityBadge;
