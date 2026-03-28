/**
 * Search Autocomplete Component
 * 
 * Features:
 * - Real-time suggestions
 * - Keyboard navigation
 * - Recent searches
 * - Category grouping
 */

import { useState, useRef, useEffect, useCallback, memo } from 'react';
import { Search, X, Clock, TrendingUp, Building2, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'company' | 'location' | 'service' | 'recent';
  subtitle?: string;
}

interface SearchAutocompleteProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  getSuggestions?: (query: string) => Promise<SearchSuggestion[]>;
  className?: string;
}

const RECENT_SEARCHES_KEY = 'recent_searches';
const MAX_RECENT = 5;

export const SearchAutocomplete = memo(function SearchAutocomplete({
  placeholder = 'Suchen...',
  onSearch,
  getSuggestions,
  className,
}: SearchAutocompleteProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const debouncedQuery = useDebounce(query, 200);

  // Get recent searches
  const getRecentSearches = useCallback((): SearchSuggestion[] => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        return JSON.parse(stored).map((text: string) => ({
          id: `recent-${text}`,
          text,
          type: 'recent' as const,
        }));
      }
    } catch {
      // Ignore errors
    }
    return [];
  }, []);

  // Save recent search
  const saveRecentSearch = (searchQuery: string) => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      const recent: string[] = stored ? JSON.parse(stored) : [];
      const updated = [searchQuery, ...recent.filter(s => s !== searchQuery)].slice(0, MAX_RECENT);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch {
      // Ignore errors
    }
  };

  // Fetch suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedQuery.trim()) {
        setSuggestions(getRecentSearches());
        return;
      }

      if (getSuggestions) {
        setIsLoading(true);
        try {
          const results = await getSuggestions(debouncedQuery);
          setSuggestions(results);
        } catch {
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchSuggestions();
  }, [debouncedQuery, getSuggestions, getRecentSearches]);

  // Handle search submission
  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    saveRecentSearch(searchQuery);
    onSearch(searchQuery);
    setQuery(searchQuery);
    setIsOpen(false);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(prev => Math.min(prev + 1, suggestions.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(prev => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && suggestions[activeIndex]) {
          handleSearch(suggestions[activeIndex].text);
        } else {
          handleSearch(query);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  // Get icon for suggestion type
  const getIcon = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'company':
        return <Building2 className="w-4 h-4" />;
      case 'location':
        return <MapPin className="w-4 h-4" />;
      case 'recent':
        return <Clock className="w-4 h-4" />;
      default:
        return <TrendingUp className="w-4 h-4" />;
    }
  };

  return (
    <div className={cn('relative', className)}>
      {/* Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          data-search-input
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls="search-suggestions"
          aria-activedescendant={activeIndex >= 0 ? `suggestion-${activeIndex}` : undefined}
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Suche löschen"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <ul
          ref={listRef}
          id="search-suggestions"
          role="listbox"
          className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg overflow-hidden"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion.id}
              id={`suggestion-${index}`}
              role="option"
              aria-selected={index === activeIndex}
              onClick={() => handleSearch(suggestion.text)}
              className={cn(
                'flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors',
                index === activeIndex ? 'bg-accent' : 'hover:bg-accent/50'
              )}
            >
              <span className="text-muted-foreground">
                {getIcon(suggestion.type)}
              </span>
              <div className="flex-1 min-w-0">
                <span className="block text-foreground truncate">{suggestion.text}</span>
                {suggestion.subtitle && (
                  <span className="text-xs text-muted-foreground">{suggestion.subtitle}</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute right-10 top-1/2 -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
});

/**
 * Hook for search with URL sync
 */
export function useSearchParams() {
  const [searchParams, setSearchParams] = useState(() => {
    if (typeof window === 'undefined') return new URLSearchParams();
    return new URLSearchParams(window.location.search);
  });

  const getParam = (key: string) => searchParams.get(key) || '';

  const setParam = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
    
    const newUrl = `${window.location.pathname}${newParams.toString() ? '?' + newParams.toString() : ''}`;
    window.history.pushState({}, '', newUrl);
  };

  return { getParam, setParam, searchParams };
}
