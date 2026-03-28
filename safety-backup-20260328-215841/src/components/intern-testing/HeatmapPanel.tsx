/**
 * Heatmap Panel - Visualizes ratings across criteria and flows
 * Feature: Heatmaps, Visual Analytics, Pattern Recognition
 */

import React, { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { Activity, Grid3X3, TrendingUp, AlertTriangle } from "lucide-react";

type FlowRating = {
  flowId: string;
  ratings: Record<string, number>;
};

interface HeatmapPanelProps {
  ratings: FlowRating[];
  criteria: { id: string; label: string; color: string }[];
  flowNames: Record<string, string>;
  onClose: () => void;
  t: (key: string) => string;
}

function getHeatColor(value: number): string {
  // 1 = red, 3 = yellow, 5 = green
  if (value <= 1.5) return "bg-red-500";
  if (value <= 2.5) return "bg-orange-500";
  if (value <= 3.5) return "bg-yellow-500";
  if (value <= 4.5) return "bg-lime-500";
  return "bg-emerald-500";
}

function getHeatOpacity(value: number): string {
  const normalized = (value - 1) / 4; // 0-1
  return `${Math.round(normalized * 100)}%`;
}

export const HeatmapPanel = memo(function HeatmapPanel({
  ratings,
  criteria,
  flowNames,
  onClose,
  t,
}: HeatmapPanelProps) {
  // Calculate averages per criterion
  const criteriaAvgs = useMemo(() => {
    return criteria.map((c) => {
      const sum = ratings.reduce((acc, r) => acc + (r.ratings[c.id] || 0), 0);
      return {
        ...c,
        avg: ratings.length ? sum / ratings.length : 0,
      };
    });
  }, [ratings, criteria]);

  // Find weak spots (criteria with avg < 3)
  const weakSpots = useMemo(() => {
    return criteriaAvgs.filter((c) => c.avg < 3);
  }, [criteriaAvgs]);

  // Find strong spots (criteria with avg >= 4)
  const strongSpots = useMemo(() => {
    return criteriaAvgs.filter((c) => c.avg >= 4);
  }, [criteriaAvgs]);

  // Calculate flow averages
  const flowAvgs = useMemo(() => {
    return ratings.map((r) => {
      const vals = Object.values(r.ratings);
      return {
        flowId: r.flowId,
        avg: vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0,
      };
    }).sort((a, b) => b.avg - a.avg);
  }, [ratings]);

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
        className="w-full max-w-2xl bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl overflow-hidden shadow-2xl max-h-[85vh] flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <Activity className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{t("heatmap.title") || "Rating Heatmap"}</h2>
              <p className="text-white/70 text-sm">{t("heatmap.subtitle") || "Visual Analysis"}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Heatmap Grid */}
          <div className="space-y-3">
            <h3 className="text-white/60 text-sm font-medium flex items-center gap-2">
              <Grid3X3 size={14} /> {t("heatmap.grid") || "Criteria x Flows"}
            </h3>
            
            <div className="overflow-x-auto">
              <div className="min-w-[500px]">
                {/* Header Row */}
                <div className="flex gap-1 mb-2">
                  <div className="w-24 shrink-0" />
                  {criteria.map((c) => (
                    <div
                      key={c.id}
                      className="flex-1 text-center text-xs text-white/60 font-medium truncate px-1"
                      title={c.label}
                    >
                      {c.label.slice(0, 3)}
                    </div>
                  ))}
                  <div className="w-12 text-center text-xs text-white/60 font-medium">Ø</div>
                </div>

                {/* Data Rows */}
                {ratings.map((rating, idx) => {
                  const vals = Object.values(rating.ratings);
                  const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
                  
                  return (
                    <motion.div
                      key={rating.flowId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex gap-1 mb-1"
                    >
                      <div className="w-24 shrink-0 text-xs text-white/70 font-medium truncate pr-2 flex items-center">
                        {flowNames[rating.flowId] || rating.flowId}
                      </div>
                      {criteria.map((c) => {
                        const val = rating.ratings[c.id] || 0;
                        return (
                          <div
                            key={c.id}
                            className={`flex-1 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm ${getHeatColor(val)}`}
                            style={{ opacity: val > 0 ? 0.4 + (val / 5) * 0.6 : 0.2 }}
                            title={`${c.label}: ${val}`}
                          >
                            {val > 0 ? val : "-"}
                          </div>
                        );
                      })}
                      <div className="w-12 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white font-bold text-sm">
                        {avg.toFixed(1)}
                      </div>
                    </motion.div>
                  );
                })}

                {/* Average Row */}
                <div className="flex gap-1 mt-3 pt-3 border-t border-white/10">
                  <div className="w-24 shrink-0 text-xs text-white font-bold">Ø</div>
                  {criteriaAvgs.map((c) => (
                    <div
                      key={c.id}
                      className={`flex-1 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm ${getHeatColor(c.avg)}`}
                    >
                      {c.avg.toFixed(1)}
                    </div>
                  ))}
                  <div className="w-12" />
                </div>
              </div>
            </div>
          </div>

          {/* Insights */}
          <div className="grid grid-cols-2 gap-3">
            {/* Weak Spots */}
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-rose-400 mb-3">
                <AlertTriangle size={18} />
                <span className="text-sm font-medium">{t("heatmap.weakSpots") || "Needs Work"}</span>
              </div>
              {weakSpots.length > 0 ? (
                <ul className="space-y-1">
                  {weakSpots.map((c) => (
                    <li key={c.id} className="text-white/70 text-sm flex items-center justify-between">
                      <span>{c.label}</span>
                      <span className="text-rose-400 font-bold">{c.avg.toFixed(1)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-white/40 text-sm">{t("heatmap.noWeakSpots") || "All looking good!"}</p>
              )}
            </div>

            {/* Strong Spots */}
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-emerald-400 mb-3">
                <TrendingUp size={18} />
                <span className="text-sm font-medium">{t("heatmap.strongSpots") || "Strong Points"}</span>
              </div>
              {strongSpots.length > 0 ? (
                <ul className="space-y-1">
                  {strongSpots.map((c) => (
                    <li key={c.id} className="text-white/70 text-sm flex items-center justify-between">
                      <span>{c.label}</span>
                      <span className="text-emerald-400 font-bold">{c.avg.toFixed(1)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-white/40 text-sm">{t("heatmap.noStrongSpots") || "Keep testing!"}</p>
              )}
            </div>
          </div>

          {/* Flow Ranking Preview */}
          <div className="space-y-2">
            <h3 className="text-white/60 text-sm font-medium">{t("heatmap.topFlows") || "Top Performing Flows"}</h3>
            <div className="space-y-1">
              {flowAvgs.slice(0, 3).map((f, idx) => (
                <div
                  key={f.flowId}
                  className="flex items-center gap-3 p-2 rounded-xl bg-white/5"
                >
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                    idx === 0 ? "bg-yellow-400 text-yellow-900" :
                    idx === 1 ? "bg-slate-300 text-slate-800" :
                    "bg-amber-600 text-white"
                  }`}>
                    {idx + 1}
                  </span>
                  <span className="flex-1 text-white text-sm truncate">
                    {flowNames[f.flowId] || f.flowId}
                  </span>
                  <span className="text-emerald-400 font-bold">{f.avg.toFixed(1)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-2 text-xs">
            <span className="text-white/40">Score:</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((v) => (
                <div
                  key={v}
                  className={`w-8 h-6 rounded flex items-center justify-center text-white ${getHeatColor(v)}`}
                >
                  {v}
                </div>
              ))}
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
