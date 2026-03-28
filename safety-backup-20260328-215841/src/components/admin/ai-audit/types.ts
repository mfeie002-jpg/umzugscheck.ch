/**
 * AI Audit System - Type Definitions
 */

export interface AuditCategory {
  id: string;
  name: string;
  icon: string;
  score: number;
  maxScore: number;
  issues: AuditIssue[];
  recommendations: string[];
}

export interface AuditIssue {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  impact: string;
  fix: string;
  category: string;
  affectedPages?: string[];
}

export interface CompetitorData {
  name: string;
  url: string;
  logo?: string;
  features: Record<string, boolean>;
  scores: {
    seo: number;
    ux: number;
    trust: number;
    conversion: number;
  };
}

export interface SiteHealthReport {
  overallScore: number;
  generatedAt: string;
  categories: {
    seo: AuditCategory;
    ux: AuditCategory;
    performance: AuditCategory;
    trust: AuditCategory;
  };
  quickWins: AuditIssue[];
  criticalIssues: AuditIssue[];
}

export interface DeepResearchPackage {
  projectName: string;
  exportedAt: string;
  targetAI: 'chatgpt' | 'gemini' | 'both';
  includes: {
    codeExport: boolean;
    screenshots: boolean;
    htmlSnapshots: boolean;
    flowData: boolean;
    competitorData: boolean;
  };
  files: {
    name: string;
    type: string;
    size: number;
  }[];
}

export interface AIAnalysisResult {
  category: string;
  score: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  priority: 'high' | 'medium' | 'low';
}

export type AuditFocusArea = 'seo' | 'ux' | 'performance' | 'trust';
