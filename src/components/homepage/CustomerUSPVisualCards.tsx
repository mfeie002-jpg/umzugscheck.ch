/**
 * Customer USP Visual Cards - ULTRA Premium Edition
 * Educational infographic-style cards with premium animations
 * "Schulbuch-Stil" - clear, visual, easy to understand for parents/customers
 * Now supports DE/BG translations
 */

import { memo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, Star, Rocket, ArrowRight, ChevronDown, Sparkles, 
  Heart, Shield, Zap, Clock, Users, Award, Gift, ThumbsUp
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getVisionTranslation, type VisionLanguage } from "@/lib/vision-translations";

// Import generated USP images
import uspVideoScan from "@/assets/usp/usp-1-video-scan.jpg";
import uspEscrow from "@/assets/usp/usp-2-escrow.jpg";
import uspBureaucracy from "@/assets/usp/usp-3-bureaucracy.jpg";
import uspCleaning from "@/assets/usp/usp-4-cleaning.jpg";
import uspCircular from "@/assets/usp/usp-5-circular.jpg";
import uspPrice from "@/assets/usp/usp-6-price.jpg";
import uspNeighborhood from "@/assets/usp/usp-7-neighborhood.jpg";
import uspInsurance from "@/assets/usp/usp-8-insurance.jpg";
import uspConcierge from "@/assets/usp/usp-9-concierge.jpg";
import uspHandyman from "@/assets/usp/usp-10-handyman.jpg";

interface CustomerUSPVisualCardsProps {
  language?: VisionLanguage;
  allExpanded?: boolean;
}

// USP images array
const uspImages = [
  uspVideoScan, uspEscrow, uspBureaucracy, uspCleaning, uspCircular,
  uspPrice, uspNeighborhood, uspInsurance, uspConcierge, uspHandyman
];

// Card styling data (colors, emojis etc)
const cardStyles = [
  { emoji: "📹", color: "from-blue-500 to-cyan-500", bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/60 dark:to-cyan-950/60", borderColor: "border-blue-300 dark:border-blue-600", accentColor: "text-blue-600 dark:text-blue-400", stats: { value: "2 Min", labelDE: "statt 2 Stunden", labelBG: "вместо 2 часа" } },
  { emoji: "🔐", color: "from-green-500 to-emerald-500", bgColor: "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/60 dark:to-emerald-950/60", borderColor: "border-green-300 dark:border-green-600", accentColor: "text-green-600 dark:text-green-400", stats: { value: "0 CHF", labelDE: "Betrugs-Risiko", labelBG: "риск от измама" } },
  { emoji: "🤖", color: "from-violet-500 to-purple-500", bgColor: "bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/60 dark:to-purple-950/60", borderColor: "border-violet-300 dark:border-violet-600", accentColor: "text-violet-600 dark:text-violet-400", stats: { value: "8h", labelDE: "Zeit gespart", labelBG: "спестено време" } },
  { emoji: "✨", color: "from-pink-500 to-rose-500", bgColor: "bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/60 dark:to-rose-950/60", borderColor: "border-pink-300 dark:border-pink-600", accentColor: "text-pink-600 dark:text-pink-400", stats: { value: "100%", labelDE: "Abnahme-Quote", labelBG: "процент приемане" } },
  { emoji: "♻️", color: "from-teal-500 to-emerald-500", bgColor: "bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/60 dark:to-emerald-950/60", borderColor: "border-teal-300 dark:border-teal-600", accentColor: "text-teal-600 dark:text-teal-400", stats: { value: "-30%", labelDE: "Umzugskosten", labelBG: "разходи за преместване" } },
  { emoji: "⚖️", color: "from-orange-500 to-amber-500", bgColor: "bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/60 dark:to-amber-950/60", borderColor: "border-orange-300 dark:border-orange-600", accentColor: "text-orange-600 dark:text-orange-400", stats: { value: "5", labelDE: "Offerten garantiert", labelBG: "гарантирани оферти" } },
  { emoji: "🗺️", color: "from-cyan-500 to-blue-500", bgColor: "bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/60 dark:to-blue-950/60", borderColor: "border-cyan-300 dark:border-cyan-600", accentColor: "text-cyan-600 dark:text-cyan-400", stats: { value: "50+", labelDE: "POIs angezeigt", labelBG: "показани POI" } },
  { emoji: "🛡️", color: "from-indigo-500 to-blue-500", bgColor: "bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/60 dark:to-blue-950/60", borderColor: "border-indigo-300 dark:border-indigo-600", accentColor: "text-indigo-600 dark:text-indigo-400", stats: { value: "24h", labelDE: "Auszahlung", labelBG: "изплащане" } },
  { emoji: "🎧", color: "from-rose-500 to-pink-500", bgColor: "bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/60 dark:to-pink-950/60", borderColor: "border-rose-300 dark:border-rose-600", accentColor: "text-rose-600 dark:text-rose-400", stats: { value: "<30s", labelDE: "Antwortzeit", labelBG: "време за отговор" } },
  { emoji: "🔧", color: "from-amber-500 to-orange-500", bgColor: "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/60 dark:to-orange-950/60", borderColor: "border-amber-300 dark:border-amber-600", accentColor: "text-amber-600 dark:text-amber-400", stats: { value: "0", labelDE: "Eigene Arbeit", labelBG: "собствен труд" } }
];

// Premium Visual USP Card Component - Mobile Optimized
const VisualUSPCard = memo(({ 
  usp, 
  index, 
  style, 
  image,
  language,
  forceExpanded
}: { 
  usp: any; 
  index: number; 
  style: typeof cardStyles[0];
  image: string;
  language: VisionLanguage;
  forceExpanded?: boolean;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const t = getVisionTranslation(language);
  
  // Sync with external forceExpanded control
  useEffect(() => {
    if (forceExpanded !== undefined) {
      setIsExpanded(forceExpanded);
    }
  }, [forceExpanded]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative rounded-2xl sm:rounded-[2rem] overflow-hidden border-2 ${style.borderColor} ${style.bgColor} hover:shadow-2xl hover:shadow-primary/10 transition-all duration-700 hover:-translate-y-2`}
    >
      {/* Decorative corner accent - Hidden on mobile for performance */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${style.color} opacity-20 blur-2xl hidden sm:block`} />
      
      {/* Image Header with premium overlay - Smaller on mobile */}
      <div className="relative h-40 sm:h-56 overflow-hidden">
        <img 
          src={image} 
          alt={usp.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
          loading="lazy"
        />
        {/* Multi-layer gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
        <div className={`absolute inset-0 bg-gradient-to-br ${style.color} opacity-30 mix-blend-overlay`} />
        
        {/* Premium number badge - Smaller on mobile */}
        <motion.div 
          initial={{ scale: 0, rotate: -180 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.06 + 0.3, type: "spring", stiffness: 200 }}
          className={`absolute top-3 sm:top-4 left-3 sm:left-4 w-10 sm:w-14 h-10 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${style.color} flex items-center justify-center shadow-xl ring-2 sm:ring-4 ring-white/20`}
        >
          <span className="font-black text-lg sm:text-2xl text-white drop-shadow-md">{index + 1}</span>
        </motion.div>
        
        {/* Tagline badge with glow - Smaller on mobile */}
        <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
          <span className={`inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/95 dark:bg-black/80 text-[10px] sm:text-xs font-bold ${style.accentColor} shadow-lg backdrop-blur-sm`}>
            <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
            <span className="hidden xs:inline">{usp.tagline}</span>
            <span className="xs:hidden">{usp.tagline.split(' ')[0]}</span>
          </span>
        </div>
        
        {/* Stats badge - bottom right - Compact on mobile */}
        <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4">
          <div className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-gradient-to-r ${style.color} shadow-lg`}>
            <p className="text-base sm:text-xl font-black text-white">{style.stats.value}</p>
            <p className="text-[8px] sm:text-[10px] text-white/80 font-medium uppercase tracking-wider">
              {language === 'de' ? style.stats.labelDE : style.stats.labelBG}
            </p>
          </div>
        </div>
        
        {/* Title section on image */}
        <div className="absolute bottom-0 left-0 right-16 sm:right-20 p-4 sm:p-6">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
            <span className="text-xl sm:text-3xl drop-shadow-lg">{style.emoji}</span>
            <span className="text-[10px] sm:text-xs text-white/90 font-bold bg-white/20 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full backdrop-blur-sm border border-white/20 line-clamp-1">
              {usp.subtitle}
            </span>
          </div>
          <h3 className="text-lg sm:text-2xl md:text-3xl font-black text-white leading-tight drop-shadow-xl line-clamp-2">
            {usp.title}
          </h3>
        </div>
      </div>
      
      {/* Content - Mobile Optimized */}
      <div className="p-4 sm:p-6 md:p-7">
        {/* Simple explanation with icon */}
        <div className="flex items-start gap-2.5 sm:gap-3 mb-4 sm:mb-6">
          <div className={`w-8 sm:w-10 h-8 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br ${style.color} flex items-center justify-center flex-shrink-0 shadow-md`}>
            <Zap className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
          </div>
          <p className="text-sm sm:text-base font-medium text-foreground leading-relaxed">
            {usp.simpleExplanation}
          </p>
        </div>
        
        {/* Visual workflow - 3 steps - Responsive */}
        <div className="bg-white/80 dark:bg-black/40 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 mb-4 sm:mb-6 border border-border/50 shadow-inner">
          <p className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 sm:mb-4 flex items-center gap-1.5 sm:gap-2">
            <ArrowRight className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
            {t.customerUsps.howItWorks}
          </p>
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {usp.howItWorks.map((step: string, idx: number) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 + idx * 0.1 + 0.4 }}
                className="text-center"
              >
                <div className={`w-7 sm:w-10 h-7 sm:h-10 mx-auto mb-2 sm:mb-3 rounded-full bg-gradient-to-br ${style.color} flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg ring-2 sm:ring-4 ring-white/50 dark:ring-black/50`}>
                  {idx + 1}
                </div>
                <p className="text-[10px] sm:text-xs font-semibold text-foreground leading-tight">{step}</p>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Benefit highlight - main message - Responsive */}
        <div className={`flex items-start gap-3 sm:gap-4 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border-2 ${style.borderColor} bg-white dark:bg-black/50 mb-4 sm:mb-5 shadow-sm`}>
          <div className={`w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-gradient-to-br ${style.color} flex items-center justify-center flex-shrink-0 shadow-md`}>
            <Check className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
          </div>
          <div>
            <p className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider mb-0.5 sm:mb-1">
              {t.customerUsps.yourBenefit}
            </p>
            <p className={`text-xs sm:text-sm font-bold ${style.accentColor} leading-relaxed`}>
              {usp.benefit}
            </p>
          </div>
        </div>

        {/* Expandable before/after section - Touch optimized */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl hover:bg-muted/50 touch-manipulation min-h-[44px] active:scale-[0.98]"
        >
          <span className="font-medium flex items-center gap-1.5 sm:gap-2">
            <ThumbsUp className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
            {t.customerUsps.beforeAfter}
          </span>
          <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <ChevronDown className="w-4 sm:w-5 h-4 sm:h-5" />
          </motion.div>
        </button>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="pt-4 space-y-4">
                {/* Pain point - Before */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border-2 border-red-200 dark:border-red-800"
                >
                  <span className="text-2xl">😫</span>
                  <div>
                    <p className="text-xs font-black text-red-600 dark:text-red-400 mb-1 uppercase tracking-wider">
                      {t.customerUsps.before} – {language === 'de' ? 'Der Stress' : 'Стресът'}
                    </p>
                    <p className="text-sm text-red-700 dark:text-red-300">{usp.painPoint}</p>
                  </div>
                </motion.div>
                
                {/* Solution - After */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className={`flex items-start gap-4 p-4 rounded-2xl ${style.bgColor} border-2 ${style.borderColor}`}
                >
                  <span className="text-2xl">🎉</span>
                  <div>
                    <p className={`text-xs font-black ${style.accentColor} mb-1 uppercase tracking-wider`}>
                      {t.customerUsps.after} – {language === 'de' ? 'Die Lösung' : 'Решението'}
                    </p>
                    <p className="text-sm text-foreground font-medium">{usp.solution}</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
});

VisualUSPCard.displayName = 'VisualUSPCard';

// Main Section Component - Mobile Optimized
export const CustomerUSPVisualCards = memo(({ language = 'de', allExpanded = false }: CustomerUSPVisualCardsProps) => {
  const t = getVisionTranslation(language);
  const usps = t.customerUsps.items;

  return (
    <section className="py-12 sm:py-24 md:py-32 bg-gradient-to-b from-background via-muted/20 to-background relative overflow-hidden">
      {/* Premium background decoration - Hidden on mobile for performance */}
      <div className="absolute inset-0 pointer-events-none hidden sm:block">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-violet-500/5 to-transparent rounded-full" />
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Premium Header - Mobile Responsive */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10 sm:mb-20"
        >
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-bold mb-4 sm:mb-8 border border-primary/20"
          >
            <Heart className="w-4 sm:w-5 h-4 sm:h-5" />
            <span className="hidden xs:inline">{t.customerUsps.sectionTitle}</span>
            <span className="xs:hidden">{language === 'de' ? '10 Vorteile' : '10 предимства'}</span>
            <Heart className="w-4 sm:w-5 h-4 sm:h-5" />
          </motion.span>
          
          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-4 sm:mb-6 leading-tight px-2">
            {language === 'de' ? 'Warum ' : 'Защо '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-violet-500">Umzugscheck.ch?</span>
          </h2>
          
          <p className="text-sm sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-6 sm:mb-8 px-2">
            {t.customerUsps.sectionSubtitle}
          </p>

          {/* Trust badges - Horizontal scroll on mobile */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 px-2">
            <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 text-xs sm:text-sm font-bold border border-green-200 dark:border-green-700">
              <Shield className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
              <span className="hidden xs:inline">{language === 'de' ? '100% Gratis & Unverbindlich' : '100% безплатно'}</span>
              <span className="xs:hidden">{language === 'de' ? 'Gratis' : 'Безплатно'}</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 text-xs sm:text-sm font-bold border border-amber-200 dark:border-amber-700">
              <Star className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
              4.9/5 {language === 'de' ? 'Sterne' : 'звезди'}
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 text-xs sm:text-sm font-bold border border-blue-200 dark:border-blue-700">
              <Users className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
              <span className="hidden xs:inline">25'000+ {language === 'de' ? 'Kunden' : 'клиенти'}</span>
              <span className="xs:hidden">25k+</span>
            </div>
          </div>
        </motion.div>
        
        {/* USP Cards Grid - Single column on small mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-7xl mx-auto">
          {usps.map((usp, idx) => (
            <VisualUSPCard 
              key={idx} 
              usp={usp} 
              index={idx} 
              style={cardStyles[idx]} 
              image={uspImages[idx]}
              language={language}
              forceExpanded={allExpanded}
            />
          ))}
        </div>
        
        {/* Bottom CTA - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 sm:mt-20 text-center"
        >
          <div className="inline-flex flex-col items-center gap-4 sm:gap-6 p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-primary/10 via-blue-500/10 to-violet-500/10 border-2 border-primary/20 w-full sm:w-auto max-w-xl mx-auto">
            <div className="flex items-center gap-2 sm:gap-3">
              <Gift className="w-6 sm:w-8 h-6 sm:h-8 text-primary flex-shrink-0" />
              <span className="text-lg sm:text-2xl md:text-3xl font-black text-foreground text-left sm:text-center">
                {language === 'de' ? 'Bereit für Ihren stressfreien Umzug?' : 'Готови за безстресово преместване?'}
              </span>
            </div>
            <p className="text-muted-foreground text-sm sm:text-lg max-w-xl">
              {language === 'de' 
                ? 'Alle 10 Vorteile – kostenlos und unverbindlich. Jetzt in 2 Minuten Offerten erhalten.'
                : 'Всички 10 предимства – безплатно и без задължения. Получете оферти за 2 минути.'}
            </p>
            <Link to="/umzugsofferten" className="w-full sm:w-auto touch-manipulation">
              <Button 
                size="lg" 
                className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-10 text-sm sm:text-lg font-bold shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all active:scale-[0.98]"
              >
                <Rocket className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
                {language === 'de' ? 'JETZT GRATIS OFFERTEN ERHALTEN' : 'ВЗЕМЕТЕ БЕЗПЛАТНИ ОФЕРТИ'}
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
});

CustomerUSPVisualCards.displayName = 'CustomerUSPVisualCards';

export default CustomerUSPVisualCards;
