/**
 * Advanced Features for Intern Testing
 * Features: Live Collaboration, Focus Mode, Voice Notes, Screen Recording,
 * Dark/Light Theme, Accessibility Mode, Gamification, Progress Milestones,
 * Smart Suggestions, Comparison Mode, Export Templates, Offline Mode
 */

import React, { memo, useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Focus, Mic, MicOff, Video, VideoOff, Sun, Moon,
  Accessibility, Gamepad2, Target, Brain, GitCompare, FileDown,
  WifiOff, MessageSquare, Bell, BellOff, Keyboard, Timer,
  Layers, Share2, Bookmark, History, Lightbulb, Compass
} from "lucide-react";

// =============== LIVE COLLABORATION INDICATOR ===============
interface LiveCollaboratorProps {
  collaborators: { id: string; name: string; avatar?: string; status: "active" | "idle" | "away" }[];
  onInvite?: () => void;
  t: (key: string) => string;
}

export const LiveCollaborators = memo(function LiveCollaborators({
  collaborators,
  onInvite,
  t,
}: LiveCollaboratorProps) {
  const activeCount = collaborators.filter((c) => c.status === "active").length;
  
  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-2">
        {collaborators.slice(0, 4).map((collab) => (
          <div
            key={collab.id}
            className={`w-8 h-8 rounded-full border-2 border-slate-800 flex items-center justify-center text-xs font-bold ${
              collab.status === "active" ? "bg-emerald-500" :
              collab.status === "idle" ? "bg-amber-500" : "bg-white/20"
            }`}
            title={`${collab.name} (${collab.status})`}
          >
            {collab.avatar ? (
              <img src={collab.avatar} alt="" className="w-full h-full rounded-full" />
            ) : (
              collab.name.charAt(0)
            )}
          </div>
        ))}
        {collaborators.length > 4 && (
          <div className="w-8 h-8 rounded-full border-2 border-slate-800 bg-white/10 flex items-center justify-center text-xs text-white">
            +{collaborators.length - 4}
          </div>
        )}
      </div>
      {activeCount > 0 && (
        <span className="text-xs text-emerald-400">
          {activeCount} {t("collab.online") || "online"}
        </span>
      )}
      {onInvite && (
        <button
          onClick={onInvite}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60"
        >
          <Share2 size={14} />
        </button>
      )}
    </div>
  );
});

// =============== FOCUS MODE ===============
interface FocusModeProps {
  enabled: boolean;
  onToggle: () => void;
  timeRemaining?: number;
  t: (key: string) => string;
}

export const FocusMode = memo(function FocusMode({
  enabled,
  onToggle,
  timeRemaining,
  t,
}: FocusModeProps) {
  return (
    <button
      onClick={onToggle}
      className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all touch-manipulation ${
        enabled ? "bg-purple-500/20 text-purple-400" : "bg-white/5 text-white/60"
      }`}
    >
      <Focus size={16} />
      <span className="text-sm font-medium">{t("focus.mode") || "Focus"}</span>
      {enabled && timeRemaining && (
        <span className="text-xs bg-purple-500/30 px-2 py-0.5 rounded-full">
          {Math.floor(timeRemaining / 60)}m
        </span>
      )}
    </button>
  );
});

// =============== VOICE NOTES ===============
interface VoiceNotesProps {
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  recordings: { id: string; duration: number; timestamp: Date }[];
  t: (key: string) => string;
}

export const VoiceNotes = memo(function VoiceNotes({
  isRecording,
  onStartRecording,
  onStopRecording,
  recordings,
  t,
}: VoiceNotesProps) {
  return (
    <div className="space-y-2">
      <button
        onClick={isRecording ? onStopRecording : onStartRecording}
        className={`flex items-center gap-2 px-4 py-3 rounded-2xl transition-all touch-manipulation w-full ${
          isRecording
            ? "bg-rose-500 text-white animate-pulse"
            : "bg-white/5 text-white/60 hover:bg-white/10"
        }`}
      >
        {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
        <span className="font-medium">
          {isRecording ? t("voice.stopRecording") || "Stop Recording" : t("voice.startRecording") || "Voice Note"}
        </span>
        {isRecording && (
          <span className="ml-auto w-3 h-3 bg-white rounded-full animate-pulse" />
        )}
      </button>
      
      {recordings.length > 0 && (
        <div className="space-y-1">
          {recordings.slice(-3).map((rec) => (
            <div
              key={rec.id}
              className="flex items-center gap-2 p-2 bg-white/5 rounded-xl text-sm"
            >
              <Mic size={14} className="text-white/40" />
              <span className="text-white/60">{rec.duration}s</span>
              <span className="text-white/40 text-xs ml-auto">
                {rec.timestamp.toLocaleTimeString("de-CH", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

// =============== PROGRESS MILESTONES ===============
interface MilestoneProps {
  milestones: { id: string; label: string; reached: boolean; reward?: string }[];
  currentProgress: number;
  t: (key: string) => string;
}

export const ProgressMilestones = memo(function ProgressMilestones({
  milestones,
  currentProgress,
  t,
}: MilestoneProps) {
  return (
    <div className="space-y-3">
      <h4 className="text-white/60 text-sm font-medium flex items-center gap-2">
        <Target size={14} />
        {t("milestones.title") || "Milestones"}
      </h4>
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-white/10" />
        <motion.div
          className="absolute left-4 top-4 w-0.5 bg-gradient-to-b from-emerald-500 to-teal-500"
          initial={{ height: 0 }}
          animate={{ height: `${currentProgress}%` }}
        />
        
        {/* Milestone Items */}
        <div className="space-y-4">
          {milestones.map((milestone, idx) => (
            <motion.div
              key={milestone.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-center gap-3 pl-2"
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center z-10 ${
                milestone.reached
                  ? "bg-emerald-500 text-white"
                  : "bg-white/10 text-white/40"
              }`}>
                {milestone.reached ? "✓" : idx + 1}
              </div>
              <div className="flex-1">
                <div className={`text-sm font-medium ${milestone.reached ? "text-white" : "text-white/60"}`}>
                  {milestone.label}
                </div>
                {milestone.reward && milestone.reached && (
                  <div className="text-xs text-amber-400">🎁 {milestone.reward}</div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
});

// =============== SMART SUGGESTIONS ===============
interface SmartSuggestionProps {
  suggestions: { id: string; text: string; type: "tip" | "warning" | "insight" }[];
  onDismiss: (id: string) => void;
  t: (key: string) => string;
}

export const SmartSuggestions = memo(function SmartSuggestions({
  suggestions,
  onDismiss,
  t,
}: SmartSuggestionProps) {
  if (suggestions.length === 0) return null;
  
  return (
    <div className="space-y-2">
      <AnimatePresence mode="popLayout">
        {suggestions.map((suggestion) => (
          <motion.div
            key={suggestion.id}
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className={`p-3 rounded-2xl flex items-start gap-3 ${
              suggestion.type === "tip" ? "bg-sky-500/10 border border-sky-500/20" :
              suggestion.type === "warning" ? "bg-amber-500/10 border border-amber-500/20" :
              "bg-purple-500/10 border border-purple-500/20"
            }`}
          >
            <div className={`p-1.5 rounded-lg ${
              suggestion.type === "tip" ? "bg-sky-500/20" :
              suggestion.type === "warning" ? "bg-amber-500/20" :
              "bg-purple-500/20"
            }`}>
              {suggestion.type === "tip" && <Lightbulb size={14} className="text-sky-400" />}
              {suggestion.type === "warning" && <Bell size={14} className="text-amber-400" />}
              {suggestion.type === "insight" && <Brain size={14} className="text-purple-400" />}
            </div>
            <p className="flex-1 text-sm text-white/70">{suggestion.text}</p>
            <button
              onClick={() => onDismiss(suggestion.id)}
              className="text-white/30 hover:text-white/60"
            >
              ×
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
});

// =============== KEYBOARD SHORTCUTS PANEL ===============
interface ShortcutsPanelProps {
  shortcuts: { key: string; description: string }[];
  onClose: () => void;
  t: (key: string) => string;
}

export const ShortcutsPanel = memo(function ShortcutsPanel({
  shortcuts,
  onClose,
  t,
}: ShortcutsPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-800 rounded-2xl p-6 w-full max-w-sm"
      >
        <div className="flex items-center gap-3 mb-4">
          <Keyboard className="text-white/60" size={24} />
          <h3 className="text-lg font-bold text-white">{t("shortcuts.title") || "Keyboard Shortcuts"}</h3>
        </div>
        <div className="space-y-2">
          {shortcuts.map((shortcut) => (
            <div key={shortcut.key} className="flex items-center justify-between py-2">
              <span className="text-white/60 text-sm">{shortcut.description}</span>
              <kbd className="px-2 py-1 bg-white/10 rounded-lg text-white text-sm font-mono">
                {shortcut.key}
              </kbd>
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          className="w-full mt-4 py-3 bg-white/10 rounded-xl text-white font-medium"
        >
          {t("common.close") || "Close"}
        </button>
      </motion.div>
    </motion.div>
  );
});

// =============== SESSION HISTORY ===============
interface SessionHistoryProps {
  sessions: { id: string; date: Date; flowsCompleted: number; avgScore: number }[];
  onLoad: (id: string) => void;
  onClose: () => void;
  t: (key: string) => string;
}

export const SessionHistory = memo(function SessionHistory({
  sessions,
  onLoad,
  onClose,
  t,
}: SessionHistoryProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-800 rounded-2xl w-full max-w-md max-h-[70vh] flex flex-col overflow-hidden"
      >
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <History className="text-white/60" size={24} />
            <h3 className="text-lg font-bold text-white">{t("history.title") || "Session History"}</h3>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {sessions.length === 0 ? (
            <p className="text-white/40 text-center py-8">{t("history.empty") || "No previous sessions"}</p>
          ) : (
            sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => onLoad(session.id)}
                className="w-full p-4 bg-white/5 hover:bg-white/10 rounded-2xl text-left transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white font-medium">
                    {session.date.toLocaleDateString("de-CH")}
                  </span>
                  <span className="text-emerald-400 font-bold">{session.avgScore.toFixed(1)}</span>
                </div>
                <div className="text-white/40 text-sm">
                  {session.flowsCompleted} {t("history.flowsCompleted") || "flows completed"}
                </div>
              </button>
            ))
          )}
        </div>
        
        <div className="p-4 border-t border-white/10">
          <button
            onClick={onClose}
            className="w-full py-3 bg-white/10 rounded-xl text-white font-medium"
          >
            {t("common.close") || "Close"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
});

// =============== OFFLINE MODE INDICATOR ===============
interface OfflineModeProps {
  isOffline: boolean;
  pendingSync: number;
  onSync?: () => void;
  t: (key: string) => string;
}

export const OfflineMode = memo(function OfflineMode({
  isOffline,
  pendingSync,
  onSync,
  t,
}: OfflineModeProps) {
  if (!isOffline && pendingSync === 0) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center gap-2 px-3 py-2 rounded-xl ${
        isOffline ? "bg-amber-500/20 text-amber-400" : "bg-sky-500/20 text-sky-400"
      }`}
    >
      <WifiOff size={16} />
      <span className="text-sm font-medium">
        {isOffline ? t("offline.mode") || "Offline Mode" : `${pendingSync} ${t("offline.pending") || "pending sync"}`}
      </span>
      {!isOffline && onSync && (
        <button
          onClick={onSync}
          className="ml-auto text-xs bg-white/10 px-2 py-1 rounded-lg"
        >
          {t("offline.sync") || "Sync"}
        </button>
      )}
    </motion.div>
  );
});

// =============== QUICK BOOKMARK ===============
interface BookmarkProps {
  isBookmarked: boolean;
  onToggle: () => void;
  label?: string;
}

export const QuickBookmark = memo(function QuickBookmark({
  isBookmarked,
  onToggle,
  label,
}: BookmarkProps) {
  return (
    <button
      onClick={onToggle}
      className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all touch-manipulation ${
        isBookmarked ? "bg-amber-500/20 text-amber-400" : "bg-white/5 text-white/60"
      }`}
    >
      <Bookmark size={16} fill={isBookmarked ? "currentColor" : "none"} />
      {label && <span className="text-sm font-medium">{label}</span>}
    </button>
  );
});

// =============== NAVIGATION COMPASS ===============
interface NavigationCompassProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
  onNavigate: (step: number) => void;
  t: (key: string) => string;
}

export const NavigationCompass = memo(function NavigationCompass({
  currentStep,
  totalSteps,
  stepLabels,
  onNavigate,
  t,
}: NavigationCompassProps) {
  return (
    <div className="bg-white/5 rounded-2xl p-4 space-y-3">
      <div className="flex items-center gap-2 text-white/60 text-sm">
        <Compass size={16} />
        <span>{t("compass.navigation") || "Quick Navigation"}</span>
      </div>
      <div className="flex gap-1 overflow-x-auto pb-1">
        {stepLabels.map((label, idx) => (
          <button
            key={idx}
            onClick={() => onNavigate(idx)}
            disabled={idx > currentStep}
            className={`shrink-0 px-3 py-2 rounded-xl text-xs font-medium transition-all touch-manipulation ${
              idx === currentStep
                ? "bg-emerald-500 text-white"
                : idx < currentStep
                ? "bg-white/10 text-white/60 hover:bg-white/20"
                : "bg-white/5 text-white/30 cursor-not-allowed"
            }`}
          >
            {idx + 1}. {label.slice(0, 8)}...
          </button>
        ))}
      </div>
    </div>
  );
});

// =============== COMPARISON MODE TOGGLE ===============
interface ComparisonModeProps {
  enabled: boolean;
  onToggle: () => void;
  selectedFlows: string[];
  t: (key: string) => string;
}

export const ComparisonMode = memo(function ComparisonMode({
  enabled,
  onToggle,
  selectedFlows,
  t,
}: ComparisonModeProps) {
  return (
    <button
      onClick={onToggle}
      className={`flex items-center gap-2 px-4 py-3 rounded-2xl transition-all touch-manipulation ${
        enabled ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30" : "bg-white/5 text-white/60"
      }`}
    >
      <GitCompare size={18} />
      <span className="font-medium">{t("comparison.mode") || "Compare Mode"}</span>
      {enabled && selectedFlows.length > 0 && (
        <span className="ml-auto bg-indigo-500/30 px-2 py-0.5 rounded-full text-xs">
          {selectedFlows.length}
        </span>
      )}
    </button>
  );
});

// =============== GAMIFICATION BADGE ===============
interface GamificationBadgeProps {
  level: number;
  xp: number;
  xpToNextLevel: number;
  title: string;
}

export const GamificationBadge = memo(function GamificationBadge({
  level,
  xp,
  xpToNextLevel,
  title,
}: GamificationBadgeProps) {
  const progress = (xp / xpToNextLevel) * 100;
  
  return (
    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl">
      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
        <span className="text-white font-bold text-lg">{level}</span>
      </div>
      <div className="flex-1">
        <div className="text-white font-semibold text-sm">{title}</div>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-white/40">{xp}/{xpToNextLevel}</span>
        </div>
      </div>
    </div>
  );
});
