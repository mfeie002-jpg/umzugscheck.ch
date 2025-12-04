import { CantonTemplate } from "@/components/canton/CantonTemplate";
import { aargauConfig } from "@/config/cantonConfigs";
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

const aargauDistricts = [
  { name: "Aarau", companies: 18, avgPrice: "CHF 1'050", popular: true },
  { name: "Baden", companies: 22, avgPrice: "CHF 1'150", popular: true },
  { name: "Wettingen", companies: 12, avgPrice: "CHF 1'000", popular: false },
  { name: "Brugg", companies: 10, avgPrice: "CHF 950", popular: false },
  { name: "Zofingen", companies: 8, avgPrice: "CHF 900", popular: false },
  { name: "Rheinfelden", companies: 9, avgPrice: "CHF 950", popular: false },
];

const aargauReviews = [
  { name: "Stefan M.", location: "Aarau", rating: 5, text: "Schneller und unkomplizierter Umzug. Sehr empfehlenswert!", company: "Aargau Umzüge AG", verified: true },
  { name: "Lisa B.", location: "Baden", rating: 5, text: "Professionelles Team, faire Preise.", company: "Baden Moving", verified: true },
  { name: "Marc H.", location: "Wettingen", rating: 4, text: "Gute Arbeit, pünktlich und zuverlässig.", company: "Limmat-Tal Transporte", verified: true },
  { name: "Sandra W.", location: "Brugg", rating: 5, text: "Alles wie geplant. Super Service!", company: "Freiamt Umzüge", verified: true },
];

const aargauTestimonials = [
  { name: "Daniel K.", location: "Aarau", rating: 5, text: "Der Umzug von Aarau nach Zürich war perfekt organisiert.", date: "Nov 2024" },
  { name: "Christina M.", location: "Baden", rating: 5, text: "Sehr professionell und freundlich. Gerne wieder!", date: "Okt 2024" },
  { name: "Robert S.", location: "Wettingen", rating: 5, text: "Preis-Leistung stimmt. Kann ich nur weiterempfehlen.", date: "Sep 2024" },
];

export const AargauNew = () => {
  return (
    <CantonTemplate
      config={aargauConfig}
      headerComponent={
        <>
          <CantonUrgencyBanner cantonName={aargauConfig.name} />
          <CantonBreadcrumb cantonName={aargauConfig.name} cantonSlug={aargauConfig.slug} />
        </>
      }
      footerComponent={
        <>
          <CantonTestimonials cantonName={aargauConfig.name} testimonials={aargauTestimonials} />
          <CantonSocialProof cantonName={aargauConfig.name} />
          <CantonPartnersSection cantonName={aargauConfig.name} />
          <CantonContactSection cantonName={aargauConfig.name} />
          <CantonRelatedServices cantonName={aargauConfig.name} cantonSlug={aargauConfig.slug} />
        </>
      }
      sidebarWidgets={[
        <div key="map" className="lg:col-span-2"><CantonInteractiveMap cantonName={aargauConfig.name} districts={aargauDistricts} /></div>,
        <div key="widgets" className="space-y-6">
          <CantonWeatherWidget cantonName={aargauConfig.name} />
          <CantonPriceCalculatorMini cantonName={aargauConfig.name} cities={aargauConfig.cities} />
        </div>,
      ]}
    >
      <CantonTrustSignals />
      <CantonStatsCounter companies={72} customers={14800} />
      <CantonCompanyFilters />
      <CantonServiceComparison cantonName={aargauConfig.name} />
      <CantonVideoSection cantonName={aargauConfig.name} />
      <CantonReviewsShowcase cantonName={aargauConfig.name} reviews={aargauReviews} />
      <CantonMovingTips cantonName={aargauConfig.name} />
      <CantonQuickActions cantonName={aargauConfig.name} cantonSlug={aargauConfig.slug} />
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2"><CantonChecklist cantonName={aargauConfig.name} /></div>
            <CantonNewsletter cantonName={aargauConfig.name} />
          </div>
        </div>
      </section>
    </CantonTemplate>
  );
};

export default AargauNew;
