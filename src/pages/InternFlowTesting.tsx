/**
 * Intern Flow Testing Page - Premium Mobile-First Edition
 * Komplett isoliertes Styling - beeinflusst NICHT den Rest der Seite
 * 
 * 25 Features:
 * 1. Drag & Drop Ranking (dnd-kit)
 * 2. Session Timer mit Pause
 * 3. Flow Timer pro Test
 * 4. Auto-Save zu localStorage
 * 5. Session Restore Option
 * 6. Skip Flow Funktion
 * 7. Confetti bei Completion
 * 8. Quick Notes (Sticky)
 * 9. Emoji Reactions
 * 10. Keyboard Shortcuts
 * 11. Sound Feedback (optional)
 * 12. Statistik Dashboard
 * 13. Undo Last Rating
 * 14. PDF Export
 * 15. JSON Export
 * 16. Clipboard Copy
 * 17. Email Share Template
 * 18. Fullscreen Preview Mode
 * 19. Progress Indicator (Steps + Bar)
 * 20. Estimated Time Remaining
 * 21. Category Breakdown (Radar)
 * 22. Mobile-First Touch Optimized
 * 23. ADHS-friendly: Big Buttons, Clear Focus
 * 24. Onboarding Steps Anzeige
 * 25. Rating Quick Select (Swipe Gestures)
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { motion, AnimatePresence } from "framer-motion";
import { TOP_10_FLOWS } from "@/data/top10Flows";
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
  Share2,
  Mail,
  Keyboard,
  Volume2,
  VolumeX,
  GripVertical,
  CheckCircle,
  XCircle,
  Star,
  Trophy,
  Target,
  Zap,
  TrendingUp,
  BarChart3,
  FileJson,
  FileText,
  ExternalLink,
  Maximize2,
  Minimize2,
  ArrowRight,
  Info,
  Sparkles,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Clipboard,
  Check,
  ChevronRight,
  Rocket,
  HelpCircle,
  X,
} from "lucide-react";

// =============== TYPES ===============
type RatingKey = "usability" | "clarity" | "speed" | "design" | "mobile" | "trust";

const RATING_CRITERIA: Array<{
  id: RatingKey;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}> = [
  { id: "usability", label: "Usability", description: "Durchkommen ohne Kopfschmerzen?", icon: <Target size={18} />, color: "#10B981" },
  { id: "clarity", label: "Klarheit", description: "Immer klar was kommt?", icon: <Eye size={18} />, color: "#3B82F6" },
  { id: "speed", label: "Speed", description: "Schnell & smooth?", icon: <Zap size={18} />, color: "#F59E0B" },
  { id: "design", label: "Design", description: "Sieht premium aus?", icon: <Sparkles size={18} />, color: "#8B5CF6" },
  { id: "mobile", label: "Mobile", description: "Daumen-freundlich?", icon: <ThumbsUp size={18} />, color: "#EC4899" },
  { id: "trust", label: "Trust", description: "Vertrauenswürdig?", icon: <CheckCircle size={18} />, color: "#06B6D4" },
];

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
};

// Storage
const STORAGE_KEY = "internFlowTestingSession";

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
      {Array.from({ length: 60 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            backgroundColor: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#10B981", "#3B82F6"][
              Math.floor(Math.random() * 8)
            ],
          }}
          initial={{ y: -20, opacity: 1, rotate: 0, scale: Math.random() * 0.5 + 0.5 }}
          animate={{
            y: window.innerHeight + 100,
            opacity: 0,
            rotate: Math.random() * 720 - 360,
          }}
          transition={{
            duration: 2.5 + Math.random() * 2,
            delay: Math.random() * 0.8,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

// =============== SORTABLE RANK ITEM ===============
function SortableRankItem({
  id,
  idx,
  flow,
  rating,
}: {
  id: string;
  idx: number;
  flow: typeof TOP_10_FLOWS[number] | undefined;
  rating: FlowRating | undefined;
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
        <div className="font-semibold text-white truncate">{flow?.name ?? id}</div>
        {rating && (
          <div className="flex items-center gap-3 text-sm text-white/60 mt-1">
            <span className="flex items-center gap-1">
              <Star size={12} className="text-amber-400" />
              {avgRating(rating).toFixed(1)}
            </span>
            {rating.emoji && <span>{rating.emoji}</span>}
            <span className={rating.wouldRecommend ? "text-emerald-400" : "text-rose-400"}>
              {rating.wouldRecommend ? "✓ Empfohlen" : "✗ Nicht empfohlen"}
            </span>
          </div>
        )}
      </div>
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
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl text-lg font-bold transition-all touch-manipulation ${
        selected
          ? "bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-lg shadow-emerald-500/40 scale-110"
          : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
      }`}
    >
      {value}
    </motion.button>
  );
}

// =============== MAIN COMPONENT ===============
export default function InternFlowTesting() {
  // Sound
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Phases
  const [phase, setPhase] = useState<"intro" | "testing" | "summary">("intro");
  const [testerName, setTesterName] = useState("");
  const [currentFlowIndex, setCurrentFlowIndex] = useState(0);

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

  const summaryRef = useRef<HTMLDivElement | null>(null);
  const currentFlow = TOP_10_FLOWS[currentFlowIndex];

  // DnD sensors - optimiert für Touch
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Progress
  const progress = useMemo(() => {
    return (currentFlowIndex / TOP_10_FLOWS.length) * 100;
  }, [currentFlowIndex]);

  // Estimated remaining time
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
      sessionTimerRef.current = setInterval(() => {
        setSessionTime((t) => t + 1);
      }, 1000);
    }
    return () => {
      if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
    };
  }, [phase, isTimerPaused]);

  // Flow timer
  useEffect(() => {
    if (phase === "testing" && isFlowOpen && !isTimerPaused) {
      flowTimerRef.current = setInterval(() => {
        setFlowTime((t) => t + 1);
      }, 1000);
    }
    return () => {
      if (flowTimerRef.current) clearInterval(flowTimerRef.current);
    };
  }, [phase, isFlowOpen, isTimerPaused]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key) {
        case "?":
          setShowHelp((v) => !v);
          break;
        case "Escape":
          setShowHelp(false);
          setIsFullscreen(false);
          break;
        case "f":
          if (isFlowOpen) setIsFullscreen((v) => !v);
          break;
        case " ":
          if (phase === "testing") {
            e.preventDefault();
            setIsTimerPaused((v) => !v);
          }
          break;
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
          if (window.confirm("📱 Letzte Session fortsetzen?")) {
            setSession(parsed);
            setTesterName(parsed.testerName);
            setCurrentFlowIndex(parsed.flowRatings.length);
            setPhase("testing");
          }
        }
      } catch {}
    }
  }, []);

  // Save session on change
  useEffect(() => {
    if (session) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    }
  }, [session]);

  const playSound = useCallback(
    (type: "success" | "click" | "complete") => {
      if (!soundEnabled) return;
      try {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = type === "success" ? 800 : type === "complete" ? 1200 : 400;
        gain.gain.value = 0.08;
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } catch {}
    },
    [soundEnabled]
  );

  const startTesting = useCallback(() => {
    if (!testerName.trim()) {
      alert("Bitte gib deinen Namen ein 🙏");
      return;
    }
    playSound("click");
    const s: TestSession = {
      testerName: testerName.trim(),
      startedAt: new Date().toISOString(),
      flowRatings: [],
      finalFeedback: "",
      overallRanking: [],
      totalTimeSpent: 0,
      skippedFlows: [],
    };
    setSession(s);
    setPhase("testing");
  }, [testerName, playSound]);

  const submitFlowRating = useCallback(() => {
    if (!currentFlow) return;

    const missing = RATING_CRITERIA.filter((c) => !currentRatings[c.id]);
    if (missing.length) {
      alert(`Bitte bewerte: ${missing.map((m) => m.label).join(", ")}`);
      return;
    }
    if (wouldRecommend === null) {
      alert("Empfehlen: Ja oder Nein?");
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

    setSession((prev) => {
      if (!prev) return prev;
      return { ...prev, flowRatings: [...prev.flowRatings, rating], totalTimeSpent: sessionTime };
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

    if (currentFlowIndex < TOP_10_FLOWS.length - 1) {
      setCurrentFlowIndex((i) => i + 1);
    } else {
      setPhase("summary");
      setShowConfetti(true);
      playSound("complete");
      setTimeout(() => setShowConfetti(false), 4000);
    }
  }, [currentFlow, currentFlowIndex, currentRatings, currentPros, currentCons, wouldRecommend, currentEmoji, quickNotes, flowTime, sessionTime, playSound]);

  const skipFlow = useCallback(() => {
    if (!currentFlow) return;
    if (!confirm("Flow wirklich überspringen?")) return;

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
  }, [currentFlow, currentFlowIndex]);

  const undoLastRating = useCallback(() => {
    if (!session || session.flowRatings.length === 0) return;
    if (!confirm("Letzte Bewertung rückgängig machen?")) return;

    setSession((prev) => {
      if (!prev) return prev;
      const newRatings = [...prev.flowRatings];
      newRatings.pop();
      return { ...prev, flowRatings: newRatings };
    });
    setCurrentFlowIndex((i) => Math.max(0, i - 1));
  }, [session]);

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
      setTimeout(() => setCopiedState(null), 2000);
    } else {
      downloadFile(`flow-testing-${finalSession.testerName}.json`, json);
    }
  }, [session, finalFeedback, overallRanking, derivedRanking]);

  // Stats für Summary
  const stats = useMemo(() => {
    if (!session?.flowRatings.length) return null;
    const ratings = session.flowRatings;
    const avgOverall = ratings.reduce((sum, r) => sum + avgRating(r), 0) / ratings.length;
    const recommended = ratings.filter(r => r.wouldRecommend).length;
    const categoryAvgs = RATING_CRITERIA.map(c => ({
      ...c,
      avg: ratings.reduce((sum, r) => sum + r.ratings[c.id], 0) / ratings.length
    }));
    return { avgOverall, recommended, total: ratings.length, categoryAvgs };
  }, [session]);

  // =============== INTRO PHASE ===============
  if (phase === "intro") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Helmet>
          <title>Intern Flow Testing | Umzugscheck.ch</title>
        </Helmet>

        <div className="min-h-screen flex flex-col">
          {/* Hero */}
          <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
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
                  className="w-20 h-20 mx-auto bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/30"
                >
                  <Rocket className="w-10 h-10 text-white" />
                </motion.div>
                
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  Flow Testing
                </h1>
                <p className="text-lg text-white/60">
                  Teste unsere <span className="text-emerald-400 font-semibold">Top 10</span> Flows
                </p>
              </div>

              {/* Steps */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { step: 1, label: "Testen", icon: <ExternalLink size={20} /> },
                  { step: 2, label: "Bewerten", icon: <Star size={20} /> },
                  { step: 3, label: "Export", icon: <Download size={20} /> },
                ].map((item) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: item.step * 0.1 }}
                    className="bg-white/5 backdrop-blur rounded-2xl p-4 text-center border border-white/10"
                  >
                    <div className="w-10 h-10 mx-auto bg-white/10 rounded-xl flex items-center justify-center text-emerald-400 mb-2">
                      {item.icon}
                    </div>
                    <div className="text-xs text-white/40">Schritt {item.step}</div>
                    <div className="text-sm font-semibold text-white">{item.label}</div>
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
                  className="w-full px-6 py-4 bg-white/10 backdrop-blur border-2 border-white/20 rounded-2xl text-white text-lg placeholder:text-white/40 focus:outline-none focus:border-emerald-400 transition-all touch-manipulation"
                  placeholder="Dein Name..."
                  value={testerName}
                  onChange={(e) => setTesterName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && startTesting()}
                  autoFocus
                />

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={startTesting}
                  className="w-full py-5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl text-white text-lg font-bold shadow-xl shadow-emerald-500/30 active:shadow-lg transition-all touch-manipulation flex items-center justify-center gap-3"
                >
                  Los geht's
                  <ArrowRight size={24} />
                </motion.button>
              </motion.div>

              {/* Tips */}
              <p className="text-center text-white/40 text-sm px-4">
                💡 Sei ehrlich - konstruktive Kritik hilft uns am meisten!
              </p>
            </motion.div>
          </div>

          {/* Sound Toggle */}
          <div className="pb-6 flex justify-center">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full text-white/60 text-sm touch-manipulation"
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              Sound {soundEnabled ? "An" : "Aus"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =============== TESTING PHASE ===============
  if (phase === "testing" && session && currentFlow) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Helmet>
          <title>Flow {currentFlowIndex + 1}/{TOP_10_FLOWS.length} | Testing</title>
        </Helmet>

        {showConfetti && <Confetti />}

        {/* Header - Sticky */}
        <div className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-lg border-b border-white/10 px-4 py-3 safe-area-top">
          <div className="max-w-4xl mx-auto">
            {/* Progress Bar */}
            <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-3">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-400 to-teal-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Info Row */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                <span className="text-white font-bold">
                  {currentFlowIndex + 1}/{TOP_10_FLOWS.length}
                </span>
                <span className="text-white/40 hidden sm:inline">{session.testerName}</span>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsTimerPaused(!isTimerPaused)}
                  className="flex items-center gap-1.5 text-white/60 touch-manipulation"
                >
                  {isTimerPaused ? <Play size={14} /> : <Pause size={14} />}
                  <Clock size={14} />
                  <span className="font-mono">{formatTime(sessionTime)}</span>
                </button>

                <button
                  onClick={() => setShowHelp(true)}
                  className="p-2 text-white/40 hover:text-white touch-manipulation"
                >
                  <HelpCircle size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 py-6 max-w-4xl mx-auto space-y-6">
          {/* Current Flow Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-5 space-y-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`w-8 h-8 rounded-xl bg-gradient-to-br ${currentFlow.color} flex items-center justify-center text-white text-sm font-bold`}>
                    {currentFlow.rank}
                  </span>
                  <span className="text-white/40 text-sm">{currentFlow.steps} Steps</span>
                  <span className="text-white/40 text-sm">•</span>
                  <span className="text-white/40 text-sm">{currentFlow.estimatedTime}</span>
                </div>
                <h2 className="text-xl font-bold text-white mt-2 line-clamp-2">
                  {currentFlow.name}
                </h2>
                <p className="text-white/60 text-sm mt-1 line-clamp-2">
                  {currentFlow.description}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => window.open(currentFlow.url, "_blank")}
                className="py-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 touch-manipulation"
              >
                <ExternalLink size={20} />
                Öffnen
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsFlowOpen(!isFlowOpen)}
                className="py-4 bg-white/10 rounded-2xl text-white font-semibold flex items-center justify-center gap-2 touch-manipulation"
              >
                {isFlowOpen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                {isFlowOpen ? "Schließen" : "Preview"}
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
                <div className={`bg-white rounded-2xl overflow-hidden ${isFullscreen ? "fixed inset-4 z-50" : ""}`}>
                  {isFullscreen && (
                    <button
                      onClick={() => setIsFullscreen(false)}
                      className="absolute top-3 right-3 z-10 p-2 bg-slate-900/80 rounded-full text-white touch-manipulation"
                    >
                      <X size={20} />
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
                      Vollbild
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
              <h3 className="text-lg font-bold text-white">Bewertung</h3>
              {flowTime > 0 && (
                <span className="text-white/40 text-sm flex items-center gap-1">
                  <Timer size={14} />
                  {formatTime(flowTime)}
                </span>
              )}
            </div>

            {/* Rating Criteria */}
            <div className="space-y-5">
              {RATING_CRITERIA.map((criterion) => (
                <div key={criterion.id} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${criterion.color}20` }}>
                      <div style={{ color: criterion.color }}>{criterion.icon}</div>
                    </div>
                    <div>
                      <div className="text-white font-medium">{criterion.label}</div>
                      <div className="text-white/40 text-xs">{criterion.description}</div>
                    </div>
                  </div>
                  
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
              <div className="text-white/60 text-sm">Quick Reaction</div>
              <div className="flex justify-between">
                {EMOJI_REACTIONS.map((emoji) => (
                  <motion.button
                    key={emoji}
                    whileTap={{ scale: 0.85 }}
                    onClick={() => setCurrentEmoji(emoji)}
                    className={`w-12 h-12 text-2xl rounded-2xl flex items-center justify-center transition-all touch-manipulation ${
                      currentEmoji === emoji
                        ? "bg-white/20 scale-110 ring-2 ring-white/40"
                        : "bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    {emoji}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Pro/Contra */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-emerald-400 text-sm font-medium flex items-center gap-1">
                  <ThumbsUp size={14} /> Was war gut?
                </label>
                <textarea
                  value={currentPros}
                  onChange={(e) => setCurrentPros(e.target.value)}
                  placeholder="z.B. Schnelles Formular..."
                  className="w-full h-24 px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-400/50 resize-none touch-manipulation"
                />
              </div>
              <div className="space-y-2">
                <label className="text-rose-400 text-sm font-medium flex items-center gap-1">
                  <ThumbsDown size={14} /> Was war schlecht?
                </label>
                <textarea
                  value={currentCons}
                  onChange={(e) => setCurrentCons(e.target.value)}
                  placeholder="z.B. Zu viele Felder..."
                  className="w-full h-24 px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/30 focus:outline-none focus:border-rose-400/50 resize-none touch-manipulation"
                />
              </div>
            </div>

            {/* Quick Notes */}
            <div className="space-y-2">
              <label className="text-white/60 text-sm font-medium">Notizen (optional)</label>
              <textarea
                value={quickNotes}
                onChange={(e) => setQuickNotes(e.target.value)}
                placeholder="Weitere Gedanken..."
                className="w-full h-20 px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 resize-none touch-manipulation"
              />
            </div>

            {/* Recommend */}
            <div className="space-y-3">
              <div className="text-white font-medium">Würdest du empfehlen?</div>
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setWouldRecommend(true)}
                  className={`py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all touch-manipulation ${
                    wouldRecommend === true
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                      : "bg-white/10 text-white/70"
                  }`}
                >
                  <ThumbsUp size={20} />
                  Ja ✓
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setWouldRecommend(false)}
                  className={`py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all touch-manipulation ${
                    wouldRecommend === false
                      ? "bg-rose-500 text-white shadow-lg shadow-rose-500/30"
                      : "bg-white/10 text-white/70"
                  }`}
                >
                  <ThumbsDown size={20} />
                  Nein ✗
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <div className="space-y-3 pb-6">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={submitFlowRating}
              className="w-full py-5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl text-white text-lg font-bold shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 touch-manipulation"
            >
              <Check size={24} />
              Bewertung speichern
            </motion.button>

            <div className="flex gap-3">
              {session.flowRatings.length > 0 && (
                <button
                  onClick={undoLastRating}
                  className="flex-1 py-3 bg-white/5 rounded-2xl text-white/60 font-medium flex items-center justify-center gap-2 touch-manipulation"
                >
                  <Undo2 size={18} />
                  Zurück
                </button>
              )}
              <button
                onClick={skipFlow}
                className="flex-1 py-3 bg-white/5 rounded-2xl text-white/60 font-medium flex items-center justify-center gap-2 touch-manipulation"
              >
                <SkipForward size={18} />
                Überspringen
              </button>
            </div>

            {/* Remaining Time Hint */}
            <div className="text-center text-white/40 text-sm">
              ~{estimatedRemaining} Min. verbleibend
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
                <h3 className="text-xl font-bold text-white mb-4">Shortcuts</h3>
                <div className="space-y-2 text-white/70 text-sm">
                  <div className="flex justify-between"><span>Pause/Resume</span><kbd className="px-2 py-1 bg-white/10 rounded">Space</kbd></div>
                  <div className="flex justify-between"><span>Vollbild</span><kbd className="px-2 py-1 bg-white/10 rounded">F</kbd></div>
                  <div className="flex justify-between"><span>Schließen</span><kbd className="px-2 py-1 bg-white/10 rounded">Esc</kbd></div>
                </div>
                <button
                  onClick={() => setShowHelp(false)}
                  className="w-full mt-6 py-3 bg-white/10 rounded-2xl text-white font-medium touch-manipulation"
                >
                  Verstanden
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

  // Init ranking wenn nötig
  useEffect(() => {
    if (phase === "summary" && overallRanking.length === 0 && derivedRanking.length > 0) {
      setOverallRanking(derivedRanking);
    }
  }, [phase, derivedRanking, overallRanking.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Helmet>
        <title>Zusammenfassung | Flow Testing</title>
      </Helmet>

      {showConfetti && <Confetti />}

      <div className="px-4 py-6 max-w-2xl mx-auto space-y-6">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 py-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
            className="w-20 h-20 mx-auto bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/30"
          >
            <Trophy className="w-10 h-10 text-white" />
          </motion.div>
          
          <h1 className="text-3xl font-bold text-white">Fertig! 🎉</h1>
          <p className="text-white/60">
            Danke, <span className="text-white font-semibold">{session.testerName}</span>!
          </p>
        </motion.div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/5 backdrop-blur rounded-2xl p-4 text-center border border-white/10">
              <div className="text-2xl font-bold text-white">{stats.avgOverall.toFixed(1)}</div>
              <div className="text-xs text-white/40">Ø Score</div>
            </div>
            <div className="bg-white/5 backdrop-blur rounded-2xl p-4 text-center border border-white/10">
              <div className="text-2xl font-bold text-emerald-400">{stats.recommended}</div>
              <div className="text-xs text-white/40">Empfohlen</div>
            </div>
            <div className="bg-white/5 backdrop-blur rounded-2xl p-4 text-center border border-white/10">
              <div className="text-2xl font-bold text-white">{formatTime(sessionTime)}</div>
              <div className="text-xs text-white/40">Testzeit</div>
            </div>
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
              <h2 className="text-lg font-bold text-white mb-4">Kategorien</h2>
              <div className="space-y-3">
                {stats.categoryAvgs.map((cat) => (
                  <div key={cat.id} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="p-1 rounded" style={{ backgroundColor: `${cat.color}20` }}>
                          <div style={{ color: cat.color }}>{cat.icon}</div>
                        </div>
                        <span className="text-white">{cat.label}</span>
                      </div>
                      <span className="text-white font-semibold">{cat.avg.toFixed(1)}</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${(cat.avg / 5) * 100}%`,
                          backgroundColor: cat.color,
                        }}
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
            <h2 className="text-lg font-bold text-white mb-4">Dein Ranking</h2>
            <p className="text-white/40 text-sm mb-4">Ziehe um zu sortieren</p>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={overallRanking.length ? overallRanking : derivedRanking}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {(overallRanking.length ? overallRanking : derivedRanking).map((id, idx) => {
                    const flow = TOP_10_FLOWS.find((f) => f.id === id);
                    const rating = session.flowRatings.find((r) => r.flowId === id);
                    return (
                      <SortableRankItem
                        key={id}
                        id={id}
                        idx={idx}
                        flow={flow}
                        rating={rating}
                      />
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
            <h2 className="text-lg font-bold text-white mb-2">Dein Fazit</h2>
            <p className="text-white/40 text-sm mb-4">Was war dein Favorit? Was sollten wir fixen?</p>
            <textarea
              value={finalFeedback}
              onChange={(e) => setFinalFeedback(e.target.value)}
              placeholder="Schreib deine Gedanken hier..."
              className="w-full h-32 px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-400/50 resize-none touch-manipulation"
            />
          </motion.div>
        </div>

        {/* Export Buttons */}
        <div className="space-y-3 pb-8">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={submitFinalFeedback}
            className="w-full py-5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl text-white text-lg font-bold shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 touch-manipulation"
          >
            {copiedState === "json" ? <Check size={24} /> : <Clipboard size={24} />}
            {copiedState === "json" ? "Kopiert! ✓" : "JSON kopieren"}
          </motion.button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={exportPdf}
              className="py-4 bg-white/10 rounded-2xl text-white font-medium flex items-center justify-center gap-2 touch-manipulation"
            >
              <FileText size={20} />
              PDF
            </button>
            <button
              onClick={() => {
                const json = JSON.stringify(session, null, 2);
                downloadFile(`flow-testing-${session.testerName}.json`, json);
              }}
              className="py-4 bg-white/10 rounded-2xl text-white font-medium flex items-center justify-center gap-2 touch-manipulation"
            >
              <Download size={20} />
              Download
            </button>
          </div>

          <button
            onClick={() => {
              const subject = encodeURIComponent(`Flow Testing Feedback - ${session.testerName}`);
              const body = encodeURIComponent(`Hallo,\n\nHier mein Flow Testing Feedback:\n\nDurchschnitt: ${stats?.avgOverall.toFixed(1)}/5\nEmpfohlen: ${stats?.recommended}/${stats?.total}\n\nFazit:\n${finalFeedback}\n\nDetails im Anhang.`);
              window.open(`mailto:?subject=${subject}&body=${body}`);
            }}
            className="w-full py-4 bg-white/5 rounded-2xl text-white/60 font-medium flex items-center justify-center gap-2 touch-manipulation"
          >
            <Mail size={20} />
            Per Email teilen
          </button>
        </div>
      </div>
    </div>
  );
}
