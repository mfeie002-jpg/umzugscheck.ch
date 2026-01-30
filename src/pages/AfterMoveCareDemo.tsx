/**
 * After Move Care Demo Page
 * Demonstrates the interactive POI map for new residents
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Info, Sparkles, MapPin, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { AfterMoveCareMap } from '@/components/after-move';

// Demo addresses in Switzerland
const DEMO_ADDRESSES = [
  { 
    label: 'Zug Zentrum', 
    city: 'Zug',
    lat: 47.1724, 
    lng: 8.5153,
    address: 'Bahnhofstrasse 12, 6300 Zug'
  },
  { 
    label: 'Zürich Oerlikon', 
    city: 'Zürich',
    lat: 47.4111, 
    lng: 8.5445,
    address: 'Thurgauerstrasse 40, 8050 Zürich'
  },
  { 
    label: 'Basel Zentrum', 
    city: 'Basel',
    lat: 47.5596, 
    lng: 7.5886,
    address: 'Marktplatz 1, 4001 Basel'
  },
  { 
    label: 'Bern Altstadt', 
    city: 'Bern',
    lat: 46.9480, 
    lng: 7.4474,
    address: 'Kramgasse 50, 3011 Bern'
  },
  { 
    label: 'Luzern See', 
    city: 'Luzern',
    lat: 47.0502, 
    lng: 8.3093,
    address: 'Seestrasse 18, 6003 Luzern'
  },
];

export default function AfterMoveCareDemo() {
  const [selectedAddress, setSelectedAddress] = useState(DEMO_ADDRESSES[0]);
  const [radius, setRadius] = useState([1000]);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation + Footer provided by MainLayout in App.tsx */}
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Back Link */}
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Zurück zur Startseite
          </Link>
        </Button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Badge variant="secondary" className="gap-1">
              <Sparkles className="h-3 w-3" />
              Demo
            </Badge>
            <Badge variant="outline">After Move Care</Badge>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
              Phase 6 - Complete
            </Badge>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            Umgebungs-Scan
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Interaktive Karte mit allen wichtigen Orten rund um Ihre neue Adresse. 
            Schulen, Supermärkte, ÖV-Haltestellen, Ärzte und mehr – alles auf einen Blick.
          </p>
        </div>

        {/* Controls */}
        <Card className="mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Search className="h-4 w-4" />
              Demo-Adresse wählen
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Address Selection */}
            <div className="flex flex-wrap gap-2">
              {DEMO_ADDRESSES.map((addr) => (
                <Button
                  key={addr.label}
                  variant={selectedAddress.label === addr.label ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedAddress(addr)}
                  className="gap-2"
                >
                  <MapPin className="h-3.5 w-3.5" />
                  {addr.label}
                </Button>
              ))}
            </div>

            {/* Radius Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Suchradius</Label>
                <Badge variant="secondary">{radius[0]}m</Badge>
              </div>
              <Slider
                value={radius}
                onValueChange={setRadius}
                min={250}
                max={2000}
                step={250}
                className="w-full max-w-md"
              />
              <p className="text-xs text-muted-foreground">
                Zeigt alle POIs im Umkreis von {radius[0]} Metern
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="mb-6 border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Info className="h-4 w-4 text-blue-600" />
              Über dieses Feature
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              Der <strong>Umgebungs-Scan</strong> ist Teil der "After Move Care" (Phase 6 - Complete) 
              im Relo-OS. Er hilft Neuzuzügern, ihre neue Umgebung zu erkunden:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>🏫 <strong>Schulen & Kindergärten</strong> – wichtig für Familien</li>
              <li>🛒 <strong>Supermärkte</strong> – Migros, Coop, Denner in der Nähe</li>
              <li>🚉 <strong>ÖV-Haltestellen</strong> – Bahn, Bus, Tram</li>
              <li>🏥 <strong>Ärzte & Apotheken</strong> – Gesundheitsversorgung</li>
              <li>🌳 <strong>Parks & Erholung</strong> – Grünflächen und Spielplätze</li>
            </ul>
            <p className="pt-2">
              <strong>Technisch:</strong> Verwendet <code className="bg-muted px-1 rounded">Leaflet</code> + 
              <code className="bg-muted px-1 rounded">OpenStreetMap</code>. POI-Daten können aus der 
              <code className="bg-muted px-1 rounded">pois</code> Tabelle oder via Overpass API geladen werden.
            </p>
          </CardContent>
        </Card>

        {/* Map Widget */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-muted-foreground">
            Live Widget Preview
          </h2>
          <AfterMoveCareMap
            center={{ lat: selectedAddress.lat, lng: selectedAddress.lng }}
            addressLabel={selectedAddress.address}
            cityName={selectedAddress.city}
            radiusMeters={radius[0]}
            variant="full"
          />
        </div>

        {/* Compact Variant */}
        <div className="mt-8 space-y-4">
          <h2 className="text-lg font-semibold text-muted-foreground">
            Kompakte Variante (für Einbettung)
          </h2>
          <div className="max-w-md">
            <AfterMoveCareMap
              center={{ lat: selectedAddress.lat, lng: selectedAddress.lng }}
              addressLabel={selectedAddress.address}
              cityName={selectedAddress.city}
              radiusMeters={radius[0]}
              variant="compact"
            />
          </div>
        </div>

        {/* Technical Info */}
        <Card className="mt-8 bg-muted/30">
          <CardHeader>
            <CardTitle className="text-base">Relevante Dateien</CardTitle>
            <CardDescription>
              Code-Struktur für das After Move Care Feature
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm font-mono">
              <li className="flex items-center gap-2">
                <span className="text-green-600">•</span>
                src/components/after-move/AfterMoveCareMap.tsx
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">•</span>
                src/pages/AfterMoveCareDemo.tsx
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-600">•</span>
                src/hooks/useNeighborhoods.ts (POI data hooks)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-600">•</span>
                src/components/neighborhood/NewcomerWelcomeKit.tsx
              </li>
              <li className="flex items-center gap-2">
                <span className="text-amber-600">•</span>
                src/lib/post-move-checklist.ts (Checklist data)
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Integration Hint */}
        <Card className="mt-6 border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Integration in Relo-OS</h3>
                <p className="text-sm text-muted-foreground">
                  Dieses Widget wird in Phase 6 (Complete) der Invisible Move Journey eingebunden. 
                  Nach Abschluss des Umzugs erhalten Kunden automatisch Zugriff auf den Umgebungs-Scan 
                  für ihre neue Adresse.
                </p>
                <div className="flex gap-2 mt-3">
                  <Button asChild size="sm" variant="outline">
                    <Link to="/invisible-move-demo">
                      Invisible Move Demo
                    </Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link to="/move/demo">
                      Move Details Page
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
