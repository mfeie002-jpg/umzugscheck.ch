/**
 * Family Page Language Switcher - DE/BG/IT Toggle
 * Vollständiger Dreisprachiger Support
 */

import { Button } from "@/components/ui/button";
import { Globe, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { FamilyLanguage } from "@/lib/family-translations";

interface FamilyLanguageSwitcherProps {
  currentLang: FamilyLanguage;
  onLanguageChange: (lang: FamilyLanguage) => void;
}

const languages = [
  { code: 'de' as FamilyLanguage, label: 'Deutsch', flag: '🇨🇭' },
  { code: 'bg' as FamilyLanguage, label: 'Български', flag: '🇧🇬' },
  { code: 'it' as FamilyLanguage, label: 'Italiano', flag: '🇮🇹' },
];

export function FamilyLanguageSwitcher({ 
  currentLang, 
  onLanguageChange 
}: FamilyLanguageSwitcherProps) {
  const current = languages.find(l => l.code === currentLang) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 min-h-[44px]">
          <Globe className="w-4 h-4" />
          <span className="text-base">{current.flag}</span>
          <span className="hidden sm:inline">{current.code.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 bg-background">
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
  );
}
