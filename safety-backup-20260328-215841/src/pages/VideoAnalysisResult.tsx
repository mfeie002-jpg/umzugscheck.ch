import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Video, Package, TrendingUp, Clock, Truck, 
  CheckCircle, Phone, Mail, ArrowRight, Star,
  Shield, MapPin, Calendar, Box, Weight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Header } from '@/components/homepage/Header';
import { Footer } from '@/components/Footer';

export default function VideoAnalysisResult() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: analysis, isLoading, error } = useQuery({
    queryKey: ['video-analysis-result', id],
    queryFn: async () => {
      if (!id) throw new Error('No ID provided');
      
      const { data, error } = await supabase
        .from('video_analyses')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  const { data: items } = useQuery({
    queryKey: ['video-analysis-result-items', id],
    queryFn: async () => {
      if (!id) return [];
      
      const { data, error } = await supabase
        .from('video_analysis_items')
        .select('*')
        .eq('analysis_id', id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  // Realtime subscription for auto-refresh when analysis is completed
  useEffect(() => {
    if (!id) return;

    const channel = supabase
      .channel(`video-analysis-${id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'video_analyses',
          filter: `id=eq.${id}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['video-analysis-result', id] });
          queryClient.invalidateQueries({ queryKey: ['video-analysis-result-items', id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, queryClient]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Ihre Analyse wird geladen...</p>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <Video className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Analyse nicht gefunden</h2>
            <p className="text-muted-foreground mb-6">
              Diese Analyse existiert nicht oder ist nicht mehr verfügbar.
            </p>
            <Button onClick={() => navigate('/')}>Zur Startseite</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (analysis.status === 'pending') {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-12">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 mx-auto mb-6"
              >
                <Video className="h-16 w-16 text-primary" />
              </motion.div>
              <h2 className="text-2xl font-bold mb-2">Ihre Analyse wird bearbeitet</h2>
              <p className="text-muted-foreground mb-6">
                Unser Team prüft Ihr Video und erstellt eine detaillierte Kostenschätzung.
                Sie erhalten eine E-Mail, sobald die Analyse abgeschlossen ist.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Voraussichtliche Bearbeitungszeit: 24-48 Stunden</span>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const categoryLabels: Record<string, string> = {
    furniture: 'Möbel',
    electronics: 'Elektronik',
    fragile: 'Zerbrechlich',
    heavy: 'Schwer',
    plants: 'Pflanzen',
    art: 'Kunst',
    boxes: 'Kartons',
    other: 'Sonstiges'
  };

  const groupedItems = items?.reduce((acc, item) => {
    const cat = item.category || 'other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {} as Record<string, typeof items>);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8 md:py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Badge className="mb-4 bg-success/20 text-success border-success/30">
            <CheckCircle className="h-3 w-3 mr-1" />
            Analyse abgeschlossen
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Ihre persönliche Umzugsanalyse
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Basierend auf Ihrem Video haben wir eine detaillierte Kostenschätzung erstellt.
          </p>
        </motion.div>

        {/* Price Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="max-w-3xl mx-auto mb-8 overflow-hidden">
            <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-white/80 text-sm mb-1">Geschätzte Umzugskosten</p>
                  <p className="text-4xl md:text-5xl font-bold">
                    CHF {analysis.price_min?.toLocaleString()} – {analysis.price_max?.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  <span className="text-sm">Preisgarantie</span>
                </div>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-4 rounded-lg bg-muted/50">
                  <Box className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">{analysis.total_volume_m3?.toFixed(1) || '-'}</p>
                  <p className="text-sm text-muted-foreground">m³ Volumen</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <Weight className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">{analysis.total_weight_kg?.toFixed(0) || '-'}</p>
                  <p className="text-sm text-muted-foreground">kg Gewicht</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <Package className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">{items?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Gegenstände</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">{analysis.estimated_hours || '-'}</p>
                  <p className="text-sm text-muted-foreground">Stunden</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Route Info */}
        {(analysis.from_city || analysis.to_city) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto mb-8"
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Von</p>
                      <p className="font-medium">{analysis.from_city || 'Nicht angegeben'}</p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Nach</p>
                      <p className="font-medium">{analysis.to_city || 'Nicht angegeben'}</p>
                    </div>
                    <div className="p-3 rounded-full bg-secondary/10">
                      <MapPin className="h-5 w-5 text-secondary" />
                    </div>
                  </div>
                  {analysis.move_date && (
                    <>
                      <Separator orientation="vertical" className="h-12 hidden md:block" />
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Umzugsdatum</p>
                          <p className="font-medium">
                            {format(new Date(analysis.move_date), 'dd. MMMM yyyy', { locale: de })}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Items List */}
        {items && items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-3xl mx-auto mb-8"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Erfasste Gegenstände ({items.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {groupedItems && Object.entries(groupedItems).map(([category, categoryItems]) => (
                    <div key={category}>
                      <h4 className="font-medium text-sm text-muted-foreground mb-3">
                        {categoryLabels[category] || category}
                      </h4>
                      <div className="grid gap-2">
                        {categoryItems?.map((item) => (
                          <div 
                            key={item.id} 
                            className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <span className="font-medium">{item.name}</span>
                              {(item.quantity || 1) > 1 && (
                                <Badge variant="secondary">{item.quantity}x</Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {item.volume_m3}m³ • {item.weight_kg}kg
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-3xl mx-auto"
        >
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">
                Jetzt kostenlose Offerten erhalten
              </h3>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Erhalten Sie bis zu 5 unverbindliche Offerten von geprüften Umzugsfirmen 
                in Ihrer Region – basierend auf Ihrer Video-Analyse.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="gap-2" onClick={() => navigate('/umzugsofferten')}>
                  <TrendingUp className="h-5 w-5" />
                  Offerten anfordern
                </Button>
                <Button size="lg" variant="outline" className="gap-2">
                  <Phone className="h-5 w-5" />
                  Beratung: 044 XXX XX XX
                </Button>
              </div>
              <div className="flex items-center justify-center gap-6 mt-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>100% kostenlos</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="h-4 w-4 text-success" />
                  <span>Geprüfte Firmen</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-success" />
                  <span>Ø 4.8 Bewertung</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
