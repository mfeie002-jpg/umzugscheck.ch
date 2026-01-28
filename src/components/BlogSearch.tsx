import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Clock, ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const blogPosts = [
  {
    id: '1',
    title: 'Die ultimative Umzugs-Checkliste',
    excerpt: 'Planen Sie Ihren Umzug stressfrei mit unserer bewährten Checkliste für alle Phasen.',
    category: 'Tipps',
    readTime: 8,
    date: '2024-11-15',
    slug: 'umzugs-checkliste'
  },
  {
    id: '2',
    title: 'Richtig packen: Profi-Tipps',
    excerpt: 'Lernen Sie die Geheimnisse professioneller Packer für einen sicheren Transport.',
    category: 'Anleitungen',
    readTime: 6,
    date: '2024-11-10',
    slug: 'richtig-packen'
  },
  {
    id: '3',
    title: 'Kosten sparen beim Umzug',
    excerpt: 'Praktische Strategien, um Ihre Umzugskosten zu minimieren ohne Qualitätseinbussen.',
    category: 'Finanzen',
    readTime: 5,
    date: '2024-11-05',
    slug: 'kosten-sparen'
  },
  {
    id: '4',
    title: 'Umzug mit Haustieren',
    excerpt: 'So machen Sie den Umzug für Ihre vierbeinigen Freunde stressfrei.',
    category: 'Tipps',
    readTime: 7,
    date: '2024-10-28',
    slug: 'umzug-haustiere'
  },
  {
    id: '5',
    title: 'Erste Wohnung einrichten',
    excerpt: 'Von der leeren Wohnung zum gemütlichen Zuhause - unsere besten Einrichtungstipps.',
    category: 'Lifestyle',
    readTime: 10,
    date: '2024-10-20',
    slug: 'erste-wohnung'
  }
];

const categories = ['Alle', 'Tipps', 'Anleitungen', 'Finanzen', 'Lifestyle'];

const BlogSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Alle');

  const filteredPosts = useMemo(() => {
    return blogPosts.filter(post => {
      const matchesSearch = 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'Alle' || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Blog durchsuchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 snap-x scrollbar-hide touch-pan-x" style={{ WebkitOverflowScrolling: 'touch' }}>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Results */}
      <AnimatePresence mode="wait">
        {filteredPosts.length > 0 ? (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid gap-4"
          >
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/blog/${post.slug}`}>
                  <Card className="hover:shadow-lg hover:border-primary/30 transition-all group">
                    <CardContent className="p-4 md:p-6 flex gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="secondary" className="text-xs">{post.category}</Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {post.readTime} Min.
                          </span>
                        </div>
                        <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-1">
                          {post.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                          {post.excerpt}
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 self-center" />
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="no-results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <BookOpen className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">Keine Artikel gefunden</p>
            <p className="text-sm text-muted-foreground mt-1">
              Versuchen Sie andere Suchbegriffe oder wählen Sie eine andere Kategorie.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlogSearch;
