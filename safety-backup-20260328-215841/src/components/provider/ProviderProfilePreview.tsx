import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Eye, Star, MapPin, Phone, Mail, Globe, CheckCircle2, Truck, Clock, Shield, Users } from 'lucide-react';

interface Provider {
  id: string;
  company_name: string;
  description?: string;
  logo_url?: string;
  phone: string;
  email: string;
  website?: string;
  city: string;
  cantons_served: string[];
  services_offered: string[];
  price_level?: string;
  employees_count?: number;
  fleet_size?: number;
  certifications?: string[];
}

interface Props {
  provider: Provider;
}

export const ProviderProfilePreview = ({ provider }: Props) => {
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  const ProfileContent = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
          {provider.logo_url ? (
            <img src={provider.logo_url} alt={provider.company_name} className="w-full h-full object-contain rounded-lg" />
          ) : (
            <Truck className="h-8 w-8 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold">{provider.company_name}</h2>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Verifiziert
            </Badge>
          </div>
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium text-foreground">4.8</span>
              <span>(24 Bewertungen)</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {provider.city}
            </div>
          </div>
          {provider.price_level && (
            <Badge variant="secondary" className="mt-2">
              {provider.price_level}
            </Badge>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-muted rounded-lg">
          <Users className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
          <p className="text-lg font-bold">{provider.employees_count || 5}</p>
          <p className="text-xs text-muted-foreground">Mitarbeiter</p>
        </div>
        <div className="text-center p-3 bg-muted rounded-lg">
          <Truck className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
          <p className="text-lg font-bold">{provider.fleet_size || 3}</p>
          <p className="text-xs text-muted-foreground">Fahrzeuge</p>
        </div>
        <div className="text-center p-3 bg-muted rounded-lg">
          <Clock className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
          <p className="text-lg font-bold">2h</p>
          <p className="text-xs text-muted-foreground">Ø Antwortzeit</p>
        </div>
      </div>

      {/* Description */}
      <div>
        <h3 className="font-semibold mb-2">Über uns</h3>
        <p className="text-muted-foreground">
          {provider.description || 'Professionelle Umzugsfirma mit langjähriger Erfahrung in der Schweiz. Wir bieten zuverlässige und preiswerte Umzugsdienstleistungen für Privat- und Firmenkunden.'}
        </p>
      </div>

      {/* Services */}
      <div>
        <h3 className="font-semibold mb-2">Unsere Leistungen</h3>
        <div className="flex flex-wrap gap-2">
          {provider.services_offered.map(service => (
            <Badge key={service} variant="outline">
              {service}
            </Badge>
          ))}
        </div>
      </div>

      {/* Regions */}
      <div>
        <h3 className="font-semibold mb-2">Service-Gebiete</h3>
        <div className="flex flex-wrap gap-2">
          {provider.cantons_served.slice(0, 8).map(canton => (
            <Badge key={canton} variant="secondary">
              {canton}
            </Badge>
          ))}
          {provider.cantons_served.length > 8 && (
            <Badge variant="secondary">+{provider.cantons_served.length - 8} weitere</Badge>
          )}
        </div>
      </div>

      {/* Trust Badges */}
      <div>
        <h3 className="font-semibold mb-2">Zertifizierungen</h3>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
            <Shield className="h-4 w-4 text-green-600" />
            <span className="text-sm">Versichert</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
            <CheckCircle2 className="h-4 w-4 text-blue-600" />
            <span className="text-sm">Geprüft</span>
          </div>
          {provider.certifications?.map(cert => (
            <div key={cert} className="flex items-center gap-2 p-2 bg-muted rounded-lg">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span className="text-sm">{cert}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="p-4 bg-muted rounded-lg">
        <h3 className="font-semibold mb-3">Kontakt</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{provider.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>{provider.email}</span>
          </div>
          {provider.website && (
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span>{provider.website}</span>
            </div>
          )}
        </div>
      </div>

      {/* CTA */}
      <Button className="w-full" size="lg">
        Offerte anfragen
      </Button>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Profil-Vorschau
            </CardTitle>
            <CardDescription>So sehen Kunden Ihr Firmenprofil</CardDescription>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Vollansicht
              </Button>
            </DialogTrigger>
            <DialogContent className={previewMode === 'desktop' ? 'max-w-3xl' : 'max-w-sm'}>
              <DialogHeader>
                <DialogTitle>Profil-Vorschau</DialogTitle>
              </DialogHeader>
              <Tabs value={previewMode} onValueChange={(v) => setPreviewMode(v as any)} className="mt-4">
                <TabsList className="mb-4">
                  <TabsTrigger value="desktop">Desktop</TabsTrigger>
                  <TabsTrigger value="mobile">Mobile</TabsTrigger>
                </TabsList>
                <div className={`border rounded-lg p-6 ${previewMode === 'mobile' ? 'max-w-sm mx-auto' : ''}`}>
                  <ProfileContent />
                </div>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg p-4 bg-muted/30">
          <ProfileContent />
        </div>
      </CardContent>
    </Card>
  );
};
