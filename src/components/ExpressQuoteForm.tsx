import { useState, type FormEvent } from "react";
import { Phone, MessageCircle, ShieldCheck, Timer, Sparkles, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { track } from "@/utils/track";
import { FeierabendCard } from "@/components/ui/FeierabendCard";
import { FeierabendButton } from "@/components/ui/FeierabendButton";
import { TrustBadge } from "@/components/ui/TrustBadge";
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
 * Uses the new Feierabend design system and highlights trust + hotline reachability
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
    if (!/^[0-9+\s]{8,}$/.test(formData.phone.trim())) return "Telefonnummer pruefen (nur Ziffern).";
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
      alert("Danke! Wir rufen Sie in wenigen Minuten zurueck.");
    } catch (error) {
      console.error("Form submission error:", error);
      setError("Ein Fehler ist aufgetreten. Bitte rufen Sie uns direkt an.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const StepBadge = ({ active, label }: { active: boolean; label: string }) => (
    <div className="flex items-center gap-2">
      <div
        className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-semibold ${
          active ? "bg-feierabend-blue-700 text-white" : "bg-gray-100 text-gray-500"
        }`}
      >
        {label}
      </div>
      <span className={`text-sm font-medium ${active ? "text-feierabend-blue-800" : "text-gray-500"}`}>
        {label === "1" ? "Verfuegbarkeit" : "Rueckruf"}
      </span>
    </div>
  );

  return (
    <FeierabendCard
      variant="premium"
      className="w-full max-w-4xl mx-auto p-6 md:p-8 space-y-6 bg-gradient-to-br from-white via-feierabend-blue-50/50 to-white"
      id={formId ?? "quote-form"}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.08em] text-feierabend-orange-600 font-semibold">Express Offerte</p>
          <h2 className="text-2xl md:text-3xl font-bold text-feierabend-blue-900 leading-tight">
            In 5-10 Minuten fix gebucht am Telefon
          </h2>
          <p className="text-sm text-gray-600 max-w-2xl">
            Wir rufen Sie sofort zurueck, pruefen Termine und sichern Ihnen den besten Slot. 24/7 Rueckruf - Live 08:00-19:00 Uhr.
          </p>
        </div>

        <div className="hidden md:flex flex-col gap-2 text-right">
          <TrustBadge icon={<ShieldCheck className="w-4 h-4" />} text="CHF 2 Mio. versichert" />
          <TrustBadge icon={<Timer className="w-4 h-4" />} text="Rueckruf in 5-10 Min" variant="success" />
          <TrustBadge icon={<Sparkles className="w-4 h-4" />} text="Seit 1980" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <StepBadge active label="1" />
        <div className={`flex-1 h-0.5 ${step === 2 ? "bg-feierabend-blue-200" : "bg-gray-200"}`} />
        <StepBadge active={step === 2} label="2" />
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {step === 1 ? (
        <form onSubmit={handleStep1Submit} className="space-y-5">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-semibold text-feierabend-blue-900">Telefonnummer *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+41 76 568 13 02"
                value={formData.phone}
                onChange={(event) => setFormData({ ...formData, phone: event.target.value })}
                required
                autoFocus
                className="h-12 rounded-xl border-feierabend-blue-200 focus-visible:ring-feierabend-orange-500"
              />
              <p className="text-xs text-gray-500">Wir rufen Sie in 5-10 Minuten zurueck.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="startPlz" className="text-sm font-semibold text-feierabend-blue-900">Von PLZ *</Label>
                <Input
                  id="startPlz"
                  type="text"
                  placeholder="8000"
                  maxLength={4}
                  inputMode="numeric"
                  value={formData.startPlz}
                  onChange={(event) => setFormData({ ...formData, startPlz: event.target.value.replace(/[^0-9]/g, "") })}
                  required
                  className="h-12 rounded-xl border-feierabend-blue-200 focus-visible:ring-feierabend-orange-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endPlz" className="text-sm font-semibold text-feierabend-blue-900">Nach PLZ *</Label>
                <Input
                  id="endPlz"
                  type="text"
                  placeholder="6300"
                  maxLength={4}
                  inputMode="numeric"
                  value={formData.endPlz}
                  onChange={(event) => setFormData({ ...formData, endPlz: event.target.value.replace(/[^0-9]/g, "") })}
                  required
                  className="h-12 rounded-xl border-feierabend-blue-200 focus-visible:ring-feierabend-orange-500"
                />
              </div>
            </div>
          </div>

          <FeierabendButton type="submit" variant="primary" size="lg" fullWidth icon={<ArrowRight className="w-5 h-5" />}>
            Verfuegbarkeit pruefen & Rueckruf erhalten
          </FeierabendButton>

          <div className="grid sm:grid-cols-3 gap-3 text-sm text-gray-600">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-white border border-feierabend-blue-100">
              <Timer className="h-4 w-4 text-feierabend-blue-600" />
              <span>Rueckruf in 5-10 Min</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-white border border-feierabend-blue-100">
              <ShieldCheck className="h-4 w-4 text-green-600" />
              <span>Versichert bis CHF 2 Mio.</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-white border border-feierabend-blue-100">
              <Sparkles className="h-4 w-4 text-feierabend-orange-600" />
              <span>Seit 1980 in CH</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <FeierabendButton
              type="button"
              variant="secondary"
              size="md"
              fullWidth
              icon={<Phone className="w-4 h-4" />}
              onClick={() => {
                track("cta_call_click", { location: "express_quote_form" });
                window.location.href = `tel:${CONTACT_PHONE_E164}`;
              }}
            >
              Direkt anrufen
            </FeierabendButton>

            <FeierabendButton
              type="button"
              variant="secondary"
              size="md"
              fullWidth
              icon={<MessageCircle className="w-4 h-4" />}
              onClick={() => {
                track("cta_whatsapp_click", { location: "express_quote_form" });
                window.open(CONTACT_WHATSAPP_LINK, "_blank", "noopener,noreferrer");
              }}
            >
              WhatsApp starten
            </FeierabendButton>
          </div>
        </form>
      ) : (
        <form onSubmit={handleStep2Submit} className="space-y-5">
          <div className="bg-white border border-feierabend-blue-100 rounded-xl p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.08em] text-feierabend-blue-600 font-semibold">Ihre Angaben</p>
                <p className="text-sm text-gray-600">Pruefen Sie kurz die Details.</p>
              </div>
              <FeierabendButton
                type="button"
                variant="text"
                size="sm"
                onClick={() => setStep(1)}
                className="text-feierabend-blue-700 hover:text-feierabend-blue-900"
              >
                Angaben anpassen
              </FeierabendButton>
            </div>

            <div className="grid sm:grid-cols-3 gap-3 text-sm text-gray-700">
              <div className="p-3 rounded-lg bg-feierabend-blue-50/60 border border-feierabend-blue-100">
                <p className="text-xs text-gray-500">Telefon</p>
                <p className="font-semibold text-feierabend-blue-900">{formData.phone}</p>
              </div>
              <div className="p-3 rounded-lg bg-feierabend-blue-50/60 border border-feierabend-blue-100">
                <p className="text-xs text-gray-500">Von</p>
                <p className="font-semibold text-feierabend-blue-900">{formData.startPlz}</p>
              </div>
              <div className="p-3 rounded-lg bg-feierabend-blue-50/60 border border-feierabend-blue-100">
                <p className="text-xs text-gray-500">Nach</p>
                <p className="font-semibold text-feierabend-blue-900">{formData.endPlz}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="moveDate" className="text-sm font-semibold text-feierabend-blue-900">Wunsch-Umzugstermin (optional)</Label>
            <Input
              id="moveDate"
              type="date"
              value={formData.moveDate}
              onChange={(event) => setFormData({ ...formData, moveDate: event.target.value })}
              min={new Date().toISOString().split("T")[0]}
              className="h-12 rounded-xl border-feierabend-blue-200 focus-visible:ring-feierabend-orange-500"
            />
            <p className="text-xs text-gray-500">Wir priorisieren Ihren Termin und bestaetigen sofort.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note" className="text-sm font-semibold text-feierabend-blue-900">Notiz (optional)</Label>
            <Textarea
              id="note"
              placeholder="z.B. 3. Stock ohne Lift, fragile Moebel, Parkplatz"
              value={formData.note}
              onChange={(event) => setFormData({ ...formData, note: event.target.value })}
              className="rounded-xl border-feierabend-blue-200 focus-visible:ring-feierabend-orange-500"
            />
            <p className="text-xs text-gray-500">Hilft uns, den Rueckruf schneller vorzubereiten.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <FeierabendButton
              type="button"
              variant="secondary"
              size="md"
              fullWidth
              onClick={() => setStep(1)}
            >
              Zurueck
            </FeierabendButton>
            <FeierabendButton
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isSubmitting}
              icon={!isSubmitting ? <ArrowRight className="w-5 h-5" /> : undefined}
            >
              {isSubmitting ? "Wird gesendet..." : "Jetzt Rueckruf erhalten"}
            </FeierabendButton>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 text-xs text-gray-600">
            <div className="p-3 rounded-xl bg-feierabend-blue-50/60 border border-feierabend-blue-100">
              Live Hotline: 08:00-19:00 Uhr / Rueckruf 24/7
            </div>
            <div className="p-3 rounded-xl bg-feierabend-blue-50/60 border border-feierabend-blue-100">
              Keine Vorkasse. Gratis Stornierung bis 72h vor Termin.
            </div>
          </div>
        </form>
      )}
    </FeierabendCard>
  );
}
