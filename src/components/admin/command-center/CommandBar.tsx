/**
 * ARCHETYP COMMAND CENTER - Command Bar
 * 
 * Top action bar with search and global actions.
 * Minimal, focused, powerful.
 */

import React from 'react';
import { Search, RefreshCw, Download, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface CommandBarProps {
  onRefresh: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isLoading: boolean;
}

export function CommandBar({
  onRefresh,
  searchQuery,
  onSearchChange,
  isLoading,
}: CommandBarProps) {
  return (
    <div className="h-14 border-b bg-background px-4 flex items-center justify-between gap-4">
      {/* Left: Title */}
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold">Command Center</h1>
        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
          ARCHETYP
        </span>
      </div>
      
      {/* Center: Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Suche Flows & Pages..."
            className="pl-9 h-9"
          />
        </div>
      </div>
      
      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={cn('h-4 w-4 mr-2', isLoading && 'animate-spin')} />
          Aktualisieren
        </Button>
      </div>
    </div>
  );
}
