/**
 * DATA JOURNALISM PAGE
 * Hub page for all data journalism tools
 */

import { Helmet } from 'react-helmet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MovingCostIndex } from '@/components/data-journalism/MovingCostIndex';
import { MovingStatisticsDashboard } from '@/components/data-journalism/MovingStatisticsDashboard';
import { LivingCostComparison } from '@/components/data-journalism/LivingCostComparison';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function DataJournalismPage() {
  return (
    <>
      <Helmet>
        <title>Umzugsdaten & Statistiken Schweiz 2024 | umzugscheck.ch</title>
        <meta name="description" content="Umzugskosten-Index, Statistiken und Lebenskosten-Vergleich für die Schweiz. Basierend auf 50'000+ Umzugsanfragen." />
        <link rel="canonical" href="https://umzugscheck.ch/daten" />
      </Helmet>
      
      <Navigation />
      
      <main className="min-h-screen bg-background pt-20">
        <Tabs defaultValue="index" className="w-full">
          <div className="container max-w-6xl mx-auto px-4 pt-8">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="index">Umzugskosten-Index</TabsTrigger>
              <TabsTrigger value="stats">Statistik-Dashboard</TabsTrigger>
              <TabsTrigger value="living">Lebenskosten-Vergleich</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="index">
            <MovingCostIndex />
          </TabsContent>
          
          <TabsContent value="stats">
            <MovingStatisticsDashboard />
          </TabsContent>
          
          <TabsContent value="living">
            <LivingCostComparison />
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </>
  );
}
