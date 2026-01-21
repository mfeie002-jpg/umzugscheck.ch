/**
 * Vision Page Language Switcher
 * DE/BG/IT language toggle with persona support for Vision pages
 */

import { memo } from "react";
import { Globe, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { VisionLanguage } from "@/lib/vision-translations";
import { PersonaPicker } from "@/components/persona/PersonaPicker";
import { FunModeToggle } from "@/components/persona/FunModeToggle";
import { usePersona } from "@/hooks/usePersona";

interface VisionLanguageSwitcherProps {
  currentLang: VisionLanguage;
  onLanguageChange: (lang: VisionLanguage) => void;
}

const languages = [
  { code: 'de' as VisionLanguage, label: 'Deutsch', flag: '🇨🇭' },
  { code: 'bg' as VisionLanguage, label: 'Български', flag: '🇧🇬' },
  { code: 'it' as VisionLanguage, label: 'Italiano', flag: '🇮🇹' }
];

export const VisionLanguageSwitcher = memo(({ currentLang, onLanguageChange }: VisionLanguageSwitcherProps) => {
  const current = languages.find(l => l.code === currentLang) || languages[0];
  const { persona, setPersona, funMode, setFunMode, showPersonaPicker, showFunToggle } = usePersona(currentLang);

  return (
    <div className="flex items-center gap-2">
      {/* Persona picker for Bulgarian */}
      {showPersonaPicker && (
        <PersonaPicker currentPersona={persona} onPersonaChange={setPersona} />
      )}
      
      {/* Fun mode toggle for Italian */}
      {showFunToggle && (
        <FunModeToggle enabled={funMode} onToggle={setFunMode} />
      )}

      {/* Language selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Globe className="w-4 h-4" />
            <span className="text-base">{current.flag}</span>
            <span className="hidden sm:inline">{current.code.toUpperCase()}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => onLanguageChange(lang.code)}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span className="text-base">{lang.flag}</span>
                <span>{lang.label}</span>
              </div>
              {currentLang === lang.code && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
});

VisionLanguageSwitcher.displayName = 'VisionLanguageSwitcher';
