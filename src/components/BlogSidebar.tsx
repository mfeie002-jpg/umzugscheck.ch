import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, BookOpen, DollarSign, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface BlogPost {
  id: string;
  title: string;
  image: string;
  readTime: string;
}

interface BlogSidebarProps {
  popularPosts: BlogPost[];
  categories: { name: string; count: number }[];
}

export const BlogSidebar = ({ popularPosts, categories }: BlogSidebarProps) => {
  return (
    <div className="space-y-6">
      {/* Most Read */}
      <Card className="shadow-strong">
        <CardContent className="p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Meistgelesen
          </h3>
          <div className="space-y-4">
            {popularPosts.map((post) => (
              <Link key={post.id} to={`/blog/${post.id}`} className="block group">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center text-xl">
                    {post.image}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">{post.readTime}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card className="shadow-strong">
        <CardContent className="p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Kategorien
          </h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <button
                key={category.name}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-secondary/50 transition-colors flex items-center justify-between group"
              >
                <span className="font-medium text-sm group-hover:text-primary transition-colors">
                  {category.name}
                </span>
                <span className="text-xs text-muted-foreground">{category.count}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cost Calculator CTA */}
      <Card className="shadow-strong bg-gradient-to-br from-primary/5 to-accent/5 border-primary/10">
        <CardContent className="p-6 text-center">
          <DollarSign className="w-12 h-12 text-primary mx-auto mb-3" />
          <h3 className="font-bold mb-2">Kostenrechner</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Berechnen Sie die Kosten für Ihren Umzug in 60 Sekunden
          </p>
          <Link to="/rechner">
            <Button className="w-full bg-accent hover:bg-accent/90 group">
              Jetzt berechnen
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};
