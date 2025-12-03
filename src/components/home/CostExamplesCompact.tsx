import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import apartment15Room from "@/assets/apartment-1-5-room.jpg";
import apartment25Room from "@/assets/apartment-2-5-room.jpg";
import apartment45Room from "@/assets/apartment-4-5-room.jpg";

const examples = [
  {
    image: apartment15Room,
    title: "1.5-Zimmer Wohnung",
    price: "ab CHF 680"
  },
  {
    image: apartment25Room,
    title: "2.5-Zimmer Wohnung",
    price: "ab CHF 980"
  },
  {
    image: apartment45Room,
    title: "4.5-Zimmer Wohnung",
    price: "ab CHF 1'650"
  }
];

export const CostExamplesCompact = () => {
  return (
    <section className="py-12 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-16"
        >
          <h2 className="text-2xl md:text-5xl font-bold mb-3 md:mb-4 text-foreground">
            Transparente Preisbeispiele
          </h2>
          <p className="text-sm md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Realistische Kostenübersicht für Umzüge in der Schweiz
          </p>
        </motion.div>

        <div className="grid grid-cols-3 gap-2 md:gap-6 max-w-6xl mx-auto">
          {examples.map((example, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border bg-card overflow-hidden group">
                <CardContent className="p-0">
                  <div className="relative bg-gradient-to-br from-muted/50 to-muted p-3 md:p-8 flex items-center justify-center min-h-[100px] md:min-h-[200px] overflow-hidden">
                    <img 
                      src={example.image} 
                      alt={example.title}
                      className="max-w-full h-auto max-h-[80px] md:max-h-[180px] object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-3 md:p-6 bg-card">
                    <h3 className="text-xs md:text-lg font-bold mb-1 md:mb-3 text-foreground leading-tight">{example.title}</h3>
                    <p className="text-lg md:text-4xl font-bold text-primary">{example.price}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-6 md:mt-12"
        >
          <p className="text-xs md:text-base text-muted-foreground text-center max-w-lg mx-auto italic">
            Dies sind Richtwerte. Exakte Preise erhalten Sie mit Ihrer Offertenanfrage.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
