import { motion } from "framer-motion";
import { Star, ExternalLink, Shield, Award } from "lucide-react";

const reviews = [
  { name: "M. Schneider", rating: 5, text: "Super Service, schnelle Antwort!", date: "vor 2 Tagen" },
  { name: "A. Brunner", rating: 5, text: "Beste Vergleichsplattform!", date: "vor 3 Tagen" },
  { name: "K. Weber", rating: 5, text: "1'200 CHF gespart, top!", date: "vor 1 Woche" },
  { name: "L. Fischer", rating: 4, text: "Sehr zu empfehlen", date: "vor 1 Woche" },
];

export const PremiumTrustPilot = () => {
  return (
    <section className="py-8 bg-muted/30 border-y">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left: Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="bg-[#00b67a] text-white px-3 py-1 rounded font-bold text-sm">
                Trustpilot
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#00b67a] text-[#00b67a]" />
                ))}
              </div>
              <span className="text-sm font-medium">4.8/5</span>
            </div>

            <div className="h-6 w-px bg-border hidden md:block" />

            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium">Swiss Made</span>
            </div>

            <div className="h-6 w-px bg-border hidden md:block" />

            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-600" />
              <span className="text-sm font-medium">Best of Swiss Web 2024</span>
            </div>
          </div>

          {/* Right: Mini reviews */}
          <div className="flex items-center gap-4 overflow-x-auto pb-2 md:pb-0">
            {reviews.slice(0, 3).map((review, index) => (
              <motion.div
                key={review.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex-shrink-0 bg-card rounded-lg px-4 py-2 shadow-sm border flex items-center gap-3"
              >
                <div className="flex items-center gap-0.5">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">{review.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
