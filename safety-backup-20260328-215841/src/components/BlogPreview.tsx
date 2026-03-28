import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Clock, BookOpen } from "lucide-react";
import { Card } from "./ui/card";
import AnimatedSection from "./AnimatedSection";
import { blogArticles } from "@/data/blogArticles";

export default function BlogPreview() {
  const featuredArticles = blogArticles.slice(0, 3);

  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-alpine bg-alpine/10 rounded-full mb-4">
            <BookOpen className="inline-block w-3 h-3 mr-1" />
            Ratgeber
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 font-display">
            Tipps & Tricks für Ihren <span className="text-gradient">Umzug</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Praktisches Wissen aus über 40 Jahren Erfahrung
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {featuredArticles.map((article, index) => (
            <AnimatedSection key={index} delay={index * 0.1}>
              <Link to={`/guide/${article.slug}`}>
                <Card className="overflow-hidden hover-lift h-full group">
                  <div className="relative h-48">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-alpine text-alpine-foreground text-xs font-medium rounded-full">
                        {article.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {article.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {article.readTime}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-alpine transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {article.excerpt}
                    </p>
                  </div>
                </Card>
              </Link>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.3} className="text-center">
          <Link
            to="/guide"
            className="inline-flex items-center text-alpine font-medium hover:underline"
          >
            Alle Artikel lesen
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}
