/**
 * Language Switcher Component
 * Allows users to switch between DE/FR/IT languages
 */

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type Language = 'de' | 'fr' | 'it';

interface LanguageOption {
  code: Language;
  label: string;
  flag: string;
  region: string;
}

const languages: LanguageOption[] = [
  { code: 'de', label: 'Deutsch', flag: '🇩🇪', region: 'Deutschschweiz' },
  { code: 'fr', label: 'Français', flag: '🇫🇷', region: 'Romandie' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹', region: 'Ticino' },
];

interface LanguageSwitcherProps {
  variant?: 'default' | 'compact' | 'text';
  className?: string;
  onLanguageChange?: (lang: Language) => void;
}

export function LanguageSwitcher({ 
  variant = 'default',
  className,
  onLanguageChange 
}: LanguageSwitcherProps) {
  const [currentLang, setCurrentLang] = useState<Language>(() => {
    // Check localStorage first
    const stored = localStorage.getItem('preferred-language') as Language;
    if (stored && ['de', 'fr', 'it'].includes(stored)) {
      return stored;
    }
    
    // Check browser language
    const browserLang = navigator.language.split('-')[0].toLowerCase();
    if (browserLang === 'fr') return 'fr';
    if (browserLang === 'it') return 'it';
    return 'de'; // Default to German
  });

  const currentLanguage = languages.find(l => l.code === currentLang)!;

  const handleLanguageChange = (lang: Language) => {
    setCurrentLang(lang);
    localStorage.setItem('preferred-language', lang);
    
    // Dispatch custom event for other components to listen
    window.dispatchEvent(new CustomEvent('languageChange', { detail: lang }));
    
    onLanguageChange?.(lang);
  };

  // Compact variant - just shows flag
  if (variant === 'compact') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm"
            className={cn("h-8 w-8 p-0", className)}
          >
            <span className="text-lg">{currentLanguage.flag}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className="flex items-center gap-2"
            >
              <span className="text-base">{lang.flag}</span>
              <span>{lang.label}</span>
              {currentLang === lang.code && (
                <Check className="w-4 h-4 ml-auto text-primary" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Text variant - just shows language code
  if (variant === 'text') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm"
            className={cn("gap-1 text-xs uppercase font-medium", className)}
          >
            <Globe className="w-3 h-3" />
            {currentLang}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className="flex items-center gap-2"
            >
              <span className="text-base">{lang.flag}</span>
              <div>
                <span className="font-medium">{lang.label}</span>
                <span className="text-xs text-muted-foreground ml-2">
                  ({lang.region})
                </span>
              </div>
              {currentLang === lang.code && (
                <Check className="w-4 h-4 ml-auto text-primary" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Default variant - shows flag and label
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className={cn("gap-2", className)}
        >
          <span className="text-base">{currentLanguage.flag}</span>
          <span className="hidden sm:inline">{currentLanguage.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className="flex items-center gap-3 py-2"
          >
            <span className="text-lg">{lang.flag}</span>
            <div className="flex-1">
              <p className="font-medium">{lang.label}</p>
              <p className="text-xs text-muted-foreground">{lang.region}</p>
            </div>
            {currentLang === lang.code && (
              <Check className="w-4 h-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Hook to use language in components
export function useLanguage(): [Language, (lang: Language) => void] {
  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem('preferred-language') as Language;
    if (stored && ['de', 'fr', 'it'].includes(stored)) {
      return stored;
    }
    return 'de';
  });

  useEffect(() => {
    const handleLanguageChange = (e: CustomEvent<Language>) => {
      setLanguage(e.detail);
    };

    window.addEventListener('languageChange', handleLanguageChange as EventListener);
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange as EventListener);
    };
  }, []);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('preferred-language', lang);
    window.dispatchEvent(new CustomEvent('languageChange', { detail: lang }));
  };

  return [language, changeLanguage];
}
