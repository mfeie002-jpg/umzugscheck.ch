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
  sections: LinkSection[];
  title?: string;
  subtitle?: string;
}

export const InternalLinkBlock = ({ sections, title, subtitle }: InternalLinkBlockProps) => {
  return (
    <section className="py-12 md:py-16 bg-secondary/10">
      <div className="container mx-auto px-4">
        {(title || subtitle) && (
          <div className="text-center mb-10">
            {title && <h2 className="text-2xl md:text-3xl font-bold mb-3">{title}</h2>}
            {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {sections.map((section, idx) => (
            <Card key={idx} className="p-6 shadow-soft hover:shadow-medium transition-shadow">
              <h3 className="text-lg font-bold mb-4">{section.heading}</h3>
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
      </div>
    </section>
  );
};
