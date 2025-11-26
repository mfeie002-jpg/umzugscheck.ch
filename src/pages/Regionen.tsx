import { Helmet } from "react-helmet";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { MapPin, TrendingUp, Users } from "lucide-react";
import { ScrollToTop } from "@/components/ScrollToTop";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { generateMetaData, generateOGTags } from "@/lib/seo-meta";
import { generatePageSchemas, generateSchemaScript } from "@/lib/schema-markup";
import { getKeywordsForPage } from "@/lib/seo-keywords";

const cantons = [
  { name: "Zürich", slug: "zuerich", companies: 42, moves: "1'200+" },
  { name: "Bern", slug: "bern", companies: 35, moves: "950+" },
  { name: "Luzern", slug: "luzern", companies: 28, moves: "680+" },
  { name: "Uri", slug: "uri", companies: 12, moves: "180+" },
  { name: "Schwyz", slug: "schwyz", companies: 18, moves: "420+" },
  { name: "Obwalden", slug: "obwalden", companies: 10, moves: "150+" },
  { name: "Nidwalden", slug: "nidwalden", companies: 11, moves: "160+" },
  { name: "Glarus", slug: "glarus", companies: 9, moves: "130+" },
  { name: "Zug", slug: "zug", companies: 22, moves: "510+" },
  { name: "Freiburg", slug: "freiburg", companies: 26, moves: "620+" },
  { name: "Solothurn", slug: "solothurn", companies: 24, moves: "560+" },
  { name: "Basel-Stadt", slug: "basel-stadt", companies: 30, moves: "720+" },
  { name: "Basel-Landschaft", slug: "basel-landschaft", companies: 28, moves: "650+" },
  { name: "Schaffhausen", slug: "schaffhausen", companies: 15, moves: "290+" },
  { name: "Appenzell Ausserrhoden", slug: "appenzell-ausserrhoden", companies: 12, moves: "200+" },
  { name: "Appenzell Innerrhoden", slug: "appenzell-innerrhoden", companies: 8, moves: "110+" },
  { name: "St. Gallen", slug: "st-gallen", companies: 32, moves: "780+" },
  { name: "Graubünden", slug: "graubuenden", companies: 20, moves: "410+" },
  { name: "Aargau", slug: "aargau", companies: 38, moves: "890+" },
  { name: "Thurgau", slug: "thurgau", companies: 25, moves: "570+" },
  { name: "Tessin", slug: "tessin", companies: 27, moves: "640+" },
  { name: "Waadt", slug: "waadt", companies: 36, moves: "850+" },
  { name: "Wallis", slug: "wallis", companies: 29, moves: "690+" },
  { name: "Neuenburg", slug: "neuenburg", companies: 19, moves: "430+" },
  { name: "Genf", slug: "genf", companies: 34, moves: "820+" },
  { name: "Jura", slug: "jura", companies: 13, moves: "240+" }
];

const Regionen = () => {
  // Generate SEO meta data
  const currentUrl = 'https://www.umzugscheck.ch/regionen/';
  const metaData = {
    title: 'Umzugsfirmen in allen Regionen der Schweiz | umzugscheck.ch',
    description: 'Finden Sie geprüfte Umzugsfirmen in allen 26 Schweizer Kantonen. Transparente Preise, echte Kundenbewertungen und kostenlose Offerten.',
    canonicalUrl: currentUrl,
    ogImage: 'https://www.umzugscheck.ch/assets/umzugscheck-logo.png'
  };
  const ogTags = generateOGTags(metaData, currentUrl);
  const keywords = getKeywordsForPage('vergleich');

  // Generate Schema.org structured data
  const schemas = generatePageSchemas({ type: 'vergleich', url: currentUrl });
  const schemaScript = generateSchemaScript(schemas);

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>{metaData.title}</title>
        <meta name="description" content={metaData.description} />
        <link rel="canonical" href={currentUrl} />
        
        {keywords && keywords.length > 0 && (
          <meta name="keywords" content={keywords.join(', ')} />
        )}
        
        <meta property="og:title" content={ogTags['og:title']} />
        <meta property="og:description" content={ogTags['og:description']} />
        <meta property="og:type" content={ogTags['og:type']} />
        <meta property="og:url" content={ogTags['og:url']} />
        <meta property="og:image" content={ogTags['og:image']} />
        
        <meta name="twitter:card" content={ogTags['twitter:card']} />
        <meta name="twitter:title" content={ogTags['twitter:title']} />
        <meta name="twitter:description" content={ogTags['twitter:description']} />
        <meta name="twitter:image" content={ogTags['twitter:image']} />

        <script type="application/ld+json">{schemaScript}</script>
      </Helmet>

      <Navigation />

      {/* Hero Section */}
      <section className="gradient-hero text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="mb-6">Umzugsfirmen in allen Regionen der Schweiz</h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-3xl mx-auto">
              Finden Sie geprüfte Umzugsfirmen in Ihrem Kanton – transparente Preise und echte Kundenbewertungen
            </p>
          </div>
        </div>
      </section>

      {/* Key Stats */}
      <section className="py-12 bg-white border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">26</div>
              <div className="text-muted-foreground">Alle Kantone</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">600+</div>
              <div className="text-muted-foreground">Umzugsfirmen</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">15'000+</div>
              <div className="text-muted-foreground">Vermittelte Umzüge</div>
            </div>
          </div>
        </div>
      </section>

      {/* Cantons Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="mb-4">Wählen Sie Ihren Kanton</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Umzugsfirmen in Ihrer Region vergleichen – lokale Expertise, faire Preise
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cantons.map((canton) => (
                <Link key={canton.slug} to={`/umzug/${canton.slug}`}>
                  <Card className="p-6 hover:shadow-strong transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/30">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1">{canton.name}</h3>
                        <p className="text-sm text-muted-foreground">Kanton {canton.name}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 pt-4 border-t border-border">
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-primary" />
                        <span className="font-semibold">{canton.companies}</span>
                        <span className="text-muted-foreground">Firmen</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <TrendingUp className="w-4 h-4 text-accent" />
                        <span className="font-semibold">{canton.moves}</span>
                        <span className="text-muted-foreground">Umzüge</span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 gradient-light">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="mb-6">Bereit für Ihren Umzug?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Erhalten Sie kostenlose Offerten von geprüften Umzugsfirmen in Ihrer Region
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/rechner">
                <button className="px-8 py-4 bg-accent hover:bg-accent-dark text-white rounded-lg font-semibold shadow-medium hover:shadow-strong transition-all">
                  Jetzt Kosten berechnen
                </button>
              </Link>
              <Link to="/firmen">
                <button className="px-8 py-4 bg-white hover:bg-secondary text-foreground rounded-lg font-semibold border-2 border-border hover:border-primary/30 transition-all">
                  Firmen vergleichen
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <ScrollToTop />
      <StickyMobileCTA />
    </div>
  );
};

export default Regionen;
