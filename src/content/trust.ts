/**
 * Single Source of Truth for Trust/Social Proof metrics
 * Use this everywhere to avoid mismatches (4.8 vs 4.7 etc.)
 */

export const TRUST = {
  // Core KPIs
  movesCount: "15'000+",
  movesLabel: "vermittelte Umzüge",
  
  companiesCount: "200+",
  companiesLabel: "geprüfte Partnerfirmen",
  
  // Rating - SINGLE SOURCE
  ratingValue: 4.8,
  ratingCount: 2847,
  ratingSource: "Umzugscheck.ch Kunden",
  
  // Savings
  savingsPercent: "40%",
  savingsLabel: "Ø Ersparnis",
  
  // Response time
  responseTime: "24-48h",
  responseLabel: "Antwortzeit",
  
  // Formatted strings
  get ratingDisplay() {
    return `${this.ratingValue}/5`;
  },
  get ratingWithCount() {
    return `${this.ratingValue}/5 aus ${this.ratingCount.toLocaleString()} Bewertungen`;
  },
} as const;

// Press/Media logos that we can verify
export const VERIFIED_PRESS = [
  { name: "SRF", verified: true },
  { name: "NZZ", verified: true },
  { name: "20 Minuten", verified: true },
  { name: "Blick", verified: true },
  { name: "TCS", verified: true },
] as const;

// Trust badges/chips
export const TRUST_CHIPS = [
  { icon: "shield", label: "Geprüfte & versicherte Firmen", key: "verified" },
  { icon: "clock", label: "Offerten in 24–48h", key: "fast" },
  { icon: "check", label: "Kostenlos & unverbindlich", key: "free" },
  { icon: "globe", label: "Schweizweit", key: "swiss" },
] as const;
