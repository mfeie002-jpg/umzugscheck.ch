/**
 * Floating Admin Help Button
 * Opens a drawer with quick help and search
 */

import { useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { 
  HelpCircle, 
  Search, 
  BookOpen, 
  ExternalLink, 
  ArrowRight,
  Zap,
  X
} from 'lucide-react';
import { 
  HANDBOOK_DATA, 
  QUICK_LINKS, 
  searchHandbook,
  getTooltipForRoute,
  type HandbookSection 
} from '@/lib/admin-handbook-data';
import { cn } from '@/lib/utils';

export function AdminHelpButton() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  
  // Get current page info
  const currentPageInfo = useMemo(() => {
    for (const category of HANDBOOK_DATA) {
      for (const section of category.sections) {
        if (location.pathname === section.route || 
            location.pathname.startsWith(section.route + '/')) {
          return { section, category };
        }
      }
    }
    return null;
  }, [location.pathname]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchHandbook(searchQuery).slice(0, 5);
  }, [searchQuery]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className={cn(
            "fixed bottom-20 right-4 z-50 h-12 w-12 rounded-full shadow-lg",
            "bg-background border-2 hover:bg-primary hover:text-primary-foreground",
            "transition-all duration-200 hover:scale-110"
          )}
        >
          <HelpCircle className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Admin Hilfe
          </SheetTitle>
          <SheetDescription>
            Schnellhilfe und Dokumentation
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Suchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            {searchQuery && (
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                onClick={() => setSearchQuery('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Suchergebnisse</p>
              {searchResults.map((section) => (
                <Link
                  key={section.id}
                  to={section.route}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-sm">{section.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {section.description}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </Link>
              ))}
            </div>
          )}

          {/* Current Page Info */}
          {!searchQuery && currentPageInfo && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Aktuelle Seite</p>
              <div className="p-4 rounded-lg border bg-primary/5">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold">{currentPageInfo.section.title}</h3>
                  {currentPageInfo.section.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {currentPageInfo.section.badge}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {currentPageInfo.section.description}
                </p>
                <div className="space-y-1">
                  <p className="text-xs font-medium">Features:</p>
                  <ul className="text-xs space-y-0.5">
                    {currentPageInfo.section.features.slice(0, 3).map((f, i) => (
                      <li key={i} className="text-muted-foreground">• {f}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Quick Links */}
          {!searchQuery && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Schnellzugriff</p>
              <div className="grid grid-cols-2 gap-2">
                {QUICK_LINKS.map((link) => (
                  <Link
                    key={link.route}
                    to={link.route}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 p-2 rounded-md border hover:bg-muted/50 text-sm transition-colors"
                  >
                    <Zap className="h-3 w-3 text-primary" />
                    {link.action}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Full Handbook Link */}
          <div className="pt-4 border-t">
            <Button asChild className="w-full" onClick={() => setOpen(false)}>
              <Link to="/admin/handbuch" className="gap-2">
                <BookOpen className="h-4 w-4" />
                Vollständiges Handbuch öffnen
              </Link>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
