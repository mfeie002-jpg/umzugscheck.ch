import { CantonConfig } from '@/components/canton/CantonTemplate';
import { Building2, Home, Sparkles, Trash2, Package, Globe, Shield, Clock, TrendingUp, Sun } from 'lucide-react';

export const tessinConfig: CantonConfig = {
  name: "Tessin",
  slug: "tessin",
  tagline: "Sonnenstube der Schweiz",
  icon: Sun,
  iconColor: "text-yellow-500",
  cities: ["Lugano", "Bellinzona", "Locarno", "Mendrisio", "Chiasso", "Ascona", "Giubiasco", "Biasca", "Minusio", "Massagno"],
  
  companies: [
    { name: "Traslochi Lugano SA", rating: 4.9, reviews: 234, priceLevel: "Premium", sponsored: true, available: true, badge: "Top" },
    { name: "Locarno Moving", rating: 4.8, reviews: 187, priceLevel: "Fair", sponsored: true, available: true, badge: "Internazionale" },
    { name: "Bellinzona Trasporti", rating: 4.7, reviews: 156, priceLevel: "Günstig", sponsored: false, available: true, badge: null },
    { name: "Mendrisio Express", rating: 4.6, reviews: 123, priceLevel: "Fair", sponsored: false, available: true, badge: null },
    { name: "Ticino Premium Movers", rating: 4.8, reviews: 98, priceLevel: "Premium", sponsored: false, available: false, badge: null }
  ],
  
  priceExamples: [
    { size: "1-2 Zimmer", range: "CHF 400 - 800", avg: "Ø CHF 600" },
    { size: "3-4 Zimmer", range: "CHF 800 - 1'500", avg: "Ø CHF 1'150" },
    { size: "5+ Zimmer", range: "CHF 1'500 - 3'000", avg: "Ø CHF 2'250" }
  ],
  
  services: [
    { name: "Trasloco privato", icon: Home, link: "/privatumzug" },
    { name: "Trasloco aziendale", icon: Building2, link: "/firmenumzug" },
    { name: "Pulizia", icon: Sparkles, link: "/reinigung" },
    { name: "Sgombero", icon: Trash2, link: "/entsorgung" },
    { name: "Deposito", icon: Package, link: "/lagerung" },
    { name: "Italia", icon: Globe, link: "/international" }
  ],
  
  usps: [
    { title: "Geprüfte Partner", desc: "Alle Firmen verifiziert und versichert", icon: Shield },
    { title: "Schnelle Angebote", desc: "Innerhalb von 24h Offerten erhalten", icon: Clock },
    { title: "Beste Preise", desc: "Bis zu 40% sparen durch Vergleich", icon: TrendingUp },
    { title: "Grenzüberschreitend", desc: "Umzüge nach Italien", icon: Globe }
  ],
  
  faqs: [
    { question: "Quanto costa un trasloco in Ticino?", answer: "Un trasloco in Ticino costa tra CHF 400 e CHF 3'000, a seconda delle dimensioni e della distanza." },
    { question: "Ci sono imprese per traslochi in Italia?", answer: "Sì, molte imprese ticinesi offrono traslochi transfrontalieri verso Milano, Como e la Lombardia." },
    { question: "Le imprese parlano tedesco?", answer: "Alcune imprese offrono servizio multilingue (IT, DE, EN), specialmente per clienti dalla Svizzera tedesca." },
    { question: "Come mi registro in Ticino?", answer: "La registrazione presso l'ufficio controllo abitanti deve avvenire entro 14 giorni dal trasloco." },
    { question: "Qual è il periodo migliore per traslocare?", answer: "In Ticino si può traslocare tutto l'anno grazie al clima mite. Evitare agosto (vacanze) e fine mese." }
  ],
  
  seo: {
    title: "Imprese di traslochi Ticino | Confronta | Umzugscheck.ch",
    description: "Confronta gratuitamente le migliori imprese di traslochi in Ticino. Fino a 5 preventivi senza impegno. Servizio in italiano.",
    keywords: "trasloco Ticino, impresa traslochi Lugano, Umzug Tessin, déménagement Tessin"
  },
  
  localInfo: {
    title: "Traslocare nel Canton Ticino",
    paragraphs: [
      { title: "Sonnenstube der Schweiz", text: "Das Tessin ist der einzige vollständig italienischsprachige Kanton der Schweiz und bietet mediterranes Flair mit Palmen, Seen und mildem Klima." },
      { title: "Grenzregion zu Italien", text: "Die Nähe zu Italien macht grenzüberschreitende Umzüge nach Mailand, Como und in die Lombardei zum Standardangebot vieler Tessiner Firmen." },
      { title: "Anmeldung", text: "Die Registrazione presso l'ufficio controllo abitanti muss innerhalb von 14 Tagen nach dem Umzug erfolgen." }
    ]
  },
  
  notificationCity: "Lugano",
  activeUsersBase: 11
};
