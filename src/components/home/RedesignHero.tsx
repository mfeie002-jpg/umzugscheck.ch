import { Button } from "@/components/ui/button";
import { CheckCircle, Video, Users, TrendingDown, ArrowRight, Shield, Check, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getHomepageContent } from "@/lib/content";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const RedesignHero = () => {
  const content = getHomepageContent().hero;
  const [fromPostal, setFromPostal] = useState("");
  const [toPostal, setToPostal] = useState("");
  const [rooms, setRooms] = useState("");
  const [liveCount, setLiveCount] = useState(5);
  const navigate = useNavigate();

  // Simulate live activity
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount(prev => Math.max(3, Math.min(12, prev + (Math.random() > 0.5 ? 1 : -1))));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCalculate = () => {
    if (!fromPostal || !toPostal || !rooms) {
      toast.error("Bitte füllen Sie alle Felder aus", {
        description: "Geben Sie Start-PLZ, Ziel-PLZ und Wohnungsgrösse ein."
      });
      return;
    }
    navigate(`/umzugsrechner?from=${encodeURIComponent(fromPostal)}&to=${encodeURIComponent(toPostal)}&rooms=${rooms}`);
  };

  return (
    <section className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center overflow-hidden py-8 lg:py-0">
      {/* Light Gradient Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-red-50/20" />
        {/* Decorative grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0 0 0) 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }} />
        {/* Decorative shapes */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        <div className="max-w-6xl mx-auto">
          
          {/* Hero Content Grid */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            
            {/* Left: Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              {/* Top Badges */}
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-6">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2"
                >
                  <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-bold text-primary uppercase tracking-wide">BIS 40% SPAREN</span>
                    <p className="text-[10px] text-muted-foreground">durch Vergleich</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-2 shadow-sm"
                >
                  <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center">
                    <Video className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-bold text-foreground uppercase tracking-wide">SCHWEIZER INNOVATION</span>
                    <p className="text-[10px] text-muted-foreground">KI Video-Rechner</p>
                  </div>
                </motion.div>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] mb-6">
                <span className="text-foreground">Der beste Deal</span>
                <br />
                <span className="text-primary">der ganzen Schweiz.</span>
              </h1>
              
              {/* Subheadline */}
              <p className="text-base md:text-lg lg:text-xl text-muted-foreground mb-6 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Unser <span className="inline-flex items-center gap-1"><Video className="w-4 h-4 text-primary" /><span className="text-primary font-semibold">KI-Rechner</span></span> analysiert Ihren Umzug per Video – wir vergleichen <span className="font-bold text-foreground">200+ Firmen</span> und finden das <span className="inline-flex items-center gap-1"><Users className="w-4 h-4 text-primary" /><span className="text-primary font-semibold">beste Angebot</span></span>.
              </p>

              {/* Feature Badges */}
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-6">
                <span className="inline-flex items-center gap-1.5 text-sm text-primary bg-primary/5 border border-primary/20 px-3 py-1.5 rounded-full">
                  <Sparkles className="w-3.5 h-3.5" />
                  Bis 40% günstiger
                </span>
                <span className="inline-flex items-center gap-1.5 text-sm text-primary bg-primary/5 border border-primary/20 px-3 py-1.5 rounded-full">
                  <Video className="w-3.5 h-3.5" />
                  Video-Analyse
                </span>
                <span className="inline-flex items-center gap-1.5 text-sm text-primary bg-primary/5 border border-primary/20 px-3 py-1.5 rounded-full">
                  <CheckCircle className="w-3.5 h-3.5" />
                  200+ Firmen
                </span>
              </div>

              {/* Live Activity Indicator */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-2 shadow-sm mb-6"
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{liveCount} Personen</span> schauen sich Firmen an
                </span>
              </motion.div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link to="/umzugsofferten">
                  <Button 
                    size="lg"
                    className="w-full sm:w-auto h-14 px-8 text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all group"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Jetzt checken lassen
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/umzugsrechner">
                  <Button 
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto h-14 px-8 text-lg font-semibold border-2 border-slate-300 hover:border-primary hover:text-primary transition-all"
                  >
                    Kosten berechnen
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Right: Calculator Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
                {/* Card Header with Badge */}
                <div className="relative p-6 pb-4">
                  {/* Best Price Badge */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex justify-center mb-4"
                  >
                    <span className="inline-flex items-center gap-1.5 bg-secondary/10 text-secondary border border-secondary/20 rounded-full px-3 py-1 text-sm font-semibold">
                      <CheckCircle className="w-4 h-4" />
                      Bester Preis garantiert
                    </span>
                  </motion.div>

                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-primary mb-1">200+ Firmen vergleichen</h3>
                    <p className="text-sm text-muted-foreground">Wir finden den günstigsten Anbieter für Sie</p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="px-6 pb-6 space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-foreground mb-2 block">Von (PLZ oder Ort)</label>
                    <Input 
                      placeholder="z.B. 8001 oder Zürich"
                      value={fromPostal}
                      onChange={(e) => setFromPostal(e.target.value)}
                      className="h-12 border-slate-200 focus:border-primary focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-foreground mb-2 block">Nach (PLZ oder Ort)</label>
                    <Input 
                      placeholder="z.B. 3011 oder Bern"
                      value={toPostal}
                      onChange={(e) => setToPostal(e.target.value)}
                      className="h-12 border-slate-200 focus:border-primary focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-foreground mb-2 block">Wohnungsgrösse</label>
                    <Select value={rooms} onValueChange={setRooms}>
                      <SelectTrigger className="h-12 border-slate-200 focus:border-primary focus:ring-primary">
                        <SelectValue placeholder="Wählen Sie..." />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-slate-200 shadow-lg z-50">
                        <SelectItem value="1">1 Zimmer</SelectItem>
                        <SelectItem value="1.5">1.5 Zimmer</SelectItem>
                        <SelectItem value="2">2 Zimmer</SelectItem>
                        <SelectItem value="2.5">2.5 Zimmer</SelectItem>
                        <SelectItem value="3">3 Zimmer</SelectItem>
                        <SelectItem value="3.5">3.5 Zimmer</SelectItem>
                        <SelectItem value="4">4 Zimmer</SelectItem>
                        <SelectItem value="4.5">4.5 Zimmer</SelectItem>
                        <SelectItem value="5">5+ Zimmer</SelectItem>
                        <SelectItem value="haus">Haus</SelectItem>
                        <SelectItem value="buero">Büro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Submit Button */}
                  <Button 
                    onClick={handleCalculate}
                    className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all group"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Jetzt checken lassen
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>

                  {/* Trust Row */}
                  <div className="flex items-center justify-center gap-4 pt-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                      Kostenlos
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                      Unverbindlich
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5 text-primary" />
                      Datenschutz
                    </span>
                  </div>
                </div>
              </div>

              {/* Decorative glow behind card */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 via-blue-500/10 to-secondary/10 rounded-3xl blur-2xl -z-10 opacity-60" />
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
};
