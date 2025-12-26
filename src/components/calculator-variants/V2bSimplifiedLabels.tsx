/**
 * V2.b - Simplified Labels & Reduced Cognitive Load
 * 
 * Optimizations:
 * - Shorter, clearer labels
 * - Larger touch targets
 * - Emoji icons for visual clarity
 * - Simplified form fields
 * - Reduced text density
 */

import { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

const MOVE_TYPES = [
  { id: "wohnung", emoji: "🏠", label: "Wohnung" },
  { id: "haus", emoji: "🏡", label: "Haus" },
  { id: "buero", emoji: "🏢", label: "Büro" },
  { id: "andere", emoji: "📦", label: "Andere" },
];

const SIZES = [
  { value: "klein", emoji: "📦", label: "Klein", desc: "Studio/1-2 Zi." },
  { value: "mittel", emoji: "📦📦", label: "Mittel", desc: "3-4 Zimmer" },
  { value: "gross", emoji: "📦📦📦", label: "Gross", desc: "5+ Zimmer" },
];

export const V2bSimplifiedLabels = memo(function V2bSimplifiedLabels() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    type: "",
    from: "",
    to: "",
    size: "",
    name: "",
    email: "",
    ok: false,
  });

  const canGo = () => {
    if (step === 1) return data.type !== "";
    if (step === 2) return data.from && data.to && data.size;
    if (step === 3) return data.name && data.email && data.ok;
    return false;
  };

  const next = () => {
    if (step < 3) setStep(step + 1);
    else navigate('/umzugsofferten-bestaetigung');
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Super Simple Progress */}
      <div className="flex justify-center gap-2 mb-6">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`w-3 h-3 rounded-full transition-all ${
              s <= step ? "bg-primary scale-110" : "bg-border"
            }`}
          />
        ))}
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
        <AnimatePresence mode="wait">
          {/* Step 1: Type - Large Emoji Buttons */}
          {step === 1 && (
            <motion.div
              key="s1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-6"
            >
              <h2 className="text-2xl font-bold text-center mb-2">
                Was ziehst du um?
              </h2>
              <p className="text-center text-muted-foreground mb-6 text-sm">
                Wähle eine Option
              </p>

              <div className="grid grid-cols-2 gap-4">
                {MOVE_TYPES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setData({ ...data, type: t.id })}
                    className={`p-6 rounded-2xl border-2 text-center transition-all ${
                      data.type === t.id
                        ? "border-primary bg-primary/10 scale-105"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <span className="text-4xl block mb-2">{t.emoji}</span>
                    <span className="font-semibold">{t.label}</span>
                  </button>
                ))}
              </div>

              <p className="text-center text-xs text-muted-foreground mt-6 flex items-center justify-center gap-1">
                <Shield className="w-3 h-3" /> Kostenlos & unverbindlich
              </p>
            </motion.div>
          )}

          {/* Step 2: Where + Size */}
          {step === 2 && (
            <motion.div
              key="s2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-6"
            >
              <h2 className="text-2xl font-bold text-center mb-6">
                Wohin?
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium block mb-1">Von</label>
                    <Input
                      value={data.from}
                      onChange={(e) => setData({ ...data, from: e.target.value })}
                      placeholder="8000"
                      className="text-center text-lg h-12"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">Nach</label>
                    <Input
                      value={data.to}
                      onChange={(e) => setData({ ...data, to: e.target.value })}
                      placeholder="3000"
                      className="text-center text-lg h-12"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2">Grösse</label>
                  <div className="grid grid-cols-3 gap-2">
                    {SIZES.map((s) => (
                      <button
                        key={s.value}
                        onClick={() => setData({ ...data, size: s.value })}
                        className={`p-4 rounded-xl border-2 text-center transition-all ${
                          data.size === s.value
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <span className="text-xl block">{s.emoji}</span>
                        <span className="font-medium text-sm">{s.label}</span>
                        <span className="text-xs text-muted-foreground block">{s.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Contact - Minimal */}
          {step === 3 && (
            <motion.div
              key="s3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-6"
            >
              <h2 className="text-2xl font-bold text-center mb-2">
                Fast fertig! ✨
              </h2>
              <p className="text-center text-muted-foreground mb-6 text-sm">
                Wohin sollen die Offerten?
              </p>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-1">Name</label>
                  <Input
                    value={data.name}
                    onChange={(e) => setData({ ...data, name: e.target.value })}
                    placeholder="Dein Name"
                    className="h-12 text-lg"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">E-Mail</label>
                  <Input
                    type="email"
                    value={data.email}
                    onChange={(e) => setData({ ...data, email: e.target.value })}
                    placeholder="deine@email.ch"
                    className="h-12 text-lg"
                  />
                </div>

                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg bg-muted/50">
                  <input
                    type="checkbox"
                    checked={data.ok}
                    onChange={(e) => setData({ ...data, ok: e.target.checked })}
                    className="w-5 h-5"
                  />
                  <span className="text-sm">
                    Datenschutz akzeptiert ✓
                  </span>
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation - Large Buttons */}
        <div className="p-4 border-t border-border bg-muted/30 flex gap-3">
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(step - 1)} size="lg" className="flex-1">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück
            </Button>
          )}
          
          <Button
            onClick={next}
            disabled={!canGo()}
            size="lg"
            className={`gap-2 ${step === 1 ? "w-full" : "flex-1"}`}
          >
            {step === 3 ? "🎉 Offerten holen" : "Weiter"}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
});

export default V2bSimplifiedLabels;
