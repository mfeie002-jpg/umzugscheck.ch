/**
 * NewcomerWelcomeKit - Sprint 3 Component
 * Comprehensive welcome guide for people moving to a new city
 * Integrates neighborhood data, checklist, and relocation costs
 */
import { memo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  Home, 
  Users, 
  Train, 
  Wallet, 
  Baby,
  Briefcase,
  GraduationCap,
  Heart,
  CheckCircle2,
  ArrowRight,
  Globe,
  TreePine,
  Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useNeighborhoodByCity, calculateTCR, getLifestyleMatch } from '@/hooks/useNeighborhoods';
import { Skeleton } from '@/components/ui/skeleton';

interface NewcomerWelcomeKitProps {
  cityName: string;
  cantonCode: string;
  userProfile?: {
    isFamily?: boolean;
    isExpat?: boolean;
    monthlyIncome?: number;
    preferences?: {
      family?: boolean;
      expat?: boolean;
      commuters?: boolean;
      quiet?: boolean;
      nature?: boolean;
    };
  };
  className?: string;
  variant?: 'full' | 'summary';
}

export const NewcomerWelcomeKit = memo(function NewcomerWelcomeKit({
  cityName,
  cantonCode,
  userProfile = {},
  className,
  variant = 'full'
}: NewcomerWelcomeKitProps) {
  const { data: neighborhood, isLoading, error } = useNeighborhoodByCity(cityName, cantonCode);

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-8 w-64" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error || !neighborhood) {
    return null;
  }

  // Calculate personalized metrics
  const monthlyIncome = userProfile.monthlyIncome || 8000;
  const isFamily = userProfile.isFamily ?? false;
  const tcr = calculateTCR(neighborhood, monthlyIncome, isFamily);
  
  const lifestyleMatch = getLifestyleMatch(neighborhood, {
    family: userProfile.preferences?.family,
    expat: userProfile.preferences?.expat,
    commuter: userProfile.preferences?.commuters,
    quiet: userProfile.preferences?.quiet,
    nature: userProfile.preferences?.nature,
  });

  const formatCurrency = (value: number | null) => {
    if (!value) return '–';
    return `CHF ${value.toLocaleString('de-CH')}`;
  };

  // Summary variant for cards/widgets
  if (variant === 'summary') {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <div className="h-1 bg-gradient-to-r from-primary to-secondary" />
        <CardContent className="pt-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="font-semibold">{cityName}</span>
            </div>
            <Badge>{cantonCode}</Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Baby className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Familie: {neighborhood.family_score}/100</span>
            </div>
            <div className="flex items-center gap-2">
              <Train className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{neighborhood.zurich_commute_minutes || '–'} Min nach ZH</span>
            </div>
            <div className="flex items-center gap-2">
              <Wallet className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Steuer: {neighborhood.tax_rate_family}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Home className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{formatCurrency(neighborhood.avg_rent_3room)}</span>
            </div>
          </div>

          <Button asChild variant="link" className="p-0 h-auto mt-3 text-sm">
            <Link to={`/umzugsfirmen/${cityName.toLowerCase()}`}>
              Mehr erfahren <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Full welcome kit
  return (
    <div className={cn("space-y-6", className)}>
      {/* Hero Card */}
      <Card className="overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-primary via-secondary to-primary" />
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <Badge variant="secondary" className="mb-2">
                Willkommen in
              </Badge>
              <CardTitle className="text-2xl flex items-center gap-2">
                <MapPin className="h-6 w-6 text-primary" />
                {cityName}, {cantonCode}
              </CardTitle>
              {neighborhood.description && (
                <p className="text-muted-foreground mt-2 max-w-xl">
                  {neighborhood.description}
                </p>
              )}
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">{lifestyleMatch}%</div>
              <div className="text-xs text-muted-foreground">Match-Score</div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Highlights */}
          {neighborhood.highlights && neighborhood.highlights.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {neighborhood.highlights.map((highlight, i) => (
                <Badge key={i} variant="outline" className="gap-1">
                  <Star className="h-3 w-3" />
                  {highlight}
                </Badge>
              ))}
            </div>
          )}

          {/* Key Metrics Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard 
              icon={<Baby className="h-5 w-5" />}
              label="Familienfreundlich"
              value={neighborhood.family_score || 50}
              type="score"
              color="emerald"
            />
            <MetricCard 
              icon={<Globe className="h-5 w-5" />}
              label="Expat-freundlich"
              value={neighborhood.expat_score || 50}
              type="score"
              color="blue"
            />
            <MetricCard 
              icon={<Train className="h-5 w-5" />}
              label="Pendler-Eignung"
              value={neighborhood.commuter_score || 50}
              type="score"
              color="amber"
            />
            <MetricCard 
              icon={<TreePine className="h-5 w-5" />}
              label="Natur & Ruhe"
              value={neighborhood.nature_score || 50}
              type="score"
              color="green"
            />
          </div>
        </CardContent>
      </Card>

      {/* Financial Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Wallet className="h-5 w-5 text-emerald-600" />
            Kosten & Steuern
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <FinancialCard 
              label="Steuersatz Familie"
              value={`${neighborhood.tax_rate_family || '–'}%`}
              sublabel="Kantonal + Gemeinde"
              highlight
            />
            <FinancialCard 
              label="Steuersatz Single"
              value={`${neighborhood.tax_rate_single || '–'}%`}
              sublabel="Kantonal + Gemeinde"
            />
            <FinancialCard 
              label="3-Zi. Miete"
              value={formatCurrency(neighborhood.avg_rent_3room)}
              sublabel="Durchschnitt/Monat"
            />
            <FinancialCard 
              label="4-Zi. Miete"
              value={formatCurrency(neighborhood.avg_rent_4room)}
              sublabel="Durchschnitt/Monat"
            />
          </div>

          <Separator className="my-4" />

          {/* Total Cost of Relocation */}
          <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Geschätzte monatliche Mehrkosten (TCR)
                </p>
                <p className="text-2xl font-bold text-primary">
                  {tcr > 0 ? '+' : ''}{formatCurrency(tcr)}
                </p>
              </div>
              <Badge variant="outline">
                Basierend auf CHF {monthlyIncome.toLocaleString('de-CH')} Einkommen
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Infrastructure & Demographics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5" />
            Anbindung & Demografie
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <InfoCard 
              icon={<Train className="h-4 w-4" />}
              label="Nach Zürich HB"
              value={neighborhood.zurich_commute_minutes ? `${neighborhood.zurich_commute_minutes} Min` : '–'}
            />
            <InfoCard 
              icon={<MapPin className="h-4 w-4" />}
              label="Bahnhof"
              value={neighborhood.train_station_distance_km ? `${neighborhood.train_station_distance_km} km` : '–'}
            />
            <InfoCard 
              icon={<Users className="h-4 w-4" />}
              label="Einwohner"
              value={neighborhood.population?.toLocaleString('de-CH') || '–'}
            />
            <InfoCard 
              icon={<Globe className="h-4 w-4" />}
              label="Ausländeranteil"
              value={neighborhood.foreigner_percent ? `${neighborhood.foreigner_percent}%` : '–'}
            />
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <Card className="bg-gradient-to-r from-secondary/10 to-secondary/5 border-secondary/20">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-lg">Bereit für den Umzug nach {cityName}?</h3>
              <p className="text-sm text-muted-foreground">
                Vergleiche jetzt Umzugsfirmen in deiner Region
              </p>
            </div>
            <Button asChild size="lg">
              <Link to="/umzugsofferten">
                Offerten vergleichen
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

// Helper components
function MetricCard({ 
  icon, 
  label, 
  value, 
  type,
  color 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: number;
  type: 'score';
  color: 'emerald' | 'blue' | 'amber' | 'green';
}) {
  const colorClasses = {
    emerald: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30',
    blue: 'text-blue-600 bg-blue-50 dark:bg-blue-950/30',
    amber: 'text-amber-600 bg-amber-50 dark:bg-amber-950/30',
    green: 'text-green-600 bg-green-50 dark:bg-green-950/30',
  };

  return (
    <motion.div 
      className={cn("p-4 rounded-xl", colorClasses[color])}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold">{value}</span>
        <span className="text-sm text-muted-foreground mb-0.5">/100</span>
      </div>
      <Progress value={value} className="h-1.5 mt-2" />
    </motion.div>
  );
}

function FinancialCard({ 
  label, 
  value, 
  sublabel,
  highlight = false 
}: { 
  label: string; 
  value: string; 
  sublabel: string;
  highlight?: boolean;
}) {
  return (
    <div className={cn(
      "p-4 rounded-xl",
      highlight ? "bg-emerald-50 dark:bg-emerald-950/30" : "bg-muted/50"
    )}>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={cn("text-xl font-bold", highlight && "text-emerald-600 dark:text-emerald-400")}>
        {value}
      </p>
      <p className="text-xs text-muted-foreground">{sublabel}</p>
    </div>
  );
}

function InfoCard({ 
  icon, 
  label, 
  value 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
      <div className="text-muted-foreground">{icon}</div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-semibold">{value}</p>
      </div>
    </div>
  );
}

export default NewcomerWelcomeKit;
