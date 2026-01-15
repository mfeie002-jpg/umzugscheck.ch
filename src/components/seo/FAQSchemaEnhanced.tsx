/**
 * Enhanced FAQ Schema Component
 * 
 * Generates Schema.org FAQPage markup for rich snippets
 * Can display FAQ directly on Google SERP
 */

import { Helmet } from "react-helmet";
import { memo } from "react";

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaEnhancedProps {
  faqs: FAQItem[];
  pageUrl?: string;
}

export const FAQSchemaEnhanced = memo(function FAQSchemaEnhanced({
  faqs,
  pageUrl
}: FAQSchemaEnhancedProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    ...(pageUrl && { "url": pageUrl }),
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
});

export default FAQSchemaEnhanced;
