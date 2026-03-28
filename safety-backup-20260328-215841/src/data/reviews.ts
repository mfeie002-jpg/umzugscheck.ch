/**
 * Demo review data for companies
 */

export interface Review {
  id: string;
  companyId: string;
  rating: number;
  title: string;
  text: string;
  authorName: string;
  createdAt: string;
  verified: boolean;
}

export const DEMO_REVIEWS: Review[] = [
  // Reviews for SwissReloc Pro (id: "1")
  {
    id: "r1",
    companyId: "1",
    rating: 5,
    title: "Perfekter Service von A bis Z",
    text: "SwissReloc hat unseren Umzug von Zürich nach Zug perfekt organisiert. Das Team war pünktlich, professionell und sehr sorgfältig mit unseren Möbeln. Besonders beeindruckt hat uns die Montage der Küche.",
    authorName: "Sarah M.",
    createdAt: "2024-11-15",
    verified: true,
  },
  {
    id: "r2",
    companyId: "1",
    rating: 5,
    title: "Sehr empfehlenswert!",
    text: "Wir hatten einen sehr komplexen Firmenumzug und SwissReloc hat alles reibungslos abgewickelt. Die Planung war exzellent und die Durchführung professionell.",
    authorName: "Thomas K.",
    createdAt: "2024-10-28",
    verified: true,
  },
  {
    id: "r3",
    companyId: "1",
    rating: 4,
    title: "Guter Service, etwas teuer",
    text: "Die Qualität war top, aber der Preis war höher als erwartet. Trotzdem würden wir sie wieder beauftragen.",
    authorName: "Anna L.",
    createdAt: "2024-10-10",
    verified: false,
  },

  // Reviews for Alpen Transport (id: "2")
  {
    id: "r4",
    companyId: "2",
    rating: 5,
    title: "Zuverlässig und freundlich",
    text: "Alpen Transport hat unseren Umzug in Bern durchgeführt. Das Team war sehr freundlich und hat alles sicher transportiert. Preis-Leistung stimmt!",
    authorName: "Michael B.",
    createdAt: "2024-11-20",
    verified: true,
  },
  {
    id: "r5",
    companyId: "2",
    rating: 4,
    title: "Gute Arbeit",
    text: "Alles verlief gut, nur die Anfahrt dauerte etwas länger als geplant. Ansonsten top Service.",
    authorName: "Laura F.",
    createdAt: "2024-11-01",
    verified: true,
  },

  // Reviews for Zürich City Umzüge (id: "4")
  {
    id: "r6",
    companyId: "4",
    rating: 5,
    title: "Top Preis-Leistung",
    text: "Für den Preis wirklich ausgezeichnete Leistung. Das Team war schnell und hat alles gut verpackt. Sehr zu empfehlen!",
    authorName: "Stefan R.",
    createdAt: "2024-11-18",
    verified: true,
  },
  {
    id: "r7",
    companyId: "4",
    rating: 5,
    title: "Sehr zufrieden",
    text: "Günstiger Preis ohne Kompromisse bei der Qualität. Würden wir jederzeit wieder buchen.",
    authorName: "Julia H.",
    createdAt: "2024-10-25",
    verified: false,
  },

  // Reviews for Bern Pro Umzug (id: "5")
  {
    id: "r8",
    companyId: "5",
    rating: 5,
    title: "Premium-Service",
    text: "Bern Pro hat unseren anspruchsvollen Umzug perfekt gemeistert. Vom Packservice bis zur Möbelmontage - alles auf höchstem Niveau.",
    authorName: "Robert W.",
    createdAt: "2024-11-12",
    verified: true,
  },

  // Reviews for Lakeview Luzern (id: "6")
  {
    id: "r9",
    companyId: "6",
    rating: 4,
    title: "Guter Service in Luzern",
    text: "Lakeview hat unseren Umzug professionell durchgeführt. Einziger Minuspunkt: Die Kommunikation könnte besser sein.",
    authorName: "Andrea S.",
    createdAt: "2024-11-05",
    verified: true,
  },

  // Reviews for St. Gallen Express (id: "11")
  {
    id: "r10",
    companyId: "11",
    rating: 5,
    title: "Schnell und zuverlässig",
    text: "St. Gallen Express hat ihrem Namen alle Ehre gemacht. Schneller Service, faire Preise und sehr freundliches Team.",
    authorName: "Markus G.",
    createdAt: "2024-11-08",
    verified: true,
  },

  // Reviews for Geneva Premium Movers (id: "12")
  {
    id: "r11",
    companyId: "12",
    rating: 5,
    title: "Service impeccable",
    text: "Un déménagement parfaitement organisé. L'équipe était professionnelle et très attentive à nos besoins. Hautement recommandé!",
    authorName: "Pierre D.",
    createdAt: "2024-11-14",
    verified: true,
  },

  // Reviews for Lausanne Elite (id: "16")
  {
    id: "r12",
    companyId: "16",
    rating: 5,
    title: "Excellent service",
    text: "Lausanne Elite a fait un travail remarquable. Tout s'est déroulé comme prévu et l'équipe était très sympathique.",
    authorName: "Sophie M.",
    createdAt: "2024-10-30",
    verified: true,
  },
];

/**
 * Get reviews for a specific company
 */
export const getCompanyReviews = (companyId: string): Review[] => {
  return DEMO_REVIEWS.filter(review => review.companyId === companyId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

/**
 * Calculate average rating for a company
 */
export const getAverageRating = (companyId: string): number => {
  const reviews = getCompanyReviews(companyId);
  if (reviews.length === 0) return 0;
  
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
};