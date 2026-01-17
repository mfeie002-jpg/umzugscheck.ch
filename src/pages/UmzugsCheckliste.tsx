/**
 * Umzugs-Checkliste Page
 * Interactive checklist with progress tracking
 */
import { lazy, Suspense } from 'react';
import { Helmet } from 'react-helmet';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { InteractiveChecklist } from '@/components/premium/InteractiveChecklist';
import { PersonalizedTimeline } from '@/components/premium/PersonalizedTimeline';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Download, CheckCircle2, Calendar, Clock, Truck } from 'lucide-react';

const UmzugsCheckliste = () => {
  return (
    <>
      <Helmet>
        <title>Umzugs-Checkliste 2026 | Kostenlos & Interaktiv | Umzugscheck.ch</title>
        <meta
          name="description"
          content="Die ultimative Schweizer Umzugs-Checkliste 2026: Interaktiv, personalisiert mit Ihrem Umzugstermin. Alle Aufgaben von 3 Monaten vorher bis nach dem Umzug."
        />
        <link rel="canonical" href="https://umzugscheck.ch/umzug-planen/checkliste" />
      </Helmet>

      <Navigation />

      <main className="min-h-screen bg-background pt-20">
        <div className="container py-12">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
              <CheckCircle2 className="w-4 h-4" />
              Kostenlos & Interaktiv
            </span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Deine Umzugs-Checkliste{' '}
              <span className="text-secondary">2026</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Alle wichtigen Aufgaben für deinen stressfreien Umzug in der Schweiz. 
              Automatisch personalisiert mit deinem Umzugstermin.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { icon: CheckCircle2, label: '28 Aufgaben', desc: 'Alle wichtigen Steps' },
              { icon: Calendar, label: '5 Phasen', desc: 'Von -3 Monate bis +1 Monat' },
              { icon: Clock, label: '~8 Stunden', desc: 'Geschätzte Gesamtzeit' },
              { icon: Truck, label: 'Swiss Made', desc: 'Für CH optimiert' },
            ].map((stat, i) => (
              <Card key={i}>
                <CardContent className="py-4 text-center">
                  <stat.icon className="w-6 h-6 mx-auto mb-2 text-secondary" />
                  <p className="font-semibold">{stat.label}</p>
                  <p className="text-xs text-muted-foreground">{stat.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Checklist */}
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <InteractiveChecklist />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Timeline Widget */}
              <PersonalizedTimeline variant="compact" />

              {/* CTA Card */}
              <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5">
                <CardContent className="pt-6">
                  <h3 className="font-bold text-lg mb-2">
                    Noch keine Umzugsfirma?
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Vergleiche kostenlos Offerten von geprüften Schweizer Umzugsfirmen.
                  </p>
                  <Button asChild className="w-full">
                    <Link to="/umzugsofferten">
                      Jetzt Offerten vergleichen
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* PDF Download */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Download className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">PDF-Checkliste</h4>
                      <p className="text-xs text-muted-foreground">Zum Ausdrucken</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full" asChild>
                    <a href="/documents/schweizer-umzugs-checkliste.pdf" download>
                      <Download className="w-4 h-4 mr-2" />
                      Gratis herunterladen
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default UmzugsCheckliste;
