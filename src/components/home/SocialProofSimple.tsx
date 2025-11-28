import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote, Shield } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Thomas M.",
    location: "Zürich",
    rating: 5,
    text: "Superschnell, faire Preise und professionelle Firmen. Genau so sollte ein Umzug laufen!"
  },
  {
    name: "Sarah K.",
    location: "Bern",
    rating: 5,
    text: "Die AI-Preisberechnung war genau! Drei Angebote erhalten und die beste Firma gewählt."
  },
  {
    name: "Marco R.",
    location: "Basel",
    rating: 5,
    text: "Transparent, keine versteckten Kosten. Die Vergleichsfunktion hat uns viel Geld gespart."
  },
  {
    name: "Lisa B.",
    location: "Luzern",
    rating: 5,
    text: "Einfacher geht's nicht. In 2 Minuten alle Infos eingegeben und am nächsten Tag Offerten erhalten."
  },
  {
    name: "Peter S.",
    location: "St. Gallen",
    rating: 5,
    text: "Alle Firmen waren geprüft und versichert. Das gibt ein gutes Gefühl beim Umzug."
  }
];

export const SocialProofSimple = () => {
  return (
    <section className="py-16 md:py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        
        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-5xl mx-auto"
        >
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">25'000+</div>
            <p className="text-slate-600 font-medium">Erfolgreiche Umzüge seit 2020</p>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">4.9/5</div>
            <p className="text-slate-600 font-medium">Durchschnittliche Kundenbewertung</p>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">100%</div>
            <p className="text-slate-600 font-medium">Zertifizierte Schweizer Firmen</p>
          </div>
        </motion.div>

        {/* Reviews Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="overflow-x-auto pb-4"
        >
          <div className="flex gap-6 min-w-max md:grid md:grid-cols-3 md:min-w-0 max-w-6xl mx-auto">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="w-[300px] md:w-auto"
              >
                <Card className="h-full bg-white border-slate-200 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-slate-700 mb-4 leading-relaxed">
                      "{testimonial.text}"
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                        {testimonial.name[0]}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">
                          {testimonial.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          {testimonial.location}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
