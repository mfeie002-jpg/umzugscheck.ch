import * as React from 'react';
import { supabase } from '@/integrations/supabase/client';
const { useEffect } = React;

interface AuditLogEntry {
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  userId?: string;
}

/**
 * Client-side audit logging for security-sensitive actions
 * In production, this would send to a backend endpoint
 */
export async function logAuditEvent(entry: AuditLogEntry): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  
  const logEntry = {
    ...entry,
    userId: user?.id || 'anonymous',
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
  };

  // In development, log to console
  if (import.meta.env.DEV) {
    console.log('[AUDIT]', logEntry);
  }

  // In production, you would send this to a backend logging service
  // For now, we store in localStorage for demo purposes
  try {
    const existingLogs = JSON.parse(localStorage.getItem('audit_logs') || '[]');
    existingLogs.push(logEntry);
    // Keep only last 100 entries
    const trimmedLogs = existingLogs.slice(-100);
    localStorage.setItem('audit_logs', JSON.stringify(trimmedLogs));
  } catch {
    // Silently fail - don't break the app for audit logging
  }
}

/**
 * Pre-defined audit actions for common security events
 */
export const AuditActions = {
  LOGIN_SUCCESS: 'auth.login.success',
  LOGIN_FAILURE: 'auth.login.failure',
  LOGOUT: 'auth.logout',
  PASSWORD_CHANGE: 'auth.password.change',
  PROFILE_UPDATE: 'user.profile.update',
  ADMIN_ACCESS: 'admin.access',
  DATA_EXPORT: 'data.export',
  DATA_DELETE: 'data.delete',
  FORM_SUBMIT: 'form.submit',
  MOVE_CREATE: 'move.create',
  MOVE_UPDATE: 'move.update',
  DOCUMENT_UPLOAD: 'document.upload',
  DOCUMENT_DELETE: 'document.delete',
} as const;

/**
 * Hook to log admin page access
 */
export function useAdminAccessLogger() {
  useEffect(() => {
    logAuditEvent({
      action: AuditActions.ADMIN_ACCESS,
      resource: 'admin_dashboard',
      details: { path: window.location.pathname },
    });
  }, []);
}

/**
 * Hook to log auth events
 */
export function useAuthAuditLogger() {
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        logAuditEvent({
          action: AuditActions.LOGIN_SUCCESS,
          resource: 'auth',
          userId: session?.user?.id,
          details: { provider: session?.user?.app_metadata?.provider },
        });
      } else if (event === 'SIGNED_OUT') {
        logAuditEvent({
          action: AuditActions.LOGOUT,
          resource: 'auth',
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);
}
