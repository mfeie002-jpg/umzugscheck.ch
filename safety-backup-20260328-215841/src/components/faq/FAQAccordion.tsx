/**
 * Enhanced FAQ Accordion Component
 * 
 * Features:
 * - Schema.org FAQ structured data
 * - Search/filter functionality
 * - Smooth animations
 * - Category grouping
 * - Accessible
 */

import { memo, useState, useMemo } from 'react';
import { ChevronDown, Search, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
  title?: string;
  showSearch?: boolean;
  showCategories?: boolean;
  className?: string;
}

export const FAQAccordion = memo(function FAQAccordion({
  items,
  title = 'Häufige Fragen',
  showSearch = true,
  showCategories = true,
  className,
}: FAQAccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(items.map(item => item.category).filter(Boolean));
    return Array.from(cats) as string[];
  }, [items]);

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = !searchQuery || 
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !activeCategory || item.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [items, searchQuery, activeCategory]);

  // Toggle item
  const toggleItem = (id: string) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Schema.org FAQ structured data
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <section className={cn('py-8', className)}>
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground">{title}</h2>
        <p className="text-muted-foreground mt-2">
          Antworten auf die am häufigsten gestellten Fragen
        </p>
      </div>

      {/* Search & Filters */}
      {(showSearch || (showCategories && categories.length > 0)) && (
        <div className="mb-6 space-y-4">
          {showSearch && (
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Frage suchen..."
                className="w-full pl-10 pr-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          )}

          {showCategories && categories.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => setActiveCategory(null)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                  !activeCategory
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                )}
              >
                Alle
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                    activeCategory === category
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* FAQ Items */}
      <div className="max-w-3xl mx-auto space-y-3">
        {filteredItems.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Keine Fragen gefunden. Versuchen Sie andere Suchbegriffe.
            </p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="border border-border rounded-lg overflow-hidden"
            >
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full flex items-center justify-between p-4 text-left bg-card hover:bg-accent/50 transition-colors"
                aria-expanded={openItems.has(item.id)}
                aria-controls={`faq-answer-${item.id}`}
              >
                <span className="font-medium text-foreground pr-4">
                  {item.question}
                </span>
                <ChevronDown
                  className={cn(
                    'w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-200',
                    openItems.has(item.id) && 'rotate-180'
                  )}
                />
              </button>

              <AnimatePresence initial={false}>
                {openItems.has(item.id) && (
                  <motion.div
                    id={`faq-answer-${item.id}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 pt-0 text-muted-foreground leading-relaxed">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))
        )}
      </div>

      {/* CTA */}
      <div className="text-center mt-8 p-6 bg-muted/50 rounded-xl max-w-3xl mx-auto">
        <p className="text-foreground font-medium mb-2">
          Haben Sie weitere Fragen?
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          Unser Team hilft Ihnen gerne weiter.
        </p>
        <a
          href="/kontakt"
          className="inline-flex items-center gap-2 text-primary hover:underline"
        >
          <MessageCircle className="w-4 h-4" />
          Kontaktieren Sie uns
        </a>
      </div>
    </section>
  );
});

/**
 * Simple FAQ List (no accordion)
 */
export const FAQList = memo(function FAQList({
  items,
  className,
}: {
  items: FAQItem[];
  className?: string;
}) {
  return (
    <div className={cn('space-y-6', className)}>
      {items.map((item) => (
        <div key={item.id}>
          <h3 className="font-semibold text-foreground mb-2">{item.question}</h3>
          <p className="text-muted-foreground">{item.answer}</p>
        </div>
      ))}
    </div>
  );
});

/**
 * Inline FAQ for product pages
 */
export const InlineFAQ = memo(function InlineFAQ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-border py-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left"
      >
        <span className="text-sm font-medium text-foreground">{question}</span>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-muted-foreground transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      {isOpen && (
        <p className="mt-2 text-sm text-muted-foreground">{answer}</p>
      )}
    </div>
  );
});
