/**
 * Golden Demo Page - Showcase of all Golden Components
 * 
 * This page demonstrates all Golden components working together.
 * Access at: /golden-demo
 */

import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { 
  GoldenNavigation, 
  GoldenSocialProof, 
  GoldenTrustBadges,
  GoldenHeroTabs 
} from '@/components/golden';
import { GoldenFlowWizard } from '@/components/golden-flow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Eye, Layout, Users, Sparkles, Star, 
  Navigation, MessageSquare, CheckCircle 
} from 'lucide-react';

const GoldenDemoPage = () => {
  const [activeSection, setActiveSection] = useState<string>('overview');

  return (
    <>
      <Helmet>
        <title>Golden Components Demo | Umzugscheck.ch</title>
        <meta 
          name="description" 
          content="Demo page showcasing the Golden Component Suite - optimized for maximum conversion." 
        />
      </Helmet>

      {/* Golden Navigation Demo */}
      <GoldenNavigation />

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 pt-20">
        {/* Page Header */}
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
          <Badge className="mb-4 bg-gradient-to-r from-primary to-secondary text-primary-foreground">
            <Star className="w-3 h-3 mr-1" /> Golden Component Suite
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Golden Components Demo
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Konsolidierte "Best-of" Versionen aller A/B-Test Varianten.
              Optimiert für maximale Conversion.
            </p>
          </div>

          <Tabs value={activeSection} onValueChange={setActiveSection} className="space-y-8">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2 h-auto">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Eye className="w-4 h-4" /> Übersicht
              </TabsTrigger>
              <TabsTrigger value="navigation" className="flex items-center gap-2">
                <Navigation className="w-4 h-4" /> Navigation
              </TabsTrigger>
              <TabsTrigger value="social" className="flex items-center gap-2">
                <Users className="w-4 h-4" /> Social Proof
              </TabsTrigger>
              <TabsTrigger value="hero" className="flex items-center gap-2">
                <Layout className="w-4 h-4" /> Hero Tabs
              </TabsTrigger>
              <TabsTrigger value="flow" className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Golden Flow
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ComponentCard
                  title="GoldenNavigation"
                  description="Optimierte Navigation mit 5 Hauptmenü-Items, Mega-Dropdowns und Emoji-Kongruenz"
                  features={['V15-basiert', 'Responsive', 'Touch-optimiert', 'Sticky CTA']}
                  status="production"
                />
                <ComponentCard
                  title="GoldenSocialProof"
                  description="Social Proof mit Live-Ticker, Trust Stats und Media Logos"
                  features={['3 Varianten', 'Animiert', 'Testimonials', 'Activity Ticker']}
                  status="production"
                />
                <ComponentCard
                  title="GoldenHeroTabs"
                  description="4 Methoden-Tabs: Formular, Video, KI-Chat, WhatsApp"
                  features={['Tab Hints', 'Subtitles', 'Mobile-first', 'Zugänglich']}
                  status="production"
                />
                <ComponentCard
                  title="GoldenTrustBadges"
                  description="Wiederverwendbare Trust-Badges mit verschiedenen Presets"
                  features={['4 Presets', 'Responsive', 'Themeable', 'SEO-ready']}
                  status="production"
                />
                <ComponentCard
                  title="GoldenFlowWizard"
                  description="4-Step Conversion Flow mit Preis-Preview und Labor Illusion"
                  features={['4 Steps', 'LocalStorage', 'KI-Video USP', 'Trust Pills']}
                  status="production"
                />
                <ComponentCard
                  title="GoldenDropdown"
                  description="Mega-Menu Dropdowns mit Trust-Microbar und animierten Items"
                  features={['Mega-Menu', 'Emoji Icons', 'Animiert', 'Keyboard Nav']}
                  status="production"
                />
              </div>
            </TabsContent>

            {/* Navigation Tab */}
            <TabsContent value="navigation">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Navigation className="w-5 h-5" />
                    GoldenNavigation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Die Navigation oben zeigt die GoldenNavigation in Aktion. 
                    Sie kombiniert die besten Patterns aus V15 mit:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5" />
                      <span>5 gleichmässig ausgerichtete Menü-Items mit Text-Emojis</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5" />
                      <span>Mega-Dropdowns mit Trust-Microbar und Beschreibungen</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5" />
                      <span>Mobile: Akkordeon-Menü mit Sticky CTA Footer</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5" />
                      <span>Kontextabhängige CTA-Labels basierend auf Route</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Social Proof Tab */}
            <TabsContent value="social" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>GoldenSocialProof - Full Variant</CardTitle>
                </CardHeader>
                <CardContent>
                  <GoldenSocialProof variant="full" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>GoldenSocialProof - Compact Variant</CardTitle>
                </CardHeader>
                <CardContent>
                  <GoldenSocialProof variant="compact" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>GoldenSocialProof - Strip Variant</CardTitle>
                </CardHeader>
                <CardContent>
                  <GoldenSocialProof variant="strip" />
                </CardContent>
              </Card>

              <Separator className="my-8" />

              <Card>
                <CardHeader>
                  <CardTitle>GoldenTrustBadges - Presets</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Default Preset</p>
                    <GoldenTrustBadges preset="default" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Premium Preset</p>
                    <GoldenTrustBadges preset="premium" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Minimal Preset</p>
                    <GoldenTrustBadges preset="minimal" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Form Preset</p>
                    <GoldenTrustBadges preset="form" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Hero Tabs Tab */}
            <TabsContent value="hero">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layout className="w-5 h-5" />
                    GoldenHeroTabs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <GoldenHeroTabs 
                    onTabChange={(tabId) => console.log('Selected tab:', tabId)}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Golden Flow Tab */}
            <TabsContent value="flow">
              <Card className="border-0 shadow-none bg-transparent">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Golden Flow Wizard
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Der optimierte 4-Step Conversion Flow
                  </p>
                </CardHeader>
                <CardContent className="p-0">
                  <GoldenFlowWizard />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

// Helper component for component cards
interface ComponentCardProps {
  title: string;
  description: string;
  features: string[];
  status: 'production' | 'beta' | 'testing';
}

const ComponentCard = ({ title, description, features, status }: ComponentCardProps) => (
  <Card className="hover:shadow-lg transition-shadow">
    <CardHeader>
      <div className="flex items-start justify-between">
        <CardTitle className="text-lg">{title}</CardTitle>
        <Badge 
          variant={status === 'production' ? 'default' : 'secondary'}
          className={status === 'production' ? 'bg-primary' : ''}
        >
          {status}
        </Badge>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      <div className="flex flex-wrap gap-2">
        {features.map((feature, idx) => (
          <Badge key={idx} variant="outline" className="text-xs">
            {feature}
          </Badge>
        ))}
      </div>
    </CardContent>
  </Card>
);

export default GoldenDemoPage;
