import { ArrowRight, Calendar, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { track } from "@/utils/track";
import { FeierabendButton } from "@/components/ui/FeierabendButton";
import { CONTACT_PHONE_E164, CONTACT_WHATSAPP_LINK } from "@/config/contact";

export function HeroRebrand() {
  const [formState, setFormState] = useState({ from: "", to: "", date: "" });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    track("form_started", { form_type: "quick_quote", from: formState.from, to: formState.to });
  };

  return (
    <section className="relative isolate overflow-hidden bg-surface-canvas pt-24 pb-16" id="hero">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 via-surface-highlight to-brand-secondary/5" />
      <div className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-brand-primary/10 blur-3xl" />
      <div className="absolute -right-40 bottom-0 h-80 w-80 rounded-full bg-brand-secondary/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 grid lg:grid-cols-[1.1fr,0.9fr] gap-10 items-center">
        <div className="space-y-6">
          <p className="inline-flex items-center gap-2 rounded-full bg-surface-highlight px-3 py-1 text-xs font-semibold text-text-link">
            Clinical Precision • Signal Orange Actions
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight text-text-heading">
            Move with Swiss Precision.
            <span className="block text-brand-primary">Booked in minutes.</span>
          </h1>
          <p className="text-lg text-text-main max-w-2xl">
            Inspired by 0123 hygiene standards, engineered with Swiss Neo-Teal clarity. Book an express move with trained staff and clinical-grade care.
          </p>

          <div className="flex flex-wrap gap-3 text-sm text-text-main" id="trust">
            {[
              "Hygiene-certified crews",
              "Fixed pricing, no surprises",
              "Clinical-grade packing protocol",
            ].map((item) => (
              <div key={item} className="inline-flex items-center gap-2 rounded-full bg-surface-highlight px-3 py-2 border border-line-default">
                <span className="h-2 w-2 rounded-full bg-brand-secondary" />
                {item}
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <FeierabendButton
              variant="primary"
              size="lg"
              className="w-full sm:w-auto"
              icon={<Phone className="h-5 w-5" />}
              onClick={() => {
                track("cta_call_click", { location: "hero_rebrand" });
                window.location.href = `tel:${CONTACT_PHONE_E164}`;
              }}
            >
              Jetzt anrufen
            </FeierabendButton>
            <FeierabendButton
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
              icon={<ArrowRight className="h-5 w-5" />}
              onClick={() => {
                const el = document.getElementById("quick-quote");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Offerte anzeigen
            </FeierabendButton>
            <FeierabendButton
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
              icon={<ArrowRight className="h-5 w-5" />}
              onClick={() => {
                track("cta_whatsapp_click", { location: "hero_rebrand" });
                window.open(CONTACT_WHATSAPP_LINK, "_blank", "noopener,noreferrer");
              }}
            >
              WhatsApp
            </FeierabendButton>
          </div>
        </div>

        <form
          id="quick-quote"
          onSubmit={handleSubmit}
          className="relative rounded-2xl border border-line-default bg-white/80 backdrop-blur shadow-soft p-6 space-y-5"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-brand-secondary uppercase tracking-[0.08em]">Express Quote</p>
              <p className="text-base font-semibold text-text-heading">Response in 5-10 minutes</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold">24/7</div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-heading" htmlFor="from">From (PLZ)</label>
            <div className="flex items-center gap-2 rounded-xl border border-line-default bg-white px-3 py-2">
              <MapPin className="h-4 w-4 text-brand-primary" />
              <input
                id="from"
                name="from"
                value={formState.from}
                onChange={(e) => setFormState((prev) => ({ ...prev, from: e.target.value }))}
                placeholder="8000"
                className="w-full bg-transparent outline-none text-sm"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-heading" htmlFor="to">To (PLZ)</label>
            <div className="flex items-center gap-2 rounded-xl border border-line-default bg-white px-3 py-2">
              <MapPin className="h-4 w-4 text-brand-primary" />
              <input
                id="to"
                name="to"
                value={formState.to}
                onChange={(e) => setFormState((prev) => ({ ...prev, to: e.target.value }))}
                placeholder="6300"
                className="w-full bg-transparent outline-none text-sm"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-heading" htmlFor="date">Move date</label>
            <div className="flex items-center gap-2 rounded-xl border border-line-default bg-white px-3 py-2">
              <Calendar className="h-4 w-4 text-brand-primary" />
              <input
                id="date"
                name="date"
                type="date"
                value={formState.date}
                onChange={(e) => setFormState((prev) => ({ ...prev, date: e.target.value }))}
                className="w-full bg-transparent outline-none text-sm"
              />
            </div>
          </div>

          <FeierabendButton type="submit" variant="primary" size="lg" fullWidth icon={<ArrowRight className="h-5 w-5" />}>
            Get express quote
          </FeierabendButton>

          <p className="text-xs text-text-main/80">
            Clinical handling • Hygiene-first crews • Fixed price confirmation on callback.
          </p>
        </form>
      </div>
    </section>
  );
}
