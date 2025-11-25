import { Shield, Award, CheckCircle2, TrendingUp } from "lucide-react";

// Swiss-relevant media and certification logos
const mediaPartners = [
  { name: "Tages-Anzeiger", logo: "📰" },
  { name: "NZZ", logo: "📑" },
  { name: "20 Minuten", logo: "📱" },
  { name: "Blick", logo: "📋" },
  { name: "SRF", logo: "📺" },
];

const certifications = [
  { 
    name: "TÜV Schweiz", 
    icon: Shield, 
    description: "Geprüfte Qualität",
    color: "text-blue-600"
  },
  { 
    name: "VMS Mitglied", 
    icon: Award, 
    description: "Verband Möbeltransporte",
    color: "text-primary"
  },
  { 
    name: "ISO 9001", 
    icon: CheckCircle2, 
    description: "Qualitätsmanagement",
    color: "text-success"
  },
  { 
    name: "SVDU Partner", 
    icon: TrendingUp, 
    description: "Dienstleistungsunternehmen",
    color: "text-accent"
  },
];

export const VerifiedPartners = () => {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-secondary/30 to-white border-y border-border/50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-premium bg-clip-text text-transparent">
              Bekannt aus & geprüft von
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Vertrauen Sie auf Schweizer Qualität – empfohlen von führenden Medien und zertifiziert durch renommierte Institutionen
            </p>
          </div>

          {/* Media Partners */}
          <div className="mb-12">
            <h3 className="text-center text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-6">
              Bekannt aus
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
              {mediaPartners.map((partner, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center gap-2 group transition-all hover:scale-110"
                >
                  <div className="text-4xl md:text-5xl opacity-60 group-hover:opacity-100 transition-opacity">
                    {partner.logo}
                  </div>
                  <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    {partner.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div>
            <h3 className="text-center text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-6">
              Geprüft & zertifiziert von
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {certifications.map((cert, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center p-6 rounded-2xl bg-white shadow-soft hover:shadow-medium transition-all group"
                >
                  <div className={`w-14 h-14 rounded-full bg-secondary flex items-center justify-center mb-3 group-hover:scale-110 transition-transform ${cert.color}`}>
                    <cert.icon className="w-7 h-7" />
                  </div>
                  <h4 className="font-bold text-sm mb-1">{cert.name}</h4>
                  <p className="text-xs text-muted-foreground">{cert.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Trust Statement */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-success/10 border border-success/20 rounded-full">
              <CheckCircle2 className="w-5 h-5 text-success" />
              <span className="text-sm font-semibold text-success">
                Über 200+ geprüfte Umzugspartner schweizweit
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
