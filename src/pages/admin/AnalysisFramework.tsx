/**
 * Analysis Framework Page - Static reference material for flow analysis methodology
 * 
 * Contains:
 * - Swiss market specifics (Swissness, ASTAG, Zügeltage)
 * - Archetype methodology and needs matrix
 * - 6-Step Framework explanation
 * - Pricing model reference
 * - Compliance requirements
 */

import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Users, Shield, Banknote, Calendar, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  SwissnessPanel,
  ArchetypeNeedsMatrix,
  SixStepFrameworkPanel,
  ComplexityScorePanel,
  PricingBreakdownPanel,
  SeasonalDemandPanel,
  ComplianceChecksPanel
} from '@/components/admin/analysis';

export default function AnalysisFramework() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/admin/flow-deep-analysis">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-primary" />
              Analyse-Framework & Methodik
            </h1>
            <p className="text-muted-foreground mt-1">
              Referenzmaterial für die Flow-Analyse im Schweizer Umzugsmarkt
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="archetypes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
            <TabsTrigger value="archetypes" className="gap-2">
              <Users className="h-4 w-4" />
              Archetypen
            </TabsTrigger>
            <TabsTrigger value="swissness" className="gap-2">
              <Shield className="h-4 w-4" />
              Swissness
            </TabsTrigger>
            <TabsTrigger value="pricing" className="gap-2">
              <Banknote className="h-4 w-4" />
              Pricing
            </TabsTrigger>
            <TabsTrigger value="compliance" className="gap-2">
              <Scale className="h-4 w-4" />
              Compliance
            </TabsTrigger>
          </TabsList>

          {/* Archetypes Tab */}
          <TabsContent value="archetypes" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* 6-Step Framework - Full width */}
              <div className="lg:col-span-2">
                <SixStepFrameworkPanel sixStepAnalysis={[]} />
              </div>
              
              {/* Archetype Needs Matrix - Full width */}
              <div className="lg:col-span-2">
                <ArchetypeNeedsMatrix archetypeScores={[]} />
              </div>
            </div>
          </TabsContent>

          {/* Swissness Tab */}
          <TabsContent value="swissness" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <SwissnessPanel swissMarketScores={[]} />
              <ComplianceChecksPanel />
            </div>
          </TabsContent>

          {/* Pricing Tab */}
          <TabsContent value="pricing" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <ComplexityScorePanel />
              <PricingBreakdownPanel />
              <div className="lg:col-span-2">
                <SeasonalDemandPanel />
              </div>
            </div>
          </TabsContent>

          {/* Compliance Tab */}
          <TabsContent value="compliance" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <ComplianceChecksPanel />
              <SwissnessPanel swissMarketScores={[]} />
            </div>
          </TabsContent>
        </Tabs>

        {/* Back to Analysis Link */}
        <div className="mt-12 text-center">
          <Button asChild variant="outline" size="lg">
            <Link to="/admin/flow-deep-analysis" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Zurück zur Flow-Analyse
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
