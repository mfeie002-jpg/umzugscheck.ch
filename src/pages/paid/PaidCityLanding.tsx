import React from "react";
import { Helmet } from "react-helmet-async";
import { PhoneCall, MessageCircle, FileText, Video, ShieldCheck, Timer, Star } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ExpressQuoteForm } from "@/components/ExpressQuoteForm";
import { FeierabendButton } from "@/components/ui/FeierabendButton";
import { FeierabendCard } from "@/components/ui/FeierabendCard";
import { TrustBadge } from "@/components/ui/TrustBadge";
import { useDynamicContent } from "@/hooks/usePaidMode";
import { track } from "@/utils/track";
import {
  CONTACT_PHONE_E164,
  CONTACT_PHONE_DISPLAY,
  CONTACT_WHATSAPP_LINK,
} from "@/config/contact";

type PaidCityLandingProps = {
  city: string;
  canonicalPath: string;
  localProof: string[];
  premiumNote?: string;
};

const EstimateCard = ({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) => (
  <FeierabendCard variant="default" className="p-5 border-feierabend-blue-100 bg-white">
    <div className="flex items-start gap-4">
      <div className="h-12 w-12 rounded-xl bg-feierabend-blue-50 flex items-center justify-center text-feierabend-blue-700">
        {icon}
      </div>
      <div>
        <p className="font-semibold text-feierabend-blue-900">{title}</p>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  </FeierabendCard>
);

const PaidCityLanding = ({ city, canonicalPath, localProof, premiumNote }: PaidCityLandingProps) => {
  const dynamic = useDynamicContent();
  const headline =
    dynamic.headline || `Ihr Umzug in ${city} - Jetzt in 5 Min. Termin sichern`;
  const subheadline =
    dynamic.subheadline || "Feierabend ab dem ersten Anruf - wir machen die Arbeit.";
  const ctaText = dynamic.ctaText || "Jetzt anrufen";

  const scrollToOffer = () => {
    const offerEl = document.getElementById("offer-form") || document.getElementById("quote-form");
    if (offerEl) {
      offerEl.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    window.location.href = "/contact";
  };

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{`Umzugsfirma ${city} | Feierabend Umzuege`}</title>
        <meta
          name="description"
          content={`Premium Umzug in ${city}. Live Umzugs-Concierge, Festpreise, Rueckruf in 5-10 Min.`}
        />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href={`https://feierabend-umzuege.ch${canonicalPath}`} />
      </Helmet>

      <Header />

      <main className="pb-12">
        <section className="relative overflow-hidden bg-gradient-to-br from-feierabend-blue-50 via-white to-white pt-16 pb-12 px-4">
          <div className="max-w-5xl mx-auto grid gap-8 lg:grid-cols-[1.05fr_0.95fr] items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-feierabend-blue-100 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-feierabend-blue-700">
                Live Umzugs-Concierge
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-feierabend-blue-950 leading-tight">
                {headline}
              </h1>
              <p className="text-lg text-gray-700">{subheadline}</p>
              {premiumNote && (
                <p className="text-sm text-feierabend-blue-700 font-semibold">{premiumNote}</p>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <FeierabendButton
                  variant="primary"
                  size="lg"
                  fullWidth
                  icon={<PhoneCall className="w-5 h-5" />}
                  onClick={() => {
                    track("cta_call_click", { location: "paid_hero", city });
                    window.location.href = `tel:${CONTACT_PHONE_E164}`;
                  }}
                >
                  {ctaText}
                </FeierabendButton>

                <FeierabendButton
                  variant="secondary"
                  size="lg"
                  fullWidth
                  icon={<MessageCircle className="w-5 h-5" />}
                  onClick={() => {
                    track("cta_whatsapp_click", { location: "paid_hero", city });
                    window.open(CONTACT_WHATSAPP_LINK, "_blank", "noopener,noreferrer");
                  }}
                >
                  WhatsApp starten
                </FeierabendButton>
              </div>

              <div className="flex items-center gap-3 text-sm text-feierabend-blue-800">
                <span className="inline-flex items-center gap-2">
                  <PhoneCall className="h-4 w-4" />
                  {CONTACT_PHONE_DISPLAY}
                </span>
                <span className="text-gray-400">|</span>
                <button
                  type="button"
                  onClick={() => {
                    track("cta_quote_click", { location: "paid_hero", city });
                    scrollToOffer();
                  }}
                  className="inline-flex items-center gap-2 text-feierabend-orange-600 font-semibold"
                >
                  <FileText className="h-4 w-4" />
                  Offerte starten
                </button>
              </div>
            </div>

            <FeierabendCard variant="premium" className="p-6 space-y-4 bg-white/90">
              <p className="text-xs uppercase tracking-[0.14em] text-feierabend-blue-600 font-semibold">
                Sofort-Check
              </p>
              <h2 className="text-2xl font-bold text-feierabend-blue-900">
                In 5-10 Minuten fix gebucht
              </h2>
              <p className="text-sm text-gray-600">
                Wir pruefen Termine, planen den Ablauf und sichern Ihnen den besten Slot.
              </p>
              <div className="space-y-3">
                <TrustBadge icon={<ShieldCheck className="w-4 h-4" />} text="CHF 2 Mio. versichert" />
                <TrustBadge icon={<Timer className="w-4 h-4" />} text="Rueckruf in 5-10 Min" variant="success" />
                <TrustBadge icon={<Star className="w-4 h-4" />} text="Familienbetrieb seit 1980" />
              </div>
            </FeierabendCard>
          </div>
        </section>

        <section className="py-12 px-4">
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold text-feierabend-blue-900">
                Ihre Offerte in dem Kanal, der Ihnen passt
              </h2>
              <p className="text-gray-600">
                Telefon, WhatsApp, Express-Form oder Video-Check - wir liefern sofort Klarheit.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <EstimateCard
                title="Telefon-Offerte (Live)"
                description="Direkt mit dem Concierge sprechen und Termin sichern."
                icon={<PhoneCall className="h-5 w-5" />}
              />
              <EstimateCard
                title="WhatsApp-Offerte"
                description="Schicken Sie uns Bilder, wir antworten sofort."
                icon={<MessageCircle className="h-5 w-5" />}
              />
              <EstimateCard
                title="Express-Form"
                description="2 Schritte, 30 Sekunden. Rueckruf in Minuten."
                icon={<FileText className="h-5 w-5" />}
              />
              <EstimateCard
                title="Video-Check (Premium)"
                description="Optionaler Live-Check fuer maximale Genauigkeit."
                icon={<Video className="h-5 w-5" />}
              />
            </div>
          </div>
        </section>

        <section className="py-12 px-4 bg-feierabend-blue-50/50">
          <div className="max-w-5xl mx-auto grid gap-8 lg:grid-cols-[0.9fr_1.1fr] items-start">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.14em] text-feierabend-blue-600 font-semibold">
                Local Proof
              </p>
              <h2 className="text-2xl font-bold text-feierabend-blue-900">
                Wir kennen {city} - bis ins Detail
              </h2>
              <ul className="space-y-3 text-sm text-gray-700">
                {localProof.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-feierabend-orange-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <FeierabendCard variant="premium" className="p-6">
              <ExpressQuoteForm formId="offer-form" />
            </FeierabendCard>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PaidCityLanding;
