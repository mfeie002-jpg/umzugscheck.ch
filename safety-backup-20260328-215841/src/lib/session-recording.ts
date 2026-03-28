/**
 * Session Recording Integration
 * Tracks user interactions for UX insights
 * Privacy-compliant with anonymization
 */

interface SessionEvent {
  type: 'click' | 'scroll' | 'input' | 'navigation' | 'error' | 'conversion';
  timestamp: number;
  data: Record<string, any>;
}

interface SessionData {
  sessionId: string;
  startTime: number;
  events: SessionEvent[];
  metadata: {
    userAgent: string;
    screenSize: string;
    referrer: string;
    entryPage: string;
    deviceType: 'mobile' | 'tablet' | 'desktop';
  };
}

class SessionRecorder {
  private session: SessionData | null = null;
  private isRecording = false;
  private maxEvents = 500;
  private flushInterval: NodeJS.Timeout | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initSession();
    }
  }

  private initSession() {
    const sessionId = this.getOrCreateSessionId();
    
    this.session = {
      sessionId,
      startTime: Date.now(),
      events: [],
      metadata: {
        userAgent: navigator.userAgent,
        screenSize: `${window.innerWidth}x${window.innerHeight}`,
        referrer: document.referrer || 'direct',
        entryPage: window.location.pathname,
        deviceType: this.getDeviceType()
      }
    };
  }

  private getOrCreateSessionId(): string {
    const key = 'umzugscheck_session_id';
    let sessionId = sessionStorage.getItem(key);
    
    if (!sessionId) {
      sessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem(key, sessionId);
    }
    
    return sessionId;
  }

  private getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  start() {
    if (this.isRecording || typeof window === 'undefined') return;
    
    this.isRecording = true;
    this.attachListeners();
    
    // Flush events periodically
    this.flushInterval = setInterval(() => this.flush(), 30000);
    
    // Flush on page unload
    window.addEventListener('beforeunload', () => this.flush());
  }

  stop() {
    this.isRecording = false;
    this.detachListeners();
    
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
    
    this.flush();
  }

  private attachListeners() {
    // Click tracking
    document.addEventListener('click', this.handleClick);
    
    // Scroll tracking (debounced)
    let scrollTimeout: NodeJS.Timeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => this.handleScroll(), 150);
    });
    
    // Input tracking (anonymized)
    document.addEventListener('input', this.handleInput);
    
    // Error tracking
    window.addEventListener('error', this.handleError);
    
    // Navigation tracking
    window.addEventListener('popstate', this.handleNavigation);
  }

  private detachListeners() {
    document.removeEventListener('click', this.handleClick);
    document.removeEventListener('input', this.handleInput);
    window.removeEventListener('error', this.handleError);
    window.removeEventListener('popstate', this.handleNavigation);
  }

  private handleClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    
    this.recordEvent('click', {
      element: this.getElementSelector(target),
      text: this.sanitizeText(target.textContent?.slice(0, 50)),
      position: { x: e.clientX, y: e.clientY },
      isButton: target.tagName === 'BUTTON' || target.closest('button') !== null,
      isLink: target.tagName === 'A' || target.closest('a') !== null,
      isCTA: target.classList.contains('cta') || target.closest('[data-cta]') !== null
    });
  };

  private handleScroll = () => {
    const scrollPercent = Math.round(
      (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
    );
    
    this.recordEvent('scroll', {
      scrollPercent,
      scrollY: window.scrollY,
      page: window.location.pathname
    });
  };

  private handleInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    
    // Don't record actual values for privacy
    this.recordEvent('input', {
      element: this.getElementSelector(target),
      fieldType: target.type,
      fieldName: target.name || target.id,
      hasValue: !!target.value,
      valueLength: target.value?.length || 0
    });
  };

  private handleError = (e: ErrorEvent) => {
    this.recordEvent('error', {
      message: e.message,
      filename: e.filename,
      lineno: e.lineno,
      page: window.location.pathname
    });
  };

  private handleNavigation = () => {
    this.recordEvent('navigation', {
      from: this.session?.metadata.entryPage,
      to: window.location.pathname
    });
  };

  recordConversion(type: string, data: Record<string, any> = {}) {
    this.recordEvent('conversion', {
      conversionType: type,
      ...data,
      page: window.location.pathname
    });
  }

  private recordEvent(type: SessionEvent['type'], data: Record<string, any>) {
    if (!this.session || !this.isRecording) return;
    
    // Limit events to prevent memory issues
    if (this.session.events.length >= this.maxEvents) {
      this.flush();
      this.session.events = [];
    }
    
    this.session.events.push({
      type,
      timestamp: Date.now(),
      data
    });
  }

  private getElementSelector(el: HTMLElement): string {
    const parts: string[] = [];
    
    if (el.id) {
      return `#${el.id}`;
    }
    
    if (el.className && typeof el.className === 'string') {
      const classes = el.className.split(' ').filter(c => c && !c.startsWith('_')).slice(0, 2);
      if (classes.length) {
        parts.push(`.${classes.join('.')}`);
      }
    }
    
    parts.unshift(el.tagName.toLowerCase());
    
    return parts.join('');
  }

  private sanitizeText(text: string | undefined): string {
    if (!text) return '';
    
    // Remove any potential PII patterns
    return text
      .replace(/\b[\w.-]+@[\w.-]+\.\w{2,}\b/g, '[email]')
      .replace(/\b\d{10,}\b/g, '[phone]')
      .replace(/\b\d{4}\b/g, '[plz]')
      .trim();
  }

  private async flush() {
    if (!this.session || this.session.events.length === 0) return;
    
    const payload = {
      ...this.session,
      flushedAt: Date.now()
    };
    
    // Store locally for now (in production, send to analytics endpoint)
    try {
      const stored = localStorage.getItem('umzugscheck_session_events') || '[]';
      const sessions = JSON.parse(stored);
      sessions.push(payload);
      
      // Keep only last 10 sessions
      if (sessions.length > 10) {
        sessions.shift();
      }
      
      localStorage.setItem('umzugscheck_session_events', JSON.stringify(sessions));
    } catch (error) {
      console.warn('Failed to store session data:', error);
    }
    
    // Clear events after flush
    this.session.events = [];
  }

  // Analytics helpers
  getSessionDuration(): number {
    if (!this.session) return 0;
    return Date.now() - this.session.startTime;
  }

  getEventCount(): number {
    return this.session?.events.length || 0;
  }

  getScrollDepth(): number {
    const scrollEvents = this.session?.events.filter(e => e.type === 'scroll') || [];
    if (scrollEvents.length === 0) return 0;
    
    return Math.max(...scrollEvents.map(e => e.data.scrollPercent || 0));
  }

  getClickHeatmapData(): { x: number; y: number; intensity: number }[] {
    const clickEvents = this.session?.events.filter(e => e.type === 'click') || [];
    
    // Group clicks by position (rounded to 50px grid)
    const grouped = new Map<string, number>();
    
    for (const event of clickEvents) {
      const x = Math.round(event.data.position?.x / 50) * 50;
      const y = Math.round(event.data.position?.y / 50) * 50;
      const key = `${x},${y}`;
      grouped.set(key, (grouped.get(key) || 0) + 1);
    }
    
    return Array.from(grouped.entries()).map(([key, count]) => {
      const [x, y] = key.split(',').map(Number);
      return { x, y, intensity: count };
    });
  }
}

// Singleton instance
export const sessionRecorder = new SessionRecorder();

// React hook for session recording
export function useSessionRecording() {
  return {
    start: () => sessionRecorder.start(),
    stop: () => sessionRecorder.stop(),
    recordConversion: (type: string, data?: Record<string, any>) => 
      sessionRecorder.recordConversion(type, data),
    getSessionDuration: () => sessionRecorder.getSessionDuration(),
    getScrollDepth: () => sessionRecorder.getScrollDepth()
  };
}

export default sessionRecorder;
