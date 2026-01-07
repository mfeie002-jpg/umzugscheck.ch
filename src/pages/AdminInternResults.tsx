/**
 * Admin Dashboard for Intern Testing Results
 * Displays all test sessions, analytics, and detailed breakdowns
 */

import React, { useState, useMemo, useEffect } from "react";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  BarChart3, Users, Clock, Star, TrendingUp, TrendingDown,
  Download, RefreshCw, ChevronDown, ChevronUp, Eye, Trash2,
  Filter, Calendar, Globe, ThumbsUp, ThumbsDown, Award,
  ArrowLeft, Search, FileJson, FileText, Activity
} from "lucide-react";
import { TOP_10_FLOWS } from "@/data/top10Flows";

// Types
type FlowRating = {
  flowId: string;
  ratings: Record<string, number>;
  pros: string;
  cons: string;
  wouldRecommend: boolean;
  completedAt: string;
  timeSpent: number;
  quickNotes: string;
  emoji?: string;
};

type TestSession = {
  id: string;
  testerName: string;
  startedAt: string;
  flowRatings: FlowRating[];
  finalFeedback: string;
  overallRanking: string[];
  completedAt?: string;
  totalTimeSpent: number;
  skippedFlows: string[];
  language: string;
  achievements: string[];
};

const STORAGE_KEY = "internFlowTestingResults";
const CRITERIA = ["usability", "clarity", "speed", "design", "mobile", "trust"];

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function avgRating(r: FlowRating): number {
  const vals = Object.values(r.ratings);
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
}

function getSessionAvg(session: TestSession): number {
  if (!session.flowRatings.length) return 0;
  return session.flowRatings.reduce((sum, r) => sum + avgRating(r), 0) / session.flowRatings.length;
}

export default function AdminInternResults() {
  const [sessions, setSessions] = useState<TestSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSession, setExpandedSession] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLanguage, setFilterLanguage] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"date" | "score" | "name">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Load sessions from localStorage (will be replaced with Supabase)
  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = () => {
    setLoading(true);
    try {
      // Load from localStorage
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as TestSession[];
        setSessions(parsed);
      } else {
        // Check for individual session
        const singleSession = localStorage.getItem("internFlowTestingSession");
        if (singleSession) {
          const parsed = JSON.parse(singleSession) as TestSession;
          if (parsed.completedAt) {
            setSessions([{ ...parsed, id: crypto.randomUUID() }]);
          }
        }
      }
    } catch (e) {
      console.error("Failed to load sessions:", e);
    }
    setLoading(false);
  };

  // Calculate global stats
  const globalStats = useMemo(() => {
    const completedSessions = sessions.filter(s => s.completedAt);
    const allRatings = sessions.flatMap(s => s.flowRatings);
    
    const avgScore = allRatings.length
      ? allRatings.reduce((sum, r) => sum + avgRating(r), 0) / allRatings.length
      : 0;

    const recommendRate = allRatings.length
      ? (allRatings.filter(r => r.wouldRecommend).length / allRatings.length) * 100
      : 0;

    const avgTime = completedSessions.length
      ? completedSessions.reduce((sum, s) => sum + s.totalTimeSpent, 0) / completedSessions.length
      : 0;

    const criteriaAvgs = CRITERIA.map(c => ({
      id: c,
      avg: allRatings.length
        ? allRatings.reduce((sum, r) => sum + (r.ratings[c] || 0), 0) / allRatings.length
        : 0
    }));

    const flowStats = TOP_10_FLOWS.map(flow => {
      const ratings = allRatings.filter(r => r.flowId === flow.id);
      return {
        id: flow.id,
        name: flow.name,
        count: ratings.length,
        avg: ratings.length ? ratings.reduce((sum, r) => sum + avgRating(r), 0) / ratings.length : 0,
        recommend: ratings.length ? (ratings.filter(r => r.wouldRecommend).length / ratings.length) * 100 : 0,
      };
    }).sort((a, b) => b.avg - a.avg);

    const languages = [...new Set(sessions.map(s => s.language))];

    return {
      totalSessions: sessions.length,
      completedSessions: completedSessions.length,
      totalRatings: allRatings.length,
      avgScore,
      recommendRate,
      avgTime,
      criteriaAvgs,
      flowStats,
      languages,
    };
  }, [sessions]);

  // Filtered and sorted sessions
  const filteredSessions = useMemo(() => {
    let result = [...sessions];

    // Filter by search
    if (searchTerm) {
      result = result.filter(s => 
        s.testerName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by language
    if (filterLanguage) {
      result = result.filter(s => s.language === filterLanguage);
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "date":
          comparison = new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime();
          break;
        case "score":
          comparison = getSessionAvg(a) - getSessionAvg(b);
          break;
        case "name":
          comparison = a.testerName.localeCompare(b.testerName);
          break;
      }
      return sortOrder === "desc" ? -comparison : comparison;
    });

    return result;
  }, [sessions, searchTerm, filterLanguage, sortBy, sortOrder]);

  const exportAllData = () => {
    const json = JSON.stringify(sessions, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `intern-test-results-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const deleteSession = (id: string) => {
    if (!confirm("Session wirklich löschen?")) return;
    const updated = sessions.filter(s => s.id !== id);
    setSessions(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Helmet>
        <title>Admin - Intern Test Results | Umzugscheck.ch</title>
      </Helmet>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-white">Intern Test Results</h1>
              <p className="text-white/40 text-sm">Admin Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={loadSessions}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 transition-colors"
              title="Aktualisieren"
            >
              <RefreshCw size={18} />
            </button>
            <button
              onClick={exportAllData}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
            >
              <Download size={18} />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur rounded-2xl p-4 border border-white/10"
          >
            <div className="flex items-center gap-2 text-white/40 text-sm mb-2">
              <Users size={16} />
              <span>Sessions</span>
            </div>
            <div className="text-3xl font-bold text-white">{globalStats.totalSessions}</div>
            <div className="text-xs text-white/40">{globalStats.completedSessions} abgeschlossen</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 backdrop-blur rounded-2xl p-4 border border-white/10"
          >
            <div className="flex items-center gap-2 text-white/40 text-sm mb-2">
              <Star size={16} />
              <span>Ø Score</span>
            </div>
            <div className="text-3xl font-bold text-emerald-400">{globalStats.avgScore.toFixed(1)}</div>
            <div className="text-xs text-white/40">von 5.0</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur rounded-2xl p-4 border border-white/10"
          >
            <div className="flex items-center gap-2 text-white/40 text-sm mb-2">
              <ThumbsUp size={16} />
              <span>Empfehlungsrate</span>
            </div>
            <div className="text-3xl font-bold text-sky-400">{globalStats.recommendRate.toFixed(0)}%</div>
            <div className="text-xs text-white/40">{globalStats.totalRatings} Bewertungen</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 backdrop-blur rounded-2xl p-4 border border-white/10"
          >
            <div className="flex items-center gap-2 text-white/40 text-sm mb-2">
              <Clock size={16} />
              <span>Ø Zeit</span>
            </div>
            <div className="text-3xl font-bold text-amber-400">{formatTime(Math.round(globalStats.avgTime))}</div>
            <div className="text-xs text-white/40">pro Session</div>
          </motion.div>
        </div>

        {/* Criteria Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 backdrop-blur rounded-2xl p-5 border border-white/10"
        >
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Activity size={20} />
            Kriterien-Übersicht
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {globalStats.criteriaAvgs.map((c) => (
              <div key={c.id} className="bg-white/5 rounded-xl p-3 text-center">
                <div className="text-xs text-white/40 mb-1 capitalize">{c.id}</div>
                <div className={`text-2xl font-bold ${
                  c.avg >= 4 ? "text-emerald-400" : c.avg >= 3 ? "text-amber-400" : "text-rose-400"
                }`}>
                  {c.avg.toFixed(1)}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Flow Rankings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/5 backdrop-blur rounded-2xl p-5 border border-white/10"
        >
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <BarChart3 size={20} />
            Flow Rankings
          </h2>
          <div className="space-y-2">
            {globalStats.flowStats.map((flow, idx) => (
              <div
                key={flow.id}
                className="flex items-center gap-3 p-3 bg-white/5 rounded-xl"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                  idx === 0 ? "bg-yellow-500 text-yellow-900" :
                  idx === 1 ? "bg-slate-300 text-slate-800" :
                  idx === 2 ? "bg-amber-600 text-white" :
                  "bg-white/10 text-white/60"
                }`}>
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-medium truncate">{flow.name}</div>
                  <div className="text-xs text-white/40">{flow.count} Bewertungen</div>
                </div>
                <div className="text-right">
                  <div className={`font-bold ${
                    flow.avg >= 4 ? "text-emerald-400" : flow.avg >= 3 ? "text-amber-400" : "text-rose-400"
                  }`}>
                    {flow.avg.toFixed(1)}
                  </div>
                  <div className="text-xs text-white/40">{flow.recommend.toFixed(0)}% 👍</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Session List */}
        <div className="bg-white/5 backdrop-blur rounded-2xl border border-white/10 overflow-hidden">
          {/* Filters */}
          <div className="p-4 border-b border-white/10 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    type="text"
                    placeholder="Suchen..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-white/30"
                  />
                </div>
              </div>

              <select
                value={filterLanguage || ""}
                onChange={(e) => setFilterLanguage(e.target.value || null)}
                className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none"
              >
                <option value="">Alle Sprachen</option>
                {globalStats.languages.map(l => (
                  <option key={l} value={l}>{l.toUpperCase()}</option>
                ))}
              </select>

              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [by, order] = e.target.value.split("-");
                  setSortBy(by as "date" | "score" | "name");
                  setSortOrder(order as "asc" | "desc");
                }}
                className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none"
              >
                <option value="date-desc">Neueste zuerst</option>
                <option value="date-asc">Älteste zuerst</option>
                <option value="score-desc">Beste zuerst</option>
                <option value="score-asc">Schlechteste zuerst</option>
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
              </select>
            </div>
          </div>

          {/* Session List */}
          <div className="divide-y divide-white/5">
            {loading ? (
              <div className="p-8 text-center text-white/40">Laden...</div>
            ) : filteredSessions.length === 0 ? (
              <div className="p-8 text-center text-white/40">
                Keine Sessions gefunden
              </div>
            ) : (
              filteredSessions.map((session) => (
                <div key={session.id || session.startedAt} className="p-4">
                  <div
                    className="flex items-center gap-4 cursor-pointer"
                    onClick={() => setExpandedSession(
                      expandedSession === (session.id || session.startedAt) ? null : (session.id || session.startedAt)
                    )}
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold">
                      {session.testerName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{session.testerName}</span>
                        <span className="px-2 py-0.5 bg-white/10 rounded-full text-xs text-white/60">
                          {session.language.toUpperCase()}
                        </span>
                        {session.completedAt && (
                          <span className="px-2 py-0.5 bg-emerald-500/20 rounded-full text-xs text-emerald-400">
                            ✓ Fertig
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-white/40">
                        {formatDate(session.startedAt)} • {session.flowRatings.length}/10 Flows
                      </div>
                    </div>
                    <div className="text-right hidden sm:block">
                      <div className="text-lg font-bold text-emerald-400">
                        {getSessionAvg(session).toFixed(1)}
                      </div>
                      <div className="text-xs text-white/40">{formatTime(session.totalTimeSpent)}</div>
                    </div>
                    <div className="text-white/40">
                      {expandedSession === (session.id || session.startedAt) ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {expandedSession === (session.id || session.startedAt) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-white/10 space-y-4"
                      >
                        {/* Achievements */}
                        {session.achievements.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {session.achievements.map((a) => (
                              <span key={a} className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded-lg text-xs flex items-center gap-1">
                                <Award size={12} /> {a}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Flow Ratings */}
                        <div className="space-y-2">
                          {session.flowRatings.map((rating) => {
                            const flow = TOP_10_FLOWS.find(f => f.id === rating.flowId);
                            return (
                              <div key={rating.flowId} className="bg-white/5 rounded-xl p-3">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-medium text-white">{flow?.name || rating.flowId}</span>
                                  <div className="flex items-center gap-2">
                                    {rating.emoji && <span>{rating.emoji}</span>}
                                    <span className={`font-bold ${
                                      avgRating(rating) >= 4 ? "text-emerald-400" : 
                                      avgRating(rating) >= 3 ? "text-amber-400" : "text-rose-400"
                                    }`}>
                                      {avgRating(rating).toFixed(1)}
                                    </span>
                                    {rating.wouldRecommend ? (
                                      <ThumbsUp size={14} className="text-emerald-400" />
                                    ) : (
                                      <ThumbsDown size={14} className="text-rose-400" />
                                    )}
                                  </div>
                                </div>
                                {(rating.pros || rating.cons) && (
                                  <div className="grid grid-cols-2 gap-2 text-xs">
                                    {rating.pros && (
                                      <div className="bg-emerald-500/10 rounded-lg p-2">
                                        <span className="text-emerald-400">+</span> {rating.pros}
                                      </div>
                                    )}
                                    {rating.cons && (
                                      <div className="bg-rose-500/10 rounded-lg p-2">
                                        <span className="text-rose-400">-</span> {rating.cons}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Final Feedback */}
                        {session.finalFeedback && (
                          <div className="bg-white/5 rounded-xl p-3">
                            <div className="text-xs text-white/40 mb-1">Fazit:</div>
                            <p className="text-white/80 text-sm">{session.finalFeedback}</p>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const json = JSON.stringify(session, null, 2);
                              navigator.clipboard.writeText(json);
                            }}
                            className="px-3 py-2 bg-white/5 rounded-lg text-white/60 text-sm flex items-center gap-2 hover:bg-white/10"
                          >
                            <FileJson size={14} /> JSON kopieren
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteSession(session.id || session.startedAt);
                            }}
                            className="px-3 py-2 bg-rose-500/10 rounded-lg text-rose-400 text-sm flex items-center gap-2 hover:bg-rose-500/20"
                          >
                            <Trash2 size={14} /> Löschen
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
