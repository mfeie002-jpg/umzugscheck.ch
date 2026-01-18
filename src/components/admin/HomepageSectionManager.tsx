/**
 * Homepage Section Manager - A/B Testing for Homepage sections after the hero
 * Manages: Social Proof, Features/Services, Testimonials, etc.
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  LayoutGrid, 
  RefreshCw, 
  Eye, 
  Power,
  PowerOff,
  Users,
  Star,
  Boxes,
  MessageSquare,
  BarChart3,
  Trash2
} from 'lucide-react';

// Section types that can be A/B tested
interface SectionConfig {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  variants: {
    id: string;
    name: string;
    description: string;
  }[];
}

const HOMEPAGE_SECTIONS: SectionConfig[] = [
  {
    id: 'social-proof',
    name: 'Social Proof / Trust Badges',
    description: 'Bekannt aus, Bewertungen, Partner-Logos',
    icon: Users,
    variants: [
      { id: 'social-proof-v1', name: 'Klassisch', description: 'Logo-Leiste mit Bewertungen' },
      { id: 'social-proof-v2', name: 'Animated', description: 'Animierte Ticker mit Live-Aktivität' },
      { id: 'social-proof-v3', name: 'Minimal', description: 'Nur Zahlen, kein Logo' },
      { id: 'social-proof-v4', name: 'Premium', description: 'Grosse Karten mit Zertifikaten' },
    ],
  },
  {
    id: 'features-bento',
    name: 'Features / Services Bento',
    description: 'Service-Grid nach dem Hero',
    icon: Boxes,
    variants: [
      { id: 'features-v1', name: 'Bento Grid', description: '6 Karten asymmetrisch' },
      { id: 'features-v2', name: 'List Style', description: 'Vertikale Liste mit Icons' },
      { id: 'features-v3', name: 'Carousel', description: 'Horizontal scrollbar' },
    ],
  },
  {
    id: 'testimonials',
    name: 'Testimonials / Reviews',
    description: 'Kundenbewertungen Slider/Grid',
    icon: MessageSquare,
    variants: [
      { id: 'testimonials-v1', name: 'Carousel', description: 'Automatisch rotierend' },
      { id: 'testimonials-v2', name: 'Grid', description: '3-Spalten Grid' },
      { id: 'testimonials-v3', name: 'Featured', description: 'Eine grosse Bewertung' },
    ],
  },
  {
    id: 'how-it-works',
    name: 'So funktioniert es',
    description: '3-Schritte Prozess-Erklärung',
    icon: Star,
    variants: [
      { id: 'hiw-v1', name: 'Timeline', description: 'Horizontale Timeline' },
      { id: 'hiw-v2', name: 'Cards', description: 'Nummerierte Karten' },
      { id: 'hiw-v3', name: 'Minimal', description: 'Nur Text mit Icons' },
    ],
  },
];

const SECTION_STORAGE_PREFIX = 'homepage_section_';

export function HomepageSectionManager() {
  const [isActive, setIsActive] = useState(true);
  const [sectionVariants, setSectionVariants] = useState<Record<string, string>>({});
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadCurrentVariants();
    fetchStats();
  }, []);

  const loadCurrentVariants = () => {
    const variants: Record<string, string> = {};
    HOMEPAGE_SECTIONS.forEach(section => {
      const stored = localStorage.getItem(`${SECTION_STORAGE_PREFIX}${section.id}`);
      variants[section.id] = stored || section.variants[0].id;
    });
    setSectionVariants(variants);
    
    const activeState = localStorage.getItem('homepage_sections_ab_active');
    setIsActive(activeState !== 'false');
    setLoading(false);
  };

  const fetchStats = async () => {
    try {
      // Fetch section-specific events
      const { data, error } = await supabase
        .from('homepage_ab_events')
        .select('flow_variant, event_type, metadata')
        .order('created_at', { ascending: false })
        .limit(1000);

      if (error) throw error;

      // Filter for section events
      const sectionStats = HOMEPAGE_SECTIONS.map(section => {
        const sectionEvents = data?.filter(e => 
          e.flow_variant?.startsWith(section.id) || 
          (e.metadata as any)?.section === section.id
        ) || [];
        
        return {
          sectionId: section.id,
          impressions: sectionEvents.filter(e => e.event_type === 'section_view').length,
          clicks: sectionEvents.filter(e => e.event_type === 'section_click').length,
          engagement: sectionEvents.filter(e => e.event_type === 'section_engagement').length,
        };
      });

      setStats(sectionStats);
    } catch (err) {
      console.error('Error fetching section stats:', err);
    }
  };

  const toggleABTest = (active: boolean) => {
    localStorage.setItem('homepage_sections_ab_active', active ? 'true' : 'false');
    setIsActive(active);
    
    toast({
      title: active ? 'Section A/B Test aktiviert' : 'Section A/B Test deaktiviert',
      description: active 
        ? 'Benutzer sehen zufällige Sektions-Varianten' 
        : 'Alle Benutzer sehen Standard-Sektionen',
    });
  };

  const setVariant = (sectionId: string, variantId: string) => {
    localStorage.setItem(`${SECTION_STORAGE_PREFIX}${sectionId}`, variantId);
    setSectionVariants(prev => ({ ...prev, [sectionId]: variantId }));
    
    toast({
      title: 'Sektion aktualisiert',
      description: `${sectionId} zeigt jetzt: ${variantId}`,
    });
  };

  const resetAllSections = () => {
    HOMEPAGE_SECTIONS.forEach(section => {
      localStorage.removeItem(`${SECTION_STORAGE_PREFIX}${section.id}`);
    });
    loadCurrentVariants();
    
    toast({
      title: 'Alle Sektionen zurückgesetzt',
      description: 'Standard-Varianten werden verwendet',
    });
    
    setTimeout(() => window.location.reload(), 500);
  };

  const previewSection = (sectionId: string, variantId: string) => {
    window.open(`/?section_preview=${sectionId}&variant=${variantId}`, '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <LayoutGrid className="h-5 w-5" />
                Homepage Sections A/B Testing
              </CardTitle>
              <CardDescription>
                Teste verschiedene Varianten der Homepage-Sektionen nach dem Hero
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant={isActive ? 'default' : 'secondary'} className="text-sm">
                {isActive ? (
                  <>
                    <Power className="h-3 w-3 mr-1" />
                    Aktiv
                  </>
                ) : (
                  <>
                    <PowerOff className="h-3 w-3 mr-1" />
                    Inaktiv
                  </>
                )}
              </Badge>
              <Switch
                checked={isActive}
                onCheckedChange={toggleABTest}
                aria-label="Section A/B Test aktivieren"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end">
            <Button variant="destructive" size="sm" onClick={resetAllSections}>
              <Trash2 className="h-4 w-4 mr-2" />
              Alle zurücksetzen
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sections Grid */}
      {HOMEPAGE_SECTIONS.map((section) => {
        const currentVariant = sectionVariants[section.id];
        const sectionStat = stats.find(s => s.sectionId === section.id);
        const Icon = section.icon;
        
        return (
          <Card key={section.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{section.name}</CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </div>
                </div>
                <Badge variant="outline" className="text-sm">
                  Aktiv: {section.variants.find(v => v.id === currentVariant)?.name || 'Standard'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {/* Mini Stats */}
              {sectionStat && (
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-muted/50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold">{sectionStat.impressions}</p>
                    <p className="text-xs text-muted-foreground">Impressions</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold">{sectionStat.clicks}</p>
                    <p className="text-xs text-muted-foreground">Clicks</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold">{sectionStat.engagement}</p>
                    <p className="text-xs text-muted-foreground">Engagement</p>
                  </div>
                </div>
              )}
              
              {/* Variants */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {section.variants.map((variant) => {
                  const isActive = currentVariant === variant.id;
                  
                  return (
                    <div
                      key={variant.id}
                      className={`border rounded-lg p-3 transition-all cursor-pointer ${
                        isActive 
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                          : 'hover:border-primary/50'
                      }`}
                      onClick={() => setVariant(section.id, variant.id)}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-sm">{variant.name}</h4>
                        {isActive && (
                          <Badge variant="default" className="text-[10px]">Aktiv</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{variant.description}</p>
                      
                      <div className="mt-2 flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-xs px-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            previewSection(section.id, variant.id);
                          }}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Preview
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Overall Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Section Statistiken
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3">Sektion</th>
                  <th className="text-left py-2 px-3">Aktive Variante</th>
                  <th className="text-right py-2 px-3">Impressions</th>
                  <th className="text-right py-2 px-3">Clicks</th>
                  <th className="text-right py-2 px-3">Engagement</th>
                </tr>
              </thead>
              <tbody>
                {HOMEPAGE_SECTIONS.map((section) => {
                  const stat = stats.find(s => s.sectionId === section.id);
                  const variant = section.variants.find(v => v.id === sectionVariants[section.id]);
                  
                  return (
                    <tr key={section.id} className="border-b last:border-0">
                      <td className="py-2 px-3 font-medium">{section.name}</td>
                      <td className="py-2 px-3">
                        <Badge variant="outline">{variant?.name || 'Standard'}</Badge>
                      </td>
                      <td className="text-right py-2 px-3">{stat?.impressions || 0}</td>
                      <td className="text-right py-2 px-3">{stat?.clicks || 0}</td>
                      <td className="text-right py-2 px-3">{stat?.engagement || 0}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
