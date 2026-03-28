/**
 * ARCHETYP COMMAND CENTER - Types
 * 
 * Simple, focused types. No overengineering.
 */

// ─────────────────────────────────────────────────────────────
// Asset Types - What we manage
// ─────────────────────────────────────────────────────────────

export type AssetType = 'flow' | 'landing-page';

export interface Asset {
  id: string;
  type: AssetType;
  name: string;
  path: string;
  score: number | null;
  lastUpdated: string | null;
  versionCount: number;
  hasFeedback: boolean;
  metadata?: Record<string, any>;
}

export interface AssetVersion {
  id: string;
  assetId: string;
  versionNumber: number;
  versionName: string | null;
  desktopScreenshot: string | null;
  mobileScreenshot: string | null;
  aiFeedback: string | null;
  aiFeedbackSource: 'chatgpt' | 'gemini' | 'claude' | 'other' | null;
  aiFeedbackDate: string | null;
  score: number | null;
  createdAt: string;
}

// ─────────────────────────────────────────────────────────────
// Score Types
// ─────────────────────────────────────────────────────────────

export interface AssetScore {
  overall: number | null;
  ux: number | null;
  mobile: number | null;
  conversion: number | null;
  trust: number | null;
  performance: number | null;
  accessibility: number | null;
}

// ─────────────────────────────────────────────────────────────
// Action Types
// ─────────────────────────────────────────────────────────────

export type ActionType = 
  | 'capture-screenshot'
  | 'add-feedback'
  | 'analyze'
  | 'compare'
  | 'export';

// ─────────────────────────────────────────────────────────────
// AI Feedback
// ─────────────────────────────────────────────────────────────

export type AISource = 'chatgpt' | 'gemini' | 'claude' | 'other';

export interface AIFeedback {
  content: string;
  source: AISource;
  date: string;
}

export const AI_SOURCES: { value: AISource; label: string; icon: string }[] = [
  { value: 'chatgpt', label: 'ChatGPT', icon: '🤖' },
  { value: 'gemini', label: 'Gemini', icon: '✨' },
  { value: 'claude', label: 'Claude', icon: '🧠' },
  { value: 'other', label: 'Anderer', icon: '💬' },
];

// ─────────────────────────────────────────────────────────────
// Stats
// ─────────────────────────────────────────────────────────────

export interface CommandCenterStats {
  totalFlows: number;
  totalPages: number;
  avgScore: number;
  pendingFeedback: number;
}
