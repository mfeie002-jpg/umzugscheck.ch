import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Clock, CheckCircle, Star } from "lucide-react";

export const ZuerichVideoSection = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">So funktioniert umzugscheck.ch in Zürich</h2>
            <p className="text-muted-foreground mb-6">
              Sehen Sie, wie einfach Sie Umzugsfirmen in Zürich vergleichen und bis zu 40% sparen können.
            </p>

            <div className="space-y-4">
              {[
                { icon: Clock, text: "In nur 2 Minuten Offerten erhalten" },
                { icon: CheckCircle, text: "Alle Firmen sind geprüft und versichert" },
                { icon: Star, text: "Bewertungen von echten Zürcher Kunden" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <item.icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <Card className="overflow-hidden">
            <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=600')] bg-cover bg-center opacity-30" />
              <Button size="lg" className="relative z-10 gap-2 rounded-full h-16 w-16">
                <Play className="h-6 w-6" />
              </Button>
              <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur rounded-lg p-3 text-white">
                <p className="font-medium text-sm">So vergleichen Sie Umzugsfirmen in Zürich</p>
                <p className="text-xs opacity-80">2:30 Min</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
