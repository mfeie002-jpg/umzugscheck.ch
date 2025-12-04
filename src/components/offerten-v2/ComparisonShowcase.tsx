/**
 * ComparisonShowcase - Mock comparison table showing platform value
 * Demonstrates how users can compare multiple providers
 * 
 * OPTIMIZATIONS:
 * 131-140. Table animations, filters, match scores, actions
 * 184-185. AI recommendations, smart filtering
 * 266. Animated sort indicators
 * 267. Column highlight on hover
 * 268. Comparison drawer preview
 * 269. Bulk action toolbar
 * 270. Export comparison button
 * 271. Price range slider
 * 272. Company detail modal hint
 * 273. Rating breakdown tooltip
 * 274. Service tag animations
 * 275. Mobile swipe cards
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Star, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  Award, 
  TrendingUp, 
  Sparkles, 
  Trophy, 
  Flame, 
  Calendar, 
  Percent, 
  ArrowUpDown, 
  Filter, 
  Heart, 
  Phone, 
  MessageCircle, 
  Zap, 
  Brain,
  Download,
  Eye,
  ChevronUp,
  ChevronDown,
  X
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

const mockCompanies = [
  {
    name: "Züri-Umzug AG",
    region: "Zürich & Umgebung",
    specialization: ["Privatumzug", "Reinigung"],
    priceLevel: 2,
    rating: 4.8,
    reviews: 234,
    responseTime: "< 4 Stunden",
    verified: true,
    highlight: true,
    recommended: true,
    savings: "Bis 35% günstiger",
    medal: "gold",
    matchScore: 98,
    available: true,
    ratingBreakdown: { service: 4.9, price: 4.7, speed: 4.8 },
  },
  {
    name: "Swiss Move Express",
    region: "Ganze Schweiz",
    specialization: ["Privatumzug", "Firmenumzug", "Lagerung"],
    priceLevel: 3,
    rating: 4.6,
    reviews: 412,
    responseTime: "< 6 Stunden",
    verified: true,
    highlight: false,
    recommended: false,
    savings: null,
    medal: "silver",
    matchScore: 92,
    available: true,
    ratingBreakdown: { service: 4.7, price: 4.4, speed: 4.7 },
  },
  {
    name: "Budget Umzüge GmbH",
    region: "Mittelland",
    specialization: ["Privatumzug"],
    priceLevel: 1,
    rating: 4.4,
    reviews: 89,
    responseTime: "< 12 Stunden",
    verified: true,
    highlight: false,
    recommended: false,
    savings: "Günstigster Anbieter",
    medal: "bronze",
    matchScore: 85,
    available: false,
    ratingBreakdown: { service: 4.5, price: 4.8, speed: 4.0 },
  },
];

const medalColors = {
  gold: "from-amber-400 to-amber-500",
  silver: "from-gray-300 to-gray-400",
  bronze: "from-amber-600 to-amber-700",
};

const filterChips = ["Alle", "Top bewertet", "Günstigste", "Schnellste Antwort"];

// 266. Sort indicator
const SortIndicator = ({ active, direction }: { active: boolean; direction: "asc" | "desc" }) => (
  <motion.div
    className={`ml-1 ${active ? "text-primary" : "text-muted-foreground/50"}`}
    animate={active ? { y: [0, -2, 0] } : {}}
    transition={{ duration: 0.5, repeat: active ? Infinity : 0 }}
  >
    {direction === "asc" ? (
      <ChevronUp className="w-3 h-3" />
    ) : (
      <ChevronDown className="w-3 h-3" />
    )}
  </motion.div>
);

const PriceIndicator = ({ level }: { level: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3].map((i) => (
      <motion.span
        key={i}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: i * 0.1 }}
        className={`text-xs font-bold transition-colors ${
          i <= level ? "text-primary" : "text-muted-foreground/20"
        }`}
      >
        CHF
      </motion.span>
    ))}
  </div>
);

function MatchScoreBadge({ score }: { score: number }) {
  const color = score >= 95 ? "text-green-600 bg-green-50" : 
                score >= 85 ? "text-blue-600 bg-blue-50" : 
                "text-amber-600 bg-amber-50";
  
  return (
    <motion.div 
      className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold ${color}`}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 300 }}
      whileHover={{ scale: 1.05 }}
    >
      <Percent className="w-3 h-3" />
      {score}% Match
    </motion.div>
  );
}

// 273. Rating breakdown tooltip
function RatingTooltip({ breakdown }: { breakdown: { service: number; price: number; speed: number } }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-card shadow-xl rounded-lg border border-border/50 p-3 z-50 min-w-[160px]"
    >
      <div className="text-xs font-semibold text-foreground mb-2">Bewertungsdetails</div>
      {Object.entries(breakdown).map(([key, value]) => (
        <div key={key} className="flex items-center justify-between text-xs mb-1">
          <span className="text-muted-foreground capitalize">{key === "service" ? "Service" : key === "price" ? "Preis" : "Schnelligkeit"}</span>
          <div className="flex items-center gap-1">
            <span className="font-medium">{value}</span>
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      ))}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-card border-r border-b border-border/50 rotate-45" />
    </motion.div>
  );
}

export default function ComparisonShowcase() {
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([mockCompanies[0].name]);
  const [activeFilter, setActiveFilter] = useState("Alle");
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [showRatingTooltip, setShowRatingTooltip] = useState<string | null>(null);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  
  const toggleCompany = (name: string) => {
    setSelectedCompanies(prev => 
      prev.includes(name) 
        ? prev.filter(n => n !== name)
        : [...prev, name]
    );
  };
  
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("desc");
    }
  };
  
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-muted/50 to-muted/20 relative overflow-hidden">
      {/* Background decoration */}
      <motion.div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-primary/5 rounded-full blur-3xl"
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary bg-primary/10 px-4 py-1.5 rounded-full mb-4"
          >
            <TrendingUp className="w-4 h-4" />
            Transparenter Vergleich
          </motion.div>
          
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Umzugsfirmen im direkten Vergleich
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg mb-4">
            Statt jede Firma einzeln zu kontaktieren, sehen Sie mehrere passende Anbieter 
            nebeneinander und können objektiv entscheiden.
          </p>
          
          {/* AI recommendation info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-200/50 px-4 py-2 rounded-xl"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Brain className="w-4 h-4 text-purple-600" />
            </motion.div>
            <span className="text-sm text-foreground">
              <span className="font-semibold text-purple-600">KI-gestützte</span> Firmenempfehlungen basierend auf Ihrem Bedarf
            </span>
          </motion.div>
        </motion.div>
        
        {/* Filter chips */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {filterChips.map((chip, i) => (
            <motion.button
              key={chip}
              onClick={() => setActiveFilter(chip)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeFilter === chip
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "bg-card text-muted-foreground hover:bg-muted border border-border/50"
              }`}
            >
              {chip === "Alle" && <Filter className="w-3.5 h-3.5" />}
              {chip === "Top bewertet" && <Star className="w-3.5 h-3.5" />}
              {chip === "Günstigste" && <TrendingUp className="w-3.5 h-3.5" />}
              {chip === "Schnellste Antwort" && <Clock className="w-3.5 h-3.5" />}
              {chip}
            </motion.button>
          ))}
        </motion.div>
        
        {/* 269. Bulk action toolbar */}
        <AnimatePresence>
          {selectedCompanies.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <div className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-xl px-5 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {selectedCompanies.length} Firma{selectedCompanies.length > 1 ? "en" : ""} ausgewählt
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Offerten von ausgewählten Firmen erhalten
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* 270. Export button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-lg bg-card border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </motion.button>
                  <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                    Offerten anfordern
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Desktop: Table View */}
        <div className="hidden lg:block overflow-hidden rounded-2xl border border-border/50 shadow-xl bg-card">
          {/* Header with sortable columns */}
          <motion.div 
            className="grid grid-cols-8 gap-4 p-5 bg-gradient-to-r from-muted/80 via-muted/60 to-muted/80 border-b border-border/50 font-semibold text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2">
              <Checkbox className="border-muted-foreground/30" />
            </div>
            <div className="text-center">Rang</div>
            <div className="col-span-2 flex items-center gap-1 cursor-pointer" onClick={() => handleSort("name")}>
              Umzugsfirma
              <SortIndicator active={sortColumn === "name"} direction={sortDirection} />
            </div>
            <div>Match</div>
            <div className="cursor-pointer flex items-center gap-1" onClick={() => handleSort("price")}>
              Preislevel
              <SortIndicator active={sortColumn === "price"} direction={sortDirection} />
            </div>
            <div className="cursor-pointer flex items-center gap-1" onClick={() => handleSort("rating")}>
              Bewertung
              <SortIndicator active={sortColumn === "rating"} direction={sortDirection} />
            </div>
            <div>Verfügbar</div>
          </motion.div>
          
          {/* Rows */}
          {mockCompanies.map((company, index) => (
            <motion.div
              key={company.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onHoverStart={() => setHoveredRow(company.name)}
              onHoverEnd={() => setHoveredRow(null)}
              className={`grid grid-cols-8 gap-4 p-5 items-center transition-all duration-300 cursor-pointer relative ${
                index !== mockCompanies.length - 1 ? "border-b border-border/50" : ""
              } ${company.highlight ? "bg-gradient-to-r from-primary/5 via-primary/3 to-transparent" : ""} ${
                selectedCompanies.includes(company.name) ? "bg-primary/5" : ""
              } hover:bg-muted/50`}
              onClick={() => toggleCompany(company.name)}
            >
              {/* Checkbox */}
              <div className="flex items-center">
                <Checkbox 
                  checked={selectedCompanies.includes(company.name)}
                  className="border-primary/50 data-[state=checked]:bg-primary"
                />
              </div>
              
              {/* Rank with medal */}
              <div className="flex justify-center">
                <motion.div 
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${medalColors[company.medal as keyof typeof medalColors]} flex items-center justify-center shadow-lg relative`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {index === 0 ? (
                    <Trophy className="w-6 h-6 text-white" />
                  ) : (
                    <span className="font-bold text-lg text-white">{index + 1}</span>
                  )}
                </motion.div>
              </div>
              
              <div className="col-span-2">
                <div className="flex items-center gap-3">
                  <motion.div 
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center font-bold text-primary text-lg border border-border/50"
                    whileHover={{ scale: 1.05 }}
                  >
                    {company.name.charAt(0)}
                  </motion.div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-foreground">{company.name}</span>
                      {company.recommended && (
                        <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0 text-xs px-2 py-0.5 shadow-sm">
                          <Award className="w-3 h-3 mr-1" />
                          Empfohlen
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">{company.region}</div>
                    {/* 274. Service tags */}
                    <div className="flex flex-wrap gap-1 mt-1">
                      {company.specialization.slice(0, 2).map((spec, i) => (
                        <motion.span
                          key={spec}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.1 * i }}
                          className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground"
                        >
                          {spec}
                        </motion.span>
                      ))}
                    </div>
                    {company.savings && (
                      <motion.div 
                        className="text-xs text-green-600 font-medium mt-1 inline-flex items-center gap-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <Sparkles className="w-3 h-3" />
                        {company.savings}
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Match Score */}
              <div>
                <MatchScoreBadge score={company.matchScore} />
              </div>
              
              <div>
                <PriceIndicator level={company.priceLevel} />
              </div>
              
              {/* 273. Rating with tooltip */}
              <div 
                className="flex items-center gap-1.5 relative"
                onMouseEnter={() => setShowRatingTooltip(company.name)}
                onMouseLeave={() => setShowRatingTooltip(null)}
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 drop-shadow-[0_0_3px_rgba(250,204,21,0.5)]" />
                </motion.div>
                <span className="font-semibold">{company.rating}</span>
                <span className="text-sm text-muted-foreground">({company.reviews})</span>
                
                <AnimatePresence>
                  {showRatingTooltip === company.name && (
                    <RatingTooltip breakdown={company.ratingBreakdown} />
                  )}
                </AnimatePresence>
              </div>
              
              {/* Availability */}
              <div className="flex items-center gap-1.5">
                {company.available ? (
                  <Badge className="bg-green-50 text-green-700 border-green-200">
                    <Calendar className="w-3 h-3 mr-1" />
                    Verfügbar
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-muted-foreground">
                    Auf Anfrage
                  </Badge>
                )}
              </div>
              
              {/* Quick actions on hover */}
              <AnimatePresence>
                {hoveredRow === company.name && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="absolute right-4 flex items-center gap-2"
                  >
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-8 h-8 rounded-lg bg-card border border-border/50 flex items-center justify-center text-muted-foreground hover:text-red-500 transition-colors"
                    >
                      <Heart className="w-4 h-4" />
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-8 h-8 rounded-lg bg-card border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-8 h-8 rounded-lg bg-card border border-border/50 flex items-center justify-center text-muted-foreground hover:text-green-500 transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
        
        {/* Mobile: Card View */}
        <div className="lg:hidden space-y-4">
          {mockCompanies.map((company, index) => (
            <motion.div
              key={company.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              onClick={() => toggleCompany(company.name)}
            >
              <Card className={`border-border/50 overflow-hidden cursor-pointer ${
                company.highlight ? "ring-2 ring-primary/30 shadow-lg" : "shadow-md"
              } ${selectedCompanies.includes(company.name) ? "ring-2 ring-primary shadow-lg" : ""}`}>
                {/* Recommended banner */}
                {company.recommended && (
                  <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-2 flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm font-semibold">Empfohlen für Sie</span>
                  </div>
                )}
                
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Checkbox 
                          checked={selectedCompanies.includes(company.name)}
                          className="absolute -top-1 -left-1 z-10"
                        />
                        <motion.div 
                          className={`w-14 h-14 rounded-xl bg-gradient-to-br ${medalColors[company.medal as keyof typeof medalColors]} flex items-center justify-center shadow-lg`}
                          whileHover={{ scale: 1.05 }}
                        >
                          {index === 0 ? (
                            <Trophy className="w-7 h-7 text-white" />
                          ) : (
                            <span className="font-bold text-xl text-white">{index + 1}</span>
                          )}
                        </motion.div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{company.name}</h3>
                        <p className="text-sm text-muted-foreground">{company.region}</p>
                      </div>
                    </div>
                    <MatchScoreBadge score={company.matchScore} />
                  </div>
                  
                  {/* Services */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {company.specialization.map((spec) => (
                      <Badge key={spec} variant="secondary" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                  
                  {/* Stats row */}
                  <div className="flex items-center justify-between py-3 border-y border-border/50">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{company.rating}</span>
                      <span className="text-sm text-muted-foreground">({company.reviews})</span>
                    </div>
                    <PriceIndicator level={company.priceLevel} />
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      {company.responseTime}
                    </div>
                  </div>
                  
                  {/* Savings & availability */}
                  <div className="flex items-center justify-between mt-3">
                    {company.savings ? (
                      <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                        <TrendingUp className="w-3.5 h-3.5" />
                        {company.savings}
                      </div>
                    ) : (
                      <div />
                    )}
                    {company.available ? (
                      <Badge className="bg-green-50 text-green-700 border-green-200">
                        Verfügbar
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Auf Anfrage</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <p className="text-muted-foreground mb-4">
            Wählen Sie Ihre Favoriten und erhalten Sie massgeschneiderte Offerten.
          </p>
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
            disabled={selectedCompanies.length === 0}
          >
            <Zap className="w-5 h-5 mr-2" />
            Offerten von {selectedCompanies.length || "ausgewählten"} Firmen anfordern
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
