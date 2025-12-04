import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, TrendingUp, TrendingDown, Star, Building2, ArrowRight, X, Download } from "lucide-react";
import { getAllCantonConfigs } from "@/lib/cantonConfigMap";
import { Link } from "react-router-dom";

interface CantonData {
  name: string;
  slug: string;
  avgPrice: number;
  companyCount: number;
  avgRating: number;
}

const CantonComparisonWidget = () => {
  const [selectedCantons, setSelectedCantons] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  const cantonConfigs = getAllCantonConfigs();

  // Transform canton configs into comparison data
  const cantonData: CantonData[] = useMemo(() => {
    return cantonConfigs.map(config => {
      // Calculate average price from price examples
      const prices = config.priceExamples.map(p => {
        const match = p.range.match(/(\d+)/);
        return match ? parseInt(match[1]) : 800;
      });
      const avgPrice = prices.length > 0 
        ? prices.reduce((a, b) => a + b, 0) / prices.length 
        : 800;
      
      // Calculate average rating from companies
      const ratings = config.companies.map(c => c.rating);
      const avgRating = ratings.length > 0 
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length 
        : 4.5;

      return {
        name: config.name,
        slug: config.slug,
        avgPrice: Math.round(avgPrice),
        companyCount: config.companies.length,
        avgRating: Math.round(avgRating * 10) / 10,
      };
    });
  }, [cantonConfigs]);

  const availableCantons = cantonData.filter(c => !selectedCantons.includes(c.slug));

  const handleAddCanton = (slug: string) => {
    if (selectedCantons.length < 4 && !selectedCantons.includes(slug)) {
      setSelectedCantons([...selectedCantons, slug]);
    }
  };

  const handleRemoveCanton = (slug: string) => {
    setSelectedCantons(selectedCantons.filter(s => s !== slug));
  };

  const selectedCantonData = selectedCantons
    .map(slug => cantonData.find(c => c.slug === slug))
    .filter(Boolean) as CantonData[];

  // Find cheapest and most expensive
  const priceStats = useMemo(() => {
    if (selectedCantonData.length < 2) return null;
    const sorted = [...selectedCantonData].sort((a, b) => a.avgPrice - b.avgPrice);
    return {
      cheapest: sorted[0],
      mostExpensive: sorted[sorted.length - 1],
      savings: sorted[sorted.length - 1].avgPrice - sorted[0].avgPrice,
    };
  }, [selectedCantonData]);

  const exportToCSV = () => {
    setIsExporting(true);
    const headers = ["Kanton", "Ø Preis (CHF)", "Firmen", "Ø Bewertung"];
    const rows = selectedCantonData.map(c => [
      c.name,
      c.avgPrice.toString(),
      c.companyCount.toString(),
      c.avgRating.toString(),
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "kanton-vergleich.csv";
    a.click();
    URL.revokeObjectURL(url);
    setTimeout(() => setIsExporting(false), 1000);
  };

  return (
    <Card className="border-2 bg-white shadow-soft">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <MapPin className="w-5 h-5 text-primary" />
          Kantons-Preisvergleich
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Vergleichen Sie Umzugspreise zwischen verschiedenen Kantonen
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Canton Selector */}
        <div className="space-y-3">
          <label className="text-sm font-medium">
            Kantone auswählen (max. 4)
          </label>
          <Select 
            value="" 
            onValueChange={handleAddCanton}
            disabled={selectedCantons.length >= 4}
          >
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Kanton hinzufügen..." />
            </SelectTrigger>
            <SelectContent>
              {availableCantons.map(canton => (
                <SelectItem key={canton.slug} value={canton.slug}>
                  {canton.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Selected Cantons Tags */}
          {selectedCantons.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedCantonData.map(canton => (
                <Badge 
                  key={canton.slug}
                  variant="secondary" 
                  className="gap-1 pr-1"
                >
                  {canton.name}
                  <button
                    onClick={() => handleRemoveCanton(canton.slug)}
                    className="ml-1 p-0.5 hover:bg-muted rounded"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Comparison Table */}
        {selectedCantonData.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm" role="table">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium" scope="col">Kanton</th>
                  <th className="text-right py-2 font-medium" scope="col">Ø Preis</th>
                  <th className="text-right py-2 font-medium" scope="col">Firmen</th>
                  <th className="text-right py-2 font-medium" scope="col">Bewertung</th>
                </tr>
              </thead>
              <tbody>
                {selectedCantonData.map(canton => (
                  <tr key={canton.slug} className="border-b last:border-0">
                    <td className="py-3">
                      <Link 
                        to={`/canton/${canton.slug}`}
                        className="flex items-center gap-2 hover:text-primary transition-colors"
                      >
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        {canton.name}
                        {priceStats?.cheapest.slug === canton.slug && (
                          <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                            <TrendingDown className="w-3 h-3 mr-1" />
                            Günstigster
                          </Badge>
                        )}
                      </Link>
                    </td>
                    <td className="py-3 text-right font-semibold">
                      CHF {canton.avgPrice}
                    </td>
                    <td className="py-3 text-right">
                      <span className="flex items-center justify-end gap-1">
                        <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                        {canton.companyCount}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <span className="flex items-center justify-end gap-1">
                        <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                        {canton.avgRating}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Savings Summary */}
        {priceStats && (
          <div className="p-4 bg-green-50 rounded-lg border border-green-100">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 rounded-full">
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-green-800">
                  Mögliche Ersparnis: CHF {priceStats.savings}
                </p>
                <p className="text-sm text-green-700">
                  Ein Umzug in {priceStats.cheapest.name} ist im Durchschnitt günstiger als in {priceStats.mostExpensive.name}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        {selectedCantonData.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={exportToCSV}
              disabled={isExporting}
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              {isExporting ? "Exportiere..." : "Als CSV exportieren"}
            </Button>
            <Link to="/umzugsofferten" className="flex-1">
              <Button className="w-full bg-primary hover:bg-primary-dark">
                Offerten vergleichen
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        )}

        {/* Empty State */}
        {selectedCantons.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <MapPin className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Wählen Sie mindestens 2 Kantone aus, um die Preise zu vergleichen</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CantonComparisonWidget;
