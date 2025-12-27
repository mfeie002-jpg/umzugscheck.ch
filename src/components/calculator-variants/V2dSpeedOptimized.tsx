/**
 * V2.d - Speed Optimized (3-Step Flow)
 * 
 * Optimizations:
 * - Reduced to 3 steps (combined fields)
 * - Auto-advance on selection
 * - Minimal animations
 * - Inline validation
 * - Quick completion target: <60 seconds
 */

import { useState, memo, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Zap, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useInitialStep } from "@/hooks/use-initial-step";

const TYPES = [
  { id: "wohnung", emoji: "🏠", label: "Wohnung" },
  { id: "haus", emoji: "🏡", label: "Haus" },
  { id: "buero", emoji: "🏢", label: "Büro" },
];

const SIZES = [
  { id: "s", label: "1-2 Zi.", rooms: "klein" },
  { id: "m", label: "3-4 Zi.", rooms: "mittel" },
  { id: "l", label: "5+ Zi.", rooms: "gross" },
];

export const V2dSpeedOptimized = memo(function V2dSpeedOptimized() {
  const navigate = useNavigate();
  const initialStep = useInitialStep(1);
  const [step, setStep] = useState(initialStep);
  const [data, setData] = useState({
    type: "",
    size: "",
    from: "",
    to: "",
    name: "",
    email: "",
    ok: false,
  });
  const [timer, setTimer] = useState(0);

  // Timer for gamification
  useEffect(() => {
    const interval = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto-advance after type selection
  useEffect(() => {
    if (step === 1 && data.type && data.size) {
      const timeout = setTimeout(() => setStep(2), 300);
      return () => clearTimeout(timeout);
    }
  }, [data.type, data.size, step]);

  const canProceed = () => {
    if (step === 1) return data.type && data.size;
    if (step === 2) return data.from && data.to;
    if (step === 3) return data.name && data.email && data.ok;
    return false;
  };

  const next = () => {
    if (step < 3) setStep(step + 1);
    else navigate('/umzugsofferten-bestaetigung');
  };

  const formatTime = (s: number) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Speed Indicator */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2 text-primary">
          <Zap className="w-4 h-4" />
          <span className="text-sm font-medium">Speed-Modus</span>
        </div>
        <div className="text-sm text-muted-foreground">
          ⏱️ {formatTime(timer)}
        </div>
      </div>

      {/* Minimal Progress */}
      <div className="flex gap-1 mb-6">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-1 flex-1 rounded-full transition-all ${
              s <= step ? "bg-primary" : "bg-border"
            }`}
          />
        ))}
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
        {/* Step 1: Type + Size Combined */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6"
          >
            <h2 className="text-xl font-bold text-center mb-4">
              Was & wie gross?
            </h2>

            {/* Type Selection */}
            <div className="flex gap-2 mb-4">
              {TYPES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setData({ ...data, type: t.id })}
                  className={`flex-1 p-3 rounded-xl border-2 text-center transition-all ${
                    data.type === t.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <span className="text-2xl block">{t.emoji}</span>
                  <span className="text-sm font-medium">{t.label}</span>
                </button>
              ))}
            </div>

            {/* Size Selection */}
            <div className="flex gap-2">
              {SIZES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setData({ ...data, size: s.id })}
                  className={`flex-1 py-3 px-4 rounded-xl border-2 text-center transition-all ${
                    data.size === s.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <span className="font-medium">{s.label}</span>
                </button>
              ))}
            </div>

            {data.type && data.size && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center gap-2"
              >
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-700 dark:text-green-400">
                  Perfekt! Weiter geht's...
                </span>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Step 2: Locations */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6"
          >
            <h2 className="text-xl font-bold text-center mb-4">
              Von → Nach
            </h2>

            <div className="flex items-center gap-2">
              <Input
                value={data.from}
                onChange={(e) => setData({ ...data, from: e.target.value })}
                placeholder="Von PLZ"
                className="text-center text-lg h-14"
                autoFocus
              />
              <span className="text-2xl">→</span>
              <Input
                value={data.to}
                onChange={(e) => setData({ ...data, to: e.target.value })}
                placeholder="Nach PLZ"
                className="text-center text-lg h-14"
              />
            </div>

            <p className="text-xs text-center text-muted-foreground mt-3">
              Nur PLZ eingeben – Orte werden automatisch erkannt
            </p>
          </motion.div>
        )}

        {/* Step 3: Contact - Minimal */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6"
          >
            <h2 className="text-xl font-bold text-center mb-4">
              📧 Wohin die Offerten?
            </h2>

            <div className="space-y-3">
              <Input
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                placeholder="Name"
                className="h-12"
                autoFocus
              />
              <Input
                type="email"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                placeholder="E-Mail"
                className="h-12"
              />

              <label className="flex items-center gap-3 cursor-pointer p-3 bg-muted/50 rounded-lg">
                <input
                  type="checkbox"
                  checked={data.ok}
                  onChange={(e) => setData({ ...data, ok: e.target.checked })}
                  className="w-5 h-5"
                />
                <span className="text-sm">Datenschutz OK ✓</span>
              </label>
            </div>

            {timer < 60 && (
              <div className="mt-4 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-center">
                <span className="text-sm text-yellow-700 dark:text-yellow-400">
                  🏆 Unter 1 Minute! Du bist schnell!
                </span>
              </div>
            )}
          </motion.div>
        )}

        {/* Navigation */}
        <div className="p-4 border-t border-border bg-muted/30 flex gap-3">
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
          
          <Button
            onClick={next}
            disabled={!canProceed()}
            size="lg"
            className={`gap-2 ${step === 1 ? "w-full" : "flex-1"}`}
          >
            {step === 3 ? "🚀 Fertig!" : "Weiter"}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
});

export default V2dSpeedOptimized;
