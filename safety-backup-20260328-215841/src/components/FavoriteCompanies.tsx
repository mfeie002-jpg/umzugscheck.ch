import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Heart, Star, ArrowRight, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface FavoriteCompany {
  id: string;
  name: string;
  rating: number;
  price_level: string;
}

interface FavoriteCompaniesProps {
  onRequestQuotes?: (companyIds: string[]) => void;
}

const STORAGE_KEY = "umzugscheck_favorites";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteCompany[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (e) {
        console.error("Error parsing favorites:", e);
      }
    }
  }, []);

  const addFavorite = (company: FavoriteCompany) => {
    if (favorites.some(f => f.id === company.id)) return;
    const updated = [...favorites, company];
    setFavorites(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    toast.success(`${company.name} zu Favoriten hinzugefügt`);
  };

  const removeFavorite = (id: string) => {
    const updated = favorites.filter(f => f.id !== id);
    setFavorites(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    toast.info("Firma aus Favoriten entfernt");
  };

  const isFavorite = (id: string) => favorites.some(f => f.id === id);

  const toggleFavorite = (company: FavoriteCompany) => {
    if (isFavorite(company.id)) {
      removeFavorite(company.id);
    } else {
      addFavorite(company);
    }
  };

  return { favorites, addFavorite, removeFavorite, isFavorite, toggleFavorite };
};

const FavoriteCompanies = ({ onRequestQuotes }: FavoriteCompaniesProps) => {
  const { favorites, removeFavorite } = useFavorites();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative">
          <Heart className={`w-4 h-4 mr-2 ${favorites.length > 0 ? "fill-red-500 text-red-500" : ""}`} />
          Favoriten
          {favorites.length > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-red-500">
              {favorites.length}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 fill-red-500 text-red-500" />
            Ihre Favoriten ({favorites.length})
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-3">
          {favorites.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Heart className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Noch keine Favoriten gespeichert</p>
              <p className="text-sm mt-1">Klicken Sie auf das Herz-Symbol bei einer Firma</p>
            </div>
          ) : (
            <>
              {favorites.map(company => (
                <div 
                  key={company.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{company.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Star className="w-3 h-3 fill-accent text-accent" />
                      <span className="text-sm">{company.rating}</span>
                      <Badge variant="outline" className="text-xs">
                        {company.price_level}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-red-500"
                    onClick={() => removeFavorite(company.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <div className="pt-4 border-t">
                <Link to="/umzugsofferten">
                  <Button className="w-full bg-primary hover:bg-primary-dark">
                    Offerten von allen anfragen
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FavoriteCompanies;
