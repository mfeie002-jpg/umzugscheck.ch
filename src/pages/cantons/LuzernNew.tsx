import { CantonTemplate } from "@/components/canton/CantonTemplate";
import { luzernConfig } from "@/config/cantonConfigs";
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

const luzernDistricts = [
  { name: "Luzern Stadt", companies: 25, avgPrice: "CHF 1'150", popular: true },
  { name: "Emmen", companies: 14, avgPrice: "CHF 1'000", popular: true },
  { name: "Kriens", companies: 12, avgPrice: "CHF 1'050", popular: false },
  { name: "Horw", companies: 8, avgPrice: "CHF 1'100", popular: false },
  { name: "Sursee", companies: 10, avgPrice: "CHF 950", popular: false },
  { name: "Hochdorf", companies: 6, avgPrice: "CHF 900", popular: false },
];

const luzernReviews = [
  { name: "Martin K.", location: "Luzern", rating: 5, text: "Umzug in der Altstadt war eine Herausforderung, aber super gemeistert!", company: "Luzern Umzüge AG", verified: true },
  { name: "Eva S.", location: "Emmen", rating: 5, text: "Pünktlich, freundlich und effizient.", company: "Pilatus Moving", verified: true },
  { name: "Thomas R.", location: "Kriens", rating: 4, text: "Gute Arbeit zu fairen Preisen.", company: "Vierwaldstättersee Transporte", verified: true },
  { name: "Claudia M.", location: "Horw", rating: 5, text: "Perfekte Organisation vom Anfang bis Ende.", company: "Seeland Umzüge Luzern", verified: true },
];

const luzernTestimonials = [
  { name: "Andreas B.", location: "Luzern Altstadt", rating: 5, text: "Der Umzug durch die engen Altstadtgassen war perfekt organisiert.", date: "Nov 2024" },
  { name: "Sabine W.", location: "Emmen", rating: 5, text: "Schnell, professionell und sehr freundlich!", date: "Okt 2024" },
  { name: "Felix H.", location: "Kriens", rating: 5, text: "Hervorragender Service. Absolute Weiterempfehlung!", date: "Sep 2024" },
];

export const LuzernNew = () => {
  return (
    <CantonTemplate
      config={luzernConfig}
      headerComponent={
        <>
          <CantonUrgencyBanner cantonName={luzernConfig.name} />
          <CantonBreadcrumb cantonName={luzernConfig.name} cantonSlug={luzernConfig.slug} />
        </>
      }
      footerComponent={
        <>
          <CantonTestimonials cantonName={luzernConfig.name} testimonials={luzernTestimonials} />
          <CantonSocialProof cantonName={luzernConfig.name} />
          <CantonPartnersSection cantonName={luzernConfig.name} />
          <CantonContactSection cantonName={luzernConfig.name} />
          <CantonRelatedServices cantonName={luzernConfig.name} cantonSlug={luzernConfig.slug} />
        </>
      }
      sidebarWidgets={[
        <div key="map" className="lg:col-span-2"><CantonInteractiveMap cantonName={luzernConfig.name} districts={luzernDistricts} /></div>,
        <div key="widgets" className="space-y-6">
          <CantonWeatherWidget cantonName={luzernConfig.name} />
          <CantonPriceCalculatorMini cantonName={luzernConfig.name} cities={luzernConfig.cities} />
        </div>,
      ]}
    >
      <CantonTrustSignals />
      <CantonStatsCounter companies={68} customers={13500} />
      <CantonCompanyFilters />
      <CantonServiceComparison cantonName={luzernConfig.name} />
      <CantonVideoSection cantonName={luzernConfig.name} />
      <CantonReviewsShowcase cantonName={luzernConfig.name} reviews={luzernReviews} />
      <CantonMovingTips cantonName={luzernConfig.name} />
      <CantonQuickActions cantonName={luzernConfig.name} cantonSlug={luzernConfig.slug} />
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2"><CantonChecklist cantonName={luzernConfig.name} /></div>
            <CantonNewsletter cantonName={luzernConfig.name} />
          </div>
        </div>
      </section>
    </CantonTemplate>
  );
};

export default LuzernNew;
