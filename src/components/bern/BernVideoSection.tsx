import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Camera, Upload, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export const BernVideoSection = () => (
  <section className="py-12">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
        <div>
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            KI-Technologie
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Video-Schätzung für Ihren Umzug in Bern</h2>
          <p className="text-muted-foreground mb-6">
            Laden Sie ein Video Ihrer Wohnung hoch und unsere KI erstellt eine präzise Kostenschätzung – 
            ideal für Umzüge in der Berner Altstadt oder ins Mittelland.
          </p>
          <ul className="space-y-3 mb-6">
            {[
              { icon: Camera, text: "Einfach filmen mit dem Smartphone" },
              { icon: Upload, text: "Video hochladen in 30 Sekunden" },
              { icon: Sparkles, text: "KI analysiert Möbel & Volumen" },
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <item.icon className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm">{item.text}</span>
              </li>
            ))}
          </ul>
          <Link to="/rechner/video">
            <Button className="bg-primary hover:bg-primary/90">
              <Play className="mr-2 h-4 w-4" />
              Video-Schätzung starten
            </Button>
          </Link>
        </div>
        <Card className="border-2 border-dashed border-primary/30 bg-primary/5">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Camera className="h-10 w-10 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Präzise Berner Schätzung</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Unsere KI kennt die Besonderheiten der Bundesstadt: enge Altstadt-Gassen, Liftbedarf und mehr.
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <span>✓ Genauigkeit 95%</span>
              <span>✓ In 2 Minuten</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </section>
);
