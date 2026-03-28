/**
 * A/B Test Tracker - Track and compare different test variants
 * Feature: A/B Testing, Variant Comparison, Statistical Analysis
 */

import React, { memo, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FlaskConical, TrendingUp, TrendingDown, Minus, BarChart3, RefreshCw, Sparkles } from "lucide-react";

type Variant = {
  id: string;
  name: string;
  description: string;
  completions: number;
  avgScore: number;
  conversionRate: number;
  avgTime: number;
};

interface ABTestTrackerProps {
  testName: string;
  variants: Variant[];
  currentVariant?: string;
  onClose: () => void;
  t: (key: string) => string;
}

const MOCK_VARIANTS: Variant[] = [
  { id: "A", name: "Variant A", description: "Original 3-Step Flow", completions: 45, avgScore: 4.2, conversionRate: 78, avgTime: 95 },
  { id: "B", name: "Variant B", description: "New 2-Step Flow", completions: 52, avgScore: 4.6, conversionRate: 85, avgTime: 72 },
];

function formatABTime(seconds: number): string {
  return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, "0")}`;
}

function getComparisonIcon(diff: number, higherIsBetter: boolean = true) {
  const isPositive = higherIsBetter ? diff > 0 : diff < 0;
  if (Math.abs(diff) < 0.1) return <Minus size={14} className="text-white/40" />;
  if (isPositive) return <TrendingUp size={14} className="text-emerald-400" />;
  return <TrendingDown size={14} className="text-rose-400" />;
}

export const ABTestTracker = memo(function ABTestTracker({
  testName = "Flow Comparison",
  variants = MOCK_VARIANTS,
  currentVariant,
  onClose,
  t,
}: ABTestTrackerProps) {
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);

  // Calculate winner
  const winner = useMemo(() => {
    if (variants.length < 2) return null;
    const sorted = [...variants].sort((a, b) => b.avgScore - a.avgScore);
    const best = sorted[0];
    const second = sorted[1];
    const diff = ((best.avgScore - second.avgScore) / second.avgScore) * 100;
    return { variant: best, improvement: diff.toFixed(1) };
  }, [variants]);

  // Statistical significance (simplified)
  const significance = useMemo(() => {
    if (variants.length < 2) return 0;
    const totalCompletions = variants.reduce((sum, v) => sum + v.completions, 0);
    // Simplified calculation - real stats would use proper statistical tests
    if (totalCompletions > 100) return 95;
    if (totalCompletions > 50) return 85;
    if (totalCompletions > 20) return 70;
    return 50;
  }, [variants]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl overflow-hidden shadow-2xl max-h-[85vh] flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <FlaskConical className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{t("abtest.title") || "A/B Test Results"}</h2>
              <p className="text-white/70 text-sm">{testName}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Winner Banner */}
          {winner && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-2xl p-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-emerald-400 font-bold">{winner.variant.name} {t("abtest.winning") || "is winning!"}</div>
                  <div className="text-white/60 text-sm">+{winner.improvement}% {t("abtest.better") || "better"}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{significance}%</div>
                  <div className="text-xs text-white/40">{t("abtest.confidence") || "confidence"}</div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Variant Cards */}
          <div className="space-y-3">
            {variants.map((variant, idx) => (
              <motion.div
                key={variant.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => setSelectedVariant(selectedVariant === variant.id ? null : variant.id)}
                className={`p-4 rounded-2xl cursor-pointer transition-all ${
                  currentVariant === variant.id
                    ? "bg-sky-500/20 border-2 border-sky-500/50"
                    : selectedVariant === variant.id
                    ? "bg-white/10 border-2 border-white/20"
                    : "bg-white/5 border-2 border-transparent hover:bg-white/10"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      variant.id === "A" ? "bg-blue-500/20 text-blue-400" : "bg-purple-500/20 text-purple-400"
                    }`}>
                      {variant.id}
                    </span>
                    <span className="font-semibold text-white">{variant.name}</span>
                  </div>
                  {winner?.variant.id === variant.id && (
                    <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
                      {t("abtest.leader") || "Leader"}
                    </span>
                  )}
                </div>

                <p className="text-white/60 text-sm mb-4">{variant.description}</p>

                {/* Metrics Grid */}
                <div className="grid grid-cols-4 gap-2">
                  <div className="bg-white/5 rounded-xl p-2 text-center">
                    <div className="text-lg font-bold text-white">{variant.completions}</div>
                    <div className="text-xs text-white/40">{t("abtest.tests") || "Tests"}</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-2 text-center">
                    <div className="text-lg font-bold text-emerald-400">{variant.avgScore.toFixed(1)}</div>
                    <div className="text-xs text-white/40">Ø Score</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-2 text-center">
                    <div className="text-lg font-bold text-sky-400">{variant.conversionRate}%</div>
                    <div className="text-xs text-white/40">{t("abtest.conversion") || "Conv."}</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-2 text-center">
                    <div className="text-lg font-bold text-amber-400">{formatABTime(variant.avgTime)}</div>
                    <div className="text-xs text-white/40">{t("abtest.time") || "Time"}</div>
                  </div>
                </div>

                {/* Expanded Comparison */}
                <AnimatePresence>
                  {selectedVariant === variant.id && variants.length > 1 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-white/10"
                    >
                      <div className="text-xs text-white/40 mb-2">{t("abtest.comparison") || "vs Other Variants"}</div>
                      {variants
                        .filter((v) => v.id !== variant.id)
                        .map((other) => {
                          const scoreDiff = variant.avgScore - other.avgScore;
                          const convDiff = variant.conversionRate - other.conversionRate;
                          const timeDiff = variant.avgTime - other.avgTime;
                          
                          return (
                            <div key={other.id} className="flex items-center gap-4 text-sm">
                              <span className="text-white/60">vs {other.name}:</span>
                              <div className="flex items-center gap-1">
                                {getComparisonIcon(scoreDiff)}
                                <span className={scoreDiff >= 0 ? "text-emerald-400" : "text-rose-400"}>
                                  {scoreDiff >= 0 ? "+" : ""}{scoreDiff.toFixed(1)} score
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                {getComparisonIcon(convDiff)}
                                <span className={convDiff >= 0 ? "text-emerald-400" : "text-rose-400"}>
                                  {convDiff >= 0 ? "+" : ""}{convDiff}% conv
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                {getComparisonIcon(timeDiff, false)}
                                <span className={timeDiff <= 0 ? "text-emerald-400" : "text-rose-400"}>
                                  {timeDiff <= 0 ? "" : "+"}{timeDiff}s
                                </span>
                              </div>
                            </div>
                          );
                        })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-white/40">
              <span>{t("abtest.sampleSize") || "Sample Size"}</span>
              <span>{variants.reduce((sum, v) => sum + v.completions, 0)} / 100 {t("abtest.recommended") || "recommended"}</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(variants.reduce((sum, v) => sum + v.completions, 0), 100)}%` }}
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
              />
            </div>
          </div>

          {/* Action Hint */}
          <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-3">
            <RefreshCw size={20} className="text-white/40" />
            <div className="flex-1">
              <div className="text-white text-sm font-medium">{t("abtest.keepTesting") || "Keep Testing"}</div>
              <div className="text-white/40 text-xs">
                {t("abtest.moreData") || "More data = higher confidence in results"}
              </div>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={onClose}
            className="w-full py-4 bg-white/10 rounded-2xl text-white font-semibold touch-manipulation"
          >
            {t("common.close") || "Close"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
});
