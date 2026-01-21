/**
 * PersonaPicker - Selector for Bulgarian persona variants
 */

import { memo } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Check, Users } from 'lucide-react';
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
        <Button variant="outline" size="sm" className="gap-2">
          <Users className="w-4 h-4" />
          <span className="text-base">{current.emoji}</span>
          <span className="hidden sm:inline text-xs">{current.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {bgPersonas.map((key) => {
          const info = PERSONA_INFO[key];
          return (
            <DropdownMenuItem
              key={key}
              onClick={() => onPersonaChange(key)}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span className="text-base">{info.emoji}</span>
                <div className="flex flex-col">
                  <span className="font-medium">{info.name}</span>
                  <span className="text-xs text-muted-foreground">{info.description}</span>
                </div>
              </div>
              {currentPersona === key && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
});
