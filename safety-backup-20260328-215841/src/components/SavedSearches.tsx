import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bookmark, Search, Trash2, Bell, BellOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SavedSearch {
  id: string;
  query: string;
  filters: {
    region?: string;
    services?: string[];
    maxPrice?: number;
  };
  savedAt: Date;
  hasNotification: boolean;
}

export const useSavedSearches = () => {
  const [searches, setSearches] = useState<SavedSearch[]>(() => {
    const saved = localStorage.getItem("savedSearches");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("savedSearches", JSON.stringify(searches));
  }, [searches]);

  const addSearch = (query: string, filters: SavedSearch["filters"]) => {
    const newSearch: SavedSearch = {
      id: Math.random().toString(36).substr(2, 9),
      query,
      filters,
      savedAt: new Date(),
      hasNotification: false,
    };
    setSearches(prev => [newSearch, ...prev.slice(0, 9)]);
  };

  const removeSearch = (id: string) => {
    setSearches(prev => prev.filter(s => s.id !== id));
  };

  const toggleNotification = (id: string) => {
    setSearches(prev => prev.map(s => 
      s.id === id ? { ...s, hasNotification: !s.hasNotification } : s
    ));
  };

  return { searches, addSearch, removeSearch, toggleNotification };
};

interface SavedSearchesProps {
  onSearchSelect?: (search: SavedSearch) => void;
}

export const SavedSearches = ({ onSearchSelect }: SavedSearchesProps) => {
  const { searches, removeSearch, toggleNotification } = useSavedSearches();

  if (searches.length === 0) {
    return (
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bookmark className="h-5 w-5 text-primary" />
            Gespeicherte Suchen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Keine gespeicherten Suchen</p>
            <p className="text-xs mt-1">Speichern Sie Ihre Suchen für später</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Bookmark className="h-5 w-5 text-primary" />
          Gespeicherte Suchen
          <Badge variant="secondary" className="ml-auto">
            {searches.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <AnimatePresence>
          {searches.map((search) => (
            <motion.div
              key={search.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 group"
            >
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 justify-start h-auto py-1 px-2"
                onClick={() => onSearchSelect?.(search)}
              >
                <div className="text-left">
                  <p className="text-sm font-medium truncate">{search.query}</p>
                  <div className="flex gap-1 mt-1">
                    {search.filters.region && (
                      <Badge variant="outline" className="text-xs py-0">
                        {search.filters.region}
                      </Badge>
                    )}
                    {search.filters.maxPrice && (
                      <Badge variant="outline" className="text-xs py-0">
                        Max CHF {search.filters.maxPrice}
                      </Badge>
                    )}
                  </div>
                </div>
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => toggleNotification(search.id)}
              >
                {search.hasNotification ? (
                  <Bell className="h-4 w-4 text-primary" />
                ) : (
                  <BellOff className="h-4 w-4" />
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                onClick={() => removeSearch(search.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default SavedSearches;
