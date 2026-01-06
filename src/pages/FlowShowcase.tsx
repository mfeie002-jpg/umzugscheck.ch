/**
 * Flow Showcase - Standalone Landing Pages für Flow-Gruppen
 * Mobile-optimiert, keine iframes - Flows direkt eingebettet
 */

import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Star, Zap, Trophy, ChevronRight, ExternalLink } from 'lucide-react';

// Flow-Gruppen Definition
const FLOW_GROUPS = {
  'gemini-top': {
    title: 'Gemini Top Flows',
    subtitle: 'Die 3 höchstbewerteten Flows (Score 4.8-5.0)',
    color: 'from-amber-500 to-orange-600',
    flows: [
      { id: 'v9-zero-friction', name: 'V9 Zero Friction', score: '4.9', path: '/v9-zero-friction', description: '5 Steps, Route-Fokus, Labor Illusion' },
      { id: 'ultimate-best36', name: 'Ultimate Best36', score: '4.8', path: '/ultimate-best36', description: '4 Steps, Auto-Advance, High-Contrast' },
      { id: 'golden-flow-v10', name: 'Golden Flow V10', score: '5.0', path: '/golden-flow-v10', description: '6 Steps, Glassmorphism, Perfekter Score' },
    ]
  },
  'swiss-premium': {
    title: 'Swiss Premium Flows',
    subtitle: '3 neue Flows mit modernsten Flow-Components',
    color: 'from-emerald-500 to-teal-600',
    flows: [
      { id: 'swiss-lightning', name: 'Swiss Lightning', score: '⚡', path: '/swiss-lightning', description: '2 Steps, 90 Sek. bis Lead' },
      { id: 'swiss-premium-choice', name: 'Swiss Premium Choice', score: '💎', path: '/swiss-premium-choice', description: '3 Steps mit Paketauswahl' },
      { id: 'swiss-concierge-hybrid', name: 'Swiss Concierge Hybrid', score: '🎬', path: '/swiss-concierge-hybrid', description: '4 Steps, optionales Video' },
    ]
  },
  'chatgpt': {
    title: 'ChatGPT Optimized Flows',
    subtitle: '3 Premium-Flows von ChatGPT optimiert',
    color: 'from-blue-500 to-teal-500',
    flows: [
      { id: 'chatgpt-flow-1', name: 'ChatGPT Flow 1', score: '⭐⭐', path: '/chatgpt-flow-1', description: 'Zero Friction Pro: 2 Steps' },
      { id: 'chatgpt-flow-2', name: 'ChatGPT Flow 2', score: '⭐⭐', path: '/chatgpt-flow-2', description: 'Social Proof Boosted: 3 Steps' },
      { id: 'chatgpt-flow-3', name: 'ChatGPT Flow 3', score: '⭐⭐', path: '/chatgpt-flow-3', description: 'Personalized Guided Chat' },
    ]
  },
};

export default function FlowShowcase() {
  const { groupId } = useParams<{ groupId: string }>();
  const group = FLOW_GROUPS[groupId as keyof typeof FLOW_GROUPS];
  const [expandedFlow, setExpandedFlow] = useState<string | null>(null);

  if (!group) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold mb-2">Flow-Gruppe nicht gefunden</h2>
            <p className="text-muted-foreground mb-4">Die angeforderte Flow-Gruppe existiert nicht.</p>
            <Button asChild>
              <Link to="/flow-tester">Zurück zum Flow-Tester</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Helmet>
        <title>{group.title} | Umzugscheck.ch</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-lg border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/flow-tester">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="font-bold text-lg">{group.title}</h1>
              <p className="text-sm text-muted-foreground">{group.subtitle}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Flow Cards - Mobile-First Vertical Layout */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {group.flows.map((flow, index) => (
          <motion.div
            key={flow.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden">
              <CardHeader className={`bg-gradient-to-r ${group.color} text-white`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                      {groupId === 'gemini-top' && <Trophy className="h-5 w-5" />}
                      {groupId === 'swiss-premium' && <Zap className="h-5 w-5" />}
                      {groupId === 'chatgpt' && <Star className="h-5 w-5" />}
                    </div>
                    <div>
                      <CardTitle className="text-white text-lg">{flow.name}</CardTitle>
                      <p className="text-white/80 text-sm">{flow.description}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-white/20 text-white border-0">
                    {flow.score}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="p-4 space-y-4">
                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button asChild className="flex-1" size="lg">
                    <Link to={flow.path}>
                      Flow öffnen
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1" 
                    size="lg"
                    onClick={() => setExpandedFlow(expandedFlow === flow.id ? null : flow.id)}
                  >
                    {expandedFlow === flow.id ? 'Vorschau schliessen' : 'Vorschau anzeigen'}
                    <ChevronRight className={`ml-2 h-4 w-4 transition-transform ${expandedFlow === flow.id ? 'rotate-90' : ''}`} />
                  </Button>
                </div>

                {/* Expanded Preview - Full Height on Mobile */}
                {expandedFlow === flow.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border rounded-lg overflow-hidden"
                  >
                    <div className="bg-muted/50 p-2 text-center text-sm text-muted-foreground border-b">
                      Live-Vorschau • <Link to={flow.path} className="text-primary hover:underline">Vollbild öffnen →</Link>
                    </div>
                    <iframe
                      src={flow.path}
                      className="w-full h-[70vh] sm:h-[600px] border-0"
                      title={`Preview: ${flow.name}`}
                    />
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {/* Quick Links zu anderen Gruppen */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-base">Andere Flow-Gruppen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {Object.entries(FLOW_GROUPS)
                .filter(([key]) => key !== groupId)
                .map(([key, g]) => (
                  <Button key={key} variant="outline" asChild className="justify-start">
                    <Link to={`/flows/${key}`}>
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${g.color} mr-2`} />
                      {g.title}
                    </Link>
                  </Button>
                ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
