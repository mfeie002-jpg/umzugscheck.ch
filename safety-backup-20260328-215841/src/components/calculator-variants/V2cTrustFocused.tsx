/**
 * V2.c - Trust-Focused Design
 * 
 * Optimizations:
 * - Prominent trust signals throughout
 * - Verified badges and partner logos
 * - Real-time social proof
 * - Security emphasis
 * - Customer count display
 */

import { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, ArrowLeft, Shield, CheckCircle, Star,
  MapPin, Home, Building2, Truck, HelpCircle, Users, Lock, Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { useInitialStep } from "@/hooks/use-initial-step";

const MOVE_TYPES = [
  { id: "wohnung", label: "Wohnung", icon: Home },
  { id: "haus", label: "Haus", icon: Building2 },
  { id: "buero", label: "Büro", icon: Truck },
  { id: "andere", label: "Andere", icon: HelpCircle },
];

const TRUST_STATS = [
  { icon: Users, value: "12'847", label: "Kunden" },
  { icon: Star, value: "4.8", label: "Bewertung" },
  { icon: Award, value: "87", label: "Firmen" },
];

const APARTMENT_SIZES = ["Studio", "1-1.5", "2-2.5", "3-3.5", "4-4.5", "5+"];

export const V2cTrustFocused = memo(function V2cTrustFocused() {
  const navigate = useNavigate();
  const initialStep = useInitialStep(1);
  const [step, setStep] = useState(initialStep);
  const [data, setData] = useState({
    type: "",
    from: "",
    to: "",
    size: "",
    name: "",
    email: "",
    phone: "",
    ok: false,
  });

  const canProceed = () => {
    if (step === 1) return data.type !== "";
    if (step === 2) return data.from && data.to && data.size;
    if (step === 3) return true;
    if (step === 4) return data.name && data.email && data.ok;
    return false;
  };

  const next = () => {
    if (step < 4) setStep(step + 1);
    else navigate('/umzugsofferten-bestaetigung');
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* TRUST: Top Stats Bar */}
      <div className="flex items-center justify-center gap-6 mb-6 py-3 px-4 bg-muted/50 rounded-xl border border-border">
        {TRUST_STATS.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="flex items-center gap-2">
              <Icon className="w-4 h-4 text-primary" />
              <span className="font-bold text-foreground">{stat.value}</span>
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
          );
        })}
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>Schritt {step} von 4</span>
          <span>{step * 25}% abgeschlossen</span>
        </div>
        <Progress value={step * 25} className="h-2" />
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
        {/* TRUST: Verification Badge Header */}
        <div className="bg-gradient-to-r from-primary/10 to-transparent px-4 py-2 flex items-center gap-2 border-b border-border">
          <Shield className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium text-foreground">Schweizer Datenschutz</span>
          <Lock className="w-3 h-3 text-muted-foreground ml-auto" />
          <span className="text-xs text-muted-foreground">SSL verschlüsselt</span>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1 */}
          {step === 1 && (
            <motion.div
              key="s1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-6"
            >
              <div className="text-center mb-6">
                <Badge variant="outline" className="mb-2">
                  <CheckCircle className="w-3 h-3 mr-1" /> Geprüfte Firmen
                </Badge>
                <h2 className="text-xl font-bold">Was möchten Sie umziehen?</h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {MOVE_TYPES.map((t) => {
                  const Icon = t.icon;
                  const selected = data.type === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setData({ ...data, type: t.id })}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        selected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                      }`}
                    >
                      <Icon className={`w-8 h-8 mb-2 ${selected ? "text-primary" : "text-muted-foreground"}`} />
                      <span className="font-medium">{t.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* TRUST: Social Proof */}
              <div className="mt-6 p-3 bg-muted/50 rounded-lg flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1,2,3].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center text-xs font-bold text-primary">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  <strong>23 Personen</strong> haben heute Offerten angefragt
                </p>
              </div>
            </motion.div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <motion.div
              key="s2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-6"
            >
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold">Wohin geht es?</h2>
                <p className="text-sm text-muted-foreground">Start- und Zielort</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium block mb-2">Von</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        value={data.from}
                        onChange={(e) => setData({ ...data, from: e.target.value })}
                        placeholder="8000 Zürich"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-2">Nach</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                      <Input
                        value={data.to}
                        onChange={(e) => setData({ ...data, to: e.target.value })}
                        placeholder="3000 Bern"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2">Grösse</label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {APARTMENT_SIZES.map((s) => (
                      <button
                        key={s}
                        onClick={() => setData({ ...data, size: s })}
                        className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all ${
                          data.size === s ? "border-primary bg-primary/10 text-primary" : "border-border"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* TRUST: Partner Logos */}
              <div className="mt-6 pt-4 border-t border-border">
                <p className="text-xs text-center text-muted-foreground mb-2">Bekannt aus</p>
                <div className="flex justify-center gap-6 opacity-50">
                  {["SRF", "20min", "Blick"].map((name) => (
                    <span key={name} className="text-sm font-bold">{name}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Services */}
          {step === 3 && (
            <motion.div
              key="s3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-6"
            >
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold">Zusätzliche Services</h2>
                <p className="text-sm text-muted-foreground">Optional - kann übersprungen werden</p>
              </div>

              <div className="space-y-3">
                {[
                  { label: "Basis-Umzug", desc: "Transport inkl.", included: true },
                  { label: "Einpacken", desc: "Professionelles Packen", price: "ab CHF 300" },
                  { label: "Reinigung", desc: "Abgabereinigung", price: "ab CHF 250" },
                ].map((s, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-border">
                    <div>
                      <p className="font-medium">{s.label}</p>
                      <p className="text-xs text-muted-foreground">{s.desc}</p>
                    </div>
                    {s.included ? (
                      <Badge className="bg-green-100 text-green-700">Inklusive</Badge>
                    ) : (
                      <span className="text-sm text-muted-foreground">{s.price}</span>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 4: Contact */}
          {step === 4 && (
            <motion.div
              key="s4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-6"
            >
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold">Kontaktdaten</h2>
                <p className="text-sm text-muted-foreground">Für Ihre persönlichen Offerten</p>
              </div>

              <div className="space-y-4">
                <Input
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  placeholder="Ihr Name"
                />
                <Input
                  type="email"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  placeholder="Ihre E-Mail"
                />
                <Input
                  type="tel"
                  value={data.phone}
                  onChange={(e) => setData({ ...data, phone: e.target.value })}
                  placeholder="Telefon (optional)"
                />

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.ok}
                    onChange={(e) => setData({ ...data, ok: e.target.checked })}
                    className="mt-1"
                  />
                  <span className="text-xs text-muted-foreground">
                    Ich akzeptiere die{" "}
                    <Link
                      to="/datenschutz"
                      className="underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Datenschutzbestimmungen
                    </Link>
                  </span>
                </label>
              </div>

              {/* TRUST: Final Guarantee */}
              <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-green-700 dark:text-green-400">Unsere Garantie</span>
                </div>
                <p className="text-xs text-green-600 dark:text-green-400">
                  100% kostenlos • Keine Werbeanrufe • Jederzeit kündbar
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="p-4 border-t border-border bg-muted/30 flex items-center justify-between gap-4">
          {step > 1 ? (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück
            </Button>
          ) : <div />}
          
          <Button onClick={next} disabled={!canProceed()} size="lg" className="gap-2">
            {step === 4 ? "Jetzt Offerten erhalten" : "Weiter"}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
});

export default V2cTrustFocused;
