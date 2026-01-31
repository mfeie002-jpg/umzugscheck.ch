/**
 * Quartier-Prognose Page
 * 
 * Public page for the Neighborhood Future Simulator tool.
 */

import { Helmet } from 'react-helmet';
import { NeighborhoodFutureSimulator } from '@/components/tools/NeighborhoodFutureSimulator';

export default function QuartierPrognose() {
  return (
    <>
      <Helmet>
        <title>Quartier-Prognose 2025-2035 | Schweizer Wohnlagen analysieren | Umzugscheck.ch</title>
        <meta 
          name="description" 
          content="Wie entwickelt sich Ihr Wunschquartier? Interaktive Prognose für Bevölkerung, Mietpreise und Infrastruktur bis 2035. Basierend auf BFS-Szenarien." 
        />
        <link rel="canonical" href="https://umzugscheck.ch/quartier-prognose" />
      </Helmet>

      <div className="container max-w-6xl py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Quartier-Prognose 2025–2035
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Planen Sie einen Umzug? Erfahren Sie, wie sich Bevölkerung, Mietpreise und 
            Infrastruktur in Ihrem Wunschquartier in den nächsten 10 Jahren entwickeln werden.
          </p>
        </div>

        <NeighborhoodFutureSimulator />
      </div>
    </>
  );
}
