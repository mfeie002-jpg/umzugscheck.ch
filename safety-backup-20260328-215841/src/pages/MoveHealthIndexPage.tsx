/**
 * Move Health Index Page
 * Public dashboard showing move satisfaction by canton
 */

import { Helmet } from 'react-helmet';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { MoveHealthDashboard } from '@/components/move-health/MoveHealthDashboard';

export default function MoveHealthIndexPage() {
  return (
    <>
      <Helmet>
        <title>Move Health Index Schweiz 2025 | Umzugszufriedenheit nach Kanton | Umzugscheck.ch</title>
        <meta 
          name="description" 
          content="Der Move Health Index misst die Umzugszufriedenheit in allen 26 Schweizer Kantonen. Basierend auf echten Bewertungen zu Planung, Umzugstag und Administration." 
        />
        <link rel="canonical" href="https://umzugscheck.ch/move-health-index" />
      </Helmet>

      <Navigation />

      <main className="min-h-screen bg-background pt-20">
        <div className="container max-w-6xl mx-auto px-4 py-8 md:py-12">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Move Health Index Schweiz
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Wie zufrieden sind Schweizer mit ihrem Umzug? Der Move Health Index 
              zeigt Zufriedenheit, Stresslevel und administrative Hürden nach Kanton.
            </p>
          </div>

          <MoveHealthDashboard />
        </div>
      </main>

      <Footer />
    </>
  );
}
