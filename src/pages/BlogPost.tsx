import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { generateMetaData, generateOGTags } from "@/lib/seo-meta";
import { getKeywordsForPage } from "@/lib/seo-keywords";

const BLOG_CONTENT: Record<string, {
  title: string;
  category: string;
  date: string;
  readTime: string;
  content: string[];
}> = {
  "umzugskosten-schweiz-2025": {
    title: "Umzugskosten in der Schweiz 2025: Der komplette Preisguide",
    category: "Ratgeber",
    date: "2024-01-15",
    readTime: "8 min",
    content: [
      "Ein Umzug in der Schweiz kann schnell teuer werden. Doch mit dem richtigen Wissen und einer guten Planung lassen sich die Kosten deutlich senken. In diesem Guide zeigen wir Ihnen, was ein Umzug wirklich kostet und wie Sie sparen können.",
      "## Was beeinflusst die Umzugskosten?",
      "Die Kosten für einen Umzug hängen von verschiedenen Faktoren ab:",
      "**1. Wohnungsgrösse**: Je mehr Zimmer, desto höher die Kosten. Ein Studio kostet etwa CHF 800-1'200, während ein 5-Zimmer-Umzug CHF 3'500-6'000 kostet.",
      "**2. Distanz**: Lokale Umzüge (gleiche Stadt) sind günstiger als Fernumzüge zwischen Kantonen.",
      "**3. Zusatzservices**: Packservice, Reinigung und Entsorgung erhöhen die Kosten merklich.",
      "**4. Stockwerk**: Ohne Lift wird jedes Stockwerk teurer (ca. CHF 100 pro Etage).",
      "## Durchschnittliche Umzugskosten",
      "- **Studio/1 Zimmer**: CHF 800-1'200",
      "- **2 Zimmer**: CHF 1'200-1'800",
      "- **3 Zimmer**: CHF 1'800-2'800",
      "- **4 Zimmer**: CHF 2'500-3'500",
      "- **5+ Zimmer/Haus**: CHF 3'500-6'000+",
      "## Spartipps",
      "**1. Vergleichen Sie Offerten**: Holen Sie mindestens 3 Angebote ein und vergleichen Sie nicht nur den Preis, sondern auch die Leistungen.",
      "**2. Umzug in der Nebensaison**: Zwischen Oktober und März sind Umzugsfirmen günstiger.",
      "**3. Kartons selbst packen**: Das spart CHF 300-800.",
      "**4. Entrümpeln vor dem Umzug**: Weniger Volumen bedeutet tiefere Kosten.",
      "## Fazit",
      "Ein gut geplanter Umzug kann deutlich günstiger sein als erwartet. Mit unserem Umzugsrechner können Sie jetzt Ihre individuellen Kosten berechnen und Offerten vergleichen."
    ],
  },
  "umzugscheckliste": {
    title: "Die ultimative Umzugscheckliste: 30 Tage vor dem Umzug",
    category: "Checkliste",
    date: "2024-01-10",
    readTime: "6 min",
    content: [
      "Ein Umzug bedeutet Stress – muss er aber nicht! Mit dieser detaillierten Checkliste behalten Sie den Überblick und vergessen nichts Wichtiges.",
      "## 30 Tage vorher",
      "- Umzugstermin festlegen",
      "- Offerten von Umzugsfirmen einholen",
      "- Alte Wohnung kündigen (Kündigungsfrist beachten!)",
      "- Mietvertrag für neue Wohnung unterschreiben",
      "- Urlaub für Umzugstag beantragen",
      "## 2 Wochen vorher",
      "- Umzugsfirma beauftragen und Termin bestätigen",
      "- Adressänderung bei Post vorbereiten",
      "- Strom, Internet, Telefon ummelden",
      "- Versicherungen informieren",
      "- Kartons und Verpackungsmaterial besorgen",
      "- Mit dem Packen beginnen (Keller, Dachboden)",
      "## 1 Woche vorher",
      "- Kühlschrank abtauen",
      "- Letzte Einkäufe planen (verderbliche Waren aufbrauchen)",
      "- Wichtige Dokumente separat verpacken",
      "- Werkzeugkiste für Montagearbeiten bereitstellen",
      "- Endreinigung organisieren oder vorbereiten",
      "## Am Umzugstag",
      "- Früh aufstehen und letzte Gegenstände einpacken",
      "- Umzugsfirma empfangen und Ablauf besprechen",
      "- Alte Wohnung übergeben (Protokoll erstellen)",
      "- Zählerstände notieren",
      "- Neue Wohnung übernehmen",
      "## Nach dem Umzug",
      "- Kartons auspacken (wichtige Zimmer zuerst)",
      "- Möbel aufbauen",
      "- Adressänderung bei allen Stellen durchführen",
      "- Nachsendeauftrag bei der Post aktivieren",
      "## Download",
      "Laden Sie unsere komplette PDF-Checkliste herunter und haken Sie Punkt für Punkt ab!"
    ],
  },
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? BLOG_CONTENT[slug] : null;

  // Generate SEO meta data
  const currentUrl = `https://www.umzugscheck.ch/blog/${slug}/`;
  const metaData = post ? {
    title: `${post.title} | umzugscheck.ch`,
    description: post.content[0].substring(0, 160),
    canonicalUrl: currentUrl,
    ogImage: 'https://www.umzugscheck.ch/assets/umzugscheck-logo.png'
  } : {
    title: 'Artikel nicht gefunden | umzugscheck.ch',
    description: 'Dieser Blogartikel existiert nicht.',
    canonicalUrl: currentUrl,
    ogImage: 'https://www.umzugscheck.ch/assets/umzugscheck-logo.png'
  };
  
  const ogTags = generateOGTags(metaData, currentUrl);
  const keywords = post ? getKeywordsForPage('', undefined, 'ratgeber') : [];

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Artikel nicht gefunden</h2>
            <p className="text-muted-foreground mb-6">Dieser Blogartikel existiert nicht.</p>
            <Link to="/blog">
              <Button>
                <ArrowLeft className="mr-2 w-4 h-4" />
                Zurück zum Blog
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
      </Helmet>

      <Navigation />

      <main className="flex-1">
        {/* Breadcrumbs */}
        <div className="container mx-auto px-4 pt-4">
          <Breadcrumbs
            items={[
              { label: "Blog", href: "/blog" },
              { label: post.title },
            ]}
          />
        </div>

        {/* Header */}
        <section className="py-12 md:py-16 gradient-hero text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Link to="/blog">
                <Button
                  variant="outline"
                  className="mb-6 border-white/20 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm"
                >
                  <ArrowLeft className="mr-2 w-4 h-4" />
                  Zurück zum Blog
                </Button>
              </Link>

              <Badge className="mb-4 bg-white/10 text-white border-white/20">
                {post.category}
              </Badge>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">{post.title}</h1>

              <div className="flex items-center gap-6 text-sm text-white/80">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(post.date).toLocaleDateString("de-CH", { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{post.readTime} Lesezeit</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <article className="prose prose-lg max-w-none">
                {post.content.map((paragraph, index) => {
                  if (paragraph.startsWith("##")) {
                    return (
                      <h2 key={index} className="text-2xl font-bold mt-8 mb-4">
                        {paragraph.replace("## ", "")}
                      </h2>
                    );
                  } else if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
                    return (
                      <p key={index} className="font-semibold mt-4 mb-2">
                        {paragraph.replace(/\*\*/g, "")}
                      </p>
                    );
                  } else if (paragraph.startsWith("-")) {
                    return (
                      <li key={index} className="ml-6">
                        {paragraph.replace("- ", "")}
                      </li>
                    );
                  } else {
                    return (
                      <p key={index} className="text-muted-foreground leading-relaxed mb-4">
                        {paragraph}
                      </p>
                    );
                  }
                })}
              </article>

              <Separator className="my-12" />

              {/* CTA */}
              <div className="text-center bg-secondary/30 rounded-xl p-8">
                <h3 className="text-2xl font-bold mb-4">Bereit für Ihren Umzug?</h3>
                <p className="text-muted-foreground mb-6">
                  Erhalten Sie jetzt kostenlose Offerten von geprüften Umzugsfirmen
                </p>
                <Link to="/rechner" className="w-full sm:w-auto inline-block">
                  <Button size="lg" className="w-full sm:w-auto bg-accent hover:bg-accent/90 shadow-accent text-base sm:text-lg px-4 sm:px-6 h-12 sm:h-14">
                    <span className="hidden sm:inline">Jetzt Offerten vergleichen</span>
                    <span className="sm:hidden">Offerten vergleichen</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;
