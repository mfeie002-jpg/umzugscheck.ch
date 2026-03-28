/**
 * V3 Variant Comparison Page
 * Overview of all V3 sub-variants with quick links to test them
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Smartphone, ArrowRight, ExternalLink, Play, CheckCircle2, 
  Eye, Zap, Hand, Maximize, MessageSquare, BarChart3,
  ArrowLeft, Grid3X3, List
} from 'lucide-react';
import { SEOHead } from '@/components/SEOHead';

interface V3Variant {
  id: string;
  label: string;
  version: string;
  description: string;
  path: string;
  icon: React.ReactNode;
  color: string;
  features: string[];
  status: 'live' | 'testing' | 'pending';
  feedbackBased?: boolean;
}

const V3_VARIANTS: V3Variant[] = [
  {
    id: 'v3',
    label: 'V3 Base (God Mode)',
    version: 'V3.0',
    description: 'Slider-basierte Delegation mit Live-Preisvorschau',
    path: '/umzugsofferten-v3',
    icon: <Zap className="h-5 w-5" />,
    color: 'bg-green-500',
    features: ['Delegation Slider', 'Live-Preis', 'Service Pakete', '4 Steps'],
    status: 'live',
  },
  {
    id: 'v3a',
    label: 'V3a Mobile-First',
    version: 'V3.A',
    description: 'Touch-optimiert mit grossen Targets',
    path: '/umzugsofferten?v=3a',
    icon: <Smartphone className="h-5 w-5" />,
    color: 'bg-green-400',
    features: ['Large Touch Targets', 'Bottom Nav', 'Mobile Hero'],
    status: 'live',
  },
  {
    id: 'v3b',
    label: 'V3b Swipe Navigation',
    version: 'V3.B',
    description: 'Swipe-Gesten zwischen Steps',
    path: '/umzugsofferten?v=3b',
    icon: <Hand className="h-5 w-5" />,
    color: 'bg-green-600',
    features: ['Swipe Gestures', 'Carousel Steps', 'Fluid Motion'],
    status: 'live',
  },
  {
    id: 'v3c',
    label: 'V3c Bottom Sheet',
    version: 'V3.C',
    description: 'Native App-Style Bottom Sheets',
    path: '/umzugsofferten?v=3c',
    icon: <List className="h-5 w-5" />,
    color: 'bg-green-700',
    features: ['Bottom Sheet UI', 'Pull-to-Dismiss', 'Overlay Inputs'],
    status: 'testing',
  },
  {
    id: 'v3d',
    label: 'V3d Thumb Zone',
    version: 'V3.D',
    description: 'Optimiert für Daumen-Erreichbarkeit',
    path: '/umzugsofferten?v=3d',
    icon: <Hand className="h-5 w-5" />,
    color: 'bg-green-800',
    features: ['Thumb Zone', 'Bottom Actions', 'One-Hand Use'],
    status: 'testing',
  },
  {
    id: 'v3e',
    label: 'V3e Fullscreen',
    version: 'V3.E',
    description: 'Immersives Fullscreen-Erlebnis',
    path: '/umzugsofferten?v=3e',
    icon: <Maximize className="h-5 w-5" />,
    color: 'bg-violet-500',
    features: ['Fullscreen', 'No Distractions', 'Focus Mode'],
    status: 'testing',
  },
  {
    id: 'v3g',
    label: 'V3g Feedback-Based',
    version: 'V3.G',
    description: 'Basierend auf ChatGPT UX-Analyse',
    path: '/umzugsofferten?v=3g',
    icon: <MessageSquare className="h-5 w-5" />,
    color: 'bg-emerald-500',
    features: ['UX-Optimiert', 'Wording Fix', 'Trust Enhanced', 'Mobile Overlay Fix'],
    status: 'pending',
    feedbackBased: true,
  },
];

const StatusBadge = ({ status }: { status: V3Variant['status'] }) => {
  const config = {
    live: { label: 'Live', className: 'bg-green-500/10 text-green-600 border-green-500/20' },
    testing: { label: 'Testing', className: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' },
    pending: { label: 'Pending', className: 'bg-gray-500/10 text-gray-600 border-gray-500/20' },
  };
  return (
    <Badge variant="outline" className={config[status].className}>
      {config[status].label}
    </Badge>
  );
};

export default function V3VariantComparison() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const liveVariants = V3_VARIANTS.filter(v => v.status === 'live');
  const testingVariants = V3_VARIANTS.filter(v => v.status === 'testing');
  const pendingVariants = V3_VARIANTS.filter(v => v.status === 'pending');

  const VariantCard = ({ variant, index }: { variant: V3Variant; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className={`h-full hover:shadow-lg transition-all duration-200 ${variant.feedbackBased ? 'ring-2 ring-primary/50' : ''}`}>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className={`w-10 h-10 rounded-lg ${variant.color} flex items-center justify-center text-white`}>
              {variant.icon}
            </div>
            <StatusBadge status={variant.status} />
          </div>
          <CardTitle className="text-lg mt-2">{variant.label}</CardTitle>
          <p className="text-sm text-muted-foreground">{variant.description}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-1">
            {variant.features.map((feature, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {feature}
              </Badge>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Button asChild variant="default" size="sm" className="flex-1">
              <Link to={variant.path}>
                <Play className="h-4 w-4 mr-1" />
                Testen
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <a href={variant.path} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
          
          {variant.feedbackBased && (
            <div className="text-xs text-primary bg-primary/5 p-2 rounded flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              Basiert auf ChatGPT UX-Feedback
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  const VariantRow = ({ variant, index }: { variant: V3Variant; index: number }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
      className={`flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors ${variant.feedbackBased ? 'ring-2 ring-primary/50' : ''}`}
    >
      <div className={`w-10 h-10 rounded-lg ${variant.color} flex items-center justify-center text-white shrink-0`}>
        {variant.icon}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium">{variant.label}</span>
          <StatusBadge status={variant.status} />
          {variant.feedbackBased && (
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
              <MessageSquare className="h-3 w-3 mr-1" />
              AI-Optimiert
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground truncate">{variant.description}</p>
      </div>
      
      <div className="flex gap-2 shrink-0">
        <Button asChild size="sm">
          <Link to={variant.path}>
            <Play className="h-4 w-4 mr-1" />
            Testen
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <a href={variant.path} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </div>
    </motion.div>
  );

  return (
    <>
      <SEOHead
        pageType="main-page"
        pageName="flow-tester"
        url="/v3-varianten"
      />
      
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container py-8 max-w-6xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                <Link to="/flow-tester" className="hover:text-foreground flex items-center gap-1">
                  <ArrowLeft className="h-4 w-4" />
                  Flow Tester
                </Link>
                <span>/</span>
                <span>V3 Varianten</span>
              </div>
              <h1 className="text-3xl font-bold">V3 Mobile-First Varianten</h1>
              <p className="text-muted-foreground mt-1">
                {V3_VARIANTS.length} Varianten zum Testen und Vergleichen
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{liveVariants.length}</div>
                  <div className="text-sm text-muted-foreground">Live</div>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                  <Eye className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{testingVariants.length}</div>
                  <div className="text-sm text-muted-foreground">Testing</div>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{pendingVariants.length}</div>
                  <div className="text-sm text-muted-foreground">Feedback-Based</div>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Tabs */}
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList>
              <TabsTrigger value="all">Alle ({V3_VARIANTS.length})</TabsTrigger>
              <TabsTrigger value="live">Live ({liveVariants.length})</TabsTrigger>
              <TabsTrigger value="testing">Testing ({testingVariants.length})</TabsTrigger>
              <TabsTrigger value="feedback">AI-Optimiert ({pendingVariants.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              {viewMode === 'grid' ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {V3_VARIANTS.map((variant, i) => (
                    <VariantCard key={variant.id} variant={variant} index={i} />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {V3_VARIANTS.map((variant, i) => (
                    <VariantRow key={variant.id} variant={variant} index={i} />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="live">
              {viewMode === 'grid' ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {liveVariants.map((variant, i) => (
                    <VariantCard key={variant.id} variant={variant} index={i} />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {liveVariants.map((variant, i) => (
                    <VariantRow key={variant.id} variant={variant} index={i} />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="testing">
              {viewMode === 'grid' ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {testingVariants.map((variant, i) => (
                    <VariantCard key={variant.id} variant={variant} index={i} />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {testingVariants.map((variant, i) => (
                    <VariantRow key={variant.id} variant={variant} index={i} />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="feedback">
              {pendingVariants.length > 0 ? (
                viewMode === 'grid' ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pendingVariants.map((variant, i) => (
                      <VariantCard key={variant.id} variant={variant} index={i} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {pendingVariants.map((variant, i) => (
                      <VariantRow key={variant.id} variant={variant} index={i} />
                    ))}
                  </div>
                )
              ) : (
                <Card className="p-8 text-center">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium mb-2">Keine Feedback-basierten Varianten</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Erstelle neue Varianten basierend auf ChatGPT-Feedback im Admin-Bereich.
                  </p>
                  <Button asChild variant="outline">
                    <Link to="/admin/tools?tab=screenshots">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Screenshots vergleichen
                    </Link>
                  </Button>
                </Card>
              )}
            </TabsContent>
          </Tabs>
          
          {/* Quick Actions */}
          <Card className="mt-8 p-6 bg-muted/30">
            <h3 className="font-medium mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline">
                <Link to="/flow-tester">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Alle Flows testen
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/admin/tools?tab=screenshots">
                  <Eye className="h-4 w-4 mr-2" />
                  Screenshots vergleichen
                </Link>
              </Button>
              <Button asChild variant="outline">
                <a href="/umzugsofferten-v3" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  V3 Base öffnen
                </a>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
