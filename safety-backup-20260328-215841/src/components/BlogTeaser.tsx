import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { BookOpen, ArrowRight, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const articles = [
  {
    title: "Umzugskosten Schweiz 2025",
    excerpt: "Kompletter Überblick über Preise, Faktoren und Einsparmöglichkeiten bei Ihrem Umzug",
    category: "Kosten",
    readTime: "5 min",
    href: "/blog/umzugskosten-schweiz"
  },
  {
    title: "Umzugs-Checkliste",
    excerpt: "30 Tage vor dem Umzug: Was Sie wann erledigen sollten für einen stressfreien Ablauf",
    category: "Planung",
    readTime: "7 min",
    href: "/blog/umzugs-checkliste"
  },
  {
    title: "Umzugsfirmen richtig vergleichen",
    excerpt: "Worauf Sie achten müssen und wie Sie die beste Firma für Ihre Bedürfnisse finden",
    category: "Tipps",
    readTime: "6 min",
    href: "/blog/firmen-vergleichen"
  }
];

export const BlogTeaser = () => {
  return (
    <section className="py-16 md:py-20 bg-gradient-light">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <BookOpen className="w-4 h-4" />
              <span>Ratgeber</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Tipps & Tricks für Ihren Umzug
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Expertenwissen, Checklisten und hilfreiche Guides für einen stressfreien Umzug
            </p>
          </div>

          {/* Articles Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {articles.map((article, index) => (
              <Link key={index} to={article.href} className="group">
                <Card className="h-full transition-all duration-300 hover:shadow-strong hover:-translate-y-1 border-2 hover:border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary" className="text-xs">
                        {article.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {article.readTime}
                      </span>
                    </div>
                    
                    <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {article.excerpt}
                    </p>
                    
                    <div className="flex items-center gap-2 text-primary text-sm font-semibold group-hover:gap-3 transition-all">
                      Weiterlesen
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center">
            <Link to="/blog">
              <Card className="inline-block hover:shadow-medium transition-all duration-300 border-2 hover:border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 text-primary font-semibold">
                    <BookOpen className="w-5 h-5" />
                    <span>Alle Ratgeber-Artikel ansehen</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
