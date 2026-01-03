import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ZuerichLandingPage = () => {
  const [fromLocation, setFromLocation] = useState("8001 Zürich"); // Prefill "Umzug von"
  const [showStickyBar, setShowStickyBar] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowStickyBar(window.scrollY > 700);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Umzugsfirmen Zürich vergleichen | Gratis Offerten | Umzugscheck.ch</title>
        <meta
          name="description"
          content="Vergleichen Sie geprüfte Umzugsfirmen in Zürich. 3–5 kostenlose Offerten, transparente Preise & echte Bewertungen. Jetzt gratis vergleichen."
        />
        <link rel="canonical" href="https://umzugscheck.ch/umzugsfirmen/zuerich" />
      </Helmet>

      <main>
        {/* HERO SECTION */}
        <section className="relative min-h-[92vh] flex items-center overflow-hidden">
          <div className="container relative z-10 px-4 py-12 md:py-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight">
              Umzug Zürich – Jetzt gratis vergleichen
            </h1>
            <p className="text-lg md:text-xl text-white/85 mb-6 max-w-xl mx-auto lg:mx-0">
              Vergleichen Sie <strong>80+ geprüfte Umzugsfirmen</strong> in Zürich, Winterthur & Umgebung.
              <span className="text-green-400 font-semibold"> Bis zu 40% sparen.</span>
            </p>
            <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold">
              <Link to="#anfrage">Jetzt Offerten anfordern</Link>
            </Button>
          </div>
        </section>

        {/* FORM SECTION */}
        <section id="anfrage" className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-xl font-bold mb-4">Anfrageformular</h2>
            <form>
              <Label htmlFor="from">Umzug von</Label>
              <Input
                id="from"
                value={fromLocation}
                onChange={(e) => setFromLocation(e.target.value)}
                placeholder="8001 oder Zürich"
              />
            </form>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section id="faq" className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-xl font-bold mb-4">Häufige Fragen zum Umzug in Zürich</h2>
            <ul className="space-y-4">
              <li>
                <strong>Was kostet ein Umzug in Zürich?</strong>
                <p>
                  Ein 2-Zimmer-Umzug innerhalb Zürich kostet ca. CHF 650–1'100, ein 4-Zimmer-Umzug ca. CHF 950–1'500.
                  Die Preise variieren je nach Entfernung und Aufwand.
                </p>
              </li>
              <li>
                <strong>Brauche ich eine Parkbewilligung in Zürich?</strong>
                <p>
                  Ja, in den meisten Quartieren ist eine Halteverbotszone nötig. Die Kosten liegen bei ca. CHF 80–150.
                </p>
              </li>
              <li>
                <strong>Wann ist die beste Zeit für einen Umzug?</strong>
                <p>
                  Die beste Zeit ist außerhalb der Hochsaison (April–September). Buchen Sie mindestens 4–6 Wochen im
                  Voraus.
                </p>
              </li>
            </ul>
          </div>
        </section>
      </main>

      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-card/98 backdrop-blur-xl border-t border-border p-3 shadow-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold">Bis 40% sparen</p>
                <p className="text-xs text-muted-foreground">80+ geprüfte Firmen</p>
              </div>
              <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold shrink-0">
                <Link to="/umzugsofferten">Gratis Offerten</Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ZuerichLandingPage;
