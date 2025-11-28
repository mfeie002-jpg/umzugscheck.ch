import { Home, Building, Truck } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const examples = [
  {
    icon: Home,
    title: "1.5-Zimmer Wohnung",
    price: "ab CHF 680",
    color: "bg-blue-100 text-blue-600"
  },
  {
    icon: Building,
    title: "2.5-Zimmer Wohnung",
    price: "ab CHF 980",
    color: "bg-cyan-100 text-cyan-600"
  },
  {
    icon: Home,
    title: "4.5-Zimmer Wohnung",
    price: "ab CHF 1'650",
    color: "bg-blue-100 text-blue-600"
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
              <Card className="text-center hover:shadow-lg transition-all border-slate-200 bg-white">
                <CardContent className="p-8">
                  <div className={`w-20 h-20 rounded-3xl ${example.color} flex items-center justify-center mx-auto mb-6 shadow-md`}>
                    <example.icon className="h-10 w-10" />
                  </div>
                  <h3 className="text-lg font-bold mb-3 text-slate-900">{example.title}</h3>
                  <p className="text-3xl font-bold text-blue-600">{example.price}</p>
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
          <Link to="/rechner">
            <Button size="lg" className="h-14 px-10 text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg">
              Exakte Kosten jetzt berechnen
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
