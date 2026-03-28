import { memo } from "react";
import { motion } from "framer-motion";
import { Package, Wrench, Sparkles, Truck, Warehouse, Piano, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ICON_MAP: Record<string, typeof Package> = {
  'Package': Package,
  'Wrench': Wrench,
  'Sparkles': Sparkles,
  'Truck': Truck,
  'Warehouse': Warehouse,
  'Piano': Piano,
};

interface Service {
  title: string;
  icon: string;
  description: string;
}

interface RegionServicesProps {
  services: Service[];
  regionName: string;
}

export const RegionServices = memo(({ services, regionName }: RegionServicesProps) => {
  return (
    <section className="py-10 md:py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Umzugsservices in {regionName}
          </h2>
          <p className="text-muted-foreground">
            Alle Services für Ihren perfekten Umzug aus einer Hand
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
          {services.map((service, index) => {
            const Icon = ICON_MAP[service.icon] || Package;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="bg-card border border-border rounded-xl p-4 md:p-5 text-center hover:shadow-md hover:border-primary/30 transition-all"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-sm md:text-base mb-1">{service.title}</h3>
                <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
                  {service.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <Button variant="outline" size="lg" asChild>
            <Link to="/services">
              Alle Services entdecken
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
});

RegionServices.displayName = 'RegionServices';
