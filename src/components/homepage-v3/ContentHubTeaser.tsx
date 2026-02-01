/**
 * Content Hub Teaser V3 - Ratgeber prominent einbinden
 * Addresses gap: "Content Hub stärker nutzen"
 */
import { memo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Calculator, CheckSquare, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const articles = [
  {
    icon: Calculator,
    title: 'Umzugskosten berechnen',
    description: 'Was kostet ein Umzug in der Schweiz? Alle Faktoren im Überblick.',
    href: '/ratgeber/umzugskosten',
    tag: 'Beliebt',
  },
  {
    icon: CheckSquare,
    title: 'Umzugs-Checkliste 2026',
    description: 'Nichts vergessen: Die komplette Checkliste für Ihren Umzug.',
    href: '/ratgeber/umzug-checkliste',
    tag: 'Neu',
  },
  {
    icon: TrendingUp,
    title: '10 Tipps zum Sparen',
    description: 'So reduzieren Sie Ihre Umzugskosten um bis zu 50%.',
    href: '/ratgeber/umzug-sparen',
    tag: 'Tipp',
  },
];

export const ContentHubTeaser = memo(function ContentHubTeaser() {
  return (
    <section className="py-16 md:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-secondary mb-2">
              <BookOpen className="w-5 h-5" />
              <span className="font-semibold text-sm uppercase tracking-wide">Umzugswissen</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">
              Wir beantworten Ihre Fragen
            </h2>
          </div>
          <Link to="/ratgeber">
            <Button variant="outline" className="gap-2">
              Alle Ratgeber
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {articles.map((article, index) => (
            <Link 
              key={index}
              to={article.href}
              className="group bg-card rounded-2xl border border-border p-6 hover:border-secondary/50 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                  <article.icon className="w-6 h-6 text-secondary" />
                </div>
                <span className="text-xs font-semibold bg-secondary/10 text-secondary px-2 py-1 rounded-full">
                  {article.tag}
                </span>
              </div>

              <h3 className="font-bold text-lg mb-2 group-hover:text-secondary transition-colors">
                {article.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                {article.description}
              </p>

              <span className="text-secondary text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                Jetzt lesen
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          ))}
        </div>

        {/* Expertise Note */}
        <div className="mt-10 text-center">
          <p className="text-muted-foreground">
            Über <strong>50 Ratgeber-Artikel</strong> von unseren Umzugsexperten – 
            kostenlos und ohne Registrierung
          </p>
        </div>
      </div>
    </section>
  );
});
