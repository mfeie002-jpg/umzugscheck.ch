/**
 * Champion A: Ultra Low-Friction Paid Landing Page (Speed-to-Lead)
 * 
 * Purpose: Paid search default (high-intent keywords)
 * Target Keywords: "umzugsfirma zürich", "umzugsofferte", "umzug offerte online"
 * Focus: Fast form completion → Lead capture
 * 
 * Design:
 * - Hero (no scroll-blocking video)
 * - 3x Trust badges inline
 * - 2-step form (phone → PLZ)
 * - Sticky call bar (mobile)
 * - Zero distractions
 */

import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ExpressQuoteForm } from "@/components/ExpressQuoteForm";
import { FeierabendCard } from "@/components/ui/FeierabendCard";
import { TrustBadge } from "@/components/ui/TrustBadge";
import { track } from "@/utils/track";
import { Phone, Shield, Zap } from "lucide-react";

type FormData = {
  phone: string;
  startPlz: string;
  endPlz: string;
  moveDate?: string;
};

const ChampionQuickFlow = () => {
  const handleFormComplete = (data: FormData) => {
    track("lead_submitted", {
      funnel: "champion_quick_flow",
      start_plz: data.startPlz,
      end_plz: data.endPlz,
      move_date: data.moveDate,
    });
    // Redirect to success or booking
    window.location.href = "/booking?source=champion_quick_flow";
  };

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Umzugsofferte in 2 Min | Feierabend Umzüge - Kostenlos & Unverbindlich</title>
        <meta
          name="description"
          content="Erhalten Sie in wenigen Minuten Offerten von zertifizierten Umzugsfirmen. Vergleichen Sie Preise und buchen Sie direkt."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://umzugscheck.ch/champion-quick-flow" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Feierabend Umzüge",
            description: "Zertifizierte Umzugsfirma mit Online-Offerten",
            areaServed: "CH",
            priceRange: "CHF",
          })}
        </script>
      </Helmet>

      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative isolate bg-gradient-to-br from-feierabend-blue-50 via-white to-white pt-16 pb-12 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
              Umzugsofferte in <span className="text-feierabend-orange-500">2 Minuten</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Kostenlos • Unverbindlich • Mehrere Angebote zum Vergleichen
            </p>

            {/* Trust Badges Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
              <TrustBadge icon={<Phone className="w-6 h-6" />} text="Live Hotline Mo–Fr 08–19 Uhr" />
              <TrustBadge icon={<Shield className="w-6 h-6" />} text="100 % Kostenlos" />
              <TrustBadge icon={<Zap className="w-6 h-6" />} text="Sofort Offertenvergleich" />
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-12 px-4 bg-white">
          <div className="max-w-2xl mx-auto">
            <FeierabendCard variant="premium" className="p-8">
              <ExpressQuoteForm onComplete={handleFormComplete} />
            </FeierabendCard>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-12 px-4 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center text-gray-900">Warum Feierabend Umzüge?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: "500+ Umzüge/Jahr", desc: "Lokale Expertise in jeder Stadt" },
                { title: "Fixpreise", desc: "Keine versteckten Kosten" },
                { title: "Geprüft & Zertifiziert", desc: "Schweizer Umzugsstandards" },
              ].map((item, i) => (
                <FeierabendCard key={i} variant="default" className="p-6">
                  <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </FeierabendCard>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-12 px-4 bg-feierabend-blue-50">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Noch Fragen?</h2>
            <p className="text-gray-600 mb-6">
              Rufen Sie unser Team an — wir beraten Sie gerne und unverbindlich.
            </p>
            <a
              href="tel:+41765681302"
              onClick={() => track("cta_call_click", { location: "banner", funnel: "champion_quick_flow" })}
              className="inline-block px-8 py-3 bg-feierabend-orange-600 hover:bg-feierabend-orange-500 text-white font-semibold rounded-lg transition-colors"
            >
              +41 76 568 13 02
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ChampionQuickFlow;
