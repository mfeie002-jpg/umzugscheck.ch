import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Camera, Upload, Sparkles, TrendingDown, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export const BernVideoSection = () => (
  <section className="py-12 bg-gradient-to-b from-transparent to-secondary/5">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
        <div>
          {/* Main USP Badge - Highly visible */}
          <div className="inline-flex items-center gap-2 bg-secondary text-white px-4 py-2 rounded-full text-sm font-bold mb-4 shadow-lg shadow-secondary/30 animate-pulse">
            <TrendingDown className="h-5 w-5" />
            <span>Bis zu 40% sparen durch Präzision</span>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Warum KI-Analyse <span className="text-secondary">Geld spart</span>
          </h2>
          
          {/* Key insight box */}
          <div className="bg-secondary/10 border-l-4 border-secondary rounded-r-lg p-4 mb-6">
            <p className="text-sm font-medium text-foreground">
              <strong>Das Problem:</strong> Traditionelle Schätzungen = ungenau → Firmen rechnen Sicherheitspuffer ein → <strong className="text-secondary">Sie zahlen mehr.</strong>
            </p>
            <p className="text-sm font-medium text-foreground mt-2">
              <strong>Die Lösung:</strong> KI-Video-Analyse = exaktes Volumen → <strong className="text-secondary">faire Preise, keine Überraschungen.</strong>
            </p>
          </div>
          
          <ul className="space-y-3 mb-6">
            {[
              { icon: Camera, text: "30 Sek. Video mit Handy", highlight: "Super einfach" },
              { icon: Sparkles, text: "KI erkennt jeden Gegenstand", highlight: "95% Genauigkeit" },
              { icon: TrendingDown, text: "Exakte Offerten", highlight: "Bis 40% günstiger" },
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary/15 flex items-center justify-center">
                  <item.icon className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <span className="text-sm font-medium block">{item.text}</span>
                  <span className="text-xs text-secondary font-bold">{item.highlight}</span>
                </div>
              </li>
            ))}
          </ul>
          
          <Link to="/rechner/video">
            <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white font-bold shadow-xl shadow-secondary/30 transition-transform hover:scale-105">
              <Play className="mr-2 h-5 w-5" />
              Jetzt Video-Analyse starten
            </Button>
          </Link>
        </div>
        <Card className="border-2 border-secondary/30 bg-gradient-to-br from-secondary/5 to-secondary/10 shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 rounded-2xl bg-secondary/20 flex items-center justify-center mx-auto mb-4">
              <Camera className="h-10 w-10 text-secondary" />
            </div>
            <h3 className="font-bold text-lg mb-2">Warum präziser = günstiger?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Traditionelle Schätzungen sind ungenau → Umzugsfirmen rechnen Sicherheitspuffer ein. 
              <strong className="text-foreground"> KI-Analyse eliminiert diese.</strong>
            </p>
            <div className="space-y-2 text-left">
              <div className="flex items-center gap-2 text-sm bg-white/60 rounded-lg p-2">
                <CheckCircle2 className="h-4 w-4 text-secondary flex-shrink-0" />
                <span><strong>95% Genauigkeit</strong> statt Schätzung</span>
              </div>
              <div className="flex items-center gap-2 text-sm bg-white/60 rounded-lg p-2">
                <CheckCircle2 className="h-4 w-4 text-secondary flex-shrink-0" />
                <span><strong>Keine Überraschungen</strong> am Umzugstag</span>
              </div>
              <div className="flex items-center gap-2 text-sm bg-white/60 rounded-lg p-2">
                <CheckCircle2 className="h-4 w-4 text-secondary flex-shrink-0" />
                <span><strong>Faire Preise</strong> ohne versteckte Kosten</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </section>
);
