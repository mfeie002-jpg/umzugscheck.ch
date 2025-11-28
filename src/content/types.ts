// Content Types for Umzugscheck.ch

export interface HeroContent {
  headline: string;
  highlightedText: string;
  subheadline: string;
  primaryCTA: string;
  secondaryCTA: string;
  trustIndicators: {
    rating: string;
    movesCount: string;
    verifiedText: string;
  };
  calculator: {
    title: string;
    subtitle: string;
    fromLabel: string;
    fromPlaceholder: string;
    toLabel: string;
    toPlaceholder: string;
    roomsLabel: string;
    roomsPlaceholder: string;
    submitButton: string;
    disclaimer: string;
  };
}

export interface SocialProofContent {
  stats: {
    value: string;
    label: string;
  }[];
  testimonials: {
    name: string;
    location: string;
    rating: number;
    text: string;
  }[];
}

export interface HowItWorksContent {
  title: string;
  subtitle: string;
  steps: {
    number: number;
    icon: string;
    title: string;
    description: string;
  }[];
}

export interface AICalculatorContent {
  badge: string;
  headline: string;
  highlightedText: string;
  description: string;
  benefits: {
    icon: string;
    title: string;
    description: string;
  }[];
  ctaButton: string;
  imageUrl: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  link: string;
  category: string;
  order: number;
}

export interface RegionCity {
  id: string;
  name: string;
  slug: string;
  canton?: string;
  isMainCity: boolean;
  order: number;
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  rating: number;
  reviewCount: number;
  priceLevel: string;
  services: string[];
  serviceAreas: string[];
  verified: boolean;
  featured: boolean;
  order: number;
}

export interface CostExample {
  id: string;
  title: string;
  description: string;
  priceFrom: string;
  icon: string;
  order: number;
}

export interface WhyUsCard {
  id: string;
  icon: string;
  title: string;
  description: string;
  order: number;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

export interface SEOContent {
  global: {
    siteName: string;
    defaultTitleSuffix: string;
    defaultDescription: string;
    defaultImage: string;
  };
  pages: {
    [key: string]: {
      title: string;
      description: string;
      canonicalPath: string;
      schemaType?: string;
    };
  };
}

export interface HomepageContent {
  hero: HeroContent;
  socialProof: SocialProofContent;
  howItWorks: HowItWorksContent;
  aiCalculator: AICalculatorContent;
  services: {
    title: string;
    subtitle: string;
  };
  topCompanies: {
    title: string;
    subtitle: string;
  };
  costExamples: {
    title: string;
    subtitle: string;
  };
  whyUs: {
    title: string;
    subtitle: string;
  };
  faq: {
    title: string;
    subtitle: string;
  };
  regions: {
    title: string;
    subtitle: string;
  };
  providerCTA: {
    badge: string;
    title: string;
    description: string;
    stats: {
      value: string;
      label: string;
    }[];
    primaryButton: string;
    secondaryButton: string;
  };
}
