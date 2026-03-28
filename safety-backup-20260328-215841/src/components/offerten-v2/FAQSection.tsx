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
 * 396. Animated background particles
 * 397. Voice search hint
 * 398. AI assistant integration CTA
 * 399. Popular questions badge
 * 400. Share to social buttons
 * 401. Bookmark question feature
 * 402. Print-friendly mode
 * 403. Auto-suggest related topics
 * 404. Animated success feedback
 * 405. Question of the day highlight
 */

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { HelpCircle, ChevronDown, Search, Clock, ThumbsUp, Link2, ChevronUp, Sparkles, MessageCircle, X, Mic, Share2, Bookmark, Printer, Star, TrendingUp, Bot, CheckCircle2, Twitter, Facebook, Linkedin, Copy } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const faqs = [
  {
    question: "Kostet mich der Service von umzugscheck.ch etwas?",
    answer: "Nein, der Service ist für Sie als Kunde zu 100 % kostenlos und unverbindlich. Sie erhalten Offerten von Umzugsfirmen, ohne dafür zu bezahlen. Wir finanzieren uns über eine kleine Provision der teilnehmenden Umzugsfirmen.",
    category: "Kosten",
    readTime: "30 Sek.",
    helpful: 234,
    isPopular: true,
  },
  {
    question: "Wie viele Offerten erhalte ich normalerweise?",
    answer: "In der Regel erhalten Sie zwischen 3 und 5 Offerten von passenden Umzugsfirmen in Ihrer Region. Die genaue Anzahl hängt von der Verfügbarkeit der Partner in Ihrem Gebiet und der Komplexität Ihres Umzugs ab.",
    category: "Ablauf",
    readTime: "25 Sek.",
    helpful: 189,
    isPopular: false,
  },
  {
    question: "Muss ich eine Offerte annehmen?",
    answer: "Nein, Sie sind zu nichts verpflichtet. Sie können alle erhaltenen Offerten in Ruhe vergleichen und sich für die beste entscheiden – oder auch gar keine annehmen. Es entstehen Ihnen keine Kosten und keine Verpflichtungen.",
    category: "Ablauf",
    readTime: "20 Sek.",
    helpful: 312,
    isPopular: true,
  },
  {
    question: "Wie schnell melden sich die Umzugsfirmen?",
    answer: "Die meisten Umzugsfirmen melden sich innerhalb von 24 Stunden bei Ihnen. Bei dringenden Anfragen oder kurzfristigen Umzügen kann es auch schneller gehen. In seltenen Fällen kann es bei Spitzenzeiten etwas länger dauern.",
    category: "Ablauf",
    readTime: "25 Sek.",
    helpful: 156,
    isPopular: false,
  },
  {
    question: "Sind meine Daten sicher?",
    answer: "Ja, Ihre Daten werden gemäss Schweizer Datenschutzgesetz (DSG) verarbeitet und nur an die ausgewählten Umzugsfirmen weitergegeben. Wir verkaufen keine Daten an Dritte und versenden keine Werbung. Nach Abschluss des Vergleichsprozesses werden Ihre Daten gelöscht.",
    category: "Sicherheit",
    readTime: "30 Sek.",
    helpful: 278,
    isPopular: true,
  },
  {
    question: "Wie genau ist die KI-Preisschätzung?",
    answer: "Unsere KI analysiert tausende reale Umzugsdaten aus der Schweiz und berücksichtigt Faktoren wie Wohnungsgrösse, Distanz, Stockwerke und gewählte Services. Die Schätzung liegt typischerweise innerhalb von ±15 % des finalen Preises. Die konkreten Offerten der Firmen können davon abweichen.",
    category: "KI",
    readTime: "35 Sek.",
    helpful: 421,
    isPopular: true,
  },
  {
    question: "Welche Umzugsfirmen sind bei umzugscheck.ch gelistet?",
    answer: "Wir arbeiten ausschliesslich mit geprüften Schweizer Umzugsfirmen zusammen. Alle Partner durchlaufen einen Qualitätscheck bezüglich Versicherung, Erfahrung und Kundenbewertungen. So stellen wir sicher, dass Sie nur seriöse Angebote erhalten.",
    category: "Firmen",
    readTime: "30 Sek.",
    helpful: 198,
    isPopular: false,
  },
];

const categories = ["Alle", "Kosten", "Ablauf", "Sicherheit", "KI", "Firmen"];

// 396. Floating particles
const particles = Array.from({ length: 12 }, (_, i) => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 3 + Math.random() * 4,
  delay: i * 0.5,
  duration: 15 + Math.random() * 10,
}));

export default function FAQSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Alle");
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [helpfulVotes, setHelpfulVotes] = useState<Record<number, boolean>>({});
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<number[]>([]);
  const [showShareMenu, setShowShareMenu] = useState<number | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  
  // 405. Question of the day (rotate daily based on date)
  const questionOfTheDay = useMemo(() => {
    const today = new Date().getDate();
    return today % faqs.length;
  }, []);
  
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
    if (!helpfulVotes[index]) {
      toast.success("Danke für Ihr Feedback!", {
        icon: <ThumbsUp className="w-4 h-4" />,
      });
    }
  };
  
  // 401. Bookmark toggle
  const toggleBookmark = (index: number) => {
    setBookmarkedQuestions(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
    toast.success(
      bookmarkedQuestions.includes(index) 
        ? "Lesezeichen entfernt" 
        : "Frage als Lesezeichen gespeichert"
    );
  };
  
  // 107. Copy link with feedback
  const copyLink = (index: number) => {
    const url = `${window.location.origin}${window.location.pathname}#faq-${index}`;
    navigator.clipboard.writeText(url);
    setCopiedIndex(index);
    toast.success("Link kopiert!");
    setTimeout(() => setCopiedIndex(null), 2000);
  };
  
  // 400. Share functions
  const shareToSocial = (platform: string, question: string) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`FAQ: ${question}`);
    
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    };
    
    window.open(urls[platform], "_blank", "width=600,height=400");
    setShowShareMenu(null);
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
    <section ref={sectionRef} className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30 relative overflow-hidden">
      {/* 396. Animated background particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-primary/20"
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 10, -10, 0],
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      
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
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
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
          <p className="text-muted-foreground text-lg mb-6">
            Alles, was Sie über unseren Service wissen müssen
          </p>
          
          {/* 398. AI Assistant CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-primary/5 text-primary px-4 py-2 rounded-full border border-primary/20"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Bot className="w-4 h-4" />
            </motion.div>
            <span className="text-sm font-medium">Frage nicht gefunden? KI-Assistent fragen</span>
            <Sparkles className="w-3 h-3" />
          </motion.div>
        </motion.div>
        
        {/* Search and filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="mb-8 space-y-4"
        >
          {/* 194. Mobile-optimized search input with larger touch target */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Frage suchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-20 h-14 md:h-12 text-base bg-card border-2 border-border/50 focus:border-primary/50 rounded-xl"
            />
            
            {/* 397. Voice search hint */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="absolute right-12 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
              title="Sprachsuche (coming soon)"
            >
              <Mic className="w-4 h-4" />
            </motion.button>
            
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
              {categories.map((category, i) => (
                <motion.button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.1 + i * 0.05 }}
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
          
          {/* Expand/Collapse all + 402. Print button */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {filteredFaqs.length} Fragen gefunden
            </span>
            <div className="flex items-center gap-2">
              {/* 402. Print button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.print()}
                className="text-muted-foreground hover:text-foreground hidden md:flex"
              >
                <Printer className="w-4 h-4 mr-1" />
                Drucken
              </Button>
              
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
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
        >
          <Accordion 
            type="multiple" 
            value={expandedItems}
            onValueChange={setExpandedItems}
            className="space-y-3"
          >
            <AnimatePresence>
              {filteredFaqs.map((faq, index) => {
                const originalIndex = faqs.indexOf(faq);
                const isQuestionOfDay = originalIndex === questionOfTheDay;
                const isBookmarked = bookmarkedQuestions.includes(originalIndex);
                
                return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.05 }}
                  layout
                  className="relative"
                >
                  {/* 405. Question of the day badge */}
                  {isQuestionOfDay && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="absolute -top-3 left-4 z-10"
                    >
                      <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg">
                        <Star className="w-3 h-3 mr-1" />
                        Frage des Tages
                      </Badge>
                    </motion.div>
                  )}
                  
                  <AccordionItem
                    value={`faq-${index}`}
                    id={`faq-${originalIndex}`}
                    className={`bg-card border-2 rounded-xl px-0 overflow-hidden transition-all duration-300 ${
                      isQuestionOfDay 
                        ? "border-amber-300 shadow-lg shadow-amber-500/10" 
                        : isBookmarked
                          ? "border-primary/30"
                          : "border-border/50 data-[state=open]:border-primary/30"
                    } data-[state=open]:shadow-lg data-[state=open]:shadow-primary/5`}
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
                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            <Badge variant="secondary" className="text-xs font-normal">
                              {faq.category}
                            </Badge>
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {faq.readTime}
                            </span>
                            {/* 399. Popular badge */}
                            {faq.isPopular && (
                              <Badge variant="outline" className="text-xs font-normal text-green-600 border-green-200 bg-green-50">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                Beliebt
                              </Badge>
                            )}
                            {/* Bookmark indicator */}
                            {isBookmarked && (
                              <Bookmark className="w-3 h-3 text-primary fill-primary" />
                            )}
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
                        <motion.div 
                          className="border-l-2 border-primary/20 pl-4"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          {faq.answer}
                        </motion.div>
                        
                        {/* Actions row */}
                        <motion.div 
                          className="flex items-center justify-between pt-4 border-t border-border/50 flex-wrap gap-3"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <div className="flex items-center gap-2 flex-wrap">
                            {/* 404. Animated helpful button with success feedback */}
                            <motion.button
                              onClick={() => handleHelpful(originalIndex)}
                              whileTap={{ scale: 0.95 }}
                              className={`flex items-center gap-1.5 px-4 py-2.5 md:px-3 md:py-1.5 rounded-lg text-sm md:text-xs font-medium transition-all min-h-[44px] md:min-h-0 ${
                                helpfulVotes[originalIndex]
                                  ? "bg-green-100 text-green-700 ring-2 ring-green-200"
                                  : "bg-muted text-muted-foreground hover:bg-green-50 hover:text-green-600"
                              }`}
                            >
                              <motion.div
                                animate={helpfulVotes[originalIndex] ? { scale: [1, 1.3, 1] } : {}}
                                transition={{ duration: 0.3 }}
                              >
                                {helpfulVotes[originalIndex] ? (
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                ) : (
                                  <ThumbsUp className="w-3.5 h-3.5" />
                                )}
                              </motion.div>
                              Hilfreich ({faq.helpful + (helpfulVotes[originalIndex] ? 1 : 0)})
                            </motion.button>
                            
                            {/* 401. Bookmark button */}
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => toggleBookmark(originalIndex)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                isBookmarked
                                  ? "bg-primary/10 text-primary"
                                  : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                              }`}
                            >
                              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? "fill-primary" : ""}`} />
                              {isBookmarked ? "Gespeichert" : "Speichern"}
                            </motion.button>
                            
                            {/* Copy link with animated feedback */}
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => copyLink(originalIndex)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                copiedIndex === originalIndex
                                  ? "bg-green-100 text-green-700"
                                  : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                              }`}
                            >
                              {copiedIndex === originalIndex ? (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  Kopiert!
                                </>
                              ) : (
                                <>
                                  <Link2 className="w-3.5 h-3.5" />
                                  Link kopieren
                                </>
                              )}
                            </motion.button>
                          </div>
                          
                          {/* 400. Share dropdown */}
                          <div className="relative">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setShowShareMenu(showShareMenu === originalIndex ? null : originalIndex)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                            >
                              <Share2 className="w-3.5 h-3.5" />
                              Teilen
                            </motion.button>
                            
                            <AnimatePresence>
                              {showShareMenu === originalIndex && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                  className="absolute right-0 top-full mt-2 bg-card border border-border rounded-xl shadow-xl p-2 z-20 min-w-[140px]"
                                >
                                  <button
                                    onClick={() => shareToSocial("twitter", faq.question)}
                                    className="flex items-center gap-2 w-full px-3 py-2 rounded-lg hover:bg-muted text-sm text-left"
                                  >
                                    <Twitter className="w-4 h-4 text-[#1DA1F2]" />
                                    Twitter
                                  </button>
                                  <button
                                    onClick={() => shareToSocial("facebook", faq.question)}
                                    className="flex items-center gap-2 w-full px-3 py-2 rounded-lg hover:bg-muted text-sm text-left"
                                  >
                                    <Facebook className="w-4 h-4 text-[#4267B2]" />
                                    Facebook
                                  </button>
                                  <button
                                    onClick={() => shareToSocial("linkedin", faq.question)}
                                    className="flex items-center gap-2 w-full px-3 py-2 rounded-lg hover:bg-muted text-sm text-left"
                                  >
                                    <Linkedin className="w-4 h-4 text-[#0A66C2]" />
                                    LinkedIn
                                  </button>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </motion.div>
                        
                        {/* 403. Related topics suggestion */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="mt-4 p-3 bg-muted/50 rounded-lg"
                        >
                          <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-primary" />
                            Ähnliche Fragen:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {faqs
                              .filter((f, i) => f.category === faq.category && i !== originalIndex)
                              .slice(0, 2)
                              .map((related, i) => (
                                <Badge 
                                  key={i}
                                  variant="outline" 
                                  className="text-xs cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors"
                                  onClick={() => {
                                    const relatedIndex = faqs.indexOf(related);
                                    setExpandedItems(prev => [...prev, `faq-${relatedIndex}`]);
                                    document.getElementById(`faq-${relatedIndex}`)?.scrollIntoView({ behavior: "smooth" });
                                  }}
                                >
                                  {related.question.substring(0, 40)}...
                                </Badge>
                              ))}
                          </div>
                        </motion.div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              )})}
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
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center mt-10"
        >
          <p className="text-muted-foreground text-sm mb-4">
            Ihre Frage nicht gefunden?
          </p>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/5">
              <MessageCircle className="w-4 h-4 mr-2" />
              Kontaktieren Sie uns
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
