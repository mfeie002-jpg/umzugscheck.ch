import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight } from "lucide-react";

const BLOG_POSTS = [
  {
    id: "umzugskosten-schweiz-2025",
    title: "Umzugskosten in der Schweiz 2025: Der komplette Preisguide",
    excerpt: "Erfahren Sie, was ein Umzug in der Schweiz wirklich kostet und wie Sie bis zu 40% sparen können.",
    category: "Ratgeber",
    date: "2024-01-15",
    readTime: "8 min",
    image: "📊",
  },
  {
    id: "umzugscheckliste",
    title: "Die ultimative Umzugscheckliste: 30 Tage vor dem Umzug",
    excerpt: "Schritt-für-Schritt Anleitung für einen stressfreien Umzug. Vom ersten Tag bis zum Einzug.",
    category: "Checkliste",
    date: "2024-01-10",
    readTime: "6 min",
    image: "✅",
  },
  {
    id: "umzugsfirmen-vergleichen",
    title: "Umzugsfirmen richtig vergleichen: 7 wichtige Kriterien",
    excerpt: "Worauf Sie bei der Auswahl einer Umzugsfirma achten sollten und wie Sie unseriöse Anbieter erkennen.",
    category: "Ratgeber",
    date: "2024-01-05",
    readTime: "5 min",
    image: "🔍",
  },
  {
    id: "umzug-selbst-organisieren",
    title: "Umzug selbst organisieren vs. Umzugsfirma beauftragen",
    excerpt: "Vor- und Nachteile beider Varianten im direkten Vergleich. Was lohnt sich für Sie?",
    category: "Ratgeber",
    date: "2024-01-01",
    readTime: "7 min",
    image: "💪",
  },
  {
    id: "umzug-mit-kindern",
    title: "Umzug mit Kindern: 10 Tipps für Familien",
    excerpt: "So gelingt der Umzug mit der ganzen Familie stressfrei. Praktische Tipps aus Elternsicht.",
    category: "Familie",
    date: "2023-12-28",
    readTime: "5 min",
    image: "👨‍👩‍👧‍👦",
  },
  {
    id: "nachhaltig-umziehen",
    title: "Nachhaltig umziehen: Umweltfreundliche Umzugstipps",
    excerpt: "Wie Sie Ihren Umzug ökologisch gestalten und dabei Geld sparen können.",
    category: "Nachhaltigkeit",
    date: "2023-12-20",
    readTime: "4 min",
    image: "🌱",
  },
];

const Blog = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 md:py-24 gradient-hero text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="mb-6">Umzugsratgeber</h1>
              <p className="text-lg md:text-xl text-white/90">
                Tipps, Guides und Checklisten für Ihren perfekten Umzug
              </p>
            </div>
          </div>
        </section>

        {/* Blog Posts */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {BLOG_POSTS.map((post) => (
                  <Link key={post.id} to={`/blog/${post.id}`}>
                    <Card className="h-full hover:shadow-strong transition-all duration-300 hover:-translate-y-1">
                      <CardContent className="p-6 flex flex-col h-full">
                        <div className="text-5xl mb-4">{post.image}</div>
                        
                        <Badge variant="secondary" className="w-fit mb-3">
                          {post.category}
                        </Badge>

                        <h3 className="text-xl font-bold mb-3 line-clamp-2">{post.title}</h3>

                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">
                          {post.excerpt}
                        </p>

                        <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(post.date).toLocaleDateString("de-CH")}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{post.readTime}</span>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
