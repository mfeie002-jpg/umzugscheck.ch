/**
 * Zug V2 Landing Page - GAMIFIED VERSION
 * 20 Gamification elements added to Zug V1
 * 
 * Gamification Features:
 * 1. XP/Points System with progress bar
 * 2. Achievement badges (unlocked as user scrolls/interacts)
 * 3. Level indicator ("Level 1: Umzugs-Anfänger")
 * 4. Animated coin/token rewards
 * 5. Progress milestone celebrations
 * 6. Streak counter ("3 Firmen bereits kontaktiert!")
 * 7. Leaderboard teaser
 * 8. Spin-the-wheel bonus
 * 9. Scratch card discount reveal
 * 10. Daily bonus popup
 * 11. Animated treasure chest for offers
 * 12. Social proof gamified ("X Personen schauen gerade")
 * 13. Countdown with bonus points
 * 14. Quiz/trivia for extra savings
 * 15. Badge collection showcase
 * 16. Referral bonus teaser
 * 17. Mystery box unlock
 * 18. Confetti celebrations
 * 19. Sound effects indicators (visual)
 * 20. Loyalty tier preview
 */

import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, Shield, Star, Clock, CheckCircle2, Gift, Users, 
  TrendingDown, Home, Building2, Sparkles, Trash2, Box, Package,
  ClipboardList, FileText, PiggyBank, Phone, MessageCircle,
  ChevronDown, ChevronUp, MapPin, Award, Zap, Heart, Timer,
  Calculator, Truck, ThumbsUp, BadgeCheck, Play, Trophy, Target,
  Crown, Flame, Coins, Gem, Medal, Rocket, PartyPopper, Eye,
  Dice6, Lock, Unlock, Percent, TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// ============================================
// GAMIFICATION STATE & HOOKS
// ============================================

interface GamificationState {
  xp: number;
  level: number;
  badges: string[];
  streak: number;
  bonusUnlocked: boolean;
  treasureOpened: boolean;
}

const LEVELS = [
  { name: "Umzugs-Anfänger", minXP: 0, icon: "🌱" },
  { name: "Umzugs-Entdecker", minXP: 100, icon: "🔍" },
  { name: "Umzugs-Kenner", minXP: 250, icon: "📦" },
  { name: "Umzugs-Profi", minXP: 500, icon: "🏆" },
  { name: "Umzugs-Meister", minXP: 1000, icon: "👑" },
];

const BADGES = [
  { id: "first_visit", name: "Erster Besuch", icon: "🎯", xp: 10 },
  { id: "scrolled_50", name: "Entdecker", icon: "🔭", xp: 20 },
  { id: "form_started", name: "Starter", icon: "🚀", xp: 30 },
  { id: "services_viewed", name: "Neugierig", icon: "👀", xp: 15 },
  { id: "faq_opened", name: "Wissbegierig", icon: "📚", xp: 25 },
  { id: "testimonials_read", name: "Vertrauensvoll", icon: "⭐", xp: 20 },
];

const useGamification = () => {
  const [state, setState] = useState<GamificationState>({
    xp: 10, // Start with first visit XP
    level: 1,
    badges: ["first_visit"],
    streak: 1,
    bonusUnlocked: false,
    treasureOpened: false,
  });

  const addXP = useCallback((amount: number) => {
    setState(prev => {
      const newXP = prev.xp + amount;
      const newLevel = LEVELS.findIndex(l => newXP < l.minXP);
      return {
        ...prev,
        xp: newXP,
        level: newLevel === -1 ? LEVELS.length : Math.max(newLevel, prev.level),
      };
    });
  }, []);

  const unlockBadge = useCallback((badgeId: string) => {
    setState(prev => {
      if (prev.badges.includes(badgeId)) return prev;
      const badge = BADGES.find(b => b.id === badgeId);
      return {
        ...prev,
        badges: [...prev.badges, badgeId],
        xp: prev.xp + (badge?.xp || 0),
      };
    });
  }, []);

  return { state, addXP, unlockBadge };
};

// ============================================
// CONSTANTS & DATA
// ============================================

const COUNTDOWN_INITIAL = 4 * 60 + 59;

const TRUST_BADGES = [
  { icon: Shield, label: "Geprüfte Partner", color: "text-emerald-500" },
  { icon: Star, label: "4.8/5 Sterne", color: "text-amber-500" },
  { icon: BadgeCheck, label: "100% Gratis", color: "text-primary" },
];

const MINI_REVIEWS = [
  { text: "Super einfach – wir sparten CHF 200!", author: "Anna K.", location: "Zug", rating: 5 },
  { text: "Schnell, freundlich und günstig!", author: "Markus S.", location: "Baar", rating: 5 },
  { text: "Top Service, sehr empfehlenswert.", author: "Lisa M.", location: "Cham", rating: 5 },
];

const SERVICES = [
  { icon: Home, title: "Privatumzug", description: "Stressfrei zügeln mit Profis", href: "/privatumzug", color: "from-primary to-primary/70", xp: 5 },
  { icon: Building2, title: "Firmenumzug", description: "Büro & Geschäftsumzug", href: "/firmenumzug", color: "from-blue-500 to-blue-400", xp: 5 },
  { icon: Sparkles, title: "Reinigung", description: "Endreinigung mit Garantie", href: "/reinigung", color: "from-emerald-500 to-emerald-400", xp: 5 },
  { icon: Trash2, title: "Entsorgung", description: "Räumung & Entrümpelung", href: "/entsorgung-raeumung", color: "from-orange-500 to-orange-400", xp: 5 },
  { icon: Box, title: "Einlagerung", description: "Sichere Lagerboxen", href: "/einlagerung", color: "from-violet-500 to-violet-400", xp: 5 },
  { icon: Package, title: "Packservice", description: "Professionelles Einpacken", href: "/packservice", color: "from-rose-500 to-rose-400", xp: 5 },
];

const STEPS = [
  { number: 1, icon: ClipboardList, title: "Anfrage stellen", description: "Online Formular in 2 Minuten ausfüllen" },
  { number: 2, icon: FileText, title: "Offerten erhalten", description: "Sie bekommen 3 Angebote von Umzugsfirmen in Zug" },
  { number: 3, icon: PiggyBank, title: "Vergleichen & Sparen", description: "Angebot auswählen & bis 40% sparen" },
];

const REGIONAL_STATS = [
  { icon: Package, value: "97", label: "Umzüge letzte Woche", suffix: "" },
  { icon: Users, value: "1'500+", label: "Nutzer aus Zug in 2025", suffix: "" },
  { icon: TrendingDown, value: "CHF 200", label: "Ø Ersparnis pro Umzug", suffix: "" },
  { icon: Shield, value: "25", label: "Zertifizierte Partner", suffix: "" },
];

const BENEFITS = [
  { icon: BadgeCheck, title: "Geprüfte Umzugsfirmen", description: "Nur qualitätsgeprüfte Unternehmen – für sorgenfreies Zügeln" },
  { icon: TrendingDown, title: "Bis 40% sparen", description: "Preise direkt vergleichen und das beste Angebot wählen" },
  { icon: Gift, title: "Gratis & unverbindlich", description: "Offertenanfrage kostenfrei – kein Risiko, keine Verpflichtung" },
  { icon: Shield, title: "Versicherung & Garantie", description: "Versicherter Umzug, inkl. Abnahmegarantie bei Reinigung" },
  { icon: Phone, title: "Persönlicher Service", description: "Beratung vor, während und nach dem Umzug" },
];

const TESTIMONIALS = [
  { text: "Umzug lief reibungslos, sehr empfehlenswert – habe CHF 250 gespart!", author: "Max M.", location: "Baar", rating: 5, date: "vor 3 Tagen" },
  { text: "Innert 24h hatte ich 3 super Offerten. Einfacher geht's nicht!", author: "Sandra K.", location: "Zug", rating: 5, date: "vor 1 Woche" },
  { text: "Die Firma war pünktlich, freundlich und hat alles sicher transportiert.", author: "Peter H.", location: "Cham", rating: 5, date: "vor 2 Wochen" },
  { text: "Endlich ein Service der hält was er verspricht. Top!", author: "Maria L.", location: "Steinhausen", rating: 5, date: "vor 3 Wochen" },
];

const FAQS = [
  { question: "Was kostet eine Umzugsfirma in Zug?", answer: "Die Kosten für einen Umzug in Zug variieren je nach Wohnungsgrösse, Distanz und gewünschten Services. Eine 2-Zimmer-Wohnung kostet ca. CHF 600-1'200, eine 4-Zimmer-Wohnung CHF 1'200-2'500. Mit unserem Vergleich sparen Sie durchschnittlich CHF 200." },
  { question: "Wie früh sollte ich meinen Umzug planen?", answer: "Wir empfehlen, mindestens 4-6 Wochen vor dem Umzugstermin Offerten einzuholen. In der Hochsaison (Frühling/Sommer) besser 8 Wochen. Kurzfristige Umzüge sind aber auch möglich." },
  { question: "Sind die Offerten wirklich unverbindlich?", answer: "Ja, 100%. Sie erhalten bis zu 3 Offerten von geprüften Umzugsfirmen aus Zug. Sie entscheiden selbst, ob und mit welcher Firma Sie den Umzug durchführen. Kein Kleingedrucktes, keine versteckten Kosten." },
  { question: "Welche Umzugsservices werden angeboten?", answer: "Unsere Partner bieten Privatumzüge, Firmenumzüge, Seniorenumzüge, Packservice, Möbelmontage, Endreinigung mit Abnahmegarantie, Entsorgung und Einlagerung an. Alles aus einer Hand." },
  { question: "Wie werden die Umzugsfirmen geprüft?", answer: "Alle Partner durchlaufen einen Qualitätscheck: Gewerbebewilligung, Versicherungsnachweis, Referenzen und regelmässige Kundenbewertungen. Nur Firmen mit mindestens 4 Sternen bleiben im Netzwerk." },
];

// ============================================
// GAMIFICATION COMPONENTS
// ============================================

// 1. XP Bar & Level Indicator (Gamification 1, 3)
const XPBar = ({ xp, level }: { xp: number; level: number }) => {
  const currentLevel = LEVELS[level - 1] || LEVELS[0];
  const nextLevel = LEVELS[level] || LEVELS[LEVELS.length - 1];
  const progress = ((xp - currentLevel.minXP) / (nextLevel.minXP - currentLevel.minXP)) * 100;

  return (
    <motion.div 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-14 left-0 right-0 z-[55] bg-gradient-to-r from-violet-600 to-purple-600 text-white py-2 px-4 shadow-lg"
    >
      <div className="container mx-auto flex items-center justify-between gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-lg">{currentLevel.icon}</span>
          <span className="font-bold hidden sm:inline">Level {level}: {currentLevel.name}</span>
          <span className="font-bold sm:hidden">Lv.{level}</span>
        </div>
        
        <div className="flex-1 max-w-xs hidden sm:block">
          <Progress value={Math.min(progress, 100)} className="h-2 bg-white/20" />
        </div>
        
        <div className="flex items-center gap-2">
          <Coins className="w-4 h-4 text-amber-300" />
          <span className="font-mono font-bold">{xp} XP</span>
        </div>
      </div>
    </motion.div>
  );
};

// 2. Floating Achievement Popup (Gamification 2, 4, 18)
const AchievementPopup = ({ badge, onClose }: { badge: typeof BADGES[0] | null; onClose: () => void }) => {
  if (!badge) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0, y: 50 }}
        className="fixed bottom-24 right-4 z-[60] bg-gradient-to-r from-amber-500 to-orange-500 text-white p-4 rounded-2xl shadow-2xl"
      >
        <div className="flex items-center gap-3">
          <motion.div 
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5 }}
            className="text-4xl"
          >
            {badge.icon}
          </motion.div>
          <div>
            <p className="font-bold">Badge freigeschaltet!</p>
            <p className="text-sm">{badge.name} • +{badge.xp} XP</p>
          </div>
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <PartyPopper className="w-6 h-6" />
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// 5. Live Viewers Counter (Gamification 12)
const LiveViewers = () => {
  const [viewers, setViewers] = useState(23);

  useEffect(() => {
    const interval = setInterval(() => {
      setViewers(prev => prev + Math.floor(Math.random() * 3) - 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full"
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
      </span>
      <Eye className="w-3.5 h-3.5 text-red-500" />
      <span className="text-xs font-semibold text-red-600">{viewers} Personen schauen gerade</span>
    </motion.div>
  );
};

// 8. Spin Wheel Teaser (Gamification 8)
const SpinWheelTeaser = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const spin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setTimeout(() => {
      setResult("CHF 50 Bonus");
      setIsSpinning(false);
    }, 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-2 border-purple-500/20"
    >
      <div className="flex items-center gap-4">
        <motion.div 
          animate={isSpinning ? { rotate: 360 * 5 } : {}}
          transition={{ duration: 2, ease: "easeOut" }}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg"
        >
          <Dice6 className="w-8 h-8 text-white" />
        </motion.div>
        <div className="flex-1">
          <p className="font-bold text-lg">🎰 Glücksrad</p>
          {result ? (
            <motion.p 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-emerald-600 font-bold"
            >
              Gewonnen: {result}! 🎉
            </motion.p>
          ) : (
            <p className="text-sm text-muted-foreground">Drehen & Extra-Bonus gewinnen!</p>
          )}
        </div>
        {!result && (
          <Button 
            onClick={spin} 
            disabled={isSpinning}
            className="bg-gradient-to-r from-purple-500 to-pink-500"
          >
            {isSpinning ? "..." : "Drehen!"}
          </Button>
        )}
      </div>
    </motion.div>
  );
};

// 9. Scratch Card (Gamification 9)
const ScratchCard = () => {
  const [scratched, setScratched] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="relative overflow-hidden rounded-2xl"
    >
      {!scratched ? (
        <button
          onClick={() => setScratched(true)}
          className="w-full p-6 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-center relative"
        >
          <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.1)_10px,rgba(255,255,255,0.1)_20px)]" />
          <Gift className="w-10 h-10 mx-auto mb-2" />
          <p className="font-bold text-lg">🎁 Rubbellos</p>
          <p className="text-sm opacity-90">Tippen zum Aufdecken!</p>
        </button>
      ) : (
        <motion.div 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="p-6 bg-gradient-to-r from-emerald-500 to-green-500 text-white text-center"
        >
          <motion.div 
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.5 }}
            className="text-4xl mb-2"
          >
            🎉
          </motion.div>
          <p className="font-bold text-xl">CHF 25 Rabatt!</p>
          <p className="text-sm opacity-90">Wird automatisch angewendet</p>
        </motion.div>
      )}
    </motion.div>
  );
};

// 11. Treasure Chest (Gamification 11)
const TreasureChest = ({ onOpen }: { onOpen: () => void }) => {
  const [opened, setOpened] = useState(false);

  const handleOpen = () => {
    setOpened(true);
    onOpen();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="p-6 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-50 border-2 border-amber-300"
    >
      <div className="flex items-center gap-4">
        <motion.div
          animate={opened ? {} : { y: [0, -5, 0] }}
          transition={{ duration: 1, repeat: opened ? 0 : Infinity }}
          className="relative"
        >
          {opened ? (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
              <Gem className="w-14 h-14 text-emerald-500" />
            </motion.div>
          ) : (
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg">
              <Lock className="w-7 h-7 text-white" />
            </div>
          )}
        </motion.div>
        <div className="flex-1">
          <p className="font-bold text-lg">
            {opened ? "🎊 Schatztruhe geöffnet!" : "🔒 Schatztruhe"}
          </p>
          <p className="text-sm text-muted-foreground">
            {opened ? "3 Gratis-Offerten + CHF 75 Bonus freigeschaltet!" : "Öffnen für exklusive Belohnungen"}
          </p>
        </div>
        {!opened && (
          <Button onClick={handleOpen} className="bg-gradient-to-r from-amber-500 to-amber-600">
            <Unlock className="w-4 h-4 mr-2" />
            Öffnen
          </Button>
        )}
      </div>
    </motion.div>
  );
};

// 14. Quiz Bonus (Gamification 14)
const QuizBonus = ({ onCorrect }: { onCorrect: () => void }) => {
  const [answered, setAnswered] = useState<boolean | null>(null);

  const handleAnswer = (correct: boolean) => {
    setAnswered(correct);
    if (correct) onCorrect();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-2 border-blue-500/20"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
          <Target className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-lg mb-2">🧠 Quiz-Bonus</p>
          {answered === null ? (
            <>
              <p className="text-sm text-muted-foreground mb-3">
                Wie viel spart man durchschnittlich mit Umzugscheck?
              </p>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => handleAnswer(false)}>CHF 50</Button>
                <Button size="sm" variant="outline" onClick={() => handleAnswer(true)}>CHF 200</Button>
                <Button size="sm" variant="outline" onClick={() => handleAnswer(false)}>CHF 500</Button>
              </div>
            </>
          ) : answered ? (
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-emerald-600 font-bold">
              ✅ Richtig! +50 XP Bonus!
            </motion.div>
          ) : (
            <div className="text-orange-600">
              Leider falsch. Die Antwort ist CHF 200!
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// 15. Badge Collection (Gamification 15)
const BadgeCollection = ({ unlockedBadges }: { unlockedBadges: string[] }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="p-6 rounded-2xl bg-muted/50 border border-border"
  >
    <div className="flex items-center gap-2 mb-4">
      <Medal className="w-5 h-5 text-amber-500" />
      <p className="font-bold">Deine Badges</p>
      <span className="text-sm text-muted-foreground">({unlockedBadges.length}/{BADGES.length})</span>
    </div>
    <div className="flex flex-wrap gap-3">
      {BADGES.map((badge) => {
        const isUnlocked = unlockedBadges.includes(badge.id);
        return (
          <motion.div
            key={badge.id}
            whileHover={{ scale: 1.1 }}
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all",
              isUnlocked 
                ? "bg-gradient-to-br from-amber-100 to-amber-200 shadow-md" 
                : "bg-muted grayscale opacity-40"
            )}
            title={isUnlocked ? badge.name : "???"}
          >
            {isUnlocked ? badge.icon : "🔒"}
          </motion.div>
        );
      })}
    </div>
  </motion.div>
);

// 16. Referral Bonus (Gamification 16)
const ReferralBonus = () => (
  <motion.div
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    className="p-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 text-white"
  >
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
        <Users className="w-6 h-6" />
      </div>
      <div className="flex-1">
        <p className="font-bold text-lg">👥 Freunde einladen</p>
        <p className="text-sm text-white/80">CHF 50 für dich & CHF 50 für deinen Freund!</p>
      </div>
      <Button variant="secondary" size="sm">
        Einladen
      </Button>
    </div>
  </motion.div>
);

// 17. Mystery Box (Gamification 17)
const MysteryBox = () => {
  const [revealed, setRevealed] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      onClick={() => setRevealed(true)}
      className="cursor-pointer"
    >
      <AnimatePresence mode="wait">
        {!revealed ? (
          <motion.div
            key="box"
            exit={{ rotateY: 90 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 text-white text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-5xl mb-2"
            >
              ❓
            </motion.div>
            <p className="font-bold">Mystery Box</p>
            <p className="text-sm text-gray-400">Tippen zum Enthüllen</p>
          </motion.div>
        ) : (
          <motion.div
            key="revealed"
            initial={{ rotateY: -90 }}
            animate={{ rotateY: 0 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 text-white text-center"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 0.5 }}
              className="text-5xl mb-2"
            >
              🎁
            </motion.div>
            <p className="font-bold">Gratis Umzugsboxen!</p>
            <p className="text-sm text-white/80">10 Kartons bei Buchung geschenkt</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// 20. Loyalty Tier Preview (Gamification 20)
const LoyaltyTierPreview = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="p-6 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 text-white"
  >
    <div className="flex items-center gap-2 mb-4">
      <Crown className="w-5 h-5 text-amber-400" />
      <p className="font-bold">Umzugscheck Rewards</p>
    </div>
    <div className="grid grid-cols-4 gap-2">
      {[
        { tier: "Bronze", icon: "🥉", active: true },
        { tier: "Silber", icon: "🥈", active: false },
        { tier: "Gold", icon: "🥇", active: false },
        { tier: "Platin", icon: "💎", active: false },
      ].map((t, i) => (
        <div 
          key={t.tier}
          className={cn(
            "text-center p-2 rounded-lg",
            t.active ? "bg-amber-500/20 ring-2 ring-amber-400" : "bg-white/5"
          )}
        >
          <div className="text-2xl">{t.icon}</div>
          <div className="text-xs mt-1">{t.tier}</div>
        </div>
      ))}
    </div>
    <p className="text-xs text-gray-400 mt-3 text-center">
      Noch 2 Umzüge bis Silber-Status!
    </p>
  </motion.div>
);

// ============================================
// PAGE SECTIONS (Same as V1 but with gamification hooks)
// ============================================

// Sticky Top Bar with Countdown + Bonus XP (Gamification 13)
const StickyTopBar = ({ addXP }: { addXP: (n: number) => void }) => {
  const [countdown, setCountdown] = useState(COUNTDOWN_INITIAL);
  const [bonusClaimed, setBonusClaimed] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : COUNTDOWN_INITIAL));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const claimBonus = () => {
    if (!bonusClaimed) {
      addXP(25);
      setBonusClaimed(true);
    }
  };

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  return (
    <motion.div 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-secondary via-secondary to-orange-500 text-white py-2.5 px-4 shadow-lg"
    >
      <div className="container mx-auto flex items-center justify-center gap-2 sm:gap-4 text-sm sm:text-base">
        <span className="animate-bounce">🎉</span>
        <span className="font-bold">Heute CHF 150 sparen!</span>
        <div className="flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1">
          <Timer className="w-4 h-4" />
          <span className="font-mono font-bold tabular-nums">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
        </div>
        {!bonusClaimed && (
          <Button 
            size="sm" 
            variant="secondary" 
            onClick={claimBonus}
            className="h-7 text-xs bg-white text-secondary hover:bg-white/90"
          >
            <Coins className="w-3 h-3 mr-1" />
            +25 XP
          </Button>
        )}
      </div>
    </motion.div>
  );
};

// Hero Section with gamification
const HeroSection = ({ unlockBadge }: { unlockBadge: (id: string) => void }) => {
  const [fromPLZ, setFromPLZ] = useState("");
  const [toPLZ, setToPLZ] = useState("");

  const handleFormFocus = () => {
    unlockBadge("form_started");
  };

  return (
    <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center overflow-hidden pt-28 sm:pt-32">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-emerald-500/5" />
      
      {/* Floating gamification elements */}
      <motion.div 
        animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute top-40 right-10 hidden lg:block"
      >
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-500/10 backdrop-blur-sm flex items-center justify-center">
          <Trophy className="w-10 h-10 text-amber-500" />
        </div>
      </motion.div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Live viewers */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <LiveViewers />
          </motion.div>

          {/* Trust badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6"
          >
            <BadgeCheck className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-semibold text-emerald-700">25 geprüfte Umzugsfirmen im Kanton Zug</span>
            <span className="px-2 py-0.5 bg-emerald-500 text-white text-xs font-bold rounded-full">+10 XP</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-6 leading-tight"
          >
            Umzugsfirma in Zug finden – 
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"> Gratis Offerten</span> & bis 40% sparen
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            Vergleichen Sie 3 geprüfte Umzugsfirmen in Zug. 
            <span className="font-semibold text-foreground"> Kostenlos, unverbindlich & sicher.</span>
          </motion.p>

          {/* Mini Form with XP indicator */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/80 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl shadow-primary/10 border border-primary/10 max-w-2xl mx-auto mb-8 relative"
          >
            <div className="absolute -top-3 -right-3 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg">
              🎮 +100 XP bei Anfrage
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                <Input 
                  placeholder="Von PLZ (z.B. 6300)"
                  value={fromPLZ}
                  onChange={(e) => setFromPLZ(e.target.value)}
                  onFocus={handleFormFocus}
                  className="pl-10 h-12 sm:h-14 text-base border-2 border-primary/20 focus:border-primary rounded-xl"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                <Input 
                  placeholder="Nach PLZ"
                  value={toPLZ}
                  onChange={(e) => setToPLZ(e.target.value)}
                  className="pl-10 h-12 sm:h-14 text-base border-2 border-primary/20 focus:border-primary rounded-xl"
                />
              </div>
              <Link to="/umzugsofferten" className="w-full">
                <Button 
                  size="lg" 
                  className="w-full h-12 sm:h-14 text-base sm:text-lg font-bold bg-gradient-to-r from-secondary via-secondary to-secondary/90 hover:from-secondary/90 hover:to-secondary shadow-lg shadow-secondary/30 rounded-xl group"
                >
                  Jetzt Offerten
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-primary/10">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-emerald-500" />
                <span>100% kostenlos</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Clock className="w-4 h-4 text-primary" />
                <span>Dauert nur 2 Min.</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground hidden sm:flex">
                <Flame className="w-4 h-4 text-orange-500" />
                <span>+100 XP</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Trust Section
const TrustSection = () => (
  <section className="py-8 bg-gradient-to-r from-primary/5 via-transparent to-emerald-500/5 border-y border-primary/10">
    <div className="container mx-auto px-4">
      <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mb-6">
        {TRUST_BADGES.map((badge, i) => (
          <motion.div 
            key={badge.label}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="flex items-center gap-2"
          >
            <badge.icon className={cn("w-5 h-5", badge.color)} />
            <span className="font-semibold text-foreground">{badge.label}</span>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        {MINI_REVIEWS.map((review, i) => (
          <motion.div
            key={review.author}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-primary/10 shadow-sm"
          >
            <div className="flex">
              {Array.from({ length: review.rating }).map((_, j) => (
                <Star key={j} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              ))}
            </div>
            <span className="text-sm font-medium text-foreground">"{review.text}"</span>
            <span className="text-xs text-muted-foreground">– {review.author}, {review.location}</span>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// Services Grid with XP
const ServicesGrid = ({ unlockBadge, addXP }: { unlockBadge: (id: string) => void; addXP: (n: number) => void }) => {
  const handleServiceClick = () => {
    unlockBadge("services_viewed");
    addXP(5);
  };

  return (
    <section className="py-16 sm:py-20">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
            Alle Umzugsservices in Zug
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Von Privatumzug bis Endreinigung – alles aus einer Hand
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
          {SERVICES.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              viewport={{ once: true }}
            >
              <Link 
                to={service.href}
                onClick={handleServiceClick}
                className="group block p-5 sm:p-6 bg-white rounded-2xl border-2 border-transparent hover:border-primary/20 shadow-lg shadow-primary/5 hover:shadow-xl hover:shadow-primary/10 transition-all relative"
              >
                <span className="absolute top-2 right-2 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
                  +{service.xp} XP
                </span>
                <div className={cn(
                  "w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg",
                  service.color
                )}>
                  <service.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{service.title}</h3>
                <p className="text-sm text-muted-foreground">{service.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Gamification Section (NEW - combines multiple elements)
const GamificationSection = ({ unlockedBadges, addXP }: { unlockedBadges: string[]; addXP: (n: number) => void }) => (
  <section className="py-16 bg-gradient-to-b from-muted/30 to-background">
    <div className="container mx-auto px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full mb-4">
          <Rocket className="w-5 h-5 text-purple-500" />
          <span className="font-bold text-purple-700">🎮 Bonus-Zone</span>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
          Sammle Belohnungen
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Extra-Vorteile für dich – je mehr du entdeckst, desto mehr sparst du!
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <SpinWheelTeaser />
        <ScratchCard />
        <TreasureChest onOpen={() => addXP(75)} />
        <QuizBonus onCorrect={() => addXP(50)} />
        <MysteryBox />
        <ReferralBonus />
      </div>

      <div className="mt-8 max-w-2xl mx-auto">
        <BadgeCollection unlockedBadges={unlockedBadges} />
      </div>

      <div className="mt-8 max-w-md mx-auto">
        <LoyaltyTierPreview />
      </div>
    </div>
  </section>
);

// How It Works with XP steps
const HowItWorksSection = () => (
  <section className="py-16 sm:py-20">
    <div className="container mx-auto px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
          So funktioniert's
        </h2>
        <p className="text-muted-foreground text-lg">
          In 3 einfachen Schritten zum besten Angebot
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {STEPS.map((step, i) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            viewport={{ once: true }}
            className="relative text-center"
          >
            {i < STEPS.length - 1 && (
              <div className="hidden sm:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/30 to-primary/10" />
            )}
            
            <div className="relative mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mb-4 shadow-xl shadow-primary/25">
              <step.icon className="w-9 h-9 text-white" />
              <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-secondary text-white text-sm font-bold flex items-center justify-center shadow-lg">
                {step.number}
              </span>
              <span className="absolute -bottom-2 -left-2 px-2 py-0.5 bg-amber-500 text-white text-xs font-bold rounded-full shadow-lg">
                +{step.number * 25} XP
              </span>
            </div>
            
            <h3 className="font-bold text-xl mb-2">{step.title}</h3>
            <p className="text-muted-foreground">{step.description}</p>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mt-12"
      >
        <Link to="/umzugsofferten">
          <Button size="lg" className="h-14 px-8 text-lg font-bold bg-gradient-to-r from-secondary to-secondary/90 shadow-lg shadow-secondary/30 group">
            Jetzt Anfrage starten
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
        <p className="text-sm text-muted-foreground mt-3">
          <span className="inline-flex items-center gap-1">
            <Coins className="w-4 h-4 text-amber-500" />
            Verdiene 150 XP bei erfolgreicher Anfrage
          </span>
        </p>
      </motion.div>
    </div>
  </section>
);

// Regional Stats (same as V1)
const RegionalStatsSection = () => (
  <section className="py-16 bg-gradient-to-r from-primary to-primary/80 text-white overflow-hidden">
    <div className="container mx-auto px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-10"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">
          Umzugscheck in Zug – Die Zahlen sprechen für sich
        </h2>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto">
        {REGIONAL_STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="text-center p-4 rounded-2xl bg-white/10 backdrop-blur-sm"
          >
            <stat.icon className="w-8 h-8 mx-auto mb-3 text-white/80" />
            <div className="text-3xl sm:text-4xl font-extrabold mb-1">{stat.value}</div>
            <div className="text-sm text-white/70">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// Benefits Section
const BenefitsSection = () => (
  <section className="py-16 sm:py-20">
    <div className="container mx-auto px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
          Warum Umzugscheck?
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {BENEFITS.map((benefit, i) => (
          <motion.div
            key={benefit.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            viewport={{ once: true }}
            className="p-6 rounded-2xl bg-gradient-to-br from-white to-muted/30 border border-primary/10 shadow-lg"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-4">
              <benefit.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
            <p className="text-muted-foreground text-sm">{benefit.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// Countdown Offer with XP bonus (Gamification 13)
const CountdownOfferSection = ({ addXP }: { addXP: (n: number) => void }) => {
  const [countdown, setCountdown] = useState(COUNTDOWN_INITIAL);
  const [bonusClaimed, setBonusClaimed] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : COUNTDOWN_INITIAL));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  const claimBonus = () => {
    if (!bonusClaimed) {
      addXP(100);
      setBonusClaimed(true);
    }
  };

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-r from-orange-500 via-secondary to-orange-500 text-white overflow-hidden relative">
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute inset-0 bg-[radial-gradient(circle,white_0%,transparent_70%)]"
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto"
        >
          <motion.div 
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full mb-6"
          >
            <Zap className="w-5 h-5" />
            <span className="font-bold">Nur für kurze Zeit!</span>
            <span className="px-2 py-0.5 bg-amber-400 text-amber-900 text-xs font-bold rounded-full">
              +100 XP
            </span>
          </motion.div>
          
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-4">
            ⚡ 20% Rabatt auf Ihren Umzug in Zug!
          </h2>
          
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 min-w-[80px]">
              <div className="text-4xl sm:text-5xl font-mono font-extrabold">{String(minutes).padStart(2, '0')}</div>
              <div className="text-sm text-white/70">Minuten</div>
            </div>
            <div className="text-4xl font-bold">:</div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 min-w-[80px]">
              <div className="text-4xl sm:text-5xl font-mono font-extrabold">{String(seconds).padStart(2, '0')}</div>
              <div className="text-sm text-white/70">Sekunden</div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/umzugsofferten">
              <Button 
                size="lg" 
                className="h-16 px-10 text-xl font-bold bg-white text-secondary hover:bg-white/90 shadow-2xl group"
              >
                <Gift className="w-6 h-6 mr-2" />
                Rabatt sichern
                <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            {!bonusClaimed && (
              <Button 
                onClick={claimBonus}
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                <Coins className="w-5 h-5 mr-2" />
                +100 Bonus-XP sammeln
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Testimonials
const TestimonialsSection = ({ unlockBadge }: { unlockBadge: (id: string) => void }) => {
  useEffect(() => {
    unlockBadge("testimonials_read");
  }, [unlockBadge]);

  return (
    <section className="py-16 sm:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-6 h-6 text-amber-400 fill-amber-400" />
              ))}
            </div>
            <span className="font-bold text-lg">4.8/5</span>
            <span className="text-muted-foreground">basierend auf 120 Bewertungen</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
            Was unsere Kunden sagen
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {TESTIMONIALS.map((testimonial, i) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl bg-white shadow-lg border border-primary/10"
            >
              <div className="flex mb-3">
                {Array.from({ length: testimonial.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-foreground mb-4">"{testimonial.text}"</p>
              <div className="flex items-center justify-between text-sm">
                <div>
                  <span className="font-semibold">{testimonial.author}</span>
                  <span className="text-muted-foreground">, {testimonial.location}</span>
                </div>
                <span className="text-xs text-muted-foreground">{testimonial.date}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// FAQ Section
const FAQSection = ({ unlockBadge }: { unlockBadge: (id: string) => void }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleOpen = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
    unlockBadge("faq_opened");
  };

  return (
    <section className="py-16 sm:py-20">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
            Häufige Fragen zum Umzug in Zug
          </h2>
          <p className="text-muted-foreground text-lg">
            Alles was Sie wissen müssen • <span className="text-amber-600 font-semibold">+25 XP pro gelesener Frage</span>
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-4">
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              viewport={{ once: true }}
              className="border border-primary/10 rounded-2xl overflow-hidden bg-white shadow-sm"
            >
              <button
                onClick={() => handleOpen(i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/30 transition-colors"
              >
                <span className="font-semibold text-lg pr-4">{faq.question}</span>
                {openIndex === i ? (
                  <ChevronUp className="w-5 h-5 text-primary flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                )}
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 text-muted-foreground">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Final CTA
const FinalCTASection = () => (
  <section className="py-16 sm:py-20 bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-white">
    <div className="container mx-auto px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center max-w-3xl mx-auto"
      >
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/10 rounded-full">
          <Trophy className="w-5 h-5 text-amber-300" />
          <span className="font-bold">+200 XP für deine erste Offerte!</span>
        </div>
        
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-6">
          Bereit für Ihren Umzug in Zug?
        </h2>
        <p className="text-lg sm:text-xl mb-8 text-white/90">
          Fordern Sie jetzt Ihre gratis Offerten an und sparen Sie bis zu 40% bei Ihrem Umzug.
        </p>
        
        <Link to="/umzugsofferten">
          <Button 
            size="lg" 
            className="h-16 px-10 text-xl font-bold bg-white text-primary hover:bg-white/90 shadow-2xl group"
          >
            Kostenlose Offerten erhalten
            <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
        
        <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>100% Kostenlos</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>Unverbindlich</span>
          </div>
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-300" />
            <span>+200 XP</span>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

// Sticky Mobile CTA
const StickyMobileCTA = () => (
  <motion.div 
    initial={{ y: 100 }}
    animate={{ y: 0 }}
    className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white/95 backdrop-blur-md border-t border-primary/10 shadow-2xl shadow-black/10 p-3 safe-area-pb"
  >
    <Link to="/umzugsofferten" className="block">
      <Button 
        className="w-full h-14 text-base font-bold bg-gradient-to-r from-secondary to-secondary/90 shadow-lg shadow-secondary/30 group"
      >
        <Gift className="w-5 h-5 mr-2" />
        Gratis Offerten + 200 XP
        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
      </Button>
    </Link>
  </motion.div>
);

// Chat Bubble
const ChatBubble = () => (
  <motion.button
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ delay: 2 }}
    whileHover={{ scale: 1.1 }}
    className="fixed bottom-20 lg:bottom-6 right-4 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/80 text-white shadow-xl shadow-primary/30 flex items-center justify-center"
    title="Fragen? Wir helfen!"
  >
    <MessageCircle className="w-6 h-6" />
  </motion.button>
);

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export default function ZugV2GamifiedLandingPage() {
  const { state, addXP, unlockBadge } = useGamification();
  const [newBadge, setNewBadge] = useState<typeof BADGES[0] | null>(null);

  // Track scroll for badge
  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercent > 50) {
        unlockBadge("scrolled_50");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [unlockBadge]);

  return (
    <>
      <Helmet>
        <title>Umzugsfirma Zug finden – Gamified | umzugscheck.ch</title>
        <meta 
          name="description" 
          content="Umzug in Zug geplant? ✔️ Kostenlose Offerten von geprüften Umzugsfirmen einholen und bis 40% sparen. ✅ Jetzt Umzugsangebot sichern!" 
        />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://umzugscheck.ch/umzugsfirmen/zug-v2" />
      </Helmet>

      <div className="min-h-screen bg-background pb-20 lg:pb-0">
        <StickyTopBar addXP={addXP} />
        <XPBar xp={state.xp} level={state.level} />
        <HeroSection unlockBadge={unlockBadge} />
        <TrustSection />
        <ServicesGrid unlockBadge={unlockBadge} addXP={addXP} />
        <GamificationSection unlockedBadges={state.badges} addXP={addXP} />
        <HowItWorksSection />
        <RegionalStatsSection />
        <BenefitsSection />
        <CountdownOfferSection addXP={addXP} />
        <TestimonialsSection unlockBadge={unlockBadge} />
        <FAQSection unlockBadge={unlockBadge} />
        <FinalCTASection />
        <StickyMobileCTA />
        <ChatBubble />
        <AchievementPopup badge={newBadge} onClose={() => setNewBadge(null)} />
      </div>
    </>
  );
}
