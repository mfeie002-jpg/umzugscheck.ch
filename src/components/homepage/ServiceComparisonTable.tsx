import { Check, X, Minus } from "lucide-react";
import { motion } from "framer-motion";

const packages = [
  {
    name: "Basic",
    price: "ab CHF 490",
    features: {
      transport: true,
      packing: false,
      assembly: false,
      cleaning: false,
      storage: false,
      insurance: "basis"
    }
  },
  {
    name: "Komfort",
    price: "ab CHF 890",
    popular: true,
    features: {
      transport: true,
      packing: true,
      assembly: true,
      cleaning: false,
      storage: false,
      insurance: "erweitert"
    }
  },
  {
    name: "Premium",
    price: "ab CHF 1'490",
    features: {
      transport: true,
      packing: true,
      assembly: true,
      cleaning: true,
      storage: true,
      insurance: "vollkasko"
    }
  }
];

const featureLabels: Record<string, string> = {
  transport: "Transport",
  packing: "Ein- & Auspacken",
  assembly: "Möbelmontage",
  cleaning: "Endreinigung",
  storage: "Zwischenlagerung",
  insurance: "Versicherung"
};

export const ServiceComparisonTable = () => {
  const renderFeature = (value: boolean | string) => {
    if (typeof value === "boolean") {
      return value ? (
        <Check className="h-5 w-5 text-green-500" />
      ) : (
        <X className="h-5 w-5 text-muted-foreground/50" />
      );
    }
    return <span className="text-sm font-medium capitalize">{value}</span>;
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Service-Pakete vergleichen</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Finden Sie das passende Paket für Ihren Umzug
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full max-w-4xl mx-auto" role="table">
            <thead>
              <tr>
                <th scope="col" className="text-left p-4 text-muted-foreground font-medium">Leistung</th>
                {packages.map((pkg) => (
                  <th key={pkg.name} scope="col" className="p-4 text-center">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className={`p-4 rounded-xl ${pkg.popular ? "bg-primary text-primary-foreground" : "bg-card border border-border"}`}
                    >
                      {pkg.popular && (
                        <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full mb-2 inline-block">
                          Beliebt
                        </span>
                      )}
                      <div className="font-bold text-lg">{pkg.name}</div>
                      <div className={`text-sm ${pkg.popular ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                        {pkg.price}
                      </div>
                    </motion.div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.keys(featureLabels).map((featureKey) => (
                <tr key={featureKey} className="border-t border-border">
                  <td className="p-4 text-foreground font-medium">{featureLabels[featureKey]}</td>
                  {packages.map((pkg) => (
                    <td key={`${pkg.name}-${featureKey}`} className="p-4 text-center">
                      <div className="flex justify-center">
                        {renderFeature(pkg.features[featureKey as keyof typeof pkg.features])}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
