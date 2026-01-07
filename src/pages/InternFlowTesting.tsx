/**
 * Intern Flow Testing Page - Ultimate Archetype Edition
 * Multi-Language (DE/EN/BG/IT) | Mobile-First | Gamified | ADHS-Friendly
 * 
 * 25+ Features:
 * 1. Drag & Drop Ranking (dnd-kit)
 * 2. Multi-Language Support (DE/EN/BG/IT)
 * 3. Gamified Onboarding mit Tipps
 * 4. Session Timer mit Pause
 * 5. Flow Timer pro Test
 * 6. Auto-Save zu localStorage
 * 7. Session Restore Option
 * 8. Skip Flow Funktion
 * 9. Confetti bei Completion
 * 10. Achievement System
 * 11. Quick Notes (Sticky)
 * 12. Emoji Reactions
 * 13. Keyboard Shortcuts
 * 14. Sound Feedback (optional)
 * 15. Statistik Dashboard
 * 16. Undo Last Rating
 * 17. PDF Export
 * 18. JSON Export
 * 19. Clipboard Copy
 * 20. Email Share Template
 * 21. Fullscreen Preview Mode
 * 22. Progress Indicator (Steps + Bar)
 * 23. Estimated Time Remaining
 * 24. Category Breakdown mit Bars
 * 25. Tooltips & Hilfe überall
 * 26. Language Selector
 * 27. Detailed How-To Guides
 * 28. Game-like Flow (A-Z Walkthrough)
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { motion, AnimatePresence } from "framer-motion";
import { TOP_10_FLOWS } from "@/data/top10Flows";
import { translations, LANGUAGES, Language, useTranslation } from "@/data/internTestingTranslations";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  TouchSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Timer,
  Play,
  Pause,
  SkipForward,
  Undo2,
  Download,
  Mail,
  Volume2,
  VolumeX,
  GripVertical,
  CheckCircle,
  Star,
  Trophy,
  Target,
  Zap,
  FileText,
  ExternalLink,
  Maximize2,
  Minimize2,
  ArrowRight,
  Sparkles,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Clipboard,
  Check,
  Rocket,
  HelpCircle,
  X,
  Globe,
  ChevronDown,
  Award,
  BookOpen,
  Lightbulb,
  Info,
  AlertCircle,
} from "lucide-react";

// =============== TYPES ===============
type RatingKey = "usability" | "clarity" | "speed" | "design" | "mobile" | "trust";

const EMOJI_REACTIONS = ["🔥", "💯", "👍", "😐", "👎", "💀"];

type FlowRating = {
  flowId: string;
  ratings: Record<RatingKey, number>;
  pros: string;
  cons: string;
  wouldRecommend: boolean;
  completedAt: string;
  timeSpent: number;
  quickNotes: string;
  emoji?: string;
};

type TestSession = {
  testerName: string;
  startedAt: string;
  flowRatings: FlowRating[];
  finalFeedback: string;
  overallRanking: string[];
  completedAt?: string;
  totalTimeSpent: number;
  skippedFlows: string[];
  language: Language;
  achievements: string[];
};

// Storage
const STORAGE_KEY = "internFlowTestingSession";
const LANG_KEY = "internFlowTestingLang";

function avgRating(r: FlowRating) {
  const vals = Object.values(r.ratings);
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function downloadFile(filename: string, text: string, mime = "application/json") {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// =============== CONFETTI ===============
function Confetti() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {Array.from({ length: 80 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            width: Math.random() * 12 + 6,
            height: Math.random() * 12 + 6,
            backgroundColor: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#10B981", "#3B82F6", "#F59E0B", "#EC4899"][
              Math.floor(Math.random() * 10)
            ],
          }}
          initial={{ y: -20, opacity: 1, rotate: 0, scale: Math.random() * 0.5 + 0.5 }}
          animate={{
            y: window.innerHeight + 100,
            opacity: 0,
            rotate: Math.random() * 1080 - 540,
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            delay: Math.random() * 1,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

// =============== ACHIEVEMENT TOAST ===============
function AchievementToast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.8 }}
      className="fixed bottom-24 left-4 right-4 z-50 mx-auto max-w-sm"
    >
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-4 shadow-2xl shadow-amber-500/30 flex items-center gap-3">
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
          <Award className="w-7 h-7 text-white" />
        </div>
        <div className="flex-1">
          <div className="text-white/70 text-xs font-medium">Achievement!</div>
          <div className="text-white font-bold">{message}</div>
        </div>
      </div>
    </motion.div>
  );
}

// =============== LANGUAGE SELECTOR ===============
function LanguageSelector({ current, onChange }: { current: Language; onChange: (lang: Language) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const currentLang = LANGUAGES.find(l => l.code === current) || LANGUAGES[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur rounded-2xl text-white touch-manipulation"
      >
        <Globe size={18} />
        <span className="text-lg">{currentLang.flag}</span>
        <span className="text-sm font-medium hidden sm:inline">{currentLang.label}</span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-48 bg-slate-800 border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50"
            >
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    onChange(lang.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors touch-manipulation ${
                    current === lang.code ? 'bg-emerald-500/20 text-emerald-400' : 'text-white hover:bg-white/10'
                  }`}
                >
                  <span className="text-xl">{lang.flag}</span>
                  <span className="font-medium">{lang.label}</span>
                  {current === lang.code && <Check size={16} className="ml-auto" />}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// =============== TOOLTIP ===============
function Tooltip({ children, tip }: { children: React.ReactNode; tip: string }) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative inline-flex">
      <button
        onTouchStart={() => setShow(true)}
        onTouchEnd={() => setTimeout(() => setShow(false), 2000)}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="touch-manipulation"
      >
        {children}
      </button>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-700 text-white text-xs rounded-xl whitespace-nowrap z-50 max-w-[200px] text-center"
          >
            {tip}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-700" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// =============== SORTABLE RANK ITEM ===============
function SortableRankItem({
  id,
  idx,
  flow,
  rating,
  t,
}: {
  id: string;
  idx: number;
  flow: typeof TOP_10_FLOWS[number] | undefined;
  rating: FlowRating | undefined;
  t: (key: string) => string;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      className={`flex items-center gap-3 p-4 rounded-2xl transition-all touch-manipulation ${
        isDragging
          ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 shadow-2xl scale-[1.02] border-2 border-emerald-400"
          : "bg-white/5 hover:bg-white/10 border border-white/10"
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-2 rounded-xl hover:bg-white/10 touch-manipulation"
        aria-label="Drag to reorder"
      >
        <GripVertical size={22} className="text-white/50" />
      </button>
      
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold shrink-0 ${
          idx === 0
            ? "bg-gradient-to-br from-yellow-400 to-amber-500 text-white shadow-lg shadow-amber-500/30"
            : idx === 1
            ? "bg-gradient-to-br from-slate-300 to-slate-400 text-slate-800"
            : idx === 2
            ? "bg-gradient-to-br from-amber-600 to-amber-700 text-white"
            : "bg-white/10 text-white/60"
        }`}
      >
        {idx + 1}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-white truncate text-sm">{flow?.name ?? id}</div>
        {rating && (
          <div className="flex items-center gap-2 text-xs text-white/60 mt-1 flex-wrap">
            <span className="flex items-center gap-1">
              <Star size={10} className="text-amber-400" />
              {avgRating(rating).toFixed(1)}
            </span>
            {rating.emoji && <span>{rating.emoji}</span>}
          </div>
        )}
      </div>
      
      {rating && (
        <div className={`text-sm ${rating.wouldRecommend ? "text-emerald-400" : "text-rose-400"}`}>
          {rating.wouldRecommend ? <ThumbsUp size={18} /> : <ThumbsDown size={18} />}
        </div>
      )}
    </motion.div>
  );
}

// =============== RATING BUTTON ===============
function RatingButton({ 
  value, 
  selected, 
  onClick 
}: { 
  value: number; 
  selected: boolean; 
  onClick: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      onClick={onClick}
      className={`w-14 h-14 rounded-2xl text-xl font-bold transition-all touch-manipulation ${
        selected
          ? "bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-lg shadow-emerald-500/40 scale-110"
          : "bg-white/10 text-white/70 hover:bg-white/20 active:bg-white/30"
      }`}
    >
      {value}
    </motion.button>
  );
}

// =============== CRITERIA CONFIG ===============
function getCriteria(t: (key: string) => string) {
  return [
    { id: "usability" as RatingKey, label: t("criteria.usability"), description: t("criteria.usability.desc"), tip: t("criteria.usability.tip"), icon: <Target size={20} />, color: "#10B981" },
    { id: "clarity" as RatingKey, label: t("criteria.clarity"), description: t("criteria.clarity.desc"), tip: t("criteria.clarity.tip"), icon: <Eye size={20} />, color: "#3B82F6" },
    { id: "speed" as RatingKey, label: t("criteria.speed"), description: t("criteria.speed.desc"), tip: t("criteria.speed.tip"), icon: <Zap size={20} />, color: "#F59E0B" },
    { id: "design" as RatingKey, label: t("criteria.design"), description: t("criteria.design.desc"), tip: t("criteria.design.tip"), icon: <Sparkles size={20} />, color: "#8B5CF6" },
    { id: "mobile" as RatingKey, label: t("criteria.mobile"), description: t("criteria.mobile.desc"), tip: t("criteria.mobile.tip"), icon: <ThumbsUp size={20} />, color: "#EC4899" },
    { id: "trust" as RatingKey, label: t("criteria.trust"), description: t("criteria.trust.desc"), tip: t("criteria.trust.tip"), icon: <CheckCircle size={20} />, color: "#06B6D4" },
  ];
}

// =============== MAIN COMPONENT ===============
export default function InternFlowTesting() {
  // Language
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved && ["de", "en", "bg", "it"].includes(saved)) return saved as Language;
    return "de";
  });
  const t = useTranslation(lang);

  // Sound
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Phases
  const [phase, setPhase] = useState<"intro" | "onboarding" | "testing" | "summary">("intro");
  const [testerName, setTesterName] = useState("");
  const [currentFlowIndex, setCurrentFlowIndex] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(true);

  // Flow UI
  const [isFlowOpen, setIsFlowOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Ratings
  const [currentRatings, setCurrentRatings] = useState<Partial<Record<RatingKey, number>>>({});
  const [currentPros, setCurrentPros] = useState("");
  const [currentCons, setCurrentCons] = useState("");
  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null);
  const [currentEmoji, setCurrentEmoji] = useState<string | undefined>();
  const [quickNotes, setQuickNotes] = useState("");

  // Session
  const [session, setSession] = useState<TestSession | null>(null);
  const [finalFeedback, setFinalFeedback] = useState("");
  const [overallRanking, setOverallRanking] = useState<string[]>([]);

  // Timers
  const [sessionTime, setSessionTime] = useState(0);
  const [flowTime, setFlowTime] = useState(0);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const sessionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const flowTimerRef = useRef<NodeJS.Timeout | null>(null);

  // UI State
  const [showConfetti, setShowConfetti] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [copiedState, setCopiedState] = useState<string | null>(null);
  const [achievement, setAchievement] = useState<string | null>(null);
  const [expandedCriterion, setExpandedCriterion] = useState<string | null>(null);

  const summaryRef = useRef<HTMLDivElement | null>(null);
  const currentFlow = TOP_10_FLOWS[currentFlowIndex];
  const CRITERIA = getCriteria(t);

  // Save language
  useEffect(() => {
    localStorage.setItem(LANG_KEY, lang);
  }, [lang]);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Progress
  const progress = useMemo(() => (currentFlowIndex / TOP_10_FLOWS.length) * 100, [currentFlowIndex]);

  // Estimated remaining
  const estimatedRemaining = useMemo(() => {
    const remaining = TOP_10_FLOWS.length - currentFlowIndex;
    const avgTimePerFlow = session?.flowRatings.length
      ? session.flowRatings.reduce((sum, r) => sum + r.timeSpent, 0) / session.flowRatings.length
      : 120;
    return Math.round((remaining * avgTimePerFlow) / 60);
  }, [currentFlowIndex, session]);

  // Session timer
  useEffect(() => {
    if (phase === "testing" && !isTimerPaused) {
      sessionTimerRef.current = setInterval(() => setSessionTime((t) => t + 1), 1000);
    }
    return () => { if (sessionTimerRef.current) clearInterval(sessionTimerRef.current); };
  }, [phase, isTimerPaused]);

  // Flow timer
  useEffect(() => {
    if (phase === "testing" && isFlowOpen && !isTimerPaused) {
      flowTimerRef.current = setInterval(() => setFlowTime((t) => t + 1), 1000);
    }
    return () => { if (flowTimerRef.current) clearInterval(flowTimerRef.current); };
  }, [phase, isFlowOpen, isTimerPaused]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      switch (e.key) {
        case "?": setShowHelp((v) => !v); break;
        case "Escape": setShowHelp(false); setIsFullscreen(false); break;
        case "f": if (isFlowOpen) setIsFullscreen((v) => !v); break;
        case " ": if (phase === "testing") { e.preventDefault(); setIsTimerPaused((v) => !v); } break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [phase, isFlowOpen]);

  // Load saved session
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as TestSession;
        if (parsed.flowRatings.length > 0 && !parsed.completedAt) {
          if (window.confirm(t("alert.restoreSession"))) {
            setSession(parsed);
            setTesterName(parsed.testerName);
            setCurrentFlowIndex(parsed.flowRatings.length);
            setLang(parsed.language || "de");
            setPhase("testing");
            setShowOnboarding(false);
          }
        }
      } catch {}
    }
  }, []);

  // Save session
  useEffect(() => {
    if (session) localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }, [session]);

  const playSound = useCallback((type: "success" | "click" | "complete") => {
    if (!soundEnabled) return;
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = type === "success" ? 800 : type === "complete" ? 1200 : 500;
      gain.gain.value = 0.06;
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {}
  }, [soundEnabled]);

  const showAchievement = useCallback((msg: string) => {
    playSound("complete");
    setAchievement(msg);
  }, [playSound]);

  const startTesting = useCallback(() => {
    if (!testerName.trim()) {
      alert(t("alert.enterName"));
      return;
    }
    playSound("click");
    if (showOnboarding) {
      setPhase("onboarding");
    } else {
      const s: TestSession = {
        testerName: testerName.trim(),
        startedAt: new Date().toISOString(),
        flowRatings: [],
        finalFeedback: "",
        overallRanking: [],
        totalTimeSpent: 0,
        skippedFlows: [],
        language: lang,
        achievements: [],
      };
      setSession(s);
      setPhase("testing");
    }
  }, [testerName, lang, showOnboarding, playSound, t]);

  const startAfterOnboarding = useCallback(() => {
    playSound("click");
    const s: TestSession = {
      testerName: testerName.trim(),
      startedAt: new Date().toISOString(),
      flowRatings: [],
      finalFeedback: "",
      overallRanking: [],
      totalTimeSpent: 0,
      skippedFlows: [],
      language: lang,
      achievements: [],
    };
    setSession(s);
    setPhase("testing");
  }, [testerName, lang, playSound]);

  const submitFlowRating = useCallback(() => {
    if (!currentFlow) return;
    const missing = CRITERIA.filter((c) => !currentRatings[c.id]);
    if (missing.length) {
      alert(`${t("alert.rateAll")}: ${missing.map((m) => m.label).join(", ")}`);
      return;
    }
    if (wouldRecommend === null) {
      alert(t("alert.recommend"));
      return;
    }

    playSound("success");

    const rating: FlowRating = {
      flowId: currentFlow.id,
      ratings: currentRatings as Record<RatingKey, number>,
      pros: currentPros.trim(),
      cons: currentCons.trim(),
      wouldRecommend,
      completedAt: new Date().toISOString(),
      timeSpent: flowTime,
      quickNotes: quickNotes.trim(),
      emoji: currentEmoji,
    };

    const newRatings = session ? [...session.flowRatings, rating] : [rating];
    
    // Check achievements
    const newAchievements = [...(session?.achievements || [])];
    if (newRatings.length === 1 && !newAchievements.includes("firstFlow")) {
      newAchievements.push("firstFlow");
      showAchievement(t("achievement.firstFlow"));
    }
    if (newRatings.length === 5 && !newAchievements.includes("halfWay")) {
      newAchievements.push("halfWay");
      showAchievement(t("achievement.halfWay"));
    }
    if (flowTime < 120 && !newAchievements.includes("speedster")) {
      newAchievements.push("speedster");
      showAchievement(t("achievement.speedster"));
    }
    if ((currentPros.length > 50 || currentCons.length > 50) && !newAchievements.includes("critic")) {
      newAchievements.push("critic");
      showAchievement(t("achievement.critic"));
    }

    setSession((prev) => {
      if (!prev) return prev;
      return { ...prev, flowRatings: newRatings, totalTimeSpent: sessionTime, achievements: newAchievements };
    });

    // Reset
    setCurrentRatings({});
    setCurrentPros("");
    setCurrentCons("");
    setWouldRecommend(null);
    setCurrentEmoji(undefined);
    setQuickNotes("");
    setIsFlowOpen(false);
    setFlowTime(0);
    setExpandedCriterion(null);

    if (currentFlowIndex < TOP_10_FLOWS.length - 1) {
      setCurrentFlowIndex((i) => i + 1);
    } else {
      if (!newAchievements.includes("complete")) {
        newAchievements.push("complete");
        showAchievement(t("achievement.complete"));
      }
      setPhase("summary");
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [currentFlow, currentFlowIndex, currentRatings, currentPros, currentCons, wouldRecommend, currentEmoji, quickNotes, flowTime, sessionTime, session, CRITERIA, t, playSound, showAchievement]);

  const skipFlow = useCallback(() => {
    if (!currentFlow) return;
    if (!confirm(t("alert.skipConfirm"))) return;
    setSession((prev) => {
      if (!prev) return prev;
      return { ...prev, skippedFlows: [...prev.skippedFlows, currentFlow.id] };
    });
    setCurrentRatings({});
    setCurrentPros("");
    setCurrentCons("");
    setWouldRecommend(null);
    setCurrentEmoji(undefined);
    setQuickNotes("");
    setIsFlowOpen(false);
    setFlowTime(0);
    if (currentFlowIndex < TOP_10_FLOWS.length - 1) {
      setCurrentFlowIndex((i) => i + 1);
    } else {
      setPhase("summary");
    }
  }, [currentFlow, currentFlowIndex, t]);

  const undoLastRating = useCallback(() => {
    if (!session || session.flowRatings.length === 0) return;
    if (!confirm(t("alert.undoConfirm"))) return;
    setSession((prev) => {
      if (!prev) return prev;
      const newRatings = [...prev.flowRatings];
      newRatings.pop();
      return { ...prev, flowRatings: newRatings };
    });
    setCurrentFlowIndex((i) => Math.max(0, i - 1));
  }, [session, t]);

  const derivedRanking = useMemo(() => {
    if (!session?.flowRatings?.length) return [];
    const sorted = [...session.flowRatings].sort((a, b) => avgRating(b) - avgRating(a));
    return sorted.map((r) => r.flowId);
  }, [session]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setOverallRanking((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }, []);

  const exportPdf = useCallback(async () => {
    if (!summaryRef.current) return;
    const canvas = await html2canvas(summaryRef.current, { scale: 2, backgroundColor: "#0f172a" });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pageW = pdf.internal.pageSize.getWidth();
    const imgW = pageW;
    const imgH = (canvas.height * imgW) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, imgW, imgH);
    pdf.save(`flow-testing-${session?.testerName || "tester"}.pdf`);
  }, [session?.testerName]);

  const submitFinalFeedback = useCallback(async () => {
    if (!session) return;
    const finalSession: TestSession = {
      ...session,
      finalFeedback: finalFeedback.trim(),
      overallRanking: overallRanking.length ? overallRanking : derivedRanking,
      completedAt: new Date().toISOString(),
    };
    const json = JSON.stringify(finalSession, null, 2);
    const copied = await copyToClipboard(json);
    if (copied) {
      setCopiedState("json");
      playSound("success");
      setTimeout(() => setCopiedState(null), 2000);
    } else {
      downloadFile(`flow-testing-${finalSession.testerName}.json`, json);
    }
  }, [session, finalFeedback, overallRanking, derivedRanking, playSound]);

  // Stats
  const stats = useMemo(() => {
    if (!session?.flowRatings.length) return null;
    const ratings = session.flowRatings;
    const avgOverall = ratings.reduce((sum, r) => sum + avgRating(r), 0) / ratings.length;
    const recommended = ratings.filter(r => r.wouldRecommend).length;
    const categoryAvgs = CRITERIA.map(c => ({
      ...c,
      avg: ratings.reduce((sum, r) => sum + r.ratings[c.id], 0) / ratings.length
    }));
    return { avgOverall, recommended, total: ratings.length, categoryAvgs };
  }, [session, CRITERIA]);

  // Init ranking
  useEffect(() => {
    if (phase === "summary" && overallRanking.length === 0 && derivedRanking.length > 0) {
      setOverallRanking(derivedRanking);
    }
  }, [phase, derivedRanking, overallRanking.length]);

  // =============== INTRO PHASE ===============
  if (phase === "intro") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Helmet>
          <title>Flow Testing | Umzugscheck.ch</title>
        </Helmet>

        <div className="min-h-screen flex flex-col safe-area-top safe-area-bottom">
          {/* Language Selector */}
          <div className="flex justify-end p-4">
            <LanguageSelector current={lang} onChange={setLang} />
          </div>

          {/* Hero */}
          <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-lg space-y-8"
            >
              {/* Logo & Title */}
              <div className="text-center space-y-4">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                  className="w-24 h-24 mx-auto bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/30"
                >
                  <Rocket className="w-12 h-12 text-white" />
                </motion.div>
                
                <h1 className="text-4xl font-bold text-white">
                  {t("intro.title")}
                </h1>
                <p className="text-xl text-white/60">
                  {t("intro.subtitle")}
                </p>
              </div>

              {/* Steps */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { step: 1, label: t("intro.step1"), desc: t("intro.step1.desc"), icon: <ExternalLink size={22} /> },
                  { step: 2, label: t("intro.step2"), desc: t("intro.step2.desc"), icon: <Star size={22} /> },
                  { step: 3, label: t("intro.step3"), desc: t("intro.step3.desc"), icon: <Download size={22} /> },
                ].map((item) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: item.step * 0.1 }}
                    className="bg-white/5 backdrop-blur rounded-2xl p-4 text-center border border-white/10"
                  >
                    <div className="w-12 h-12 mx-auto bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl flex items-center justify-center text-emerald-400 mb-2">
                      {item.icon}
                    </div>
                    <div className="text-xs text-white/40 mb-1">{item.step}</div>
                    <div className="text-sm font-bold text-white">{item.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Name Input */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-4"
              >
                <input
                  className="w-full px-6 py-5 bg-white/10 backdrop-blur border-2 border-white/20 rounded-2xl text-white text-lg placeholder:text-white/40 focus:outline-none focus:border-emerald-400 transition-all touch-manipulation"
                  placeholder={t("intro.name.placeholder")}
                  value={testerName}
                  onChange={(e) => setTesterName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && startTesting()}
                  autoFocus
                />

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={startTesting}
                  className="w-full py-5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl text-white text-xl font-bold shadow-xl shadow-emerald-500/30 active:shadow-lg transition-all touch-manipulation flex items-center justify-center gap-3"
                >
                  {t("intro.start")}
                  <ArrowRight size={24} />
                </motion.button>
              </motion.div>

              {/* Tips */}
              <div className="flex items-center justify-center gap-2 text-white/40 text-sm">
                <Lightbulb size={16} className="text-amber-400" />
                <span>{t("intro.tip")}</span>
              </div>
            </motion.div>
          </div>

          {/* Sound Toggle */}
          <div className="pb-6 flex justify-center gap-4">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/5 rounded-full text-white/60 text-sm touch-manipulation"
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              {t("intro.sound")} {soundEnabled ? t("intro.on") : t("intro.off")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =============== ONBOARDING PHASE ===============
  if (phase === "onboarding") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 safe-area-top safe-area-bottom">
        <Helmet>
          <title>How-To | Flow Testing</title>
        </Helmet>

        <div className="min-h-screen flex flex-col px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 max-w-lg mx-auto w-full space-y-6"
          >
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">{t("onboarding.title")}</h1>
            </div>

            {/* Sections */}
            <div className="space-y-4">
              {/* What is this? */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/5 backdrop-blur rounded-2xl p-5 border border-white/10"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                    <HelpCircle className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h2 className="font-bold text-white">{t("onboarding.what")}</h2>
                </div>
                <p className="text-white/70 text-sm leading-relaxed">{t("onboarding.what.desc")}</p>
              </motion.div>

              {/* How does it work? */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/5 backdrop-blur rounded-2xl p-5 border border-white/10"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <Target className="w-5 h-5 text-blue-400" />
                  </div>
                  <h2 className="font-bold text-white">{t("onboarding.how")}</h2>
                </div>
                <div className="text-white/70 text-sm leading-relaxed whitespace-pre-line">{t("onboarding.how.desc")}</div>
              </motion.div>

              {/* Time */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/5 backdrop-blur rounded-2xl p-5 border border-white/10"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5 text-amber-400" />
                  </div>
                  <h2 className="font-bold text-white">{t("onboarding.time")}</h2>
                </div>
                <p className="text-white/70 text-sm leading-relaxed">{t("onboarding.time.desc")}</p>
              </motion.div>

              {/* Pro Tips */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur rounded-2xl p-5 border border-purple-500/20"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-purple-400" />
                  </div>
                  <h2 className="font-bold text-white">{t("onboarding.tips")}</h2>
                </div>
                <ul className="space-y-2 text-sm text-white/70">
                  <li>{t("onboarding.tip1")}</li>
                  <li>{t("onboarding.tip2")}</li>
                  <li>{t("onboarding.tip3")}</li>
                  <li>{t("onboarding.tip4")}</li>
                  <li>{t("onboarding.tip5")}</li>
                </ul>
              </motion.div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={startAfterOnboarding}
                className="w-full py-5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl text-white text-lg font-bold shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 touch-manipulation"
              >
                <Check size={24} />
                {t("onboarding.understood")}
              </motion.button>
              
              <button
                onClick={() => {
                  setShowOnboarding(false);
                  startAfterOnboarding();
                }}
                className="w-full py-3 text-white/40 text-sm touch-manipulation"
              >
                {t("onboarding.skip")}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // =============== TESTING PHASE ===============
  if (phase === "testing" && session && currentFlow) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Helmet>
          <title>{t("testing.flow")} {currentFlowIndex + 1}/{TOP_10_FLOWS.length}</title>
        </Helmet>

        {showConfetti && <Confetti />}
        
        <AnimatePresence>
          {achievement && (
            <AchievementToast message={achievement} onClose={() => setAchievement(null)} />
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-lg border-b border-white/10 px-4 py-3 safe-area-top">
          <div className="max-w-4xl mx-auto">
            {/* Progress Bar */}
            <div className="h-2.5 bg-white/10 rounded-full overflow-hidden mb-3">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Info Row */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-lg">
                  {currentFlowIndex + 1}/{TOP_10_FLOWS.length}
                </span>
                <span className="text-white/40 hidden sm:inline">• {session.testerName}</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsTimerPaused(!isTimerPaused)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full touch-manipulation ${
                    isTimerPaused ? 'bg-amber-500/20 text-amber-400' : 'text-white/60'
                  }`}
                >
                  {isTimerPaused ? <Play size={14} /> : <Pause size={14} />}
                  <span className="font-mono text-sm">{formatTime(sessionTime)}</span>
                </button>

                <LanguageSelector current={lang} onChange={setLang} />

                <button
                  onClick={() => setShowHelp(true)}
                  className="p-2 text-white/40 hover:text-white touch-manipulation"
                >
                  <HelpCircle size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 py-6 max-w-2xl mx-auto space-y-6">
          {/* Current Flow Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-5 space-y-4"
          >
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className={`w-9 h-9 rounded-xl bg-gradient-to-br ${currentFlow.color} flex items-center justify-center text-white font-bold`}>
                  {currentFlow.rank}
                </span>
                <span className="px-2 py-1 bg-white/10 rounded-lg text-white/60 text-xs">{currentFlow.steps} {t("testing.steps")}</span>
                <span className="px-2 py-1 bg-white/10 rounded-lg text-white/60 text-xs">{currentFlow.estimatedTime}</span>
              </div>
              <h2 className="text-xl font-bold text-white">
                {currentFlow.name}
              </h2>
              <p className="text-white/60 text-sm mt-1">
                {currentFlow.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => window.open(currentFlow.url, "_blank")}
                className="py-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 touch-manipulation"
              >
                <ExternalLink size={20} />
                {t("testing.open")}
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsFlowOpen(!isFlowOpen)}
                className="py-4 bg-white/10 rounded-2xl text-white font-semibold flex items-center justify-center gap-2 touch-manipulation"
              >
                {isFlowOpen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                {isFlowOpen ? t("testing.close") : t("testing.preview")}
              </motion.button>
            </div>
          </motion.div>

          {/* Preview Iframe */}
          <AnimatePresence>
            {isFlowOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className={`bg-white rounded-2xl overflow-hidden ${isFullscreen ? "fixed inset-2 z-50" : ""}`}>
                  {isFullscreen && (
                    <button
                      onClick={() => setIsFullscreen(false)}
                      className="absolute top-3 right-3 z-10 p-3 bg-slate-900/80 rounded-full text-white touch-manipulation"
                    >
                      <X size={24} />
                    </button>
                  )}
                  <iframe
                    title={currentFlow.id}
                    src={currentFlow.url}
                    className={`w-full bg-white ${isFullscreen ? "h-full" : "h-[500px] md:h-[600px]"}`}
                  />
                </div>

                {!isFullscreen && (
                  <div className="flex justify-center mt-3">
                    <button
                      onClick={() => setIsFullscreen(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full text-white/60 text-sm touch-manipulation"
                    >
                      <Maximize2 size={14} />
                      {t("testing.fullscreen")}
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Rating Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-5 space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">{t("testing.rating")}</h3>
                <p className="text-white/40 text-xs">{t("testing.rating.desc")}</p>
              </div>
              {flowTime > 0 && (
                <span className="text-white/40 text-sm flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-full">
                  <Timer size={14} />
                  {formatTime(flowTime)}
                </span>
              )}
            </div>

            {/* Rating Criteria */}
            <div className="space-y-5">
              {CRITERIA.map((criterion) => (
                <div key={criterion.id} className="space-y-3">
                  <div 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setExpandedCriterion(expandedCriterion === criterion.id ? null : criterion.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl" style={{ backgroundColor: `${criterion.color}20` }}>
                        <div style={{ color: criterion.color }}>{criterion.icon}</div>
                      </div>
                      <div>
                        <div className="text-white font-semibold">{criterion.label}</div>
                        <div className="text-white/40 text-xs">{criterion.description}</div>
                      </div>
                    </div>
                    <Tooltip tip={criterion.tip}>
                      <Info size={16} className="text-white/30" />
                    </Tooltip>
                  </div>
                  
                  <AnimatePresence>
                    {expandedCriterion === criterion.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-white/5 rounded-xl p-3 text-xs text-white/60"
                      >
                        <AlertCircle size={12} className="inline mr-1" />
                        {criterion.tip}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <div className="flex justify-between gap-2">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <RatingButton
                        key={val}
                        value={val}
                        selected={currentRatings[criterion.id] === val}
                        onClick={() => setCurrentRatings((prev) => ({ ...prev, [criterion.id]: val }))}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Emoji Reaction */}
            <div className="space-y-2">
              <div className="text-white/60 text-sm">{t("testing.quickReaction")}</div>
              <div className="flex justify-between gap-1">
                {EMOJI_REACTIONS.map((emoji) => (
                  <motion.button
                    key={emoji}
                    whileTap={{ scale: 0.85 }}
                    onClick={() => setCurrentEmoji(currentEmoji === emoji ? undefined : emoji)}
                    className={`flex-1 h-14 text-2xl rounded-2xl flex items-center justify-center transition-all touch-manipulation ${
                      currentEmoji === emoji
                        ? "bg-white/20 scale-105 ring-2 ring-white/40"
                        : "bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    {emoji}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Pro/Contra */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-emerald-400 text-sm font-medium flex items-center gap-2">
                  <ThumbsUp size={16} /> {t("testing.whatGood")}
                </label>
                <textarea
                  value={currentPros}
                  onChange={(e) => setCurrentPros(e.target.value)}
                  placeholder={t("testing.whatGood.placeholder")}
                  className="w-full h-24 px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-400/50 resize-none touch-manipulation text-base"
                />
              </div>
              <div className="space-y-2">
                <label className="text-rose-400 text-sm font-medium flex items-center gap-2">
                  <ThumbsDown size={16} /> {t("testing.whatBad")}
                </label>
                <textarea
                  value={currentCons}
                  onChange={(e) => setCurrentCons(e.target.value)}
                  placeholder={t("testing.whatBad.placeholder")}
                  className="w-full h-24 px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/30 focus:outline-none focus:border-rose-400/50 resize-none touch-manipulation text-base"
                />
              </div>
            </div>

            {/* Quick Notes */}
            <div className="space-y-2">
              <label className="text-white/60 text-sm font-medium">{t("testing.notes")}</label>
              <textarea
                value={quickNotes}
                onChange={(e) => setQuickNotes(e.target.value)}
                placeholder={t("testing.notes.placeholder")}
                className="w-full h-20 px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 resize-none touch-manipulation text-base"
              />
            </div>

            {/* Recommend */}
            <div className="space-y-3">
              <div className="text-white font-semibold">{t("testing.recommend")}</div>
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setWouldRecommend(true)}
                  className={`py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all touch-manipulation ${
                    wouldRecommend === true
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                      : "bg-white/10 text-white/70"
                  }`}
                >
                  <ThumbsUp size={24} />
                  {t("testing.yes")}
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setWouldRecommend(false)}
                  className={`py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all touch-manipulation ${
                    wouldRecommend === false
                      ? "bg-rose-500 text-white shadow-lg shadow-rose-500/30"
                      : "bg-white/10 text-white/70"
                  }`}
                >
                  <ThumbsDown size={24} />
                  {t("testing.no")}
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <div className="space-y-3 pb-8">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={submitFlowRating}
              className="w-full py-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl text-white text-xl font-bold shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-3 touch-manipulation"
            >
              <Check size={28} />
              {t("testing.save")}
            </motion.button>

            <div className="flex gap-3">
              {session.flowRatings.length > 0 && (
                <button
                  onClick={undoLastRating}
                  className="flex-1 py-4 bg-white/5 rounded-2xl text-white/60 font-medium flex items-center justify-center gap-2 touch-manipulation"
                >
                  <Undo2 size={18} />
                  {t("testing.back")}
                </button>
              )}
              <button
                onClick={skipFlow}
                className="flex-1 py-4 bg-white/5 rounded-2xl text-white/60 font-medium flex items-center justify-center gap-2 touch-manipulation"
              >
                <SkipForward size={18} />
                {t("testing.skip")}
              </button>
            </div>

            <div className="text-center text-white/40 text-sm">
              ~{estimatedRemaining} {t("testing.remaining")}
            </div>
          </div>
        </div>

        {/* Help Modal */}
        <AnimatePresence>
          {showHelp && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
              onClick={() => setShowHelp(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-slate-800 rounded-3xl p-6 max-w-sm w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold text-white mb-4">{t("help.title")}</h3>
                <div className="space-y-3 text-white/70 text-sm">
                  <div className="flex justify-between items-center"><span>{t("help.pause")}</span><kbd className="px-3 py-1.5 bg-white/10 rounded-lg text-xs">Space</kbd></div>
                  <div className="flex justify-between items-center"><span>{t("help.fullscreen")}</span><kbd className="px-3 py-1.5 bg-white/10 rounded-lg text-xs">F</kbd></div>
                  <div className="flex justify-between items-center"><span>{t("help.close")}</span><kbd className="px-3 py-1.5 bg-white/10 rounded-lg text-xs">Esc</kbd></div>
                </div>
                <button
                  onClick={() => setShowHelp(false)}
                  className="w-full mt-6 py-4 bg-white/10 rounded-2xl text-white font-medium touch-manipulation"
                >
                  {t("help.understood")}
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // =============== SUMMARY PHASE ===============
  if (!session) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 safe-area-top safe-area-bottom">
      <Helmet>
        <title>{t("summary.title")} | Flow Testing</title>
      </Helmet>

      {showConfetti && <Confetti />}

      <AnimatePresence>
        {achievement && (
          <AchievementToast message={achievement} onClose={() => setAchievement(null)} />
        )}
      </AnimatePresence>

      <div className="px-4 py-6 max-w-2xl mx-auto space-y-6">
        {/* Language Selector */}
        <div className="flex justify-end">
          <LanguageSelector current={lang} onChange={setLang} />
        </div>

        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 py-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
            className="w-24 h-24 mx-auto bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/30"
          >
            <Trophy className="w-12 h-12 text-white" />
          </motion.div>
          
          <h1 className="text-4xl font-bold text-white">{t("summary.title")}</h1>
          <p className="text-white/60 text-lg">
            {t("summary.thanks")}, <span className="text-white font-semibold">{session.testerName}</span>!
          </p>
        </motion.div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-3 gap-3">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 backdrop-blur rounded-2xl p-4 text-center border border-white/10"
            >
              <div className="text-3xl font-bold text-white">{stats.avgOverall.toFixed(1)}</div>
              <div className="text-xs text-white/40 mt-1">{t("summary.avgScore")}</div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 backdrop-blur rounded-2xl p-4 text-center border border-white/10"
            >
              <div className="text-3xl font-bold text-emerald-400">{stats.recommended}/{stats.total}</div>
              <div className="text-xs text-white/40 mt-1">{t("summary.recommended")}</div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/5 backdrop-blur rounded-2xl p-4 text-center border border-white/10"
            >
              <div className="text-3xl font-bold text-white">{formatTime(sessionTime)}</div>
              <div className="text-xs text-white/40 mt-1">{t("summary.testTime")}</div>
            </motion.div>
          </div>
        )}

        {/* Summary Content for PDF */}
        <div ref={summaryRef} className="space-y-6">
          {/* Category Breakdown */}
          {stats && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white/5 backdrop-blur rounded-3xl p-5 border border-white/10"
            >
              <h2 className="text-lg font-bold text-white mb-4">{t("summary.categories")}</h2>
              <div className="space-y-4">
                {stats.categoryAvgs.map((cat) => (
                  <div key={cat.id} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${cat.color}20` }}>
                          <div style={{ color: cat.color }}>{cat.icon}</div>
                        </div>
                        <span className="text-white font-medium">{cat.label}</span>
                      </div>
                      <span className="text-white font-bold">{cat.avg.toFixed(1)}</span>
                    </div>
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(cat.avg / 5) * 100}%` }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Drag & Drop Ranking */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/5 backdrop-blur rounded-3xl p-5 border border-white/10"
          >
            <h2 className="text-lg font-bold text-white mb-2">{t("summary.ranking")}</h2>
            <p className="text-white/40 text-sm mb-4 flex items-center gap-2">
              <GripVertical size={14} />
              {t("summary.ranking.tip")}
            </p>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext
                items={overallRanking.length ? overallRanking : derivedRanking}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {(overallRanking.length ? overallRanking : derivedRanking).map((id, idx) => {
                    const flow = TOP_10_FLOWS.find((f) => f.id === id);
                    const rating = session.flowRatings.find((r) => r.flowId === id);
                    return (
                      <SortableRankItem key={id} id={id} idx={idx} flow={flow} rating={rating} t={t} />
                    );
                  })}
                </div>
              </SortableContext>
            </DndContext>
          </motion.div>

          {/* Final Feedback */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/5 backdrop-blur rounded-3xl p-5 border border-white/10"
          >
            <h2 className="text-lg font-bold text-white mb-2">{t("summary.feedback")}</h2>
            <p className="text-white/40 text-sm mb-4">{t("summary.feedback.desc")}</p>
            <textarea
              value={finalFeedback}
              onChange={(e) => setFinalFeedback(e.target.value)}
              placeholder={t("summary.feedback.placeholder")}
              className="w-full h-32 px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-400/50 resize-none touch-manipulation text-base"
            />
          </motion.div>
        </div>

        {/* Export Buttons */}
        <div className="space-y-3 pb-8">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={submitFinalFeedback}
            className="w-full py-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl text-white text-xl font-bold shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-3 touch-manipulation"
          >
            {copiedState === "json" ? <Check size={28} /> : <Clipboard size={28} />}
            {copiedState === "json" ? t("summary.copied") : t("summary.copy")}
          </motion.button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={exportPdf}
              className="py-5 bg-white/10 rounded-2xl text-white font-medium flex items-center justify-center gap-2 touch-manipulation text-lg"
            >
              <FileText size={22} />
              {t("summary.pdf")}
            </button>
            <button
              onClick={() => {
                const json = JSON.stringify(session, null, 2);
                downloadFile(`flow-testing-${session.testerName}.json`, json);
              }}
              className="py-5 bg-white/10 rounded-2xl text-white font-medium flex items-center justify-center gap-2 touch-manipulation text-lg"
            >
              <Download size={22} />
              {t("summary.download")}
            </button>
          </div>

          <button
            onClick={() => {
              const subject = encodeURIComponent(`Flow Testing Feedback - ${session.testerName}`);
              const body = encodeURIComponent(`Hallo,\n\nHier mein Flow Testing Feedback:\n\nDurchschnitt: ${stats?.avgOverall.toFixed(1)}/5\nEmpfohlen: ${stats?.recommended}/${stats?.total}\n\nFazit:\n${finalFeedback}\n\nDetails im Anhang.`);
              window.open(`mailto:?subject=${subject}&body=${body}`);
            }}
            className="w-full py-5 bg-white/5 rounded-2xl text-white/60 font-medium flex items-center justify-center gap-2 touch-manipulation text-lg"
          >
            <Mail size={22} />
            {t("summary.email")}
          </button>
        </div>
      </div>
    </div>
  );
}
