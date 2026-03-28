/**
 * Demo page for the InvisibleMoveDashboard widget
 * Shows the customer-facing move tracking interface
 */

import { Link } from 'react-router-dom';
import { ArrowLeft, Info, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { InvisibleMoveDashboard } from '@/components/dashboard/InvisibleMoveDashboard';

export default function InvisibleMoveDashboardDemo() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation + Footer provided by MainLayout in App.tsx */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
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
            <Badge variant="outline">Relo-OS Widget</Badge>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            Invisible Move Dashboard
          </h1>
          <p className="text-muted-foreground">
            Das zentrale Kunden-Dashboard für die Umzugsverfolgung. 
            Zeigt den aktuellen Status, nächste Aktionen und Timeline.
          </p>
        </div>

        {/* Info Card */}
        <Card className="mb-8 border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Info className="h-4 w-4 text-blue-600" />
              Über dieses Widget
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              Das <strong>InvisibleMoveDashboard</strong> ist ein Endkunden-Widget, das in die 
              Benutzer-App eingebettet wird. Es zeigt:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Aktuelle Phase (1-6) des Umzugsprojekts</li>
              <li>Fortschritt in Prozent</li>
              <li>Von/Nach Adressen und Umzugsdatum</li>
              <li>Volumen, Festpreis und Digital Twin Status</li>
              <li>Nächste empfohlene Aktionen</li>
            </ul>
            <p className="pt-2">
              <strong>Technisch:</strong> Verwendet den <code className="bg-muted px-1 rounded">useMoveProject</code> Hook 
              und die State Machine aus <code className="bg-muted px-1 rounded">src/lib/move-project.ts</code>.
            </p>
          </CardContent>
        </Card>

        {/* Dashboard Widget */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-muted-foreground">
            Live Widget Preview
          </h2>
          <InvisibleMoveDashboard />
        </div>

        {/* Technical Info */}
        <Card className="mt-8 bg-muted/30">
          <CardHeader>
            <CardTitle className="text-base">Relevante Dateien</CardTitle>
            <CardDescription>
              Code-Struktur für das Invisible Move Dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm font-mono">
              <li className="flex items-center gap-2">
                <span className="text-green-600">•</span>
                src/components/dashboard/InvisibleMoveDashboard.tsx
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">•</span>
                src/hooks/useMoveProject.ts
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">•</span>
                src/lib/move-project.ts
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">•</span>
                src/components/journey/MoveJourneyProgress.tsx
              </li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
