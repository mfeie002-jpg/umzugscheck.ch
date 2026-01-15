import { memo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  FileText, 
  Calculator, 
  CheckSquare, 
  Lightbulb,
  ArrowRight
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface RegionContentClusterProps {
  regionName: string;
  regionSlug: string;
}

export const RegionContentCluster = memo(({ regionName, regionSlug }: RegionContentClusterProps) => {
  const CLUSTER_LINKS = [
    {
      icon: Calculator,
      title: `Umzugskosten ${regionName}`,
      description: "Was kostet ein Umzug? Preise im Überblick",
      href: "/umzugsrechner",
      color: "bg-blue-500/10 text-blue-600"
    },
    {
      icon: CheckSquare,
      title: "Umzugs-Checkliste",
      description: "Nichts vergessen: Die komplette Checkliste",
      href: "/ratgeber/umzug-checkliste",
      color: "bg-green-500/10 text-green-600"
    },
    {
      icon: Lightbulb,
      title: `Umzugstipps ${regionName}`,
      description: "Lokale Tipps für einen reibungslosen Umzug",
      href: "/ratgeber/umzugstipps",
      color: "bg-amber-500/10 text-amber-600"
    },
    {
      icon: FileText,
      title: "Offerten vergleichen",
      description: "So finden Sie die beste Umzugsfirma",
      href: "/ratgeber/offerten-vergleichen",
      color: "bg-purple-500/10 text-purple-600"
    }
  ];

  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-lg font-bold text-foreground mb-6">
            Weiterführende Ratgeber
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CLUSTER_LINKS.map((link, index) => (
              <motion.div
                key={link.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link to={link.href}>
                  <Card className="h-full hover:shadow-md transition-all group border-border/50 hover:border-primary/30">
                    <CardContent className="p-4">
                      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${link.color} mb-3`}>
                        <link.icon className="h-5 w-5" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                        {link.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {link.description}
                      </p>
                      <span className="inline-flex items-center gap-1 text-xs text-primary font-medium">
                        Mehr erfahren
                        <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
});

RegionContentCluster.displayName = "RegionContentCluster";
