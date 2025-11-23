import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowRight, Search, TrendingUp, BookOpen, DollarSign } from "lucide-react";
import { useState } from "react";

const BLOG_POSTS = [
  {
    id: "umzugskosten-schweiz-2025",
    title: "Umzugskosten in der Schweiz 2025: Der komplette Preisguide",
    excerpt: "Erfahren Sie, was ein Umzug in der Schweiz wirklich kostet und wie Sie bis zu 40% sparen können.",
    category: "Ratgeber",
    tags: ["Kosten", "Preise", "Sparen"],
    date: "2024-01-15",
    readTime: "8 min",
    image: "📊",
    popular: true,
  },
  {
    id: "umzugscheckliste",
    title: "Die ultimative Umzugscheckliste: 30 Tage vor dem Umzug",
    excerpt: "Schritt-für-Schritt Anleitung für einen stressfreien Umzug. Vom ersten Tag bis zum Einzug.",
    category: "Checkliste",
    tags: ["Planung", "Checkliste", "Organisation"],
    date: "2024-01-10",
    readTime: "6 min",
    image: "✅",
    popular: true,
  },
  {
    id: "umzugsfirmen-vergleichen",
    title: "Umzugsfirmen richtig vergleichen: 7 wichtige Kriterien",
    excerpt: "Worauf Sie bei der Auswahl einer Umzugsfirma achten sollten und wie Sie unseriöse Anbieter erkennen.",
    category: "Ratgeber",
    tags: ["Vergleich", "Firmen", "Tipps"],
    date: "2024-01-05",
    readTime: "5 min",
    image: "🔍",
    popular: true,
  },
  {
    id: "umzug-selbst-organisieren",
    title: "Umzug selbst organisieren vs. Umzugsfirma beauftragen",
    excerpt: "Vor- und Nachteile beider Varianten im direkten Vergleich. Was lohnt sich für Sie?",
    category: "Ratgeber",
    tags: ["DIY", "Vergleich", "Kosten"],
    date: "2024-01-01",
    readTime: "7 min",
    image: "💪",
  },
  {
    id: "umzug-mit-kindern",
    title: "Umzug mit Kindern: 10 Tipps für Familien",
    excerpt: "So gelingt der Umzug mit der ganzen Familie stressfrei. Praktische Tipps aus Elternsicht.",
    category: "Familie",
    tags: ["Familie", "Kinder", "Tipps"],
    date: "2023-12-28",
    readTime: "5 min",
    image: "👨‍👩‍👧‍👦",
  },
  {
    id: "nachhaltig-umziehen",
    title: "Nachhaltig umziehen: Umweltfreundliche Umzugstipps",
    excerpt: "Wie Sie Ihren Umzug ökologisch gestalten und dabei Geld sparen können.",
    category: "Nachhaltigkeit",
    tags: ["Nachhaltigkeit", "Umwelt", "Tipps"],
    date: "2023-12-20",
    readTime: "4 min",
    image: "🌱",
  },
];

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const popularPosts = BLOG_POSTS.filter(post => post.popular);

  const filteredPosts = BLOG_POSTS.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 md:py-24 gradient-hero text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <Badge variant="secondary" className="mb-4 bg-white/10 text-white border-white/20">
                <BookOpen className="w-3 h-3 mr-1" />
                Ratgeber & Tipps
              </Badge>
              <h1 className="mb-6">Umzugsratgeber</h1>
              <p className="text-lg md:text-xl text-white/90 mb-8">
                Tipps, Guides und Checklisten für Ihren perfekten Umzug
              </p>
              
              {/* Search */}
              <div className="max-w-xl mx-auto relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Artikel durchsuchen..."
                  className="pl-12 h-14 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/60"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Blog Posts with Sidebar */}
        <section className="py-12 md:py-16 bg-gradient-light">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold">
                      {searchTerm ? `Suchergebnisse (${filteredPosts.length})` : 'Alle Artikel'}
                    </h2>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {filteredPosts.map((post) => (
                      <Link key={post.id} to={`/blog/${post.id}`} className="group">
                        <Card className="h-full hover-lift border-2 hover:border-primary/20 transition-all duration-300">
                          <CardContent className="p-6 flex flex-col h-full">
                            <div className="text-5xl mb-4">{post.image}</div>
                            
                            <div className="flex flex-wrap gap-2 mb-3">
                              <Badge variant="secondary">
                                {post.category}
                              </Badge>
                              {post.popular && (
                                <Badge className="bg-accent/10 text-accent border-accent/20">
                                  <TrendingUp className="w-3 h-3 mr-1" />
                                  Beliebt
                                </Badge>
                              )}
                            </div>

                            <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                              {post.title}
                            </h3>

                            <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">
                              {post.excerpt}
                            </p>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-1 mb-4">
                              {post.tags.slice(0, 3).map((tag, idx) => (
                                <span key={idx} className="text-xs text-primary bg-primary/5 px-2 py-1 rounded">
                                  #{tag}
                                </span>
                              ))}
                            </div>

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
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>

                  {filteredPosts.length === 0 && (
                    <Card className="p-12 text-center">
                      <p className="text-muted-foreground">
                        Keine Artikel gefunden. Versuchen Sie einen anderen Suchbegriff.
                      </p>
                    </Card>
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Most Read */}
                  <Card className="shadow-strong">
                    <CardContent className="p-6">
                      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        Meistgelesen
                      </h3>
                      <div className="space-y-4">
                        {popularPosts.slice(0, 3).map((post, idx) => (
                          <Link
                            key={post.id}
                            to={`/blog/${post.id}`}
                            className="block group"
                          >
                            <div className="flex gap-3">
                              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center text-xl">
                                {post.image}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                                  {post.title}
                                </h4>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {post.readTime}
                                </p>
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
                        {["Ratgeber", "Checkliste", "Familie", "Nachhaltigkeit", "Kosten"].map((category) => (
                          <button
                            key={category}
                            className="w-full text-left px-3 py-2 rounded-lg hover:bg-secondary/50 transition-colors flex items-center justify-between group"
                          >
                            <span className="font-medium text-sm group-hover:text-primary transition-colors">
                              {category}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {BLOG_POSTS.filter(p => p.category === category).length}
                            </span>
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Cost Guide CTA */}
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
