import { useDynamicContent, usePaidMode } from "@/hooks/usePaidMode";
import { Phone, MessageSquare, ArrowRight, Star, Shield, Building2 } from "lucide-react";
import { track } from "@/utils/track";
import { FeierabendButton } from "@/components/ui/FeierabendButton";
import { TrustBadge } from "@/components/ui/TrustBadge";
import { CONTACT_PHONE_E164, CONTACT_WHATSAPP_LINK } from "@/config/contact";

type DynamicHeroProps = {
  defaultHeadline?: string;
  defaultSubheadline?: string;
  showTrustBadges?: boolean;
  ctaOnClick?: () => void;
  phoneE164?: string;
  whatsappLink?: string;
};

/**
 * Dynamic Hero Section with Paid Mode integration
 * Adapts headline and wording based on traffic source
 */
export function DynamicHero({
  defaultHeadline,
  defaultSubheadline,
  showTrustBadges = true,
  ctaOnClick,
  phoneE164 = CONTACT_PHONE_E164,
  whatsappLink = CONTACT_WHATSAPP_LINK,
}: DynamicHeroProps) {
  const dynamicContent = useDynamicContent();
  const { isPremiumMode, wording } = usePaidMode();

  const headline = defaultHeadline || dynamicContent.headline;
  const subheadline = defaultSubheadline || dynamicContent.subheadline;
  const ctaText = dynamicContent.ctaText;

  const handleCallClick = () => {
    track("cta_call_click", { location: "hero" });
    window.location.href = `tel:${phoneE164}`;
  };

  const handleWhatsAppClick = () => {
    track("cta_whatsapp_click", { location: "hero" });
    window.open(whatsappLink, "_blank", "noopener,noreferrer");
  };

  const handleQuoteClick = () => {
    track("cta_quote_click", { location: "hero" });
    if (ctaOnClick) {
      ctaOnClick();
      return;
    }
    const formEl = document.getElementById("quote-form");
    formEl?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative bg-gradient-to-br from-feierabend-blue-50 via-white to-white overflow-hidden">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-feierabend-blue-900 mb-4 md:mb-6 leading-tight animate-in fade-in slide-in-from-bottom duration-700">
            {headline}
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-gray-700 mb-6 md:mb-8 max-w-2xl animate-in fade-in slide-in-from-bottom duration-700 delay-100">
            {subheadline}
          </p>

          {/* Trust Badges */}
          {showTrustBadges && (
            <div className="flex flex-wrap gap-3 mb-6 md:mb-8 animate-in fade-in zoom-in-95 duration-700 delay-200">
              <TrustBadge 
                icon={<Star className="w-4 h-4" />}
                text="Google 5.0 ★★★★★"
                variant="success"
              />
              <TrustBadge 
                icon={<Building2 className="w-4 h-4" />}
                text="Seit 1980"
                variant="default"
              />
              <TrustBadge 
                icon={<Shield className="w-4 h-4" />}
                text="CHF 2 Mio. versichert"
                variant="success"
              />
              
              {/* Premium mode badge */}
              {isPremiumMode && (
                <TrustBadge 
                  icon={<Star className="w-4 h-4" />}
                  text="✨ Diskret • Full-Service"
                  variant="default"
                />
              )}
              
              {/* Empathetic mode badge */}
              {wording === 'empathetic' && (
                <TrustBadge 
                  icon={<Shield className="w-4 h-4" />}
                  text="Geduldig für Senioren"
                  variant="default"
                />
              )}
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 animate-in fade-in slide-in-from-bottom duration-700 delay-300">
            <FeierabendButton
              variant="primary"
              size="lg"
              icon={<Phone className="w-5 h-5" />}
              onClick={handleCallClick}
            >
              Jetzt anrufen
            </FeierabendButton>

            <FeierabendButton
              variant="secondary"
              size="lg"
              icon={<MessageSquare className="w-5 h-5" />}
              onClick={handleWhatsAppClick}
            >
              WhatsApp
            </FeierabendButton>

            <FeierabendButton
              variant="secondary"
              size="lg"
              icon={<ArrowRight className="w-5 h-5" />}
              onClick={handleQuoteClick}
            >
              {ctaText || "Offerte in 60 Sek"}
            </FeierabendButton>
          </div>

          {/* Micro-copy */}
          <p className="text-sm text-gray-600 mt-6 animate-in fade-in duration-700 delay-400">
            <strong className="text-feierabend-blue-700">In 5-10 Minuten fix gebucht</strong> - Live am Telefon oder WhatsApp
            <br />
            <span className="text-xs text-gray-500">
              Mo-Fr 08:00-19:00 Uhr - Sa 09:00-17:00 Uhr - 24/7 Rueckruf
            </span>
          </p>

          {/* Premium info box */}
          {isPremiumMode && (
            <div className="mt-6 p-4 bg-feierabend-blue-50 border border-feierabend-blue-200 rounded-xl animate-in fade-in zoom-in-95 duration-700 delay-500">
              <p className="text-sm text-feierabend-blue-700">
                <strong className="text-feierabend-blue-900">Premium Service:</strong> Diskrete
                Abwicklung, persönlicher Ansprechpartner, Full-Service inkl. Packing & Reinigung
              </p>
            </div>
          )}

          {/* Empathetic info box */}
          {wording === 'empathetic' && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl animate-in fade-in zoom-in-95 duration-700 delay-500">
              <p className="text-sm text-green-700">
                <strong className="text-green-900">Seniorenumzüge:</strong> Wir
                nehmen uns Zeit und kümmern uns um alle Details. Geduldig und einfühlsam.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
