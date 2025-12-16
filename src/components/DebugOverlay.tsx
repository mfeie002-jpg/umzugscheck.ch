/**
 * Debug Overlay for Development
 * 
 * Shows analytics events, consent status, AB variants
 * Only visible when localStorage.uc_debug = 'true'
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bug, X, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { isDebugMode, getDebugEvents, getConsent, clearDebugEvents } from '@/lib/consent';

interface DebugEvent {
  event: string;
  payload: Record<string, any>;
  timestamp: number;
}

export function DebugOverlay() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [events, setEvents] = useState<DebugEvent[]>([]);
  const [copied, setCopied] = useState(false);
  const consent = getConsent();

  useEffect(() => {
    // Check if debug mode is enabled
    setIsVisible(isDebugMode());
    setEvents(getDebugEvents());

    // Listen for new events
    const handleEvent = () => {
      setEvents([...getDebugEvents()]);
    };

    window.addEventListener('debug-event', handleEvent);
    
    // Poll for events (backup)
    const interval = setInterval(() => {
      setEvents([...getDebugEvents()]);
    }, 1000);

    return () => {
      window.removeEventListener('debug-event', handleEvent);
      clearInterval(interval);
    };
  }, []);

  const copyToClipboard = useCallback(() => {
    const data = {
      consent,
      events: events.slice(0, 20),
      timestamp: new Date().toISOString()
    };
    
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [consent, events]);

  const handleClear = () => {
    clearDebugEvents();
    setEvents([]);
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ x: 300 }}
      animate={{ x: 0 }}
      className="fixed top-20 right-4 z-[9999] w-80 max-h-[80vh] bg-slate-900 text-white rounded-lg shadow-2xl overflow-hidden font-mono text-xs"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <Bug className="w-4 h-4 text-green-400" />
          <span className="font-semibold text-sm">Debug Panel</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-slate-400 hover:text-white hover:bg-slate-700"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-slate-400 hover:text-white hover:bg-slate-700"
            onClick={() => setIsVisible(false)}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            {/* Consent Status */}
            <div className="p-3 border-b border-slate-700">
              <div className="text-slate-400 mb-1">Consent Status</div>
              <div className="flex gap-2">
                <span className={`px-2 py-0.5 rounded text-xs ${
                  consent.analytics ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  Analytics: {consent.analytics ? 'ON' : 'OFF'}
                </span>
                <span className="px-2 py-0.5 rounded text-xs bg-green-500/20 text-green-400">
                  Necessary: ON
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="p-3 border-b border-slate-700 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
                onClick={copyToClipboard}
              >
                {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                {copied ? 'Copied!' : 'Copy Events'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
                onClick={handleClear}
              >
                Clear
              </Button>
            </div>

            {/* Events List */}
            <div className="max-h-80 overflow-y-auto">
              <div className="p-2">
                <div className="text-slate-400 mb-2">
                  Recent Events ({events.length})
                </div>
                {events.length === 0 ? (
                  <div className="text-slate-500 text-center py-4">
                    No events yet
                  </div>
                ) : (
                  <div className="space-y-2">
                    {events.slice(0, 10).map((event, i) => (
                      <div
                        key={`${event.timestamp}-${i}`}
                        className="bg-slate-800 rounded p-2"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-green-400 font-semibold">
                            {event.event}
                          </span>
                          <span className="text-slate-500 text-[10px]">
                            {new Date(event.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <pre className="text-slate-300 text-[10px] overflow-x-auto">
                          {JSON.stringify(event.payload, null, 1)}
                        </pre>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default DebugOverlay;
