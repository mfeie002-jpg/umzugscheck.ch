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
    <section className="py-20 md:py-28 bg-slate-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
            Transparente Preisbeispiele
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
            Realistische Kostenübersicht für Umzüge in der Schweiz
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {examples.map((example, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="text-center hover:shadow-lg transition-all border-slate-200 bg-white overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative bg-slate-50 p-8 flex items-center justify-center min-h-[200px]">
                    <img 
                      src={example.image} 
                      alt={example.title}
                      className="max-w-full h-auto max-h-[180px] object-contain"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold mb-3 text-slate-900">{example.title}</h3>
                    <p className="text-3xl font-bold text-blue-600">{example.price}</p>
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
          className="text-center mt-12"
        >
          <p className="text-lg text-slate-400 text-center max-w-md mx-auto mt-6">
            <em>Dies sind Richtwerte. Exakte Preise erhalten Sie mit Ihrer Offertenanfrage.</em>
          </p>
        </motion.div>
      </div>
    </section>
  );
};
