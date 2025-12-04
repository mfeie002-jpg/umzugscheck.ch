import { CantonTemplate } from "@/components/canton/CantonTemplate";
import { stgallenConfig } from "@/config/cantonConfigs";
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

const stgallenDistricts = [
  { name: "St. Gallen Stadt", companies: 22, avgPrice: "CHF 1'100", popular: true },
  { name: "Rapperswil-Jona", companies: 14, avgPrice: "CHF 1'150", popular: true },
  { name: "Wil", companies: 10, avgPrice: "CHF 950", popular: false },
  { name: "Gossau", companies: 8, avgPrice: "CHF 900", popular: false },
  { name: "Buchs", companies: 7, avgPrice: "CHF 850", popular: false },
  { name: "Rorschach", companies: 6, avgPrice: "CHF 950", popular: false },
];

const stgallenReviews = [
  { name: "Markus T.", location: "St. Gallen", rating: 5, text: "Exzellenter Service! Alles hat perfekt geklappt.", company: "St. Gallen Umzüge AG", verified: true },
  { name: "Nicole F.", location: "Rapperswil", rating: 5, text: "Sehr professionell und pünktlich.", company: "Ostschweiz Moving", verified: true },
  { name: "Bruno S.", location: "Wil", rating: 4, text: "Gute Arbeit, freundliches Team.", company: "Bodensee Transporte", verified: true },
  { name: "Irene K.", location: "Gossau", rating: 5, text: "Schneller und sauberer Umzug!", company: "Fürstenland Umzüge", verified: true },
];

const stgallenTestimonials = [
  { name: "Patrick M.", location: "St. Gallen Altstadt", rating: 5, text: "Trotz der historischen Altstadt hat alles bestens geklappt.", date: "Nov 2024" },
  { name: "Monika B.", location: "Rapperswil-Jona", rating: 5, text: "Vom ersten Kontakt bis zum letzten Karton - alles perfekt!", date: "Okt 2024" },
  { name: "Werner L.", location: "Wil", rating: 5, text: "Faire Preise und top Service. Gerne wieder!", date: "Sep 2024" },
];

export const StGallenNew = () => {
  return (
    <CantonTemplate
      config={stgallenConfig}
      headerComponent={
        <>
          <CantonUrgencyBanner cantonName={stgallenConfig.name} />
          <CantonBreadcrumb cantonName={stgallenConfig.name} cantonSlug={stgallenConfig.slug} />
        </>
      }
      footerComponent={
        <>
          <CantonTestimonials cantonName={stgallenConfig.name} testimonials={stgallenTestimonials} />
          <CantonSocialProof cantonName={stgallenConfig.name} />
          <CantonPartnersSection cantonName={stgallenConfig.name} />
          <CantonContactSection cantonName={stgallenConfig.name} />
          <CantonRelatedServices cantonName={stgallenConfig.name} cantonSlug={stgallenConfig.slug} />
        </>
      }
      sidebarWidgets={[
        <div key="map" className="lg:col-span-2"><CantonInteractiveMap cantonName={stgallenConfig.name} districts={stgallenDistricts} /></div>,
        <div key="widgets" className="space-y-6">
          <CantonWeatherWidget cantonName={stgallenConfig.name} />
          <CantonPriceCalculatorMini cantonName={stgallenConfig.name} cities={stgallenConfig.cities} />
        </div>,
      ]}
    >
      <CantonTrustSignals />
      <CantonStatsCounter companies={65} customers={12800} />
      <CantonCompanyFilters />
      <CantonServiceComparison cantonName={stgallenConfig.name} />
      <CantonVideoSection cantonName={stgallenConfig.name} />
      <CantonReviewsShowcase cantonName={stgallenConfig.name} reviews={stgallenReviews} />
      <CantonMovingTips cantonName={stgallenConfig.name} />
      <CantonQuickActions cantonName={stgallenConfig.name} cantonSlug={stgallenConfig.slug} />
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2"><CantonChecklist cantonName={stgallenConfig.name} /></div>
            <CantonNewsletter cantonName={stgallenConfig.name} />
          </div>
        </div>
      </section>
    </CantonTemplate>
  );
};

export default StGallenNew;
