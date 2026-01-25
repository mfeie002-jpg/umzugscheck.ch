/**
 * Provider Projects Panel
 * Shows all projects assigned to or available for the provider
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useProviderAuth } from '@/contexts/ProviderAuthContext';
import { 
  Package, 
  MapPin, 
  Calendar, 
  Clock, 
  ChevronRight,
  Inbox,
  CheckCircle,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface MoveProjectSummary {
  id: string;
  status: string;
  from_city: string;
  to_city: string;
  from_postal: string;
  to_postal: string;
  preferred_date: string | null;
  total_volume_m3: number | null;
  estimated_price_min: number | null;
  estimated_price_max: number | null;
  created_at: string;
  has_bid?: boolean;
  bid_status?: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  route: { label: 'Anfrage', color: 'bg-blue-100 text-blue-800', icon: MapPin },
  inventory: { label: 'Inventar', color: 'bg-purple-100 text-purple-800', icon: Package },
  quote: { label: 'Offerte', color: 'bg-amber-100 text-amber-800', icon: TrendingUp },
  booking: { label: 'Gebucht', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  moving: { label: 'Laufend', color: 'bg-orange-100 text-orange-800', icon: Clock },
  complete: { label: 'Abgeschlossen', color: 'bg-gray-100 text-gray-800', icon: CheckCircle },
};

export const ProviderProjectsPanel = () => {
  const { provider, token } = useProviderAuth();
  const [projects, setProjects] = useState<MoveProjectSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('available');

  useEffect(() => {
    if (provider?.id) {
      fetchProjects();
    }
  }, [provider?.id]);

  const fetchProjects = async () => {
    if (!provider?.id) return;
    
    try {
      setLoading(true);
      
      // Fetch projects in quote status (available for bidding)
      const { data: availableProjects, error: availableError } = await supabase
        .from('move_projects')
        .select('*')
        .eq('status', 'quote')
        .order('created_at', { ascending: false });

      if (availableError) throw availableError;

      // Fetch projects where provider has bid
      const { data: bidProjects, error: bidError } = await supabase
        .from('project_bids')
        .select(`
          project_id,
          status,
          move_projects (*)
        `)
        .eq('provider_id', provider.id);

      if (bidError) throw bidError;

      // Merge and deduplicate
      const allProjects = new Map<string, MoveProjectSummary>();
      
      availableProjects?.forEach(p => {
        allProjects.set(p.id, { ...p, has_bid: false });
      });

      bidProjects?.forEach(bp => {
        const project = bp.move_projects as any;
        if (project) {
          allProjects.set(project.id, { 
            ...project, 
            has_bid: true, 
            bid_status: bp.status 
          });
        }
      });

      setProjects(Array.from(allProjects.values()));
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredProjects = (tab: string) => {
    switch (tab) {
      case 'available':
        return projects.filter(p => !p.has_bid && p.status === 'quote');
      case 'my_bids':
        return projects.filter(p => p.has_bid);
      case 'won':
        return projects.filter(p => p.bid_status === 'accepted');
      default:
        return projects;
    }
  };

  const filteredProjects = getFilteredProjects(activeTab);

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Projekte werden geladen...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Inbox className="h-5 w-5" />
          Umzugsprojekte
        </CardTitle>
        <CardDescription>
          Verfügbare Aufträge und Ihre Gebote
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-3 mb-6">
            <TabsTrigger value="available" className="flex items-center gap-2">
              <Inbox className="h-4 w-4" />
              Verfügbar
              <Badge variant="secondary" className="ml-1">
                {getFilteredProjects('available').length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="my_bids" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Meine Gebote
              <Badge variant="secondary" className="ml-1">
                {getFilteredProjects('my_bids').length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="won" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Gewonnen
              <Badge variant="secondary" className="ml-1">
                {getFilteredProjects('won').length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {filteredProjects.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Inbox className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Keine Projekte in dieser Kategorie</p>
              </div>
            ) : (
              filteredProjects.map(project => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  onBid={() => fetchProjects()}
                  providerId={provider?.id || ''}
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

interface ProjectCardProps {
  project: MoveProjectSummary;
  onBid: () => void;
  providerId: string;
}

const ProjectCard = ({ project, onBid, providerId }: ProjectCardProps) => {
  const [showBidForm, setShowBidForm] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const statusConfig = STATUS_CONFIG[project.status] || STATUS_CONFIG.route;
  const StatusIcon = statusConfig.icon;

  const handleSubmitBid = async () => {
    if (!bidAmount) return;
    
    try {
      setSubmitting(true);
      
      const { error } = await supabase
        .from('project_bids')
        .insert({
          project_id: project.id,
          provider_id: providerId,
          bid_amount: parseFloat(bidAmount),
          status: 'pending',
        });

      if (error) throw error;
      
      setShowBidForm(false);
      setBidAmount('');
      onBid();
    } catch (error) {
      console.error('Error submitting bid:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          {/* Route */}
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{project.from_city || project.from_postal}</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{project.to_city || project.to_postal}</span>
          </div>

          {/* Details */}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {project.preferred_date && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {format(new Date(project.preferred_date), 'dd. MMM yyyy', { locale: de })}
              </div>
            )}
            {project.total_volume_m3 && (
              <div className="flex items-center gap-1">
                <Package className="h-4 w-4" />
                {project.total_volume_m3.toFixed(1)} m³
              </div>
            )}
            {project.estimated_price_min && project.estimated_price_max && (
              <div className="flex items-center gap-1 font-medium text-foreground">
                CHF {Math.round(project.estimated_price_min)} - {Math.round(project.estimated_price_max)}
              </div>
            )}
          </div>

          {/* Status */}
          <div className="flex items-center gap-2">
            <Badge className={statusConfig.color}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {statusConfig.label}
            </Badge>
            {project.has_bid && (
              <Badge variant={project.bid_status === 'accepted' ? 'default' : 'secondary'}>
                {project.bid_status === 'accepted' ? 'Zuschlag erhalten' : 
                 project.bid_status === 'rejected' ? 'Abgelehnt' : 'Gebot abgegeben'}
              </Badge>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          {!project.has_bid && project.status === 'quote' && (
            <>
              {showBidForm ? (
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="CHF"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    className="w-24 px-2 py-1 text-sm border rounded"
                  />
                  <Button 
                    size="sm" 
                    onClick={handleSubmitBid}
                    disabled={submitting || !bidAmount}
                  >
                    {submitting ? '...' : 'Senden'}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => setShowBidForm(false)}
                  >
                    ✕
                  </Button>
                </div>
              ) : (
                <Button size="sm" onClick={() => setShowBidForm(true)}>
                  Gebot abgeben
                </Button>
              )}
            </>
          )}
          <Button variant="ghost" size="sm">
            Details ansehen
          </Button>
        </div>
      </div>
    </div>
  );
};
