import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { 
  getCityPageLinks, 
  getServicePageLinks, 
  getCityServicePageLinks,
  type LinkCluster 
} from "@/lib/internal-linking";

interface InternalLinksProps {
  type: 'service' | 'city' | 'city-service' | 'main';
  currentService?: string;
  currentCity?: string;
  pageType?: 'offerten' | 'preise' | 'vergleich' | 'faq';
}

export const InternalLinks = ({ type, currentService, currentCity, pageType }: InternalLinksProps) => {
  let linkClusters: LinkCluster[] = [];

  if (type === 'city' && currentCity) {
    linkClusters = getCityPageLinks(currentCity);
  } else if (type === 'service' && currentService) {
    linkClusters = getServicePageLinks(currentService);
  } else if (type === 'city-service' && currentCity && currentService) {
    linkClusters = getCityServicePageLinks(currentCity, currentService);
  }

  if (linkClusters.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-16 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            Weitere Services & Regionen
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {linkClusters.map((cluster, idx) => (
              <Card key={idx} className="p-6 shadow-medium hover:shadow-strong transition-shadow">
                <h3 className="text-lg font-bold mb-4">{cluster.title}</h3>
                <div className="space-y-2">
                  {cluster.links.map((link, linkIdx) => (
                    <Link 
                      key={linkIdx}
                      to={link.url}
                      className="block text-primary hover:underline font-medium transition-colors"
                    >
                      {link.text}
                    </Link>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
