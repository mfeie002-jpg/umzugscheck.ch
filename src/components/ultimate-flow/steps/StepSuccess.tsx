/**
 * Success State after submission
 */

import { CheckCircle2, Mail, Clock, Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import type { UltimateFlowData } from "../UltimateSwissFlow";

interface StepSuccessProps {
  data: UltimateFlowData;
}

export function StepSuccess({ data }: StepSuccessProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-background flex flex-col">
      <div className="flex-1 container mx-auto px-4 py-12 max-w-lg flex flex-col items-center justify-center text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Anfrage erfolgreich gesendet!
        </h1>
        <p className="text-muted-foreground mb-8">
          Vielen Dank, {data.name?.split(' ')[0] || 'Herr/Frau'}. Ihre Anfrage wurde an passende Umzugsfirmen weitergeleitet.
        </p>

        {/* What's Next */}
        <div className="w-full bg-card rounded-xl border p-5 space-y-4 mb-8">
          <h2 className="font-semibold text-foreground">Was passiert jetzt?</h2>
          
          <div className="space-y-3 text-left">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Mail className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">E-Mail Bestätigung</p>
                <p className="text-xs text-muted-foreground">
                  Sie erhalten in Kürze eine Bestätigung an {data.email}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Clock className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Offerten in 24h</p>
                <p className="text-xs text-muted-foreground">
                  Bis zu 5 Firmen melden sich mit individuellen Angeboten
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Phone className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Persönliche Beratung</p>
                <p className="text-xs text-muted-foreground">
                  Bei Fragen: 044 XXX XX XX (Mo-Fr 9-17 Uhr)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="space-y-3 w-full">
          <Link to="/firmen" className="block">
            <Button className="w-full h-12 gap-2">
              Umzugsfirmen ansehen
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/" className="block">
            <Button variant="ghost" className="w-full">
              Zur Startseite
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
