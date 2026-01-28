import { Link } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SectionBadge from "@/components/SectionBadge";
import LazyImage from "@/components/LazyImage";
import blogChecklist from "@/assets/blog-checklist-new.jpg";
import blogCosts from "@/assets/blog-costs.jpg";
import blogFamily from "@/assets/blog-family-move.jpg";

const BlogPreviewSection = () => {
  const articles = [
    {
      title: "Die ultimative Umzugscheckliste",
      excerpt: "Alles was Sie beachten müssen für einen stressfreien Umzug – von der Planung bis zur Übergabe.",
      image: blogChecklist,
      slug: "umzugscheckliste",
      readTime: "5 Min",
      category: "Planung",
    },
    {
      title: "Umzugskosten in der Schweiz 2024",
      excerpt: "Was kostet ein Umzug wirklich? Wir erklären alle Faktoren und geben Spartipps.",
      image: blogCosts,
      slug: "umzugskosten-schweiz",
      readTime: "7 Min",
      category: "Kosten",
    },
    {
      title: "Umzug mit Kindern meistern",
      excerpt: "So machen Sie den Umzug auch für die Kleinen zu einem positiven Erlebnis.",
      image: blogFamily,
      slug: "umzug-mit-kindern",
      readTime: "4 Min",
      category: "Familie",
    },
  ];

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16 space-y-4 animate-fade-in">
          <SectionBadge variant="warm">Ratgeber</SectionBadge>
          <h2 className="text-balance font-display mt-4">
            Tipps für Ihren <span className="text-gradient-warm">Umzug</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Praktische Ratgeber und Checklisten von unseren Experten.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-10">
          {articles.map((article, index) => (
            <div 
              key={index} 
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Link to={`/guide/${article.slug}`} className="block group h-full">
                <Card className="overflow-hidden h-full hover-lift">
                  <div className="relative h-48 overflow-hidden">
                    <LazyImage 
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-full bg-white/90 text-xs font-semibold">
                        {article.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {article.readTime}
                      </div>
                    </div>
                    <h3 className="font-bold text-lg mb-2 group-hover:text-alpine transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>
                </Card>
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <Link to="/blog">
            <Button variant="outline" className="border-2">
              Alle Ratgeber ansehen
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogPreviewSection;
