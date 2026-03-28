import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock } from "lucide-react";
import { Link } from "react-router-dom";

interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
}

interface RelatedArticlesProps {
  articles: Article[];
}

export const RelatedArticles = ({ articles }: RelatedArticlesProps) => {
  return (
    <section className="py-12 md:py-16 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Weitere hilfreiche Artikel</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Card key={article.slug} className="shadow-soft hover:shadow-medium transition-shadow group">
                <CardHeader>
                  <Badge variant="outline" className="w-fit mb-2">
                    {article.category}
                  </Badge>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {article.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{article.readTime}</span>
                    </div>
                    
                    <Link to={`/blog/${article.slug}`}>
                      <Button size="sm" variant="ghost" className="group/btn">
                        Lesen
                        <ArrowRight className="ml-1 w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
