import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Calendar, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

const QuickQuoteForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    date: "",
    rooms: "2-3",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/contact", { state: formData });
  };

  return (
    <section className="py-16 bg-gradient-to-br from-primary via-primary to-primary/90">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-2">
              Schnelle Offerte in 30 Sekunden
            </h2>
            <p className="text-primary-foreground/80">
              Erhalten Sie jetzt Ihre unverbindliche Kostenschätzung
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-background/10 backdrop-blur-sm rounded-2xl p-6 md:p-8">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-foreground/60" />
                <Input
                  placeholder="Von (PLZ/Ort)"
                  value={formData.from}
                  onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                  className="pl-10 bg-background/90 border-0 h-12"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-foreground/60" />
                <Input
                  placeholder="Nach (PLZ/Ort)"
                  value={formData.to}
                  onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                  className="pl-10 bg-background/90 border-0 h-12"
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-foreground/60" />
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="pl-10 bg-background/90 border-0 h-12"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="h-12 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
              >
                Offerte holen
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mt-6 text-primary-foreground/80 text-sm">
              <span className="flex items-center gap-1">
                <Home className="w-4 h-4" /> Kostenlos
              </span>
              <span>•</span>
              <span>Unverbindlich</span>
              <span>•</span>
              <span>In 24h Antwort</span>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default QuickQuoteForm;
