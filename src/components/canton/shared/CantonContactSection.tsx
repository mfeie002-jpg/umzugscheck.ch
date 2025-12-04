import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MessageCircle, Clock, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

interface CantonContactSectionProps {
  cantonName: string;
  phone?: string;
  email?: string;
  regions?: string;
}

export const CantonContactSection = ({ 
  cantonName, 
  phone = "044 123 45 67", 
  email = "info@umzugscheck.ch",
  regions = "der ganzen Region"
}: CantonContactSectionProps) => (
  <section className="py-12 bg-muted/30">
    <div className="container mx-auto px-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Kontakt & Beratung</h2>
        <p className="text-muted-foreground">Persönliche Beratung für Ihren Umzug in {cantonName}</p>
      </div>
      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <Card className="text-center hover:shadow-lg transition-all">
          <CardContent className="p-6">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Phone className="h-7 w-7 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Telefon</h3>
            <p className="text-primary font-medium mb-3">{phone}</p>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Mo-Fr 8-18 Uhr</span>
            </div>
          </CardContent>
        </Card>
        <Card className="text-center hover:shadow-lg transition-all">
          <CardContent className="p-6">
            <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-7 w-7 text-accent" />
            </div>
            <h3 className="font-semibold mb-2">Live Chat</h3>
            <p className="text-sm text-muted-foreground mb-3">Sofortige Antworten</p>
            <Link to="/kontakt">
              <Button variant="outline" size="sm">Chat starten</Button>
            </Link>
          </CardContent>
        </Card>
        <Card className="text-center hover:shadow-lg transition-all">
          <CardContent className="p-6">
            <div className="w-14 h-14 rounded-2xl bg-success/10 flex items-center justify-center mx-auto mb-4">
              <Mail className="h-7 w-7 text-success" />
            </div>
            <h3 className="font-semibold mb-2">E-Mail</h3>
            <p className="text-sm text-muted-foreground mb-3">Antwort in 24h</p>
            <a href={`mailto:${email}`} className="text-primary hover:underline text-sm">{email}</a>
          </CardContent>
        </Card>
      </div>
      <div className="flex items-center justify-center gap-2 mt-6 text-sm text-muted-foreground">
        <MapPin className="h-4 w-4" />
        <span>Beratung für {cantonName} und {regions}</span>
      </div>
    </div>
  </section>
);
