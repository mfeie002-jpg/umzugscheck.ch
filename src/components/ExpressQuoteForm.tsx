import { useState, type FormEvent } from "react";
import { Phone, MessageCircle, ShieldCheck, Timer, Sparkles, ArrowRight, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { track } from "@/utils/track";
import { CONTACT_PHONE_E164, CONTACT_WHATSAPP_LINK } from "@/config/contact";

type ExpressQuoteFormProps = {
  onComplete?: (data: ExpressFormData) => void;
  formId?: string;
};

type ExpressFormData = {
  phone: string;
  startPlz: string;
  endPlz: string;
  moveDate?: string;
  note?: string;
};

/**
 * Express Quote Form for Paid Traffic (speed-to-lead)
 * Uses Umzugscheck.ch design system with semantic tokens
 * Mobile-first optimized with proper touch targets
 */
export function ExpressQuoteForm({ onComplete, formId }: ExpressQuoteFormProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState<ExpressFormData>({
    phone: "",
    startPlz: "",
    endPlz: "",
    moveDate: "",
    note: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateStep1 = () => {
    if (!formData.phone.trim()) return "Bitte Telefonnummer eintragen.";
    if (!/^[0-9+\s]{8,}$/.test(formData.phone.trim())) return "Telefonnummer prüfen (nur Ziffern).";
    if (!/^[0-9]{4}$/.test(formData.startPlz)) return "Von PLZ muss 4 Ziffern haben.";
    if (!/^[0-9]{4}$/.test(formData.endPlz)) return "Nach PLZ muss 4 Ziffern haben.";
    return null;
  };

  const handleStep1Submit = (event: FormEvent) => {
    event.preventDefault();
    const validationError = validateStep1();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);

    track("quote_start", {
      form_type: "express_quote",
      start_plz: formData.startPlz,
      end_plz: formData.endPlz,
      location: "express_quote_form",
    });

    track("quote_step1_submit", {
      form_type: "express_quote",
      start_plz: formData.startPlz,
      end_plz: formData.endPlz,
      location: "express_quote_form",
    });

    setStep(2);
  };

  const handleStep2Submit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 900));

      track("quote_submit", {
        form_type: "express_quote",
        start_plz: formData.startPlz,
        end_plz: formData.endPlz,
        move_date: formData.moveDate || "unspecified",
        note: formData.note || "none",
        location: "express_quote_form",
      });

      onComplete?.(formData);
      alert("Danke! Wir melden uns in wenigen Minuten.");
    } catch (error) {
      console.error("Form submission error:", error);
      setError("Ein Fehler ist aufgetreten. Bitte rufen Sie uns direkt an.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const StepBadge = ({ active, stepNum }: { active: boolean; stepNum: 1 | 2 }) => (
    <div className="flex items-center gap-2">
      <div
        className={`h-10 w-10 min-w-[40px] rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
          active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
        }`}
      >
        {stepNum}
      </div>
      <span className={`text-sm font-medium hidden sm:inline ${active ? "text-foreground" : "text-muted-foreground"}`}>
        {stepNum === 1 ? "Verfügbarkeit" : "Rückruf"}
      </span>
    </div>
  );

  return (
    <Card
      className="w-full max-w-4xl mx-auto p-4 sm:p-6 md:p-8 space-y-5 bg-card border-border"
      id={formId ?? "quote-form"}
    >
      {/* Header */}
      <div className="flex flex-col gap-3">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-primary font-semibold">Express Offerte</p>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground leading-tight">
            Gratis Offerten in wenigen Minuten
          </h2>
          <p className="text-sm text-muted-foreground">
            Füllen Sie das Formular aus und erhalten Sie bis zu 3 unverbindliche Angebote von geprüften Umzugsfirmen.
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-3 sm:gap-4">
        <StepBadge active stepNum={1} />
        <div className={`flex-1 h-1 rounded-full ${step === 2 ? "bg-primary/30" : "bg-muted"}`} />
        <StepBadge active={step === 2} stepNum={2} />
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 text-destructive px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {step === 1 ? (
        <form onSubmit={handleStep1Submit} className="space-y-5">
          {/* Form Fields - Mobile Optimized */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-semibold text-foreground">
                Telefonnummer *
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+41 44 567 89 00"
                value={formData.phone}
                onChange={(event) => setFormData({ ...formData, phone: event.target.value })}
                required
                autoFocus
                autoComplete="tel"
                className="h-12 sm:h-14 text-base rounded-lg border-border focus-visible:ring-primary"
              />
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Kein Spam – nur für Ihre Offerte
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="startPlz" className="text-sm font-semibold text-foreground">
                  Von PLZ *
                </Label>
                <Input
                  id="startPlz"
                  type="text"
                  placeholder="8000"
                  maxLength={4}
                  inputMode="numeric"
                  autoComplete="postal-code"
                  value={formData.startPlz}
                  onChange={(event) => setFormData({ ...formData, startPlz: event.target.value.replace(/[^0-9]/g, "") })}
                  required
                  className="h-12 sm:h-14 text-base rounded-lg border-border focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endPlz" className="text-sm font-semibold text-foreground">
                  Nach PLZ *
                </Label>
                <Input
                  id="endPlz"
                  type="text"
                  placeholder="6300"
                  maxLength={4}
                  inputMode="numeric"
                  value={formData.endPlz}
                  onChange={(event) => setFormData({ ...formData, endPlz: event.target.value.replace(/[^0-9]/g, "") })}
                  required
                  className="h-12 sm:h-14 text-base rounded-lg border-border focus-visible:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Primary CTA - Large Touch Target */}
          <Button 
            type="submit" 
            size="lg" 
            className="w-full h-14 text-base font-semibold rounded-lg"
          >
            Offerten vergleichen
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>

          {/* Trust Badges - Mobile Optimized Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border">
              <CheckCircle className="h-4 w-4 text-primary shrink-0" />
              <span className="text-foreground">100% kostenlos</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border">
              <Timer className="h-4 w-4 text-primary shrink-0" />
              <span className="text-foreground">Antwort in Minuten</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border">
              <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
              <span className="text-foreground">Geprüfte Partner</span>
            </div>
          </div>

          {/* Alternative CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="flex-1 h-12 rounded-lg"
              onClick={() => {
                track("cta_call_click", { location: "express_quote_form" });
                window.location.href = `tel:${CONTACT_PHONE_E164}`;
              }}
            >
              <Phone className="w-4 h-4 mr-2" />
              Direkt anrufen
            </Button>

            <Button
              type="button"
              variant="outline"
              size="lg"
              className="flex-1 h-12 rounded-lg"
              onClick={() => {
                track("cta_whatsapp_click", { location: "express_quote_form" });
                window.open(CONTACT_WHATSAPP_LINK, "_blank", "noopener,noreferrer");
              }}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp
            </Button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleStep2Submit} className="space-y-5">
          {/* Summary Card */}
          <div className="bg-muted/30 border border-border rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-primary font-semibold">Ihre Angaben</p>
                <p className="text-sm text-muted-foreground">Prüfen Sie kurz die Details.</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setStep(1)}
                className="text-primary hover:text-primary/80"
              >
                Ändern
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="p-3 rounded-lg bg-background border border-border">
                <p className="text-xs text-muted-foreground">Telefon</p>
                <p className="font-semibold text-foreground truncate">{formData.phone}</p>
              </div>
              <div className="p-3 rounded-lg bg-background border border-border">
                <p className="text-xs text-muted-foreground">Von</p>
                <p className="font-semibold text-foreground">{formData.startPlz}</p>
              </div>
              <div className="p-3 rounded-lg bg-background border border-border">
                <p className="text-xs text-muted-foreground">Nach</p>
                <p className="font-semibold text-foreground">{formData.endPlz}</p>
              </div>
            </div>
          </div>

          {/* Optional Fields */}
          <div className="space-y-2">
            <Label htmlFor="moveDate" className="text-sm font-semibold text-foreground">
              Wunsch-Umzugstermin (optional)
            </Label>
            <Input
              id="moveDate"
              type="date"
              value={formData.moveDate}
              onChange={(event) => setFormData({ ...formData, moveDate: event.target.value })}
              min={new Date().toISOString().split("T")[0]}
              className="h-12 sm:h-14 text-base rounded-lg border-border focus-visible:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="note" className="text-sm font-semibold text-foreground">
              Notiz (optional)
            </Label>
            <Textarea
              id="note"
              placeholder="z.B. 3. Stock ohne Lift, fragile Möbel..."
              value={formData.note}
              onChange={(event) => setFormData({ ...formData, note: event.target.value })}
              className="min-h-[80px] rounded-lg border-border focus-visible:ring-primary"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="sm:flex-1 h-12 rounded-lg order-2 sm:order-1"
              onClick={() => setStep(1)}
            >
              Zurück
            </Button>
            <Button
              type="submit"
              size="lg"
              className="sm:flex-[2] h-14 text-base font-semibold rounded-lg order-1 sm:order-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                "Wird gesendet..."
              ) : (
                <>
                  Jetzt Offerten erhalten
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </div>

          {/* Info Footer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div className="p-3 rounded-lg bg-muted/30 border border-border">
              Hotline: Mo–Fr 08:00–18:00 Uhr
            </div>
            <div className="p-3 rounded-lg bg-muted/30 border border-border">
              100% kostenlos & unverbindlich
            </div>
          </div>
        </form>
      )}
    </Card>
  );
}
