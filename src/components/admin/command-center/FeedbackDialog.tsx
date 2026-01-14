/**
 * ARCHETYP COMMAND CENTER - Feedback Dialog
 * 
 * Simple dialog to add/edit AI feedback for a version.
 */

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MessageSquare, Loader2 } from 'lucide-react';
import type { AssetVersion, AISource } from './types';

const AI_SOURCES: { value: AISource; label: string; icon: string }[] = [
  { value: 'chatgpt', label: 'ChatGPT', icon: '🤖' },
  { value: 'gemini', label: 'Gemini', icon: '✨' },
  { value: 'claude', label: 'Claude', icon: '🧠' },
  { value: 'other', label: 'Anderer', icon: '💬' },
];

interface FeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  version: AssetVersion | null;
  onSave: (feedback: string, source: AISource) => void;
}

export function FeedbackDialog({
  open,
  onOpenChange,
  version,
  onSave,
}: FeedbackDialogProps) {
  const [feedback, setFeedback] = useState('');
  const [source, setSource] = useState<AISource>('chatgpt');
  const [isSaving, setIsSaving] = useState(false);

  // Reset form when version changes
  useEffect(() => {
    if (version) {
      setFeedback(version.aiFeedback || '');
      setSource(version.aiFeedbackSource || 'chatgpt');
    }
  }, [version]);

  const handleSave = async () => {
    if (!feedback.trim()) return;
    
    setIsSaving(true);
    try {
      await onSave(feedback, source);
    } finally {
      setIsSaving(false);
    }
  };

  if (!version) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            AI Feedback - Version {version.versionNumber}
          </DialogTitle>
          <DialogDescription>
            Füge das Feedback von ChatGPT, Gemini oder Claude ein
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 space-y-4 py-4 overflow-y-auto">
          {/* AI Source Selection */}
          <div className="space-y-2">
            <Label>AI Quelle</Label>
            <div className="flex gap-2 flex-wrap">
              {AI_SOURCES.map((s) => (
                <Button
                  key={s.value}
                  variant={source === s.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSource(s.value)}
                  className="gap-1"
                >
                  <span>{s.icon}</span>
                  {s.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Feedback Text */}
          <div className="space-y-2">
            <Label>Feedback</Label>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Füge hier das AI-Feedback ein..."
              className="min-h-[200px] font-mono text-sm"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Abbrechen
          </Button>
          <Button onClick={handleSave} disabled={!feedback.trim() || isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Speichern...
              </>
            ) : (
              'Speichern'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
