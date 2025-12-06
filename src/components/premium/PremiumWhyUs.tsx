import { Shield, Clock, Eye, Users, Headphones, Award, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import customerSupportImg from "@/assets/customer-support-woman.jpg";

const usps = [
  {
    icon: Shield,
    title: "Nur geprüfte Partner",
    description: "Jede Umzugsfirma wird auf Versicherung, Bewilligungen und Qualität geprüft, bevor sie aufgenommen wird.",
    stat: "200+ Partner"
  },
  {
    icon: Eye,
    title: "Transparente Preise",
    description: "Keine versteckten Kosten oder bösen Überraschungen. Sie erhalten klare, vergleichbare Offerten.",
    stat: "100% transparent"
  },
  {
    icon: Clock,
    title: "Zeit & Nerven sparen",
    description: "Statt dutzende Telefonate führen Sie eine Anfrage aus und erhalten mehrere Angebote.",
    stat: "Ø 3 Std. gespart"
  },
  {
    icon: Award,
    title: "AI-gestützte Analyse",
    description: "Unser intelligentes System findet die bestpassenden Firmen für Ihre spezifischen Anforderungen.",
    stat: "98% Trefferquote"
  },
  {
    icon: Users,
    title: "Lokale Schweizer Experten",
    description: "Alle Partner sind etablierte Schweizer Unternehmen mit regionalem Know-how und Erfahrung.",
    stat: "26 Kantone"
  },
  {
    icon: Headphones,
    title: "Persönlicher Support",
    description: "Bei Fragen sind wir für Sie da – per Telefon, E-Mail oder Chat. Schweizer Qualität im Service.",
    stat: "< 2h Antwortzeit"
  }
];

export const PremiumWhyUs = () => {
  return (
    <section className="py-16 md:py-24 bg-muted/30" aria-labelledby="why-us-heading">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3">
            Ihre Vorteile
          </span>
          <h2 id="why-us-heading" className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Warum mit Umzugscheck.ch vergleichen?
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Wir machen Umzüge in der Schweiz einfacher, transparenter und stressfreier.
          </p>
        </motion.div>
        
        {/* Content Grid: USPs + Image */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* USPs - 2 columns on larger screens */}
          <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
            {usps.map((usp, idx) => {
              const Icon = usp.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="group bg-card rounded-2xl p-6 shadow-sm border border-border/50 hover:shadow-lift hover:border-primary/20 transition-all"
                >
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-bold text-foreground">{usp.title}</h3>
                        <span className="flex-shrink-0 text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                          {usp.stat}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed">{usp.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
          
          {/* Image Column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="hidden lg:block relative"
          >
            <div className="sticky top-24">
              <div className="relative rounded-3xl overflow-hidden shadow-deep">
                <img 
                  src={customerSupportImg} 
                  alt="Freundlicher Kundenservice" 
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                    <div className="flex items-center gap-3">
                      <Headphones className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-semibold text-foreground text-sm">Persönlicher Support</div>
                        <div className="text-xs text-muted-foreground">Mo-Fr 8:00-18:00 Uhr</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Trust Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              100% kostenlos
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              Unverbindlich
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              Schweizer Datenschutz
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              Keine Spam-Anrufe
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
