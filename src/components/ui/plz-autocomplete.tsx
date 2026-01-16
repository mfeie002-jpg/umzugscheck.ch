/**
 * Swiss PLZ Autocomplete Component
 * 
 * Features:
 * - Real-time search as you type
 * - Shows city name and canton
 * - Keyboard navigation
 * - Mobile-friendly dropdown
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { MapPin, Check } from "lucide-react";
import { searchPostalCodes, getCityByPLZ, type SwissLocation } from "@/data/swissPostalCodes";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface PLZAutocompleteProps {
  value: string;
  onChange: (plz: string, city?: string, canton?: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  className?: string;
  id?: string;
}

export const PLZAutocomplete = ({
  value,
  onChange,
  placeholder = "PLZ oder Ort eingeben",
  label,
  error,
  className,
  id = "plz-input"
}: PLZAutocompleteProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<SwissLocation[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync external value changes
  useEffect(() => {
    if (value !== inputValue) {
      setInputValue(value);
      const location = getCityByPLZ(value);
      if (location) {
        setSelectedCity(location.city);
      }
    }
  }, [value]);

  // Handle input change
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setHighlightedIndex(-1);
    
    if (newValue.length >= 2) {
      const results = searchPostalCodes(newValue);
      setSuggestions(results);
      setIsOpen(results.length > 0);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }

    // If it's a valid 4-digit PLZ, check if it exists
    if (/^\d{4}$/.test(newValue)) {
      const location = getCityByPLZ(newValue);
      if (location) {
        setSelectedCity(location.city);
        onChange(location.plz, location.city, location.canton);
      } else {
        setSelectedCity("");
        onChange(newValue);
      }
    } else {
      setSelectedCity("");
      onChange(newValue);
    }
  }, [onChange]);

  // Handle selection
  const handleSelect = useCallback((location: SwissLocation) => {
    setInputValue(location.plz);
    setSelectedCity(location.city);
    onChange(location.plz, location.city, location.canton);
    setIsOpen(false);
    setSuggestions([]);
    inputRef.current?.blur();
  }, [onChange]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
          handleSelect(suggestions[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  }, [isOpen, suggestions, highlightedIndex, handleSelect]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("relative", className)}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium mb-1.5">
          {label}
        </label>
      )}
      
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
        <Input
          ref={inputRef}
          id={id}
          type="text"
          inputMode="numeric"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          placeholder={placeholder}
          autoComplete="off"
          className={cn(
            "pl-10 pr-4 h-12",
            selectedCity && "pr-24",
            error && "border-destructive"
          )}
        />
        
        {/* Show selected city badge */}
        <AnimatePresence>
          {selectedCity && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1"
            >
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full flex items-center gap-1">
                <Check className="h-3 w-3" />
                {selectedCity}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && suggestions.length > 0 && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-1 bg-background border border-border rounded-lg shadow-lg overflow-hidden"
          >
            <ul className="py-1 max-h-60 overflow-y-auto">
              {suggestions.map((location, index) => (
                <li
                  key={`${location.plz}-${location.city}`}
                  onClick={() => handleSelect(location)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors",
                    highlightedIndex === index 
                      ? "bg-primary/10 text-primary" 
                      : "hover:bg-muted"
                  )}
                >
                  <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{location.plz}</span>
                      <span className="text-muted-foreground">–</span>
                      <span className="truncate">{location.city}</span>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded shrink-0">
                    {location.canton}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error message */}
      {error && (
        <p className="text-sm text-destructive mt-1">{error}</p>
      )}
    </div>
  );
};

export default PLZAutocomplete;
