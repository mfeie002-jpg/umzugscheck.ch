/**
 * Champion B: Trust-First Landing Page (Cold Traffic)
 * 
 * Purpose: Retargeting + brand awareness keywords
 * Target Keywords: "umzugsfirma in der nähe", "zügeln zürich", "umzug+reinigung"
 * Focus: Build confidence → Social proof → Lead capture
 * 
 * Design:
 * - Hero with proof-points
 * - Case studies / testimonials
 * - Service showcase
 * - Trust grid + certifications
 * - Sticky call bar (mobile)
 * - Form at bottom (or embedded)
 */

import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ExpressQuoteForm } from "@/components/ExpressQuoteForm";
import { FeierabendCard } from "@/components/ui/FeierabendCard";
import { TrustBadge } from "@/components/ui/TrustBadge";
import { track } from "@/utils/track";
import { Star, Users, Award, MapPin } from "lucide-react";

type FormData = {
  phone: string;
  startPlz: string;
  endPlz: string;
  moveDate?: string;
};

const ChampionTrustFirst = () => {
  const handleFormComplete = (data: FormData) => {
    track("lead_submitted", {
      funnel: "champion_trust_first",
      start_plz: data.startPlz,
      end_plz: data.endPlz,
      move_date: data.moveDate,
    });
    window.location.href = "/booking?source=champion_trust_first";
  };

  const testimonials = [
    {
      name: "Maria K., Zürich",
      quote: "Professionell, pünktlich, und wirklich fair im Preis. Keine versteckten Kosten!",
      rating: 5,
    },
    {
      name: "Hans M., Bern",
      quote: "Die Jungs waren super freundlich und haben meine alten Möbel wie neue behandelt.",
      rating: 5,
    },
    {
      name: "Petra S., Basel",
      quote: "Schnelle Offerte, schneller Umzug. So soll es sein! Empfehle ich weiter.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Umzugsfirma Schweiz | Feierabend Umzüge - Zuverlässig & Transparent</title>
        <meta
          name="description"
          content="Feierabend Umzüge: 500+ erfolgreiche Umzüge pro Jahr. Fixpreise, Schweizer Zertifizierungen, Live-Support."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://umzugscheck.ch/champion-trust-first" />
      </Helmet>

      <Header />

      <main className="flex-1">
        {/* Hero with Social Proof */}
        <section className="relative isolate bg-gradient-to-b from-feierabend-blue-50 via-white to-white pt-20 pb-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6">
                Ihr Umzug in <span className="text-feierabend-orange-500">zuverlässigen Händen</span>
              </h1>
              <p className="text-xl text-gray-600">
                500+ erfolgreiche Umzüge pro Jahr • Schweizer Zertifizierungen • Live-Support
              </p>
            </div>

            {/* Trust Numbers */}
            <div className="grid md:grid-cols-4 gap-6 mb-12">
              <FeierabendCard variant="default" className="p-6 text-center">
                <div className="text-4xl font-bold text-feierabend-orange-500 mb-2">500+</div>
                <p className="text-gray-600">Umzüge/Jahr</p>
              </FeierabendCard>
              <FeierabendCard variant="default" className="p-6 text-center">
                <div className="text-4xl font-bold text-feierabend-blue-500 mb-2">4.9★</div>
                <p className="text-gray-600">Durchschn. Rating</p>
              </FeierabendCard>
              <FeierabendCard variant="default" className="p-6 text-center">
                <div className="text-4xl font-bold text-feierabend-teal-500 mb-2">15+</div>
                <p className="text-gray-600">Jahre Erfahrung</p>
              </FeierabendCard>
              <FeierabendCard variant="default" className="p-6 text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">100%</div>
                <p className="text-gray-600">Zufrieden</p>
              </FeierabendCard>
            </div>

            {/* Trust Badges */}
            <div className="grid md:grid-cols-3 gap-4">
              <TrustBadge icon={<Award className="w-6 h-6" />} label="SSM Zertifiziert" />
              <TrustBadge icon={<Users className="w-6 h-6" />} label="Professionelles Team" />
              <TrustBadge icon={<MapPin className="w-6 h-6" />} label="Alle Kantone" />
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Das sagen unsere Kunden</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, i) => (
                <FeierabendCard key={i} variant="premium" className="p-6">
                  <div className="flex mb-3">
                    {[...Array(testimonial.rating)].map((_, j) => (
                      <Star key={j} className="w-5 h-5 fill-feierabend-orange-500 text-feierabend-orange-500" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.quote}"</p>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                </FeierabendCard>
              ))}
            </div>
          </div>
        </section>

        {/* Service Grid */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Unsere Services</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { title: "Privatumzug", desc: "Von Wohnung zu Wohnung mit Profi-Team" },
                { title: "Büroumzug", desc: "Minimale Downtime + IT-Support" },
                { title: "Verpackung", desc: "Vollständiger Pack-Service" },
                { title: "Endreinigung", desc: "Nach dem Umzug sofort eingriffsbereit" },
                { title: "Entsorgung", desc: "Nachhaltige Möbel- & Materialverwertung" },
                { title: "Einlagerung", desc: "Sichere Lagerung mit Klimakontrolle" },
              ].map((service, i) => (
                <FeierabendCard key={i} variant="default" className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600">{service.desc}</p>
                </FeierabendCard>
              ))}
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">Kostenlose Offerte Anfordern</h2>
            <FeierabendCard variant="premium" className="p-8">
              <ExpressQuoteForm onComplete={handleFormComplete} />
            </FeierabendCard>
          </div>
        </section>

        {/* Call-to-Action Banner */}
        <section className="py-16 px-4 bg-feierabend-orange-50">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Persönliche Beratung gewünscht?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Unser Team antwortet sofort auf Ihre Fragen — kostenlos und unverbindlich.
            </p>
            <a
              href="tel:+41765681302"
              onClick={() => track("cta_call_click", { location: "banner", funnel: "champion_trust_first" })}
              className="inline-block px-8 py-4 bg-feierabend-orange-600 hover:bg-feierabend-orange-500 text-white font-semibold rounded-lg transition-colors text-lg"
            >
              Jetzt Anrufen: +41 76 568 13 02
            </a>
            <p className="text-sm text-gray-500 mt-4">Mo–Fr: 08:00–19:00 Uhr</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ChampionTrustFirst;
