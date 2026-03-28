/**
 * FunModeToggle - Toggle for Italian fun mode
 */

import { memo } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Sparkles } from 'lucide-react';

interface FunModeToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export const FunModeToggle = memo(function FunModeToggle({
  enabled,
  onToggle
}: FunModeToggleProps) {
  return (
    <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-muted/50">
      <Sparkles className={`w-4 h-4 ${enabled ? 'text-primary' : 'text-muted-foreground'}`} />
      <Label htmlFor="fun-mode" className="text-xs cursor-pointer">
        Fun Mode
      </Label>
      <Switch
        id="fun-mode"
        checked={enabled}
        onCheckedChange={onToggle}
        className="scale-75"
      />
    </div>
  );
});
