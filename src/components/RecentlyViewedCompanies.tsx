import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock, Star, ArrowRight, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface ViewedCompany {
  id: string;
  name: string;
  rating: number;
  priceLevel: string;
  viewedAt: Date;
}

export const useRecentlyViewed = () => {
  const [viewed, setViewed] = useState<ViewedCompany[]>(() => {
    const saved = localStorage.getItem("recentlyViewedCompanies");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("recentlyViewedCompanies", JSON.stringify(viewed));
  }, [viewed]);

  const addViewed = (company: Omit<ViewedCompany, "viewedAt">) => {
    setViewed(prev => {
      const filtered = prev.filter(c => c.id !== company.id);
      return [{ ...company, viewedAt: new Date() }, ...filtered].slice(0, 10);
    });
  };

  const clearViewed = () => setViewed([]);

  return { viewed, addViewed, clearViewed };
};

interface RecentlyViewedCompaniesProps {
  onCompanyClick?: (companyId: string) => void;
}

export const RecentlyViewedCompanies = ({ onCompanyClick }: RecentlyViewedCompaniesProps) => {
  const { viewed, clearViewed } = useRecentlyViewed();

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `vor ${days}d`;
    if (hours > 0) return `vor ${hours}h`;
    if (minutes > 0) return `vor ${minutes}m`;
    return "gerade";
  };

  if (viewed.length === 0) {
    return null;
  }

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Zuletzt angesehen
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearViewed}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2">
          <AnimatePresence>
            {viewed.map((company, index) => (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
                className="flex-shrink-0"
              >
                <Button
                  variant="outline"
                  className="h-auto py-3 px-4 flex flex-col items-center gap-2 min-w-[100px]"
                  onClick={() => onCompanyClick?.(company.id)}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {company.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <p className="text-xs font-medium truncate max-w-[80px]">
                      {company.name}
                    </p>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                      <span className="text-xs">{company.rating}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatTimeAgo(company.viewedAt)}
                    </p>
                  </div>
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        <Link to="/umzugsfirmen">
          <Button variant="ghost" className="w-full mt-3" size="sm">
            Alle Firmen ansehen
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default RecentlyViewedCompanies;
