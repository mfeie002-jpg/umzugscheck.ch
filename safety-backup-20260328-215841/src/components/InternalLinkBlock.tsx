import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

interface LinkItem {
  title: string;
  href: string;
  description?: string;
}

interface LinkSection {
  heading: string;
  links: LinkItem[];
}

interface InternalLinkBlockProps {
  sections?: LinkSection[];
  title?: string;
  subtitle?: string;
  links?: { text: string; url: string }[];
}

export const InternalLinkBlock = ({ sections, title, subtitle, links }: InternalLinkBlockProps) => {
  // If simple links array is provided, convert to sections format
  const displaySections = links 
    ? [{ heading: "", links: links.map(l => ({ title: l.text, href: l.url })) }]
    : sections || [];

  return (
    <section className="py-12 md:py-16 bg-secondary/10">
      <div className="container mx-auto px-4">
        {(title || subtitle) && (
          <div className="text-center mb-10">
            {title && <h2 className="text-2xl md:text-3xl font-bold mb-3">{title}</h2>}
            {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
          </div>
        )}

        {links ? (
          <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
            {links.map((link, idx) => (
              <Link 
                key={idx}
                to={link.url}
                className="px-6 py-3 bg-card border border-border rounded-lg hover:bg-accent hover:border-primary transition-all hover:-translate-y-0.5 hover:shadow-md text-foreground hover:text-primary font-medium"
              >
                {link.text}
              </Link>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {displaySections.map((section, idx) => (
              <Card key={idx} className="p-6 shadow-soft hover:shadow-medium transition-shadow">
                {section.heading && <h3 className="text-lg font-bold mb-4">{section.heading}</h3>}
                <div className="space-y-2">
                  {section.links.map((link, linkIdx) => (
                    <Link 
                      key={linkIdx}
                      to={link.href}
                      className="group flex items-center justify-between text-sm text-foreground hover:text-primary transition-colors py-1"
                    >
                      <span className="font-medium">{link.title}</span>
                      <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
