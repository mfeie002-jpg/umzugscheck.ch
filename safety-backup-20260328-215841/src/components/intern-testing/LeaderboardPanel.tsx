/**
 * Leaderboard Panel - Shows team rankings, streaks, and competition data
 * Feature: Leaderboard, Team Comparison, Personal Stats
 */

import React, { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Medal, Flame, TrendingUp, Users, Crown, Star, Zap } from "lucide-react";

type LeaderboardEntry = {
  id: string;
  name: string;
  avatar?: string;
  flowsCompleted: number;
  avgScore: number;
  streak: number;
  totalTime: number;
  rank: number;
  isCurrentUser?: boolean;
  team?: string;
};

interface LeaderboardPanelProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
  onClose: () => void;
  t: (key: string) => string;
}

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { id: "1", name: "Max M.", flowsCompleted: 10, avgScore: 4.8, streak: 5, totalTime: 1800, rank: 1, team: "UX" },
  { id: "2", name: "Anna K.", flowsCompleted: 10, avgScore: 4.6, streak: 3, totalTime: 2100, rank: 2, team: "Dev" },
  { id: "3", name: "Tim R.", flowsCompleted: 8, avgScore: 4.5, streak: 2, totalTime: 1600, rank: 3, team: "UX" },
  { id: "4", name: "Lisa B.", flowsCompleted: 7, avgScore: 4.3, streak: 1, totalTime: 1400, rank: 4, team: "Design" },
  { id: "5", name: "Jan H.", flowsCompleted: 6, avgScore: 4.2, streak: 0, totalTime: 1200, rank: 5, team: "Dev" },
];

function formatLeaderboardTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  return `${mins}m`;
}

function getRankIcon(rank: number) {
  switch (rank) {
    case 1: return <Crown className="w-5 h-5 text-yellow-400" />;
    case 2: return <Medal className="w-5 h-5 text-slate-300" />;
    case 3: return <Medal className="w-5 h-5 text-amber-600" />;
    default: return <span className="text-white/40 font-bold text-sm">#{rank}</span>;
  }
}

export const LeaderboardPanel = memo(function LeaderboardPanel({
  entries = MOCK_LEADERBOARD,
  currentUserId,
  onClose,
  t,
}: LeaderboardPanelProps) {
  const teamStats = React.useMemo(() => {
    const teams: Record<string, { totalScore: number; count: number; avgScore: number }> = {};
    entries.forEach((e) => {
      if (e.team) {
        if (!teams[e.team]) teams[e.team] = { totalScore: 0, count: 0, avgScore: 0 };
        teams[e.team].totalScore += e.avgScore;
        teams[e.team].count++;
      }
    });
    Object.keys(teams).forEach((team) => {
      teams[team].avgScore = teams[team].totalScore / teams[team].count;
    });
    return Object.entries(teams)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.avgScore - a.avgScore);
  }, [entries]);

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
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <Trophy className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{t("leaderboard.title") || "Leaderboard"}</h2>
              <p className="text-white/70 text-sm">{t("leaderboard.subtitle") || "Top Testers"}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Individual Rankings */}
          <div className="space-y-2">
            <h3 className="text-white/60 text-sm font-medium flex items-center gap-2">
              <Star size={14} /> {t("leaderboard.individual") || "Individual Ranking"}
            </h3>
            <div className="space-y-2">
              {entries.map((entry, idx) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`flex items-center gap-3 p-3 rounded-2xl transition-all ${
                    entry.isCurrentUser || entry.id === currentUserId
                      ? "bg-emerald-500/20 border-2 border-emerald-500/50"
                      : "bg-white/5 hover:bg-white/10"
                  }`}
                >
                  {/* Rank */}
                  <div className="w-10 h-10 flex items-center justify-center">
                    {getRankIcon(entry.rank)}
                  </div>

                  {/* Avatar / Initial */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white ${
                    entry.rank === 1 ? "bg-gradient-to-br from-yellow-400 to-amber-500" :
                    entry.rank === 2 ? "bg-gradient-to-br from-slate-300 to-slate-400" :
                    entry.rank === 3 ? "bg-gradient-to-br from-amber-600 to-amber-700" :
                    "bg-white/20"
                  }`}>
                    {entry.avatar ? (
                      <img src={entry.avatar} alt="" className="w-full h-full rounded-xl object-cover" />
                    ) : (
                      entry.name.charAt(0)
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white truncate">{entry.name}</span>
                      {entry.streak > 0 && (
                        <span className="flex items-center gap-0.5 text-orange-400 text-xs">
                          <Flame size={12} /> {entry.streak}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/50">
                      <span>{entry.flowsCompleted} flows</span>
                      <span>•</span>
                      <span>{formatLeaderboardTime(entry.totalTime)}</span>
                      {entry.team && (
                        <>
                          <span>•</span>
                          <span className="text-sky-400">{entry.team}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-right">
                    <div className="text-xl font-bold text-white">{entry.avgScore.toFixed(1)}</div>
                    <div className="text-xs text-white/40">Ø Score</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Team Comparison */}
          {teamStats.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-white/60 text-sm font-medium flex items-center gap-2">
                <Users size={14} /> {t("leaderboard.teams") || "Team Comparison"}
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {teamStats.map((team, idx) => (
                  <motion.div
                    key={team.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                    className={`p-4 rounded-2xl text-center ${
                      idx === 0 ? "bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30" : "bg-white/5"
                    }`}
                  >
                    {idx === 0 && <Crown size={16} className="mx-auto text-emerald-400 mb-1" />}
                    <div className="text-white font-bold">{team.name}</div>
                    <div className="text-2xl font-bold text-emerald-400">{team.avgScore.toFixed(1)}</div>
                    <div className="text-xs text-white/40">{team.count} members</div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/5 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-emerald-400 mb-2">
                <TrendingUp size={18} />
                <span className="text-sm font-medium">{t("leaderboard.bestStreak") || "Best Streak"}</span>
              </div>
              <div className="text-3xl font-bold text-white">
                {Math.max(...entries.map((e) => e.streak))}
                <span className="text-lg text-white/40 ml-1">days</span>
              </div>
            </div>
            <div className="bg-white/5 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-sky-400 mb-2">
                <Zap size={18} />
                <span className="text-sm font-medium">{t("leaderboard.fastestTester") || "Fastest"}</span>
              </div>
              <div className="text-3xl font-bold text-white">
                {formatLeaderboardTime(Math.min(...entries.map((e) => e.totalTime)))}
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
