// Centralized conversion tracking for analytics

export interface ConversionEvent {
  type: 'exit_intent_shown' | 'exit_intent_converted' | 'exit_intent_dismissed' | 
        'recommendation_shown' | 'recommendation_clicked' | 'recommendation_dismissed' |
        'scroll_milestone' | 'cta_click' | 'form_start' | 'form_complete';
  data?: Record<string, any>;
  timestamp: string;
  path: string;
}

const STORAGE_KEY = 'conversion-analytics';

export const trackConversion = (
  type: ConversionEvent['type'], 
  data?: Record<string, any>
) => {
  const events = getConversionEvents();
  
  const event: ConversionEvent = {
    type,
    data,
    timestamp: new Date().toISOString(),
    path: window.location.pathname,
  };
  
  events.push(event);
  
  // Keep last 500 events
  const trimmed = events.slice(-500);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  
  // Dispatch custom event for real-time updates
  window.dispatchEvent(new CustomEvent('conversion-tracked', { detail: event }));
};

export const getConversionEvents = (): ConversionEvent[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
};

export const getConversionStats = () => {
  const events = getConversionEvents();
  
  // Exit Intent Stats
  const exitIntentShown = events.filter(e => e.type === 'exit_intent_shown').length;
  const exitIntentConverted = events.filter(e => e.type === 'exit_intent_converted').length;
  const exitIntentDismissed = events.filter(e => e.type === 'exit_intent_dismissed').length;
  const exitIntentRate = exitIntentShown > 0 
    ? ((exitIntentConverted / exitIntentShown) * 100).toFixed(1) 
    : '0';
  
  // Recommendation Stats
  const recommendationShown = events.filter(e => e.type === 'recommendation_shown').length;
  const recommendationClicked = events.filter(e => e.type === 'recommendation_clicked').length;
  const recommendationDismissed = events.filter(e => e.type === 'recommendation_dismissed').length;
  const recommendationRate = recommendationShown > 0 
    ? ((recommendationClicked / recommendationShown) * 100).toFixed(1) 
    : '0';
  
  // Recommendation clicks by service
  const recommendationsByService = events
    .filter(e => e.type === 'recommendation_clicked')
    .reduce((acc: Record<string, number>, e) => {
      const service = e.data?.title || 'Unbekannt';
      acc[service] = (acc[service] || 0) + 1;
      return acc;
    }, {});
  
  // Scroll depth distribution
  const scrollEvents = events.filter(e => e.type === 'scroll_milestone');
  const scrollDepthCounts = scrollEvents.reduce((acc: Record<number, number>, e) => {
    const depth = e.data?.depth || 0;
    acc[depth] = (acc[depth] || 0) + 1;
    return acc;
  }, {});
  
  // Form funnel
  const formStarts = events.filter(e => e.type === 'form_start').length;
  const formCompletes = events.filter(e => e.type === 'form_complete').length;
  const formConversionRate = formStarts > 0 
    ? ((formCompletes / formStarts) * 100).toFixed(1) 
    : '0';

  // CTA Click Stats
  const ctaEvents = events.filter(e => e.type === 'cta_click');
  const ctaByName = ctaEvents.reduce((acc: Record<string, number>, e) => {
    const name = e.data?.cta_name || 'Unbekannt';
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});
  const ctaByLocation = ctaEvents.reduce((acc: Record<string, number>, e) => {
    const location = e.data?.cta_location || 'Unbekannt';
    acc[location] = (acc[location] || 0) + 1;
    return acc;
  }, {});
  
  // Timeline data (last 7 days)
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const timelineData = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split('T')[0];
    const dayEvents = events.filter(e => e.timestamp.startsWith(dateStr));
    
    timelineData.push({
      date: date.toLocaleDateString('de-CH', { weekday: 'short' }),
      exitIntent: dayEvents.filter(e => e.type === 'exit_intent_converted').length,
      recommendations: dayEvents.filter(e => e.type === 'recommendation_clicked').length,
      ctaClicks: dayEvents.filter(e => e.type === 'cta_click').length,
    });
  }
  
  return {
    exitIntent: {
      shown: exitIntentShown,
      converted: exitIntentConverted,
      dismissed: exitIntentDismissed,
      rate: exitIntentRate,
    },
    recommendations: {
      shown: recommendationShown,
      clicked: recommendationClicked,
      dismissed: recommendationDismissed,
      rate: recommendationRate,
      byService: recommendationsByService,
    },
    scrollDepth: scrollDepthCounts,
    forms: {
      starts: formStarts,
      completes: formCompletes,
      rate: formConversionRate,
    },
    cta: {
      total: ctaEvents.length,
      byName: ctaByName,
      byLocation: ctaByLocation,
    },
    timeline: timelineData,
    totalEvents: events.length,
  };
};

export const clearConversionData = () => {
  localStorage.removeItem(STORAGE_KEY);
};
