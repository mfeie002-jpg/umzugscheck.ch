/**
 * PersonaPicker - VIP Celebrity Selector for Bulgarian personas
 */

import { memo } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Check, Crown } from 'lucide-react';
import { PERSONA_INFO, type PersonaKey } from '@/lib/persona-types';

interface PersonaPickerProps {
  currentPersona: PersonaKey;
  onPersonaChange: (persona: PersonaKey) => void;
}

const bgPersonas: PersonaKey[] = ['bg0', 'bg1', 'bg2', 'bg3'];

export const PersonaPicker = memo(function PersonaPicker({
  currentPersona,
  onPersonaChange
}: PersonaPickerProps) {
  const current = PERSONA_INFO[currentPersona] || PERSONA_INFO.bg0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-1.5 px-2 sm:px-3 h-9 sm:h-10 bg-gradient-to-r from-secondary/10 to-primary/10 border-secondary/30 hover:border-secondary/50"
        >
          <Crown className="w-3.5 h-3.5 text-secondary" />
          <span className="text-base">{current.emoji}</span>
          <span className="hidden sm:inline text-xs font-medium truncate max-w-[60px]">{current.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5 text-xs font-semibold text-secondary border-b border-border mb-1">
          👑 VIP Celebrity Mode
        </div>
        {bgPersonas.map((key) => {
          const info = PERSONA_INFO[key];
          return (
            <DropdownMenuItem
              key={key}
              onClick={() => onPersonaChange(key)}
              className="flex items-center justify-between py-2"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{info.emoji}</span>
                <div className="flex flex-col">
                  <span className="font-medium text-sm">{info.name}</span>
                  <span className="text-xs text-secondary">{info.vipBadge}</span>
                </div>
              </div>
              {currentPersona === key && (
                <Check className="h-4 w-4 text-secondary" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
});
