/**
 * Post-Move Survey Page
 * Collects user feedback after their move
 */

import { Helmet } from 'react-helmet';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { PostMoveSurvey } from '@/components/move-health/PostMoveSurvey';

export default function PostMoveSurveyPage() {
  return (
    <>
      <Helmet>
        <title>Umzug bewerten | Ihre Meinung zählt | Umzugscheck.ch</title>
        <meta 
          name="description" 
          content="Bewerten Sie Ihren Umzug und helfen Sie anderen bei ihrer Entscheidung. Ihre Erfahrung fliesst in den Move Health Index ein." 
        />
        <link rel="canonical" href="https://umzugscheck.ch/umzug-bewerten" />
      </Helmet>

      <Navigation />

      <main className="min-h-screen bg-background pt-20">
        <div className="container max-w-4xl mx-auto px-4 py-8 md:py-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Wie war Ihr Umzug?
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Teilen Sie Ihre Erfahrung in 2 Minuten. Ihre Bewertung hilft anderen 
              und verbessert den Move Health Index.
            </p>
          </div>

          <PostMoveSurvey />
        </div>
      </main>

      <Footer />
    </>
  );
}
