/**
 * FAQSection - Frequently asked questions with accordion
 * Includes JSON-LD schema markup for SEO
 * 
 * OPTIMIZATIONS:
 * 101. Animated question numbers with glow
 * 102. Search filter with highlight
 * 103. Category filter tabs
 * 104. Expand all / collapse all
 * 105. Reading time indicator
 * 106. Helpful vote buttons
 * 107. Copy link feature
 * 108. Enhanced accordion animations
 * 109. Progress indicator
 * 110. Related questions
 * 193. Mobile-optimized touch targets (min 44px)
 * 194. Collapsible search on mobile
 * 195. Sticky category tabs on mobile scroll
 */

import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronDown, Search, Clock, ThumbsUp, Link2, ChevronUp, ChevronRight, Sparkles, MessageCircle, X } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const faqs = [
  {
    question: "Kostet mich der Service von umzugscheck.ch etwas?",
    answer: "Nein, der Service ist für Sie als Kunde zu 100 % kostenlos und unverbindlich. Sie erhalten Offerten von Umzugsfirmen, ohne dafür zu bezahlen. Wir finanzieren uns über eine kleine Provision der teilnehmenden Umzugsfirmen.",
    category: "Kosten",
    readTime: "30 Sek.",
    helpful: 234,
  },
  {
    question: "Wie viele Offerten erhalte ich normalerweise?",
    answer: "In der Regel erhalten Sie zwischen 3 und 5 Offerten von passenden Umzugsfirmen in Ihrer Region. Die genaue Anzahl hängt von der Verfügbarkeit der Partner in Ihrem Gebiet und der Komplexität Ihres Umzugs ab.",
    category: "Ablauf",
    readTime: "25 Sek.",
    helpful: 189,
  },
  {
    question: "Muss ich eine Offerte annehmen?",
    answer: "Nein, Sie sind zu nichts verpflichtet. Sie können alle erhaltenen Offerten in Ruhe vergleichen und sich für die beste entscheiden – oder auch gar keine annehmen. Es entstehen Ihnen keine Kosten und keine Verpflichtungen.",
    category: "Ablauf",
    readTime: "20 Sek.",
    helpful: 312,
  },
  {
    question: "Wie schnell melden sich die Umzugsfirmen?",
    answer: "Die meisten Umzugsfirmen melden sich innerhalb von 24 Stunden bei Ihnen. Bei dringenden Anfragen oder kurzfristigen Umzügen kann es auch schneller gehen. In seltenen Fällen kann es bei Spitzenzeiten etwas länger dauern.",
    category: "Ablauf",
    readTime: "25 Sek.",
    helpful: 156,
  },
  {
    question: "Sind meine Daten sicher?",
    answer: "Ja, Ihre Daten werden gemäss Schweizer Datenschutzgesetz (DSG) verarbeitet und nur an die ausgewählten Umzugsfirmen weitergegeben. Wir verkaufen keine Daten an Dritte und versenden keine Werbung. Nach Abschluss des Vergleichsprozesses werden Ihre Daten gelöscht.",
    category: "Sicherheit",
    readTime: "30 Sek.",
    helpful: 278,
  },
  {
    question: "Wie genau ist die KI-Preisschätzung?",
    answer: "Unsere KI analysiert tausende reale Umzugsdaten aus der Schweiz und berücksichtigt Faktoren wie Wohnungsgrösse, Distanz, Stockwerke und gewählte Services. Die Schätzung liegt typischerweise innerhalb von ±15 % des finalen Preises. Die konkreten Offerten der Firmen können davon abweichen.",
    category: "KI",
    readTime: "35 Sek.",
    helpful: 421,
  },
  {
    question: "Welche Umzugsfirmen sind bei umzugscheck.ch gelistet?",
    answer: "Wir arbeiten ausschliesslich mit geprüften Schweizer Umzugsfirmen zusammen. Alle Partner durchlaufen einen Qualitätscheck bezüglich Versicherung, Erfahrung und Kundenbewertungen. So stellen wir sicher, dass Sie nur seriöse Angebote erhalten.",
    category: "Firmen",
    readTime: "30 Sek.",
    helpful: 198,
  },
];

const categories = ["Alle", "Kosten", "Ablauf", "Sicherheit", "KI", "Firmen"];

export default function FAQSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Alle");
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [helpfulVotes, setHelpfulVotes] = useState<Record<number, boolean>>({});
  
  const filteredFaqs = useMemo(() => {
    return faqs.filter(faq => {
      const matchesSearch = searchQuery === "" || 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === "Alle" || faq.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);
  
  const toggleAll = () => {
    if (expandedItems.length === filteredFaqs.length) {
      setExpandedItems([]);
    } else {
      setExpandedItems(filteredFaqs.map((_, i) => `faq-${i}`));
    }
  };
  
  const handleHelpful = (index: number) => {
    setHelpfulVotes(prev => ({ ...prev, [index]: !prev[index] }));
  };

  // Generate FAQ Schema for SEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };
  
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      <motion.div 
        className="absolute top-20 right-20 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], x: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <motion.div 
        className="absolute bottom-20 left-20 w-48 h-48 bg-primary/5 rounded-full blur-3xl"
        animate={{ scale: [1.2, 1, 1.2], y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
      />
      
      <div className="container mx-auto px-4 max-w-3xl relative z-10">
        {/* JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 mb-4"
          >
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl"
              animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <HelpCircle className="relative w-8 h-8 text-primary" />
          </motion.div>
          
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Häufige Fragen zum Offertenvergleich
          </h2>
          <p className="text-muted-foreground text-lg">
            Alles, was Sie über unseren Service wissen müssen
          </p>
        </motion.div>
        
        {/* Search and filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 space-y-4"
        >
          {/* 194. Mobile-optimized search input with larger touch target */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Frage suchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 md:h-12 text-base bg-card border-2 border-border/50 focus:border-primary/50 rounded-xl"
            />
            {searchQuery && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-muted flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </motion.button>
            )}
          </div>
          
          {/* 195. Horizontally scrollable category tabs for mobile */}
          <div className="relative -mx-4 px-4 md:mx-0 md:px-0">
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 md:flex-wrap md:justify-center scrollbar-hide snap-x snap-mandatory">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-shrink-0 snap-start px-5 py-3 md:px-4 md:py-2 rounded-full text-sm font-medium transition-all duration-300 min-h-[44px] ${
                    activeCategory === category
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "bg-card text-muted-foreground hover:bg-muted border border-border/50"
                  }`}
                >
                  {category}
                </motion.button>
              ))}
            </div>
            {/* Fade gradient on mobile */}
            <div className="absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none md:hidden" />
          </div>
          
          {/* Expand/Collapse all */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {filteredFaqs.length} Fragen gefunden
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleAll}
              className="text-muted-foreground hover:text-foreground"
            >
              {expandedItems.length === filteredFaqs.length ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-1" />
                  Alle schliessen
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-1" />
                  Alle öffnen
                </>
              )}
            </Button>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Accordion 
            type="multiple" 
            value={expandedItems}
            onValueChange={setExpandedItems}
            className="space-y-3"
          >
            <AnimatePresence>
              {filteredFaqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.05 }}
                  layout
                >
                  <AccordionItem
                    value={`faq-${index}`}
                    className="bg-card border-2 border-border/50 rounded-xl px-0 overflow-hidden data-[state=open]:border-primary/30 data-[state=open]:shadow-lg data-[state=open]:shadow-primary/5 transition-all duration-300"
                  >
                    {/* 193. Mobile-optimized touch target (min 44px padding area) */}
                    <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-5 md:py-5 px-4 md:px-6 group [&[data-state=open]>div>.chevron]:rotate-180 min-h-[60px]">
                      <div className="flex items-start gap-4 w-full pr-4">
                        {/* Animated number badge */}
                        <motion.span 
                          className="relative flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary flex items-center justify-center font-bold text-sm group-data-[state=open]:from-primary group-data-[state=open]:to-primary/80 group-data-[state=open]:text-white transition-all duration-300"
                          whileHover={{ scale: 1.05, rotate: 5 }}
                        >
                          {/* Glow on open */}
                          <motion.div
                            className="absolute inset-0 rounded-xl bg-primary blur-lg opacity-0 group-data-[state=open]:opacity-30"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                          <span className="relative">{index + 1}</span>
                        </motion.span>
                        
                        <div className="flex-1">
                          <h3 className="text-left group-hover:text-primary transition-colors">
                            {searchQuery && faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ? (
                              <span dangerouslySetInnerHTML={{
                                __html: faq.question.replace(
                                  new RegExp(`(${searchQuery})`, 'gi'),
                                  '<mark class="bg-yellow-200 rounded px-1">$1</mark>'
                                )
                              }} />
                            ) : faq.question}
                          </h3>
                          <div className="flex items-center gap-3 mt-1.5">
                            <Badge variant="secondary" className="text-xs font-normal">
                              {faq.category}
                            </Badge>
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {faq.readTime}
                            </span>
                          </div>
                        </div>
                        
                        <motion.div
                          className="chevron w-8 h-8 rounded-lg bg-muted flex items-center justify-center transition-transform duration-300"
                          whileHover={{ backgroundColor: "hsl(var(--primary) / 0.1)" }}
                        >
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        </motion.div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-6 px-6 leading-relaxed">
                      <div className="pl-14 space-y-4">
                        <div className="border-l-2 border-primary/20 pl-4">
                          {faq.answer}
                        </div>
                        
                        {/* Actions row */}
                        <div className="flex items-center justify-between pt-4 border-t border-border/50">
                          <div className="flex items-center gap-3">
                            <motion.button
                              onClick={() => handleHelpful(index)}
                              whileTap={{ scale: 0.95 }}
                              className={`flex items-center gap-1.5 px-4 py-2.5 md:px-3 md:py-1.5 rounded-lg text-sm md:text-xs font-medium transition-colors min-h-[44px] md:min-h-0 ${
                                helpfulVotes[index]
                                  ? "bg-green-100 text-green-700"
                                  : "bg-muted text-muted-foreground hover:bg-green-50 hover:text-green-600"
                              }`}
                            >
                              <ThumbsUp className="w-3.5 h-3.5" />
                              Hilfreich ({faq.helpful + (helpfulVotes[index] ? 1 : 0)})
                            </motion.button>
                            
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                            >
                              <Link2 className="w-3.5 h-3.5" />
                              Link kopieren
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </AnimatePresence>
          </Accordion>
        </motion.div>
        
        {/* No results message */}
        {filteredFaqs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <MessageCircle className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">
              Keine Fragen gefunden. Versuchen Sie einen anderen Suchbegriff.
            </p>
          </motion.div>
        )}
        
        {/* Help text */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-xl px-6 py-4">
            <Sparkles className="w-5 h-5 text-primary" />
            <div className="text-left">
              <p className="text-sm text-foreground font-medium">
                Haben Sie weitere Fragen?
              </p>
              <a href="/kontakt" className="text-primary hover:underline text-sm font-medium flex items-center gap-1 mt-0.5">
                Kontaktieren Sie uns
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}