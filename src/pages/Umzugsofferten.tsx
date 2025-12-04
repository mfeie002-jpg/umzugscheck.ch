import { Helmet } from "react-helmet";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import OffertenHero from "@/components/offerten/OffertenHero";
import OffertenStats from "@/components/offerten/OffertenStats";
import OffertenBenefits from "@/components/offerten/OffertenBenefits";
import OffertenTestimonials from "@/components/offerten/OffertenTestimonials";
import OffertenProcess from "@/components/offerten/OffertenProcess";
import OffertenPricing from "@/components/offerten/OffertenPricing";
import OffertenPartners from "@/components/offerten/OffertenPartners";
import OffertenRegions from "@/components/offerten/OffertenRegions";
import OffertenServices from "@/components/offerten/OffertenServices";
import OffertenFAQ from "@/components/offerten/OffertenFAQ";
import OffertenCTA from "@/components/offerten/OffertenCTA";

const Umzugsofferten = () => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Umzugsofferten vergleichen",
    "description": "Erhalten Sie kostenlose Umzugsofferten von geprüften Schweizer Umzugsfirmen. Vergleichen Sie Preise, Bewertungen und Leistungen.",
    "provider": {
      "@type": "Organization",
      "name": "umzugscheck.ch",
      "url": "https://umzugscheck.ch"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Switzerland"
    },
    "serviceType": "Moving Quote Comparison"
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Ist der Service wirklich kostenlos?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ja. Für Sie als Auftraggeber ist der Service 100 % kostenlos. Wir finanzieren uns über eine Provision der teilnehmenden Umzugsfirmen."
        }
      },
      {
        "@type": "Question",
        "name": "Wie schnell erhalte ich Offerten?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "In der Regel erhalten Sie die ersten Offerten innerhalb von 24 Stunden. Bei kurzfristigen Umzügen kann es auch schneller gehen."
        }
      },
      {
        "@type": "Question",
        "name": "Wie viel kann ich mit dem Vergleich sparen?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Je nach Umfang und Region sind Einsparungen von bis zu 40 % möglich, weil Sie mehrere Angebote direkt vergleichen."
        }
      },
      {
        "@type": "Question",
        "name": "Sind alle Firmen geprüft?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ja. Wir arbeiten nur mit seriösen, registrierten Umzugsfirmen zusammen und prüfen Bewertungen sowie Rückmeldungen von Kunden laufend."
        }
      },
      {
        "@type": "Question",
        "name": "Bin ich verpflichtet, eine Offerte anzunehmen?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nein. Sie vergleichen die Angebote in Ruhe und entscheiden selbst, ob und mit welcher Firma Sie den Auftrag vergeben."
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Umzugsofferten vergleichen | Kostenlos & unverbindlich | umzugscheck.ch</title>
        <meta 
          name="description" 
          content="Erhalten Sie kostenlose Umzugsofferten von geprüften Schweizer Umzugsfirmen. Vergleichen Sie Preise, Bewertungen und Leistungen – schnell, transparent und unverbindlich." 
        />
        <meta name="keywords" content="Umzugsofferten, Umzug Schweiz, Umzugsfirma vergleichen, Zügelofferte, Umzugskosten" />
        <link rel="canonical" href="https://umzugscheck.ch/umzugsofferten" />
        
        <meta property="og:title" content="Umzugsofferten vergleichen | Kostenlos & unverbindlich" />
        <meta property="og:description" content="Erhalten Sie kostenlose Umzugsofferten von geprüften Schweizer Umzugsfirmen." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://umzugscheck.ch/umzugsofferten" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Umzugsofferten vergleichen | umzugscheck.ch" />
        <meta name="twitter:description" content="Kostenlose Umzugsofferten von geprüften Schweizer Umzugsfirmen." />
        
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>

      <main id="main-content">
        <div className="container mx-auto px-4 pt-4 relative z-20">
          <Breadcrumbs items={[{ label: "Umzugsofferten" }]} />
        </div>

        <OffertenHero />
        <OffertenStats />
        <OffertenBenefits />
        <OffertenTestimonials />
        <OffertenProcess />
        <OffertenPricing />
        <OffertenPartners />
        <OffertenRegions />
        <OffertenServices />
        <OffertenFAQ />
        <OffertenCTA />
      </main>

      <StickyMobileCTA text="Offerten erhalten" link="/rechner" />
    </div>
  );
};

export default Umzugsofferten;
