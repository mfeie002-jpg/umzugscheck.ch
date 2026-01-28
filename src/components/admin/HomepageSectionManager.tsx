/**
 * Homepage Section Manager - A/B Testing for Homepage sections after the hero
 * Full drag & drop reordering + all sections with variants
 */

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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
  Trash2,
  GripVertical,
  MapPin,
  HelpCircle,
  Calculator,
  Shield,
  Building2,
  TrendingUp,
  Video,
  Phone,
  FileText,
  Award,
  Lightbulb,
  Target,
  Sparkles,
  Clock,
  CheckCircle,
  EyeOff
} from 'lucide-react';

// Section types that can be A/B tested
interface SectionConfig {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  enabled: boolean;
  variants: {
    id: string;
    name: string;
    description: string;
  }[];
}

// All Homepage Sections with variants
const DEFAULT_HOMEPAGE_SECTIONS: SectionConfig[] = [
  {
    id: 'hero',
    name: 'Hero Section',
    description: 'Hauptbereich oben mit CTA und Form',
    icon: Target,
    enabled: true,
    variants: [
      { id: 'hero-a', name: 'Original', description: 'Split Layout mit Form' },
      { id: 'hero-b', name: 'Premium Tabs', description: '4 Tabs (Form/Video/Chat/WhatsApp)' },
      { id: 'hero-c', name: 'Smart Router', description: 'PLZ-first Wizard' },
    ],
  },
  {
    id: 'social-proof',
    name: 'Social Proof / Trust Badges',
    description: 'Nach dem Hero: Bekannt aus, Bewertungen, Partner-Logos',
    icon: Users,
    enabled: true,
    variants: [
      { id: 'social-proof-v1', name: 'V1: Original', description: 'Farbige Logos klassisch' },
      { id: 'social-proof-v2', name: 'V2: Live Dashboard', description: 'Dashboard + Deal Cards' },
      { id: 'social-proof-v3', name: 'V3: Trust Hierarchy', description: 'Logos oben, Hierarchie' },
      { id: 'social-proof-v4', name: 'V4: Trust Stack', description: 'Kompakt gestapelt' },
      { id: 'social-proof-v5', name: 'V5: Trust Strip 2.0', description: 'Unified modern Strip' },
    ],
  },
  {
    id: 'how-it-works',
    name: 'So funktioniert es',
    description: '3-Schritte Prozess-Erklärung',
    icon: Star,
    enabled: true,
    variants: [
      { id: 'hiw-v1', name: 'Timeline', description: 'Horizontale Timeline' },
      { id: 'hiw-v2', name: 'Cards', description: 'Nummerierte Karten' },
      { id: 'hiw-v3', name: 'Minimal', description: 'Nur Text mit Icons' },
      { id: 'hiw-v4', name: 'Animated', description: 'Mit Scroll-Animation' },
    ],
  },
  {
    id: 'features-bento',
    name: 'Features / Services Bento',
    description: 'Service-Grid mit Dienstleistungen',
    icon: Boxes,
    enabled: true,
    variants: [
      { id: 'features-v1', name: 'Bento Grid', description: '6 Karten asymmetrisch' },
      { id: 'features-v2', name: 'List Style', description: 'Vertikale Liste mit Icons' },
      { id: 'features-v3', name: 'Carousel', description: 'Horizontal scrollbar' },
      { id: 'features-v4', name: 'Icons Only', description: 'Kompakt mit nur Icons' },
    ],
  },
  {
    id: 'calculator-preview',
    name: 'Preisrechner Preview',
    description: 'Mini-Rechner CTA zum Vollversion',
    icon: Calculator,
    enabled: true,
    variants: [
      { id: 'calc-v1', name: 'Embedded', description: 'Direkt eingebettet' },
      { id: 'calc-v2', name: 'CTA Card', description: 'Nur CTA zum Rechner' },
      { id: 'calc-v3', name: 'Floating', description: 'Floating Button' },
    ],
  },
  {
    id: 'testimonials',
    name: 'Testimonials / Reviews',
    description: 'Kundenbewertungen Slider/Grid',
    icon: MessageSquare,
    enabled: true,
    variants: [
      { id: 'testimonials-v1', name: 'Carousel', description: 'Automatisch rotierend' },
      { id: 'testimonials-v2', name: 'Grid', description: '3-Spalten Grid' },
      { id: 'testimonials-v3', name: 'Featured', description: 'Eine grosse Bewertung' },
      { id: 'testimonials-v4', name: 'Video', description: 'Video Testimonials' },
      { id: 'testimonials-v5', name: 'Masonry', description: 'Pinterest-Style Layout' },
    ],
  },
  {
    id: 'top-companies',
    name: 'Top Umzugsfirmen',
    description: 'Beste Firmen Showcase',
    icon: Building2,
    enabled: true,
    variants: [
      { id: 'companies-v1', name: 'Cards', description: '3 Top Firmen Cards' },
      { id: 'companies-v2', name: 'Table', description: 'Vergleichstabelle' },
      { id: 'companies-v3', name: 'Logos', description: 'Nur Logos mit Rating' },
      { id: 'companies-v4', name: 'Carousel', description: 'Scrollbar Firmen' },
    ],
  },
  {
    id: 'cost-examples',
    name: 'Preisbeispiele',
    description: 'Transparente Kostenübersicht',
    icon: TrendingUp,
    enabled: true,
    variants: [
      { id: 'costs-v1', name: 'Table', description: 'Preistabelle' },
      { id: 'costs-v2', name: 'Cards', description: 'Preis-Cards' },
      { id: 'costs-v3', name: 'Interactive', description: 'Slider mit Preisen' },
    ],
  },
  {
    id: 'regions',
    name: 'Regionen',
    description: 'Schweizer Regionen/Kantone',
    icon: MapPin,
    enabled: true,
    variants: [
      { id: 'regions-v1', name: 'Map', description: 'Interaktive Schweizerkarte' },
      { id: 'regions-v2', name: 'Grid', description: 'Kantone Grid' },
      { id: 'regions-v3', name: 'List', description: 'Alphabetische Liste' },
    ],
  },
  {
    id: 'usp-section',
    name: 'Warum umzugscheck.ch?',
    description: 'Unique Selling Points',
    icon: Sparkles,
    enabled: true,
    variants: [
      { id: 'usp-v1', name: 'Cards', description: '4 USP Cards' },
      { id: 'usp-v2', name: 'Icons', description: 'Icon Row' },
      { id: 'usp-v3', name: 'Comparison', description: 'Vs. Konkurrenz' },
      { id: 'usp-v4', name: 'Visual', description: 'Mit Illustrationen' },
    ],
  },
  {
    id: 'ai-calculator',
    name: 'KI-Rechner Showcase',
    description: 'AI/KI Feature Highlight',
    icon: Lightbulb,
    enabled: true,
    variants: [
      { id: 'ai-v1', name: 'Hero Style', description: 'Grosser AI Showcase' },
      { id: 'ai-v2', name: 'Compact', description: 'Kleine Card' },
      { id: 'ai-v3', name: 'Video', description: 'Mit Demo-Video' },
    ],
  },
  {
    id: 'video-section',
    name: 'Video Bereich',
    description: 'Erklärvideo oder Video-Upload',
    icon: Video,
    enabled: false,
    variants: [
      { id: 'video-v1', name: 'Embedded', description: 'YouTube/Vimeo Embed' },
      { id: 'video-v2', name: 'Upload CTA', description: 'Video-Upload Funnel' },
      { id: 'video-v3', name: 'Testimonial', description: 'Video Testimonials' },
    ],
  },
  {
    id: 'faq',
    name: 'FAQ Sektion',
    description: 'Häufig gestellte Fragen',
    icon: HelpCircle,
    enabled: true,
    variants: [
      { id: 'faq-v1', name: 'Accordion', description: 'Klassisches Akkordeon' },
      { id: 'faq-v2', name: 'Cards', description: 'FAQ Cards Grid' },
      { id: 'faq-v3', name: 'Tabs', description: 'Kategorisierte Tabs' },
      { id: 'faq-v4', name: 'Search', description: 'Mit Suchfunktion' },
    ],
  },
  {
    id: 'trust-seals',
    name: 'Trust Seals / Garantien',
    description: 'Gütesiegel und Garantien',
    icon: Shield,
    enabled: true,
    variants: [
      { id: 'trust-v1', name: 'Badges', description: 'Badge Row' },
      { id: 'trust-v2', name: 'Cards', description: 'Detaillierte Cards' },
      { id: 'trust-v3', name: 'Banner', description: 'Full-Width Banner' },
    ],
  },
  {
    id: 'contact-cta',
    name: 'Kontakt CTA',
    description: 'Kontakt-Möglichkeiten',
    icon: Phone,
    enabled: true,
    variants: [
      { id: 'contact-v1', name: 'Phone + Form', description: 'Telefon und Formular' },
      { id: 'contact-v2', name: 'WhatsApp', description: 'WhatsApp Integration' },
      { id: 'contact-v3', name: 'Chat', description: 'Live Chat Widget' },
    ],
  },
  {
    id: 'blog-preview',
    name: 'Blog / Ratgeber Preview',
    description: 'Neueste Artikel',
    icon: FileText,
    enabled: false,
    variants: [
      { id: 'blog-v1', name: 'Cards', description: '3 Artikel Cards' },
      { id: 'blog-v2', name: 'List', description: 'Kompakte Liste' },
      { id: 'blog-v3', name: 'Featured', description: 'Ein Featured Artikel' },
    ],
  },
  {
    id: 'awards',
    name: 'Awards / Auszeichnungen',
    description: 'Preise und Auszeichnungen',
    icon: Award,
    enabled: false,
    variants: [
      { id: 'awards-v1', name: 'Banner', description: 'Award Banner' },
      { id: 'awards-v2', name: 'Badges', description: 'Award Badges' },
    ],
  },
  {
    id: 'recent-activity',
    name: 'Live Aktivität',
    description: 'Kürzlich abgeschlossene Umzüge',
    icon: Clock,
    enabled: false,
    variants: [
      { id: 'activity-v1', name: 'Feed', description: 'Live Feed' },
      { id: 'activity-v2', name: 'Counter', description: 'Zähler Animation' },
      { id: 'activity-v3', name: 'Map', description: 'Auf Karte' },
    ],
  },
  {
    id: 'provider-cta',
    name: 'Für Umzugsfirmen CTA',
    description: 'Partner werden',
    icon: Building2,
    enabled: true,
    variants: [
      { id: 'provider-v1', name: 'Banner', description: 'CTA Banner' },
      { id: 'provider-v2', name: 'Card', description: 'Info Card' },
      { id: 'provider-v3', name: 'Stats', description: 'Mit Statistiken' },
    ],
  },
  {
    id: 'final-cta',
    name: 'Final CTA',
    description: 'Abschliessender Call-to-Action',
    icon: CheckCircle,
    enabled: true,
    variants: [
      { id: 'final-v1', name: 'Full Width', description: 'Breiter CTA Banner' },
      { id: 'final-v2', name: 'Split', description: 'Split mit Bild' },
      { id: 'final-v3', name: 'Minimal', description: 'Nur Button' },
      { id: 'final-v4', name: 'Form', description: 'Mit Mini-Form' },
    ],
  },
];

const SECTION_STORAGE_PREFIX = 'homepage_section_';
const SECTION_ORDER_KEY = 'homepage_section_order';
const SECTION_ENABLED_PREFIX = 'homepage_section_enabled_';

// Sortable Section Card Component
interface SortableSectionProps {
  section: SectionConfig;
  currentVariant: string;
  sectionStat: any;
  onSetVariant: (sectionId: string, variantId: string) => void;
  onToggleEnabled: (sectionId: string, enabled: boolean) => void;
  onPreview: (sectionId: string, variantId: string) => void;
}

function SortableSectionCard({ 
  section, 
  currentVariant, 
  sectionStat, 
  onSetVariant, 
  onToggleEnabled,
  onPreview 
}: SortableSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const Icon = section.icon;

  return (
    <Card 
      ref={setNodeRef} 
      style={style} 
      className={`${!section.enabled ? 'opacity-60' : ''} ${isDragging ? 'ring-2 ring-primary shadow-lg' : ''}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Drag Handle */}
            <button
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded touch-none"
            >
              <GripVertical className="h-5 w-5 text-muted-foreground" />
            </button>
            
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${section.enabled ? 'bg-primary/10' : 'bg-muted'}`}>
              <Icon className={`h-5 w-5 ${section.enabled ? 'text-primary' : 'text-muted-foreground'}`} />
            </div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                {section.name}
                {!section.enabled && (
                  <Badge variant="secondary" className="text-xs">
                    <EyeOff className="h-3 w-3 mr-1" />
                    Ausgeblendet
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>{section.description}</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-sm">
              Aktiv: {section.variants.find(v => v.id === currentVariant)?.name || 'Standard'}
            </Badge>
            <Switch
              checked={section.enabled}
              onCheckedChange={(enabled) => onToggleEnabled(section.id, enabled)}
              aria-label={`${section.name} ein/ausblenden`}
            />
          </div>
        </div>
      </CardHeader>
      
      {section.enabled && (
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
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
                  onClick={() => onSetVariant(section.id, variant.id)}
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
                        onPreview(section.id, variant.id);
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
      )}
    </Card>
  );
}

export function HomepageSectionManager() {
  const [isActive, setIsActive] = useState(true);
  const [sections, setSections] = useState<SectionConfig[]>([]);
  const [sectionVariants, setSectionVariants] = useState<Record<string, string>>({});
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    loadSections();
    fetchStats();
  }, []);

  const loadSections = () => {
    // Load order
    const savedOrder = localStorage.getItem(SECTION_ORDER_KEY);
    let orderedSections = [...DEFAULT_HOMEPAGE_SECTIONS];
    
    if (savedOrder) {
      try {
        const orderIds = JSON.parse(savedOrder);
        orderedSections = orderIds
          .map((id: string) => DEFAULT_HOMEPAGE_SECTIONS.find(s => s.id === id))
          .filter(Boolean) as SectionConfig[];
        
        // Add any new sections that weren't in saved order
        DEFAULT_HOMEPAGE_SECTIONS.forEach(section => {
          if (!orderedSections.find(s => s.id === section.id)) {
            orderedSections.push(section);
          }
        });
      } catch (e) {
        console.error('Error parsing section order:', e);
      }
    }
    
    // Load enabled state for each section
    orderedSections = orderedSections.map(section => ({
      ...section,
      enabled: localStorage.getItem(`${SECTION_ENABLED_PREFIX}${section.id}`) !== 'false' 
        ? section.enabled 
        : false
    }));
    
    setSections(orderedSections);
    
    // Load variants
    const variants: Record<string, string> = {};
    orderedSections.forEach(section => {
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
      const { data, error } = await supabase
        .from('homepage_ab_events')
        .select('flow_variant, event_type, metadata')
        .order('created_at', { ascending: false })
        .limit(1000);

      if (error) throw error;

      const sectionStats = DEFAULT_HOMEPAGE_SECTIONS.map(section => {
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

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSections((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newOrder = arrayMove(items, oldIndex, newIndex);
        
        // Save order to localStorage
        localStorage.setItem(SECTION_ORDER_KEY, JSON.stringify(newOrder.map(s => s.id)));
        
        toast({
          title: 'Reihenfolge aktualisiert',
          description: 'Die Sektionen wurden neu angeordnet',
        });
        
        return newOrder;
      });
    }
  }, [toast]);

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
    
    const section = sections.find(s => s.id === sectionId);
    const variant = section?.variants.find(v => v.id === variantId);
    
    toast({
      title: 'Variante geändert',
      description: `${section?.name}: ${variant?.name}`,
    });
  };

  const toggleSectionEnabled = (sectionId: string, enabled: boolean) => {
    localStorage.setItem(`${SECTION_ENABLED_PREFIX}${sectionId}`, enabled ? 'true' : 'false');
    setSections(prev => prev.map(s => 
      s.id === sectionId ? { ...s, enabled } : s
    ));
    
    const section = sections.find(s => s.id === sectionId);
    toast({
      title: enabled ? 'Sektion aktiviert' : 'Sektion deaktiviert',
      description: section?.name,
    });
  };

  const resetAllSections = () => {
    // Clear all section-related localStorage
    localStorage.removeItem(SECTION_ORDER_KEY);
    DEFAULT_HOMEPAGE_SECTIONS.forEach(section => {
      localStorage.removeItem(`${SECTION_STORAGE_PREFIX}${section.id}`);
      localStorage.removeItem(`${SECTION_ENABLED_PREFIX}${section.id}`);
    });
    
    loadSections();
    
    toast({
      title: 'Alle Sektionen zurückgesetzt',
      description: 'Standard-Reihenfolge und Varianten wiederhergestellt',
    });
  };

  const previewSection = (sectionId: string, variantId: string) => {
    window.open(`/?section_preview=${sectionId}&variant=${variantId}#${sectionId}`, '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const enabledSections = sections.filter(s => s.enabled);
  const disabledSections = sections.filter(s => !s.enabled);

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <LayoutGrid className="h-5 w-5" />
                Homepage Sections Manager
              </CardTitle>
              <CardDescription>
                Drag & Drop zum Sortieren • {enabledSections.length} aktiv • {disabledSections.length} ausgeblendet
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant={isActive ? 'default' : 'secondary'} className="text-sm">
                {isActive ? (
                  <>
                    <Power className="h-3 w-3 mr-1" />
                    A/B Test Aktiv
                  </>
                ) : (
                  <>
                    <PowerOff className="h-3 w-3 mr-1" />
                    Standard Modus
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
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Ziehe Sektionen um die Reihenfolge zu ändern. Schalte einzelne Sektionen ein/aus.
            </p>
            <Button variant="destructive" size="sm" onClick={resetAllSections}>
              <Trash2 className="h-4 w-4 mr-2" />
              Alles zurücksetzen
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Draggable Sections */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sections.map(s => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {sections.map((section) => (
              <SortableSectionCard
                key={section.id}
                section={section}
                currentVariant={sectionVariants[section.id]}
                sectionStat={stats.find(s => s.sectionId === section.id)}
                onSetVariant={setVariant}
                onToggleEnabled={toggleSectionEnabled}
                onPreview={previewSection}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Overall Stats Table */}
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
                  <th className="text-left py-2 px-3">Status</th>
                  <th className="text-left py-2 px-3">Aktive Variante</th>
                  <th className="text-right py-2 px-3">Impressions</th>
                  <th className="text-right py-2 px-3">Clicks</th>
                  <th className="text-right py-2 px-3">Engagement</th>
                </tr>
              </thead>
              <tbody>
                {sections.map((section) => {
                  const stat = stats.find(s => s.sectionId === section.id);
                  const variant = section.variants.find(v => v.id === sectionVariants[section.id]);
                  
                  return (
                    <tr key={section.id} className="border-b last:border-0">
                      <td className="py-2 px-3 font-medium">{section.name}</td>
                      <td className="py-2 px-3">
                        <Badge variant={section.enabled ? 'default' : 'secondary'}>
                          {section.enabled ? 'Aktiv' : 'Aus'}
                        </Badge>
                      </td>
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
