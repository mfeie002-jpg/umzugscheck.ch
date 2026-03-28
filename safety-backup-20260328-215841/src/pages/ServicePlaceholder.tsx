
import { OptimizedSEO } from "@/components/OptimizedSEO";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface ServicePlaceholderProps {
  serviceName: string;
  slug: string;
  description: string;
}

const ServicePlaceholder = ({ serviceName, slug, description }: ServicePlaceholderProps) => {
  return (
    <div className="min-h-screen bg-background">
      <OptimizedSEO
        title={`${serviceName} Schweiz – Offerten vergleichen | umzugscheck.ch`}
        description={description}
        canonicalUrl={`https://umzugscheck.ch/${slug}`}
        keywords={`${serviceName}, ${serviceName} Schweiz, ${serviceName} Offerten`}
      />

      <main id="main-content" role="main">
        <section className="py-16 md:py-24 bg-gradient-to-br from-background via-secondary/5 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                {serviceName}
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                {description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/umzugsrechner">
                  <Button size="lg" className="w-full sm:w-auto">
                    Jetzt Offerten erhalten
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/umzugsfirmen">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Alle Anbieter ansehen
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      
    </div>
  );
};

export default ServicePlaceholder;
