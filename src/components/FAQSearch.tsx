import { useState, useMemo } from "react";
import { Search, X, HelpCircle, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FAQItem {
  q: string;
  a: string;
  category?: string;
}

interface FAQCategory {
  title: string;
  icon?: string;
  questions: FAQItem[];
}

interface FAQSearchProps {
  categories: FAQCategory[];
  className?: string;
  showPopular?: boolean;
  popularQuestions?: string[];
}

export const FAQSearch = ({
  categories,
  className,
  showPopular = true,
  popularQuestions = [
    "Wie erhalte ich Umzugsofferten?",
    "Was kostet ein Umzug in der Schweiz?",
    "Sind die Offerten wirklich kostenlos?",
  ],
}: FAQSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [clickedQuestions, setClickedQuestions] = useState<string[]>([]);

  // Flatten all questions for search
  const allQuestions = useMemo(() => {
    return categories.flatMap((cat) =>
      cat.questions.map((q) => ({
        ...q,
        category: cat.title,
        categoryIcon: cat.icon,
      }))
    );
  }, [categories]);

  // Filter questions based on search
  const filteredQuestions = useMemo(() => {
    if (!searchTerm.trim()) return [];
    
    const term = searchTerm.toLowerCase();
    return allQuestions.filter(
      (q) =>
        q.q.toLowerCase().includes(term) ||
        q.a.toLowerCase().includes(term)
    );
  }, [searchTerm, allQuestions]);

  const handleQuestionClick = (question: string) => {
    if (!clickedQuestions.includes(question)) {
      setClickedQuestions([...clickedQuestions, question]);
      // In production, track this to analytics
      console.log("FAQ clicked:", question);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const handlePopularClick = (question: string) => {
    const foundQ = allQuestions.find((q) => q.q === question);
    if (foundQ) {
      setSearchTerm(question);
    }
  };

  return (
    <div className={className}>
      {/* Search Input */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Frage suchen..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-12 pr-10 h-12 text-base"
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Popular Questions */}
      {showPopular && !searchTerm && (
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-3">
            <TrendingUp className="h-4 w-4" />
            Häufig gesucht
          </div>
          <div className="flex flex-wrap gap-2">
            {popularQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handlePopularClick(q)}
                className="px-3 py-1.5 text-sm bg-muted hover:bg-muted/80 rounded-full transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      {searchTerm && (
        <div className="mb-8">
          <p className="text-sm text-muted-foreground mb-4">
            {filteredQuestions.length} Ergebnis{filteredQuestions.length !== 1 ? "se" : ""} für "{searchTerm}"
          </p>

          {filteredQuestions.length > 0 ? (
            <Card className="p-4">
              <Accordion type="single" collapsible>
                {filteredQuestions.map((faq, idx) => (
                  <AccordionItem key={idx} value={`search-${idx}`}>
                    <AccordionTrigger
                      onClick={() => handleQuestionClick(faq.q)}
                      className="text-left hover:text-primary"
                    >
                      <div className="flex items-start gap-3">
                        <HelpCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium">{faq.q}</span>
                          <span className="block text-xs text-muted-foreground mt-1">
                            {faq.categoryIcon} {faq.category}
                          </span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pl-8 text-muted-foreground">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Card>
          ) : (
            <Card className="p-8 text-center">
              <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                Keine Fragen gefunden für "{searchTerm}"
              </p>
              <p className="text-sm text-muted-foreground">
                Versuchen Sie andere Suchbegriffe oder{" "}
                <a href="/kontakt" className="text-primary hover:underline">
                  kontaktieren Sie uns
                </a>
              </p>
            </Card>
          )}
        </div>
      )}

      {/* Categories (show when not searching) */}
      {!searchTerm && (
        <div className="space-y-8">
          {categories.map((category, categoryIndex) => (
            <Card key={categoryIndex} className="p-6 md:p-8 shadow-soft hover:shadow-medium transition-shadow">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl" aria-hidden="true">
                  {category.icon}
                </span>
                <h2 className="text-xl md:text-2xl font-bold">{category.title}</h2>
              </div>

              <Accordion type="single" collapsible className="w-full">
                {category.questions.map((faq, faqIndex) => (
                  <AccordionItem key={faqIndex} value={`item-${categoryIndex}-${faqIndex}`}>
                    <AccordionTrigger
                      onClick={() => handleQuestionClick(faq.q)}
                      className="text-left text-base font-semibold hover:text-primary"
                    >
                      <div className="flex items-start gap-3">
                        <HelpCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>{faq.q}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pl-8 pt-2">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
