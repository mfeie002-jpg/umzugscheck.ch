/**
 * CompanyComparisonTable - Tabular view for company comparison
 * Features: Sortable columns, bookmark function, joint quote request
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Star, 
  MapPin, 
  CheckCircle2, 
  Heart, 
  ArrowUpDown,
  Send,
  Building2,
  Clock,
  Shield,
  TrendingUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useFavorites } from "@/components/FavoriteCompanies";
import { useAnalytics } from "@/lib/analytics";

interface Company {
  id: string;
  name: string;
  rating: number;
  review_count: number;
  price_level: string;
  services: string[];
  service_areas: string[];
  verified: boolean;
  availability?: {
    status: 'available' | 'limited' | 'busy';
    nextAvailable: string;
    slotsThisWeek: number;
  };
}

interface CompanyComparisonTableProps {
  companies: Company[];
  onRequestQuote?: (companyIds: string[]) => void;
}

type SortField = 'name' | 'rating' | 'reviews' | 'price';
type SortDirection = 'asc' | 'desc';

export default function CompanyComparisonTable({ 
  companies, 
  onRequestQuote 
}: CompanyComparisonTableProps) {
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [sortField, setSortField] = useState<SortField>('rating');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const analytics = useAnalytics();

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedCompanies = [...companies].sort((a, b) => {
    let comparison = 0;
    switch (sortField) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'rating':
        comparison = a.rating - b.rating;
        break;
      case 'reviews':
        comparison = a.review_count - b.review_count;
        break;
      case 'price':
        const priceOrder = { 'günstig': 1, 'fair': 2, 'premium': 3 };
        comparison = (priceOrder[a.price_level as keyof typeof priceOrder] || 2) - 
                     (priceOrder[b.price_level as keyof typeof priceOrder] || 2);
        break;
    }
    return sortDirection === 'desc' ? -comparison : comparison;
  });

  const toggleSelection = (id: string) => {
    setSelectedCompanies(prev => 
      prev.includes(id) 
        ? prev.filter(c => c !== id)
        : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedCompanies.length === companies.length) {
      setSelectedCompanies([]);
    } else {
      setSelectedCompanies(companies.map(c => c.id));
    }
  };

  const handleJointRequest = () => {
    if (selectedCompanies.length === 0) {
      toast.error("Bitte wählen Sie mindestens eine Firma aus");
      return;
    }
    
    analytics.track('company_clicked', {
      action: 'joint_quote_request',
      company_count: selectedCompanies.length,
      company_ids: selectedCompanies
    });
    
    if (onRequestQuote) {
      onRequestQuote(selectedCompanies);
    } else {
      toast.success(`Offerte für ${selectedCompanies.length} Firmen angefragt!`, {
        description: "Sie erhalten in Kürze Angebote per E-Mail."
      });
    }
  };

  const getPriceBadgeStyle = (level: string) => {
    switch (level) {
      case 'günstig':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'fair':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'premium':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getAvailabilityBadge = (availability?: Company['availability']) => {
    if (!availability) return null;
    
    switch (availability.status) {
      case 'available':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse" />
            Verfügbar
          </Badge>
        );
      case 'limited':
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5" />
            Begrenzt
          </Badge>
        );
      case 'busy':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">
            <Clock className="w-3 h-3 mr-1" />
            {availability.nextAvailable}
          </Badge>
        );
    }
  };

  const SortHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 px-2 font-semibold hover:bg-muted"
      onClick={() => handleSort(field)}
    >
      {children}
      <ArrowUpDown className={`ml-1 h-3 w-3 ${sortField === field ? 'text-primary' : 'text-muted-foreground'}`} />
    </Button>
  );

  return (
    <div className="space-y-4">
      {/* Action Bar */}
      <AnimatePresence>
        {selectedCompanies.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="text-sm">
                {selectedCompanies.length} ausgewählt
              </Badge>
              <span className="text-sm text-muted-foreground">
                Gemeinsame Offerte anfragen für bessere Vergleichbarkeit
              </span>
            </div>
            <Button onClick={handleJointRequest} className="gap-2">
              <Send className="w-4 h-4" />
              Offerten anfordern
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="border rounded-xl overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedCompanies.length === companies.length && companies.length > 0}
                  onCheckedChange={selectAll}
                />
              </TableHead>
              <TableHead className="min-w-[200px]">
                <SortHeader field="name">Firma</SortHeader>
              </TableHead>
              <TableHead>
                <SortHeader field="price">Preisniveau</SortHeader>
              </TableHead>
              <TableHead>
                <SortHeader field="rating">Bewertung</SortHeader>
              </TableHead>
              <TableHead>
                <SortHeader field="reviews">Bewertungen</SortHeader>
              </TableHead>
              <TableHead>Services</TableHead>
              <TableHead>Verfügbarkeit</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedCompanies.map((company, index) => (
              <motion.tr
                key={company.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className={`hover:bg-muted/30 transition-colors ${
                  selectedCompanies.includes(company.id) ? 'bg-primary/5' : ''
                }`}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedCompanies.includes(company.id)}
                    onCheckedChange={() => toggleSelection(company.id)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center font-bold text-primary">
                      {company.name.charAt(0)}
                    </div>
                    <div>
                      <Link 
                        to={`/firma/${company.id}`}
                        className="font-semibold hover:text-primary transition-colors flex items-center gap-1"
                      >
                        {company.name}
                        {company.verified && (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        )}
                      </Link>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        {company.service_areas.slice(0, 2).join(", ")}
                        {company.service_areas.length > 2 && ` +${company.service_areas.length - 2}`}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getPriceBadgeStyle(company.price_level)}>
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {company.price_level}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-semibold">{company.rating.toFixed(1)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-muted-foreground">{company.review_count}</span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1 max-w-[200px]">
                    {company.services.slice(0, 2).map((service, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {service}
                      </Badge>
                    ))}
                    {company.services.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{company.services.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {getAvailabilityBadge(company.availability)}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => toggleFavorite({
                      id: company.id,
                      name: company.name,
                      rating: company.rating,
                      price_level: company.price_level
                    })}
                  >
                    <Heart 
                      className={`w-4 h-4 transition-colors ${
                        isFavorite(company.id) 
                          ? "fill-red-500 text-red-500" 
                          : "text-muted-foreground hover:text-red-500"
                      }`} 
                    />
                  </Button>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Bottom action bar */}
      {selectedCompanies.length > 0 && (
        <div className="flex justify-center">
          <Button 
            size="lg" 
            onClick={handleJointRequest}
            className="gap-2 shadow-lg"
          >
            <Send className="w-5 h-5" />
            Offerten von {selectedCompanies.length} Firmen anfordern
          </Button>
        </div>
      )}
    </div>
  );
}
