/**
 * Intern Flow Testing Page - Enhanced Version
 * 
 * Features:
 * - Drag & Drop Ranking (dnd-kit)
 * - Session Timer
 * - Flow Timer
 * - Progress Persistence
 * - Skip Flow Option
 * - Confetti on Completion
 * - Statistics Dashboard
 * - Comparison Charts
 * - Quick Notes
 * - Keyboard Shortcuts
 * - Dark/Light Mode
 * - Emoji Reactions
 * - Undo Last Rating
 * - Email/Share Export
 * - Accessibility Improvements
 * - Mobile Optimized
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
  Sun,
  Moon,
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
  ArrowLeft,
  ArrowRight,
  Info,
  Sparkles,
  Clock,
  Users,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  StickyNote,
  Eye,
  Clipboard,
  Check,
} from "lucide-react";

type RatingKey = "usability" | "clarity" | "speed" | "design" | "mobile" | "trust";

const RATING_CRITERIA: Array<{
  id: RatingKey;
  label: string;
  description: string;
  icon: React.ReactNode;
}> = [
  { id: "usability", label: "Usability", description: "Wie leicht ist es, durchzukommen?", icon: <Target size={16} /> },
  { id: "clarity", label: "Klarheit", description: "Ist immer klar, was als Nächstes passiert?", icon: <Eye size={16} /> },
  { id: "speed", label: "Speed", description: "Fühlt es sich schnell & frictionless an?", icon: <Zap size={16} /> },
  { id: "design", label: "Design", description: "Wirkt es hochwertig und konsistent?", icon: <Sparkles size={16} /> },
  { id: "mobile", label: "Mobile", description: "Thumb-Zone, Inputs, Scrolling, Safe-Areas.", icon: <Users size={16} /> },
  { id: "trust", label: "Trust", description: "Badges, Transparenz, keine 'Sus'-Vibes.", icon: <CheckCircle size={16} /> },
];

const EMOJI_REACTIONS = ["🔥", "💯", "👍", "😐", "👎", "💀"];

type FlowRating = {
  flowId: string;
  ratings: Record<RatingKey, number>;
  pros: string;
  cons: string;
  wouldRecommend: boolean;
  completedAt: string;
  timeSpent: number; // seconds
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
  meta?: {
    userAgent?: string;
    viewport?: { w: number; h: number };
    darkMode?: boolean;
  };
};

// Storage keys
const STORAGE_KEY = "internFlowTestingSession";
const THEME_KEY = "internFlowTestingTheme";

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

// Confetti component
function Confetti() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            backgroundColor: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD"][
              Math.floor(Math.random() * 6)
            ],
          }}
          initial={{ y: -20, opacity: 1, rotate: 0 }}
          animate={{
            y: window.innerHeight + 20,
            opacity: 0,
            rotate: Math.random() * 720 - 360,
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            delay: Math.random() * 0.5,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

// Sortable Ranking Item
function SortableRankItem({
  id,
  idx,
  flow,
  rating,
  isDark,
}: {
  id: string;
  idx: number;
  flow: typeof TOP_10_FLOWS[number] | undefined;
  rating: FlowRating | undefined;
  isDark: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between rounded-xl p-3 transition-colors ${
        isDragging
          ? isDark
            ? "bg-slate-700 shadow-xl"
            : "bg-slate-200 shadow-xl"
          : isDark
          ? "bg-slate-950/50 hover:bg-slate-900"
          : "bg-slate-100 hover:bg-slate-200"
      }`}
    >
      <div className="flex items-center gap-3">
        <button
          {...attributes}
          {...listeners}
          className={`cursor-grab active:cursor-grabbing p-1 rounded ${
            isDark ? "hover:bg-slate-800" : "hover:bg-slate-300"
          }`}
        >
          <GripVertical size={18} className="text-slate-400" />
        </button>
        <div
          className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold ${
            idx < 3
              ? "bg-gradient-to-br from-yellow-500 to-amber-600 text-white"
              : isDark
              ? "bg-slate-800 text-slate-400"
              : "bg-slate-300 text-slate-600"
          }`}
        >
          {idx + 1}
        </div>
        <div>
          <div className="font-semibold text-sm">{flow?.name ?? id}</div>
          {rating && (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>⭐ {avgRating(rating).toFixed(1)}</span>
              {rating.emoji && <span>{rating.emoji}</span>}
            </div>
          )}
        </div>
      </div>
      {rating && (
        <div className={`text-xs ${rating.wouldRecommend ? "text-emerald-400" : "text-rose-400"}`}>
          {rating.wouldRecommend ? <ThumbsUp size={14} /> : <ThumbsDown size={14} />}
        </div>
      )}
    </div>
  );
}

export default function InternFlowTesting() {
  // Theme
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem(THEME_KEY);
    return saved ? saved === "dark" : true;
  });

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
  const [showQuickNotes, setShowQuickNotes] = useState(false);

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
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [copiedState, setCopiedState] = useState<string | null>(null);

  const summaryRef = useRef<HTMLDivElement | null>(null);

  const currentFlow = TOP_10_FLOWS[currentFlowIndex];

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Progress calculation
  const progress = useMemo(() => {
    const base = currentFlowIndex / TOP_10_FLOWS.length;
    const bonus = isFlowOpen ? 0.5 / TOP_10_FLOWS.length : 0;
    return Math.min(100, (base + bonus) * 100);
  }, [currentFlowIndex, isFlowOpen]);

  // Estimated remaining time
  const estimatedRemaining = useMemo(() => {
    const remaining = TOP_10_FLOWS.length - currentFlowIndex;
    const avgTimePerFlow = session?.flowRatings.length
      ? session.flowRatings.reduce((sum, r) => sum + r.timeSpent, 0) / session.flowRatings.length
      : 180; // 3 min default
    return Math.round((remaining * avgTimePerFlow) / 60);
  }, [currentFlowIndex, session]);

  // Theme effect
  useEffect(() => {
    localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

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
          setShowKeyboardShortcuts((v) => !v);
          break;
        case "Escape":
          setShowKeyboardShortcuts(false);
          setIsFullscreen(false);
          break;
        case "f":
          if (isFlowOpen) setIsFullscreen((v) => !v);
          break;
        case "n":
          setShowQuickNotes((v) => !v);
          break;
        case "d":
          setIsDark((v) => !v);
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
          if (window.confirm("Möchtest du deine letzte Session fortsetzen?")) {
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
      // Simple beep using Web Audio API
      try {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = type === "success" ? 800 : type === "complete" ? 1200 : 400;
        gain.gain.value = 0.1;
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } catch {}
    },
    [soundEnabled]
  );

  const startTesting = useCallback(() => {
    if (!testerName.trim()) {
      alert("Bitte gib deinen Namen ein.");
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
      meta: {
        userAgent: navigator.userAgent,
        viewport: { w: window.innerWidth, h: window.innerHeight },
        darkMode: isDark,
      },
    };
    setSession(s);
    setPhase("testing");
  }, [testerName, isDark, playSound]);

  const submitFlowRating = useCallback(() => {
    if (!currentFlow) return;

    const missing = RATING_CRITERIA.filter((c) => !currentRatings[c.id]);
    if (missing.length) {
      alert(`Bitte bewerte alle Kriterien: ${missing.map((m) => m.label).join(", ")}`);
      return;
    }
    if (wouldRecommend === null) {
      alert("Bitte gib an, ob du den Flow weiterempfehlen würdest.");
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
      return {
        ...prev,
        flowRatings: [...prev.flowRatings, rating],
        totalTimeSpent: sessionTime,
      };
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
      playSound("complete");
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      setPhase("summary");
    }
  }, [
    currentFlow,
    currentFlowIndex,
    currentRatings,
    currentPros,
    currentCons,
    wouldRecommend,
    flowTime,
    quickNotes,
    currentEmoji,
    sessionTime,
    playSound,
  ]);

  const skipFlow = useCallback(() => {
    if (!currentFlow) return;
    if (!window.confirm(`Flow "${currentFlow.name}" wirklich überspringen?`)) return;

    setSession((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        skippedFlows: [...prev.skippedFlows, currentFlow.id],
      };
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
    if (!window.confirm("Letzte Bewertung rückgängig machen?")) return;

    setSession((prev) => {
      if (!prev) return prev;
      const ratings = [...prev.flowRatings];
      ratings.pop();
      return { ...prev, flowRatings: ratings };
    });
    setCurrentFlowIndex((i) => Math.max(0, i - 1));
  }, [session]);

  const derivedRanking = useMemo(() => {
    if (!session?.flowRatings?.length) return [];
    const sorted = [...session.flowRatings].sort((a, b) => avgRating(b) - avgRating(a));
    return sorted.map((r) => r.flowId);
  }, [session]);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const ranking = overallRanking.length ? overallRanking : derivedRanking;
      const oldIndex = ranking.indexOf(active.id as string);
      const newIndex = ranking.indexOf(over.id as string);
      setOverallRanking(arrayMove(ranking, oldIndex, newIndex));
    },
    [overallRanking, derivedRanking]
  );

  const exportPdf = useCallback(async () => {
    if (!summaryRef.current) return;
    const canvas = await html2canvas(summaryRef.current, { scale: 2, backgroundColor: isDark ? "#0f172a" : "#ffffff" });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();

    const imgW = pageW;
    const imgH = (canvas.height * imgW) / canvas.width;

    if (imgH <= pageH) {
      pdf.addImage(imgData, "PNG", 0, 0, imgW, imgH);
    } else {
      let remaining = imgH;
      let position = 0;
      while (remaining > 0) {
        pdf.addImage(imgData, "PNG", 0, position, imgW, imgH);
        remaining -= pageH;
        position -= pageH;
        if (remaining > 0) pdf.addPage();
      }
    }

    pdf.save(`umzugscheck-intern-feedback-${session?.testerName || "tester"}.pdf`);
  }, [session?.testerName, isDark]);

  const exportJson = useCallback(async () => {
    if (!session) return;

    const finalSession: TestSession = {
      ...session,
      finalFeedback: finalFeedback.trim(),
      overallRanking: overallRanking.length ? overallRanking : derivedRanking,
      completedAt: new Date().toISOString(),
      totalTimeSpent: sessionTime,
    };

    const json = JSON.stringify(finalSession, null, 2);
    const copied = await copyToClipboard(json);

    if (copied) {
      setCopiedState("json");
      setTimeout(() => setCopiedState(null), 2000);
    } else {
      downloadFile(`umzugscheck-intern-feedback-${finalSession.testerName}.json`, json);
    }
  }, [session, finalFeedback, overallRanking, derivedRanking, sessionTime]);

  const shareByEmail = useCallback(() => {
    if (!session) return;

    const subject = encodeURIComponent(`Flow Testing Feedback - ${session.testerName}`);
    const body = encodeURIComponent(
      `Hallo,\n\nAnbei mein Flow Testing Feedback:\n\n` +
        `Tester: ${session.testerName}\n` +
        `Flows getestet: ${session.flowRatings.length}\n` +
        `Gesamtzeit: ${formatTime(sessionTime)}\n\n` +
        `Bitte JSON-Datei anhängen für Details.\n\nGruss`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
  }, [session, sessionTime]);

  // Statistics
  const stats = useMemo(() => {
    if (!session?.flowRatings.length) return null;

    const ratings = session.flowRatings;
    const allAvgs = ratings.map(avgRating);
    const avgOverall = allAvgs.reduce((a, b) => a + b, 0) / allAvgs.length;
    const recommended = ratings.filter((r) => r.wouldRecommend).length;

    const byCategory: Record<RatingKey, number> = {} as any;
    RATING_CRITERIA.forEach((c) => {
      const vals = ratings.map((r) => r.ratings[c.id]).filter(Boolean);
      byCategory[c.id] = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
    });

    return {
      avgOverall,
      recommended,
      total: ratings.length,
      byCategory,
      totalTime: sessionTime,
    };
  }, [session, sessionTime]);

  const themeClasses = isDark
    ? {
        bg: "bg-slate-950",
        card: "bg-slate-900/60 border-slate-800",
        cardHover: "hover:bg-slate-800/80",
        input: "bg-slate-950 border-slate-700 focus:border-slate-500",
        text: "text-white",
        textMuted: "text-slate-400",
        button: "bg-white text-slate-950 hover:bg-slate-100",
        buttonSecondary: "bg-slate-950 border-slate-700 hover:bg-slate-900",
      }
    : {
        bg: "bg-slate-50",
        card: "bg-white border-slate-200 shadow-sm",
        cardHover: "hover:bg-slate-50",
        input: "bg-white border-slate-300 focus:border-slate-400",
        text: "text-slate-900",
        textMuted: "text-slate-500",
        button: "bg-slate-900 text-white hover:bg-slate-800",
        buttonSecondary: "bg-white border-slate-300 hover:bg-slate-50",
      };

  // ---------- Intro Phase ----------
  if (phase === "intro") {
    return (
      <div className={`min-h-screen ${themeClasses.bg} ${themeClasses.text}`}>
        <Helmet>
          <title>Intern Flow Testing | Umzugscheck.ch</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>

        {/* Theme toggle */}
        <div className="fixed top-4 right-4 z-50 flex gap-2">
          <button
            onClick={() => setIsDark(!isDark)}
            className={`p-2 rounded-xl border transition-colors ${themeClasses.buttonSecondary}`}
            title="Theme wechseln (D)"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl border transition-colors ${themeClasses.buttonSecondary}`}
            title="Sound"
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
        </div>

        <div className="mx-auto max-w-4xl px-4 py-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600">
                <Clipboard size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Intern Flow Testing</h1>
                <p className={`${themeClasses.textMuted}`}>
                  Teste unsere <span className="font-semibold">Top 10</span> Umzugsofferten-Flows
                </p>
              </div>
            </div>
          </motion.div>

          {/* How it works */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`mt-8 rounded-2xl border p-6 ${themeClasses.card}`}
          >
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Info size={20} className="text-blue-500" />
              So funktioniert's
            </h2>
            <ol className="mt-4 grid gap-4 md:grid-cols-3">
              {[
                { icon: <Play size={20} />, title: "Flow testen", desc: "Öffnen, durchgehen, Gefühl notieren." },
                { icon: <Star size={20} />, title: "Bewerten", desc: "6 Kriterien + Pro/Contra + Emoji." },
                { icon: <Download size={20} />, title: "Export", desc: "JSON kopieren + PDF speichern." },
              ].map((step, i) => (
                <li
                  key={i}
                  className={`rounded-xl p-4 border ${isDark ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-200"}`}
                >
                  <div className="flex items-center gap-2 text-emerald-500">
                    <span className="text-lg font-bold">{i + 1}</span>
                    {step.icon}
                  </div>
                  <div className="mt-2 font-semibold">{step.title}</div>
                  <div className={`mt-1 text-sm ${themeClasses.textMuted}`}>{step.desc}</div>
                </li>
              ))}
            </ol>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`mt-6 rounded-2xl border p-6 ${themeClasses.card}`}
          >
            <h2 className="text-lg font-semibold mb-4">✨ Features</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              {[
                "⏱️ Timer pro Flow",
                "🎯 6 Bewertungskriterien",
                "😀 Emoji Reactions",
                "📝 Quick Notes",
                "↕️ Drag & Drop Ranking",
                "📊 Statistiken",
                "🌙 Dark/Light Mode",
                "⌨️ Keyboard Shortcuts",
                "💾 Auto-Save",
                "📄 PDF Export",
                "📋 JSON Export",
                "📧 Email-Share",
              ].map((feature) => (
                <div key={feature} className={`p-2 rounded-lg ${isDark ? "bg-slate-800/50" : "bg-slate-100"}`}>
                  {feature}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Top 10 Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`mt-6 rounded-2xl border p-6 ${themeClasses.card}`}
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Trophy size={20} className="text-yellow-500" />
              Top 10 Flows zum Testen
            </h2>
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
              {TOP_10_FLOWS.map((flow) => (
                <motion.div
                  key={flow.id}
                  whileHover={{ scale: 1.01 }}
                  className={`flex items-center gap-4 p-3 rounded-xl border transition-colors ${
                    isDark ? "bg-slate-900 border-slate-800 hover:bg-slate-800" : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${flow.color} text-white font-bold text-lg shrink-0`}
                  >
                    {flow.rank}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{flow.name}</p>
                    <p className={`text-sm truncate ${themeClasses.textMuted}`}>{flow.description}</p>
                  </div>
                  <div className={`text-sm shrink-0 flex items-center gap-1 ${themeClasses.textMuted}`}>
                    <Clock size={14} />
                    {flow.estimatedTime}
                  </div>
                </motion.div>
              ))}
            </div>
            <div className={`mt-4 p-3 rounded-xl ${isDark ? "bg-blue-500/10 border border-blue-500/20" : "bg-blue-50 border border-blue-200"}`}>
              <p className="text-sm flex items-center gap-2">
                <Clock size={16} className="text-blue-500" />
                <span>Geschätzte Gesamtdauer: ca. 30-45 Minuten</span>
              </p>
            </div>
          </motion.div>

          {/* Name Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`mt-6 rounded-2xl border p-6 ${themeClasses.card}`}
          >
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Users size={20} className="text-purple-500" />
              Dein Name
            </h2>
            <div className="mt-4 flex gap-3">
              <input
                className={`w-full rounded-xl border px-4 py-3 outline-none transition-colors ${themeClasses.input}`}
                placeholder="Vorname Nachname"
                value={testerName}
                onChange={(e) => setTesterName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && startTesting()}
              />
              <button
                className={`rounded-xl px-6 py-3 font-semibold transition-colors flex items-center gap-2 ${themeClasses.button}`}
                onClick={startTesting}
              >
                <Play size={18} />
                Test starten
              </button>
            </div>
            <p className={`mt-3 text-xs ${themeClasses.textMuted}`}>
              💡 Tipp: Mach's ehrlich — wenn's nervt, dann nervt's. Wir wollen's killen, nicht schönreden.
            </p>
            <p className={`mt-1 text-xs ${themeClasses.textMuted}`}>
              ⌨️ Drücke <kbd className={`px-1.5 py-0.5 rounded ${isDark ? "bg-slate-800" : "bg-slate-200"}`}>?</kbd> für
              Keyboard Shortcuts
            </p>
          </motion.div>
        </div>

        {/* Keyboard shortcuts modal */}
        <AnimatePresence>
          {showKeyboardShortcuts && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowKeyboardShortcuts(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className={`rounded-2xl border p-6 max-w-md w-full ${themeClasses.card} ${themeClasses.bg}`}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                  <Keyboard size={20} />
                  Keyboard Shortcuts
                </h3>
                <div className="space-y-2 text-sm">
                  {[
                    ["?", "Shortcuts anzeigen"],
                    ["Esc", "Schliessen / Vollbild beenden"],
                    ["F", "Vollbild toggle"],
                    ["N", "Quick Notes toggle"],
                    ["D", "Dark/Light Mode"],
                    ["Space", "Timer pausieren"],
                  ].map(([key, desc]) => (
                    <div key={key} className="flex items-center justify-between">
                      <kbd className={`px-2 py-1 rounded font-mono ${isDark ? "bg-slate-800" : "bg-slate-200"}`}>{key}</kbd>
                      <span className={themeClasses.textMuted}>{desc}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ---------- Testing Phase ----------
  if (phase === "testing" && session && currentFlow) {
    return (
      <div className={`min-h-screen ${themeClasses.bg} ${themeClasses.text}`}>
        <Helmet>
          <title>
            Flow {currentFlowIndex + 1}/10 | Testing | Umzugscheck.ch
          </title>
        </Helmet>

        {/* Header */}
        <div className={`sticky top-0 z-40 border-b ${themeClasses.card} backdrop-blur-xl`}>
          <div className="mx-auto max-w-6xl px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-4">
                <div className={`text-sm ${themeClasses.textMuted}`}>{session.testerName}</div>
                <div className="text-lg font-bold">
                  Flow {currentFlowIndex + 1}/{TOP_10_FLOWS.length}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* Timers */}
                <div className={`flex items-center gap-2 text-sm ${themeClasses.textMuted}`}>
                  <Timer size={14} />
                  <span title="Session-Zeit">{formatTime(sessionTime)}</span>
                  {isFlowOpen && (
                    <>
                      <span>/</span>
                      <span title="Flow-Zeit" className="text-emerald-500">
                        {formatTime(flowTime)}
                      </span>
                    </>
                  )}
                </div>
                <button
                  onClick={() => setIsTimerPaused(!isTimerPaused)}
                  className={`p-1.5 rounded-lg transition-colors ${themeClasses.buttonSecondary} border`}
                  title="Timer pausieren (Space)"
                >
                  {isTimerPaused ? <Play size={14} /> : <Pause size={14} />}
                </button>
                <div className={`px-2 py-1 rounded-lg text-xs ${isDark ? "bg-emerald-500/20 text-emerald-400" : "bg-emerald-100 text-emerald-700"}`}>
                  {session.flowRatings.length} bewertet
                </div>
                <button
                  onClick={() => setIsDark(!isDark)}
                  className={`p-1.5 rounded-lg border transition-colors ${themeClasses.buttonSecondary}`}
                >
                  {isDark ? <Sun size={14} /> : <Moon size={14} />}
                </button>
              </div>
            </div>
            {/* Progress bar */}
            <div className={`mt-2 h-2 w-full rounded-full ${isDark ? "bg-slate-800" : "bg-slate-200"}`}>
              <motion.div
                className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className={`mt-1 text-xs ${themeClasses.textMuted} flex justify-between`}>
              <span>~{estimatedRemaining} Min. verbleibend</span>
              <span>{Math.round(progress)}% abgeschlossen</span>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 py-6">
          {/* Flow Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl border p-6 ${themeClasses.card}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div
                  className={`flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${currentFlow.color} text-white font-bold text-xl shadow-lg shrink-0`}
                >
                  #{currentFlow.rank}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{currentFlow.name}</h2>
                  <p className={`text-sm ${themeClasses.textMuted}`}>{currentFlow.description}</p>
                  <div className={`flex items-center gap-4 mt-2 text-sm ${themeClasses.textMuted}`}>
                    <span className="flex items-center gap-1">
                      <Zap size={14} />
                      {currentFlow.steps} Steps
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {currentFlow.estimatedTime}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  className={`rounded-xl px-4 py-2 font-semibold transition-colors flex items-center gap-2 ${themeClasses.button}`}
                  onClick={() => window.open(currentFlow.url, "_blank", "noopener,noreferrer")}
                >
                  <ExternalLink size={16} />
                  Neuer Tab
                </button>
                <button
                  className={`rounded-xl border px-4 py-2 font-semibold transition-colors flex items-center gap-2 ${themeClasses.buttonSecondary}`}
                  onClick={() => {
                    setIsFlowOpen(!isFlowOpen);
                    if (!isFlowOpen) setFlowTime(0);
                  }}
                >
                  {isFlowOpen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                  {isFlowOpen ? "Schliessen" : "Hier öffnen"}
                </button>
              </div>
            </div>

            {currentFlow.reason && (
              <div className={`mt-4 p-3 rounded-xl ${isDark ? "bg-blue-500/10 border border-blue-500/20" : "bg-blue-50 border border-blue-200"}`}>
                <p className="text-sm">
                  <strong>💡 Warum dieser Flow?</strong> {currentFlow.reason}
                </p>
              </div>
            )}

            {/* Quick actions */}
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => setShowQuickNotes(!showQuickNotes)}
                className={`text-xs px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-colors ${themeClasses.buttonSecondary}`}
              >
                <StickyNote size={12} />
                Quick Notes (N)
              </button>
              <button
                onClick={skipFlow}
                className={`text-xs px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-colors ${themeClasses.buttonSecondary}`}
              >
                <SkipForward size={12} />
                Überspringen
              </button>
              {session.flowRatings.length > 0 && (
                <button
                  onClick={undoLastRating}
                  className={`text-xs px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-colors ${themeClasses.buttonSecondary}`}
                >
                  <Undo2 size={12} />
                  Letzte rückgängig
                </button>
              )}
            </div>

            {/* Quick notes */}
            <AnimatePresence>
              {showQuickNotes && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4">
                    <label className={`text-sm font-medium ${themeClasses.textMuted}`}>
                      📝 Schnelle Notizen (werden gespeichert)
                    </label>
                    <textarea
                      className={`mt-2 w-full rounded-xl border p-3 outline-none transition-colors ${themeClasses.input}`}
                      rows={2}
                      value={quickNotes}
                      onChange={(e) => setQuickNotes(e.target.value)}
                      placeholder="Erste Eindrücke, Bugs, Ideen..."
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Preview & Rating */}
          <AnimatePresence mode="wait">
            {isFlowOpen ? (
              <motion.div
                key="flow-open"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-6 grid gap-6 lg:grid-cols-2"
              >
                {/* Preview */}
                <div
                  className={`rounded-2xl border p-4 ${themeClasses.card} ${isFullscreen ? "lg:col-span-2" : ""}`}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="font-semibold flex items-center gap-2">
                      <Eye size={16} />
                      Flow-Preview
                    </div>
                    <div className="flex gap-2">
                      <button
                        className={`rounded-lg border px-3 py-1 text-sm transition-colors ${themeClasses.buttonSecondary}`}
                        onClick={() => setIsFullscreen(!isFullscreen)}
                      >
                        {isFullscreen ? "Verkleinern (F)" : "Vollbild (F)"}
                      </button>
                    </div>
                  </div>
                  <div className={`overflow-hidden rounded-xl border ${isDark ? "border-slate-700" : "border-slate-300"}`}>
                    <iframe
                      title={currentFlow.id}
                      src={currentFlow.url}
                      className="h-[600px] w-full bg-white"
                    />
                  </div>
                </div>

                {/* Rating Form */}
                {!isFullscreen && (
                  <div className={`rounded-2xl border p-6 ${themeClasses.card}`}>
                    <div className="text-xl font-bold flex items-center gap-2">
                      <Star size={20} className="text-yellow-500" />
                      Bewertung
                    </div>
                    <p className={`mt-1 text-sm ${themeClasses.textMuted}`}>1 = schlecht, 5 = exzellent</p>

                    <div className="mt-6 space-y-4">
                      {/* Ratings */}
                      {RATING_CRITERIA.map((c) => (
                        <div
                          key={c.id}
                          className={`rounded-xl p-4 border ${isDark ? "bg-slate-950/50 border-slate-800" : "bg-slate-50 border-slate-200"}`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <span className="text-emerald-500">{c.icon}</span>
                              <div>
                                <div className="font-semibold text-sm">{c.label}</div>
                                <div className={`text-xs ${themeClasses.textMuted}`}>{c.description}</div>
                              </div>
                            </div>
                            <div className="flex gap-1.5">
                              {[1, 2, 3, 4, 5].map((v) => (
                                <button
                                  key={v}
                                  className={`h-8 w-8 rounded-lg border text-sm font-semibold transition-all ${
                                    currentRatings[c.id] === v
                                      ? "border-emerald-500 bg-emerald-500 text-white scale-110"
                                      : isDark
                                      ? "border-slate-700 bg-slate-950 hover:border-slate-500"
                                      : "border-slate-300 bg-white hover:border-slate-400"
                                  }`}
                                  onClick={() => {
                                    playSound("click");
                                    setCurrentRatings((prev) => ({ ...prev, [c.id]: v }));
                                  }}
                                >
                                  {v}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Emoji reaction */}
                      <div>
                        <label className={`text-sm font-semibold ${themeClasses.textMuted}`}>
                          Quick Reaction (optional)
                        </label>
                        <div className="mt-2 flex gap-2 flex-wrap">
                          {EMOJI_REACTIONS.map((emoji) => (
                            <button
                              key={emoji}
                              onClick={() => setCurrentEmoji(currentEmoji === emoji ? undefined : emoji)}
                              className={`text-2xl p-2 rounded-xl border transition-all ${
                                currentEmoji === emoji
                                  ? "border-emerald-500 bg-emerald-500/20 scale-110"
                                  : isDark
                                  ? "border-slate-700 hover:border-slate-500"
                                  : "border-slate-200 hover:border-slate-400"
                              }`}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Pros & Cons */}
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="text-sm font-semibold flex items-center gap-1">
                            <ThumbsUp size={14} className="text-emerald-500" />
                            Was war gut?
                          </label>
                          <textarea
                            className={`mt-2 w-full rounded-xl border p-3 outline-none transition-colors text-sm ${themeClasses.input}`}
                            rows={3}
                            value={currentPros}
                            onChange={(e) => setCurrentPros(e.target.value)}
                            placeholder="Positive Punkte..."
                          />
                        </div>
                        <div>
                          <label className="text-sm font-semibold flex items-center gap-1">
                            <ThumbsDown size={14} className="text-rose-500" />
                            Was war schlecht?
                          </label>
                          <textarea
                            className={`mt-2 w-full rounded-xl border p-3 outline-none transition-colors text-sm ${themeClasses.input}`}
                            rows={3}
                            value={currentCons}
                            onChange={(e) => setCurrentCons(e.target.value)}
                            placeholder="Negative Punkte..."
                          />
                        </div>
                      </div>

                      {/* Would recommend */}
                      <div>
                        <div className="text-sm font-semibold">Würdest du den Flow weiterempfehlen?</div>
                        <div className="mt-2 flex gap-2">
                          <button
                            className={`flex-1 rounded-xl border px-4 py-3 font-semibold transition-all flex items-center justify-center gap-2 ${
                              wouldRecommend === true
                                ? "border-emerald-500 bg-emerald-500/20 text-emerald-400"
                                : isDark
                                ? "border-slate-700 bg-slate-950 hover:border-slate-500"
                                : "border-slate-300 bg-white hover:border-slate-400"
                            }`}
                            onClick={() => setWouldRecommend(true)}
                          >
                            <ThumbsUp size={18} />
                            Ja
                          </button>
                          <button
                            className={`flex-1 rounded-xl border px-4 py-3 font-semibold transition-all flex items-center justify-center gap-2 ${
                              wouldRecommend === false
                                ? "border-rose-500 bg-rose-500/20 text-rose-400"
                                : isDark
                                ? "border-slate-700 bg-slate-950 hover:border-slate-500"
                                : "border-slate-300 bg-white hover:border-slate-400"
                            }`}
                            onClick={() => setWouldRecommend(false)}
                          >
                            <ThumbsDown size={18} />
                            Nein
                          </button>
                        </div>
                      </div>

                      {/* Submit */}
                      <div className="flex gap-2 pt-2">
                        <button
                          className={`flex-1 rounded-xl border px-4 py-3 font-semibold transition-colors ${themeClasses.buttonSecondary}`}
                          onClick={() => setIsFlowOpen(false)}
                        >
                          <ArrowLeft size={16} className="inline mr-2" />
                          Zurück
                        </button>
                        <button
                          className={`flex-1 rounded-xl px-4 py-3 font-semibold transition-colors ${themeClasses.button}`}
                          onClick={submitFlowRating}
                        >
                          Speichern
                          <ArrowRight size={16} className="inline ml-2" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="flow-closed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`mt-6 rounded-2xl border p-8 text-center ${themeClasses.card}`}
              >
                <Play size={48} className={`mx-auto ${themeClasses.textMuted}`} />
                <p className={`mt-4 ${themeClasses.textMuted}`}>
                  Klicke auf <strong>"Neuer Tab"</strong> oder <strong>"Hier öffnen"</strong> um den Flow zu testen.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Keyboard shortcuts modal */}
        <AnimatePresence>
          {showKeyboardShortcuts && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowKeyboardShortcuts(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className={`rounded-2xl border p-6 max-w-md w-full ${themeClasses.card} ${themeClasses.bg}`}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                  <Keyboard size={20} />
                  Keyboard Shortcuts
                </h3>
                <div className="space-y-2 text-sm">
                  {[
                    ["?", "Shortcuts anzeigen"],
                    ["Esc", "Schliessen / Vollbild beenden"],
                    ["F", "Vollbild toggle"],
                    ["N", "Quick Notes toggle"],
                    ["D", "Dark/Light Mode"],
                    ["Space", "Timer pausieren"],
                  ].map(([key, desc]) => (
                    <div key={key} className="flex items-center justify-between">
                      <kbd className={`px-2 py-1 rounded font-mono ${isDark ? "bg-slate-800" : "bg-slate-200"}`}>
                        {key}
                      </kbd>
                      <span className={themeClasses.textMuted}>{desc}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ---------- Summary Phase ----------
  if (!session) return null;

  const rankingItems = overallRanking.length ? overallRanking : derivedRanking;

  return (
    <div className={`min-h-screen ${themeClasses.bg} ${themeClasses.text}`}>
      <Helmet>
        <title>Feedback Summary | Umzugscheck.ch</title>
      </Helmet>

      {showConfetti && <Confetti />}

      {/* Theme toggle */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsDark(!isDark)}
          className={`p-2 rounded-xl border transition-colors ${themeClasses.buttonSecondary}`}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`rounded-2xl border p-6 ${themeClasses.card}`}>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600">
              <Trophy size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Alle Flows getestet 🎉</h1>
              <p className={themeClasses.textMuted}>
                Danke, <span className="font-semibold">{session.testerName}</span>! Jetzt noch dein Fazit.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Statistics */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`mt-6 rounded-2xl border p-6 ${themeClasses.card}`}
          >
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <BarChart3 size={20} className="text-blue-500" />
              Statistiken
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className={`p-4 rounded-xl ${isDark ? "bg-slate-900" : "bg-slate-100"}`}>
                <div className="text-2xl font-bold">{stats.avgOverall.toFixed(1)}</div>
                <div className={`text-sm ${themeClasses.textMuted}`}>Ø Bewertung</div>
              </div>
              <div className={`p-4 rounded-xl ${isDark ? "bg-slate-900" : "bg-slate-100"}`}>
                <div className="text-2xl font-bold text-emerald-500">
                  {stats.recommended}/{stats.total}
                </div>
                <div className={`text-sm ${themeClasses.textMuted}`}>Empfohlen</div>
              </div>
              <div className={`p-4 rounded-xl ${isDark ? "bg-slate-900" : "bg-slate-100"}`}>
                <div className="text-2xl font-bold">{formatTime(stats.totalTime)}</div>
                <div className={`text-sm ${themeClasses.textMuted}`}>Gesamtzeit</div>
              </div>
              <div className={`p-4 rounded-xl ${isDark ? "bg-slate-900" : "bg-slate-100"}`}>
                <div className="text-2xl font-bold">{session.skippedFlows.length}</div>
                <div className={`text-sm ${themeClasses.textMuted}`}>Übersprungen</div>
              </div>
            </div>

            {/* Category breakdown */}
            <div className="mt-6">
              <h3 className={`text-sm font-semibold mb-3 ${themeClasses.textMuted}`}>Bewertung nach Kategorie</h3>
              <div className="space-y-2">
                {RATING_CRITERIA.map((c) => (
                  <div key={c.id} className="flex items-center gap-3">
                    <div className="w-24 text-sm flex items-center gap-1">
                      {c.icon}
                      {c.label}
                    </div>
                    <div className={`flex-1 h-3 rounded-full ${isDark ? "bg-slate-800" : "bg-slate-200"}`}>
                      <motion.div
                        className="h-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${(stats.byCategory[c.id] / 5) * 100}%` }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                      />
                    </div>
                    <div className="w-10 text-right text-sm font-semibold">
                      {stats.byCategory[c.id].toFixed(1)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Summary area for PDF */}
        <div ref={summaryRef} id="summary-area" className="mt-6 space-y-6">
          {/* Ratings list */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`rounded-2xl border p-6 ${themeClasses.card}`}
          >
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <CheckCircle size={20} className="text-emerald-500" />
              Deine Bewertungen
            </h2>
            <div className="space-y-3">
              {session.flowRatings.map((r, idx) => {
                const flow = TOP_10_FLOWS.find((f) => f.id === r.flowId);
                return (
                  <div
                    key={r.flowId}
                    className={`flex items-center justify-between rounded-xl p-4 ${
                      isDark ? "bg-slate-950/50" : "bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                          idx < 3
                            ? "bg-gradient-to-br from-yellow-500 to-amber-600 text-white"
                            : isDark
                            ? "bg-slate-800 text-slate-400"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <div>
                        <div className="font-semibold flex items-center gap-2">
                          {flow?.name ?? r.flowId}
                          {r.emoji && <span>{r.emoji}</span>}
                        </div>
                        <div className={`text-xs ${themeClasses.textMuted}`}>
                          {formatTime(r.timeSpent)} • {flow?.url}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold flex items-center gap-1">
                        <Star size={16} className="text-yellow-500" />
                        {avgRating(r).toFixed(1)}
                      </div>
                      <div
                        className={`text-xs flex items-center gap-1 ${
                          r.wouldRecommend ? "text-emerald-400" : "text-rose-400"
                        }`}
                      >
                        {r.wouldRecommend ? <ThumbsUp size={12} /> : <ThumbsDown size={12} />}
                        {r.wouldRecommend ? "Empfohlen" : "Nicht empfohlen"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Drag & Drop Ranking */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`rounded-2xl border p-6 ${themeClasses.card}`}
          >
            <div className="flex items-center justify-between gap-3 mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <TrendingUp size={20} className="text-purple-500" />
                Dein Ranking
              </h2>
              <p className={`text-sm ${themeClasses.textMuted}`}>
                <GripVertical size={14} className="inline" /> Drag & Drop zum Anpassen
              </p>
            </div>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={rankingItems} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {rankingItems.map((id, idx) => {
                    const flow = TOP_10_FLOWS.find((f) => f.id === id);
                    const rating = session.flowRatings.find((r) => r.flowId === id);
                    return (
                      <SortableRankItem
                        key={id}
                        id={id}
                        idx={idx}
                        flow={flow}
                        rating={rating}
                        isDark={isDark}
                      />
                    );
                  })}
                </div>
              </SortableContext>
            </DndContext>
          </motion.div>

          {/* Final feedback */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`rounded-2xl border p-6 ${themeClasses.card}`}
          >
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <MessageSquare size={20} className="text-orange-500" />
              Dein Gesamtfeedback
            </h2>
            <p className={`mt-1 text-sm ${themeClasses.textMuted}`}>
              Was war dein Favorit? Wo gab's Friction? Was ist "must-fix"?
            </p>
            <textarea
              className={`mt-4 w-full rounded-xl border p-4 outline-none transition-colors ${themeClasses.input}`}
              rows={8}
              value={finalFeedback}
              onChange={(e) => setFinalFeedback(e.target.value)}
              placeholder="Dein detailliertes Feedback hier..."
            />
          </motion.div>
        </div>

        {/* Export Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 flex flex-wrap gap-3"
        >
          <button
            className={`rounded-xl px-4 py-3 font-semibold transition-colors flex items-center gap-2 ${themeClasses.button}`}
            onClick={exportJson}
          >
            {copiedState === "json" ? <Check size={18} /> : <FileJson size={18} />}
            {copiedState === "json" ? "Kopiert!" : "JSON kopieren"}
          </button>
          <button
            className={`rounded-xl border px-4 py-3 font-semibold transition-colors flex items-center gap-2 ${themeClasses.buttonSecondary}`}
            onClick={exportPdf}
          >
            <FileText size={18} />
            PDF exportieren
          </button>
          <button
            className={`rounded-xl border px-4 py-3 font-semibold transition-colors flex items-center gap-2 ${themeClasses.buttonSecondary}`}
            onClick={shareByEmail}
          >
            <Mail size={18} />
            Per Email teilen
          </button>
        </motion.div>

        <p className={`mt-4 text-xs ${themeClasses.textMuted}`}>
          💡 Tipp: JSON-Datei enthält alle Details. PDF zeigt die sichtbare Zusammenfassung.
        </p>
      </div>
    </div>
  );
}
