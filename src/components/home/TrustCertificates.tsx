import { Shield, Award, CheckCircle2, Lock, FileCheck, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const certificates = [
  {
    icon: Shield,
    title: "SSL-Verschlüsselt",
    description: "Ihre Daten sind sicher",
    color: "text-success"
  },
  {
    icon: Award,
    title: "Swiss Made",
    description: "100% Schweizer Qualität",
    color: "text-primary"
  },
  {
    icon: Lock,
    title: "DSGVO-konform",
    description: "Datenschutz garantiert",
    color: "text-info"
  },
  {
    icon: FileCheck,
    title: "Geprüfte Firmen",
    description: "Nur verifizierte Partner",
    color: "text-accent"
  },
  {
    icon: CheckCircle2,
    title: "Versichert",
    description: "Vollumfänglicher Schutz",
    color: "text-success"
  },
  {
    icon: Users,
    title: "TÜV-zertifiziert",
    description: "Qualität bestätigt",
    color: "text-warning"
  }
];

export const TrustCertificates = () => {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-secondary/10 to-background border-y border-border">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ihre Sicherheit ist unsere Priorität
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Zertifiziert, versichert und nach höchsten Schweizer Standards geprüft
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 max-w-6xl mx-auto">
          {certificates.map((cert, index) => (
            <Card
              key={index}
              className="border-2 border-border hover:border-primary/20 hover-lift group transition-all"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto rounded-xl bg-secondary group-hover:bg-primary/10 flex items-center justify-center mb-3 transition-all group-hover:scale-110">
                  <cert.icon className={`w-6 h-6 ${cert.color}`} />
                </div>
                <div className="font-bold text-sm mb-1">{cert.title}</div>
                <div className="text-xs text-muted-foreground">{cert.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional trust message */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground max-w-3xl mx-auto">
            <Shield className="w-5 h-5 inline-block mr-2 text-success" />
            <strong className="text-foreground">100% Schweizer Qualität:</strong> Alle unsere Partner 
            durchlaufen einen strengen Prüfprozess und erfüllen höchste Qualitäts- und Sicherheitsstandards. 
            Ihre Zufriedenheit und Sicherheit stehen an erster Stelle.
          </p>
        </div>
      </div>
    </section>
  );
};