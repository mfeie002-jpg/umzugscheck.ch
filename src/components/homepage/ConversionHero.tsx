import { useState, memo } from "react";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Shield, Sparkles, Users, TrendingDown, Video, Camera, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

const swissPostalCodes = [
  { code: "8001", city: "Zürich", canton: "ZH" },
  { code: "8002", city: "Zürich", canton: "ZH" },
  { code: "8005", city: "Zürich", canton: "ZH" },
  { code: "3000", city: "Bern", canton: "BE" },
  { code: "3011", city: "Bern", canton: "BE" },
  { code: "4000", city: "Basel", canton: "BS" },
  { code: "4051", city: "Basel", canton: "BS" },
  { code: "6000", city: "Luzern", canton: "LU" },
  { code: "1200", city: "Genève", canton: "GE" },
  { code: "9000", city: "St. Gallen", canton: "SG" },
  { code: "5000", city: "Aarau", canton: "AG" },
  { code: "6300", city: "Zug", canton: "ZG" },
  { code: "8400", city: "Winterthur", canton: "ZH" },
];

const serviceOptions = [
  { value: "umzug", label: "Nur Umzug" },
  { value: "umzug-reinigung", label: "Umzug + Reinigung" },
  { value: "umzug-reinigung-entsorgung", label: "Umzug + Reinigung + Entsorgung" },
];

export const ConversionHero = memo(function ConversionHero() {
  const navigate = useNavigate();
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [apartmentSize, setApartmentSize] = useState("");
  const [serviceType, setServiceType] = useState("umzug");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/umzugsofferten?from=${encodeURIComponent(fromLocation)}&to=${encodeURIComponent(toLocation)}&size=${encodeURIComponent(apartmentSize)}&service=${encodeURIComponent(serviceType)}`);
  };

  return (
    <section className="relative min-h-[70vh] md:min-h-[75vh] lg:min-h-[70vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/70 md:via-background/90 md:to-background/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
      </div>

      <div className="container relative z-10 py-6 md:py-10 lg:py-12 px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-5 text-center lg:text-left"
          >
            {/* Savings Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-green-600/20 backdrop-blur-sm rounded-full px-4 py-2 border border-green-500/30 shadow-soft mx-auto lg:mx-0"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
                <TrendingDown className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-bold text-green-700 dark:text-green-400">Bis zu 40% sparen</span>
              <span className="text-sm text-muted-foreground">• durch Vergleich</span>
            </motion.div>

            {/* Headline */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
                Der beste Deal
              </h1>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
                <span className="text-primary">der ganzen Schweiz.</span>
              </h1>
            </div>

            {/* Value Proposition */}
            <p className="text-base md:text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0">
              Wir vergleichen <strong className="text-foreground">200+ Schweizer Umzugsfirmen</strong> miteinander – 
              Sie erhalten garantiert das <span className="inline-flex items-center gap-1 bg-green-500/10 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-md font-medium text-sm">
                <Trophy className="w-3.5 h-3.5" />beste Angebot
              </span> zum fairsten Preis.
            </p>

            {/* USP Pills */}
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              <span className="inline-flex items-center gap-1.5 text-xs bg-green-500/10 text-green-700 dark:text-green-400 px-3 py-1.5 rounded-full font-medium">
                <TrendingDown className="w-3 h-3" />
                Bis 40% sparen
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full font-medium">
                <Users className="w-3 h-3" />
                200+ Firmen
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs bg-secondary/10 text-secondary px-3 py-1.5 rounded-full font-medium">
                <Video className="w-3 h-3" />
                KI Video-Analyse
              </span>
            </div>

            {/* Live Activity Badge - ONLY this, NO stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 bg-green-500/10 text-green-700 dark:text-green-400 rounded-full px-3 py-1.5 text-sm mx-auto lg:mx-0"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="font-medium">3 Personen vergleichen gerade</span>
            </motion.div>

            {/* Mobile CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 lg:hidden pt-2">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white shadow-cta h-12"
                onClick={() => navigate('/umzugsrechner?tab=ai')}
              >
                <Video className="w-5 h-5 mr-2" />
                KI Video-Rechner starten
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="w-full sm:w-auto h-12"
                onClick={() => navigate('/umzugsofferten')}
              >
                <Camera className="w-5 h-5 mr-2" />
                Foto-Upload
              </Button>
            </div>

            {/* Desktop Trust Badges */}
            <div className="hidden lg:flex flex-wrap gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                <Shield className="w-3 h-3" />
                SSL verschlüsselt
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                <Users className="w-3 h-3" />
                Schweizweit
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                <TrendingDown className="w-3 h-3" />
                Bis 40% sparen
              </span>
            </div>
          </motion.div>

          {/* Right - Form Card (Desktop only) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="hidden lg:block"
          >
            <div className="bg-card rounded-2xl border border-border shadow-premium p-6 lg:p-8">
              {/* Savings Badge */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500/10 to-green-600/10 text-green-700 dark:text-green-400 px-3 py-1.5 rounded-full text-xs font-bold mb-3">
                  <Trophy className="w-3.5 h-3.5" />
                  Bester Preis garantiert
                </div>
                <h2 className="text-xl lg:text-2xl font-bold">200+ Firmen vergleichen</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Wir finden den günstigsten Anbieter für Ihren Umzug
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Von (PLZ oder Ort)</label>
                  <Input
                    placeholder="z.B. 8001 oder Zürich"
                    value={fromLocation}
                    onChange={(e) => setFromLocation(e.target.value)}
                    className="h-12 rounded-xl"
                    list="from-suggestions"
                  />
                  <datalist id="from-suggestions">
                    {swissPostalCodes.map((p) => (
                      <option key={`from-${p.code}`} value={`${p.code} ${p.city}`} />
                    ))}
                  </datalist>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Nach (PLZ oder Ort)</label>
                  <Input
                    placeholder="z.B. 3011 oder Bern"
                    value={toLocation}
                    onChange={(e) => setToLocation(e.target.value)}
                    className="h-12 rounded-xl"
                    list="to-suggestions"
                  />
                  <datalist id="to-suggestions">
                    {swissPostalCodes.map((p) => (
                      <option key={`to-${p.code}`} value={`${p.code} ${p.city}`} />
                    ))}
                  </datalist>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Wohnungsgrösse</label>
                  <Select value={apartmentSize} onValueChange={setApartmentSize}>
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="Bitte wählen..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-1.5">1 – 1.5 Zimmer</SelectItem>
                      <SelectItem value="2-2.5">2 – 2.5 Zimmer</SelectItem>
                      <SelectItem value="3-3.5">3 – 3.5 Zimmer</SelectItem>
                      <SelectItem value="4-4.5">4 – 4.5 Zimmer</SelectItem>
                      <SelectItem value="5+">5+ Zimmer / Haus</SelectItem>
                      <SelectItem value="office">Büro / Firma</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Leistungsumfang</label>
                  <Select value={serviceType} onValueChange={setServiceType}>
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Primary CTA */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-14 rounded-xl bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold text-base shadow-cta"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Jetzt checken lassen
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>

                {/* Video Upload Alternative */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-card px-2 text-muted-foreground">oder</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="w-full h-12 rounded-xl border-primary/30 hover:bg-primary/5 font-medium"
                  onClick={() => navigate('/umzugsrechner?tab=ai')}
                >
                  <Video className="w-5 h-5 mr-2 text-primary" />
                  Video hochladen & KI berechnet
                </Button>
              </form>

              <div className="flex flex-wrap justify-center gap-4 mt-6 pt-6 border-t border-border">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <TrendingDown className="w-3.5 h-3.5 text-green-500" />
                  Bis 40% sparen
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                  100% kostenlos
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Shield className="w-3.5 h-3.5 text-primary" />
                  Geprüfte Firmen
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
});
