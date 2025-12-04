import { CantonConfig } from '@/components/canton/CantonTemplate';

export const tessinConfig: CantonConfig = {
  name: "Tessin",
  code: "TI",
  slug: "tessin",
  heroTitle: "Imprese di traslochi in Ticino",
  heroSubtitle: "Trova le migliori imprese di traslochi nel Canton Ticino. Confronta preventivi gratuitamente.",
  
  companies: [
    {
      id: "ti-1",
      name: "Traslochi Lugano SA",
      rating: 4.9,
      reviewCount: 234,
      priceLevel: "fair",
      services: ["Trasloco privato", "Trasloco aziendale", "Pulizia"],
      description: "Leader dei traslochi in Ticino",
      isSponsored: true,
      logo: "/placeholder.svg"
    },
    {
      id: "ti-2",
      name: "Locarno Moving",
      rating: 4.8,
      reviewCount: 187,
      priceLevel: "fair",
      services: ["Trasloco privato", "Internazionale"],
      description: "Specialisti Lago Maggiore",
      isSponsored: true,
      logo: "/placeholder.svg"
    },
    {
      id: "ti-3",
      name: "Bellinzona Trasporti",
      rating: 4.7,
      reviewCount: 156,
      priceLevel: "günstig",
      services: ["Trasloco privato", "Sgombero"],
      description: "Servizio nella capitale",
      logo: "/placeholder.svg"
    },
    {
      id: "ti-4",
      name: "Mendrisio Express",
      rating: 4.6,
      reviewCount: 123,
      priceLevel: "fair",
      services: ["Trasloco express", "Italia"],
      description: "Traslochi transfrontalieri",
      logo: "/placeholder.svg"
    },
    {
      id: "ti-5",
      name: "Ticino Premium Movers",
      rating: 4.8,
      reviewCount: 98,
      priceLevel: "premium",
      services: ["Trasloco villa", "Arte", "Internazionale"],
      description: "Servizio premium per clienti esigenti",
      logo: "/placeholder.svg"
    }
  ],
  
  priceExamples: [
    { size: "Monolocale", priceRange: "CHF 500 - 800", details: "Economico" },
    { size: "3 locali", priceRange: "CHF 1'000 - 1'600", details: "Standard" },
    { size: "Villa", priceRange: "CHF 2'200 - 4'000", details: "Servizio completo" }
  ],
  
  services: [
    { name: "Trasloco privato", icon: "Home", link: "/privatumzug" },
    { name: "Trasloco aziendale", icon: "Building2", link: "/firmenumzug" },
    { name: "Pulizia", icon: "Sparkles", link: "/reinigung" },
    { name: "Sgombero", icon: "Trash2", link: "/entsorgung" },
    { name: "Deposito", icon: "Package", link: "/lagerung" },
    { name: "Italia", icon: "Globe", link: "/international" }
  ],
  
  usps: [
    { title: "Dolce Vita", description: "Servizio in italiano", icon: "Sun" },
    { title: "Laghi", description: "Lugano, Maggiore, Ceresio", icon: "Waves" },
    { title: "Italia", description: "Traslochi transfrontalieri", icon: "Globe" },
    { title: "Clima mite", description: "Traslochi tutto l'anno", icon: "Thermometer" }
  ],
  
  faqs: [
    {
      question: "Quanto costa un trasloco in Ticino?",
      answer: "Un trasloco in Ticino costa tra CHF 500 e CHF 4'000, a seconda delle dimensioni e della distanza."
    },
    {
      question: "Ci sono imprese per traslochi in Italia?",
      answer: "Sì, molte imprese ticinesi offrono traslochi transfrontalieri verso Milano, Como e la Lombardia."
    },
    {
      question: "Le imprese parlano tedesco?",
      answer: "Alcune imprese offrono servizio multilingue (IT, DE, EN), specialmente per clienti dalla Svizzera tedesca."
    },
    {
      question: "Come mi registro in Ticino?",
      answer: "La registrazione presso l'ufficio controllo abitanti deve avvenire entro 14 giorni dal trasloco."
    },
    {
      question: "Qual è il periodo migliore per traslocare?",
      answer: "In Ticino si può traslocare tutto l'anno grazie al clima mite. Evitare agosto (vacanze) e fine mese."
    }
  ],
  
  localInfo: `
    <h3>Traslocare nel Canton Ticino</h3>
    <p>Il Ticino è il cantone più meridionale della Svizzera, l'unico interamente italofono, con un clima mediterraneo e una cultura unica.</p>
    
    <h4>Registrazione</h4>
    <p>La registrazione presso l'ufficio controllo abitanti del comune deve avvenire entro 14 giorni dall'arrivo.</p>
    
    <h4>Regione di confine</h4>
    <p>La vicinanza all'Italia rende frequenti i traslochi transfrontalieri. Molte imprese offrono questo servizio.</p>
    
    <h4>Zone popolari</h4>
    <p>Lugano (centro economico), Locarno, Bellinzona (capitale), Mendrisio e Chiasso sono le principali località. Le zone lacustri sono molto richieste.</p>
  `,
  
  metaTitle: "Imprese di traslochi Ticino | Confronta | Umzugscheck.ch",
  metaDescription: "Confronta gratuitamente le migliori imprese di traslochi in Ticino. Fino a 5 preventivi senza impegno. Servizio in italiano."
};
