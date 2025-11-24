import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Video, Sparkles, Clock, ArrowRight, Smartphone } from "lucide-react";

export const VideoEstimatorTeaser = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-secondary/20 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <Card className="overflow-hidden border-none shadow-strong bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5">
            <CardContent className="p-0">
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Left Content */}
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <Badge className="w-fit mb-4 bg-gradient-to-r from-accent to-primary text-white border-none">
                    <Sparkles className="w-3 h-3 mr-1" />
                    KI-gestützte Kosteneinschätzung
                  </Badge>

                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Video-Umzugsrechner
                  </h2>
                  
                  <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                    Keine Lust auf lange Formulare? Filmen Sie einfach Ihre Wohnung mit dem 
                    Smartphone und erhalten Sie eine präzise Kostenschätzung – in Sekunden.
                  </p>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                        <Smartphone className="w-5 h-5 text-success" />
                      </div>
                      <div>
                        <div className="font-semibold">1. Wohnung filmen</div>
                        <div className="text-sm text-muted-foreground">
                          Alle Zimmer kurz mit dem Handy aufnehmen
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Video className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold">2. Video hochladen</div>
                        <div className="text-sm text-muted-foreground">
                          Datei direkt im Browser hochladen
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <div className="font-semibold">3. Sofortige Schätzung</div>
                        <div className="text-sm text-muted-foreground">
                          KI analysiert Ihr Video und berechnet die Kosten
                        </div>
                      </div>
                    </div>
                  </div>

                  <Link to="/rechner/video">
                    <Button size="lg" className="w-full sm:w-auto group shadow-accent">
                      Video-Rechner testen
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>

                {/* Right Visual */}
                <div className="relative lg:min-h-[500px] bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center p-8">
                  <div className="relative">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-3xl animate-pulse" 
                         style={{ animationDuration: '3s' }}>
                    </div>
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/20 rounded-full blur-3xl animate-pulse" 
                         style={{ animationDuration: '4s', animationDelay: '1s' }}>
                    </div>

                    {/* Main Icon */}
                    <div className="relative z-10 w-48 h-48 md:w-64 md:h-64 rounded-3xl bg-gradient-to-br from-primary to-accent shadow-strong flex items-center justify-center">
                      <Video className="w-24 h-24 md:w-32 md:h-32 text-white" strokeWidth={1.5} />
                    </div>

                    {/* Floating Badges */}
                    <div className="absolute -top-4 -left-4 animate-bounce" style={{ animationDuration: '3s' }}>
                      <Badge className="bg-white text-foreground shadow-medium">
                        <Sparkles className="w-3 h-3 mr-1 text-accent" />
                        KI-Power
                      </Badge>
                    </div>

                    <div className="absolute -bottom-4 -right-4 animate-bounce" style={{ animationDuration: '3s', animationDelay: '1s' }}>
                      <Badge className="bg-white text-foreground shadow-medium">
                        <Clock className="w-3 h-3 mr-1 text-success" />
                        60 Sek
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trust Line */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              ✓ Kostenlos & unverbindlich &nbsp;•&nbsp; ✓ Datenschutzkonform &nbsp;•&nbsp; ✓ Keine Installation nötig
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
