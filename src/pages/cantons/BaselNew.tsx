import { CantonTemplate } from "@/components/canton/CantonTemplate";
import { baselConfig } from "@/config/cantonConfigs";
import {
  CantonUrgencyBanner,
  CantonBreadcrumb,
  CantonTrustSignals,
  CantonStatsCounter,
  CantonCompanyFilters,
  CantonServiceComparison,
  CantonVideoSection,
  CantonReviewsShowcase,
  CantonInteractiveMap,
  CantonWeatherWidget,
  CantonPriceCalculatorMini,
  CantonMovingTips,
  CantonQuickActions,
  CantonChecklist,
  CantonNewsletter,
  CantonTestimonials,
  CantonSocialProof,
  CantonPartnersSection,
  CantonContactSection,
  CantonRelatedServices,
} from "@/components/canton/shared";

const baselDistricts = [
  { name: "Basel-Stadt", companies: 28, avgPrice: "CHF 1'250", popular: true },
  { name: "Riehen", companies: 12, avgPrice: "CHF 1'150", popular: false },
  { name: "Binningen", companies: 15, avgPrice: "CHF 1'100", popular: true },
  { name: "Allschwil", companies: 10, avgPrice: "CHF 1'050", popular: false },
  { name: "Muttenz", companies: 14, avgPrice: "CHF 1'000", popular: false },
  { name: "Liestal", companies: 11, avgPrice: "CHF 950", popular: false },
];

const baselReviews = [
  { name: "Hans M.", location: "Basel", rating: 5, text: "Professioneller Umzug von Basel nach Riehen. Sehr zufrieden!", company: "Basel Umzüge AG", verified: true },
  { name: "Sarah K.", location: "Binningen", rating: 5, text: "Schnell, sauber und freundlich. Top Service!", company: "Rheinknie Moving", verified: true },
  { name: "Peter W.", location: "Allschwil", rating: 4, text: "Gutes Preis-Leistungs-Verhältnis.", company: "Dreiland Transporte", verified: true },
  { name: "Maria L.", location: "Muttenz", rating: 5, text: "Alles perfekt gelaufen, sehr empfehlenswert.", company: "Baslerland Umzüge", verified: true },
];

const baselTestimonials = [
  { name: "Thomas B.", location: "Basel Altstadt", rating: 5, text: "Der beste Umzugsservice den ich je hatte. Absolut professionell und pünktlich.", date: "Nov 2024" },
  { name: "Anna S.", location: "Riehen", rating: 5, text: "Trotz enger Gassen in der Altstadt hat alles perfekt geklappt.", date: "Okt 2024" },
  { name: "Michael R.", location: "Binningen", rating: 5, text: "Sehr freundliches Team und faire Preise. Kann ich nur empfehlen!", date: "Sep 2024" },
];

export const BaselNew = () => {
  return (
    <CantonTemplate
      config={baselConfig}
      headerComponent={
        <>
          <CantonUrgencyBanner cantonName={baselConfig.name} />
          <CantonBreadcrumb cantonName={baselConfig.name} cantonSlug={baselConfig.slug} />
        </>
      }
      footerComponent={
        <>
          <CantonTestimonials cantonName={baselConfig.name} testimonials={baselTestimonials} />
          <CantonSocialProof cantonName={baselConfig.name} />
          <CantonPartnersSection cantonName={baselConfig.name} />
          <CantonContactSection cantonName={baselConfig.name} />
          <CantonRelatedServices cantonName={baselConfig.name} cantonSlug={baselConfig.slug} />
        </>
      }
      sidebarWidgets={[
        <div key="map" className="lg:col-span-2"><CantonInteractiveMap cantonName={baselConfig.name} districts={baselDistricts} /></div>,
        <div key="widgets" className="space-y-6">
          <CantonWeatherWidget cantonName={baselConfig.name} />
          <CantonPriceCalculatorMini cantonName={baselConfig.name} cities={baselConfig.cities} />
        </div>,
      ]}
    >
      <CantonTrustSignals />
      <CantonStatsCounter companies={85} customers={16500} />
      <CantonCompanyFilters />
      <CantonServiceComparison cantonName={baselConfig.name} />
      <CantonVideoSection cantonName={baselConfig.name} />
      <CantonReviewsShowcase cantonName={baselConfig.name} reviews={baselReviews} />
      <CantonMovingTips cantonName={baselConfig.name} />
      <CantonQuickActions cantonName={baselConfig.name} cantonSlug={baselConfig.slug} />
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2"><CantonChecklist cantonName={baselConfig.name} /></div>
            <CantonNewsletter cantonName={baselConfig.name} />
          </div>
        </div>
      </section>
    </CantonTemplate>
  );
};

export default BaselNew;
