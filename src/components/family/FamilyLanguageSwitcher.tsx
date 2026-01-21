/**
 * Family Page Language Switcher - DE/BG Toggle
 */

import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import type { FamilyLanguage } from "@/lib/family-translations";

interface FamilyLanguageSwitcherProps {
  currentLang: FamilyLanguage;
  onLanguageChange: (lang: FamilyLanguage) => void;
}

export function FamilyLanguageSwitcher({ 
  currentLang, 
  onLanguageChange 
}: FamilyLanguageSwitcherProps) {
  return (
    <div className="flex items-center gap-1 bg-muted rounded-full p-1">
      <Button
        variant={currentLang === 'de' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onLanguageChange('de')}
        className="min-h-[36px] min-w-[44px] rounded-full text-xs font-bold"
      >
        🇨🇭 DE
      </Button>
      <Button
        variant={currentLang === 'bg' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onLanguageChange('bg')}
        className="min-h-[36px] min-w-[44px] rounded-full text-xs font-bold"
      >
        🇧🇬 BG
      </Button>
    </div>
  );
}
