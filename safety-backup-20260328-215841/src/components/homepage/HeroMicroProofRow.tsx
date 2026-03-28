/**
 * HeroMicroProofRow - Compact social proof line for Hero
 * Shows: Rating + Online count + Last request
 * 
 * Example: ★ 4.8/5 (15'000+) · 🟢 42 online · Letzte: Genf → Zug (8 Min)
 */

import { memo, useState, useEffect } from "react";
import { Star, Users, MapPin, Clock } from "lucide-react";
import { TRUST } from "@/content/trust";

interface HeroMicroProofRowProps {
  className?: string;
}

// Swiss cities for rotating activity
const ROUTES = [
  { from: "Zürich", to: "Bern", minutesAgo: 3 },
  { from: "Basel", to: "Luzern", minutesAgo: 5 },
  { from: "Genf", to: "Lausanne", minutesAgo: 8 },
  { from: "Bern", to: "Zürich", minutesAgo: 2 },
  { from: "Luzern", to: "Zug", minutesAgo: 6 },
];

export const HeroMicroProofRow = memo(function HeroMicroProofRow({ 
  className = "" 
}: HeroMicroProofRowProps) {
  const [onlineCount, setOnlineCount] = useState(42);
  const [routeIndex, setRouteIndex] = useState(0);
  const [showRoute, setShowRoute] = useState(true);
  
  // Generate pseudo-live online count (session-consistent)
  useEffect(() => {
    const storageKey = "hero_micro_online";
    const stored = sessionStorage.getItem(storageKey);
    
    if (stored) {
      setOnlineCount(parseInt(stored, 10));
    } else {
      // Random between 35-65
      const count = Math.floor(Math.random() * 31) + 35;
      setOnlineCount(count);
      sessionStorage.setItem(storageKey, count.toString());
    }
    
    // Small drift every 30s
    const interval = setInterval(() => {
      setOnlineCount(prev => {
        const drift = Math.floor(Math.random() * 5) - 2;
        const newCount = Math.max(25, Math.min(75, prev + drift));
        sessionStorage.setItem(storageKey, newCount.toString());
        return newCount;
      });
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Rotate routes every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setShowRoute(false);
      setTimeout(() => {
        setRouteIndex(prev => (prev + 1) % ROUTES.length);
        setShowRoute(true);
      }, 300);
    }, 6000);
    
    return () => clearInterval(interval);
  }, []);
  
  const currentRoute = ROUTES[routeIndex];
  
  return (
    <div className={`flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs text-muted-foreground ${className}`}>
      {/* Rating */}
      <span className="inline-flex items-center gap-1">
        <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
        <span className="font-medium text-foreground">{TRUST.ratingValue}/5</span>
        <span>({TRUST.movesCount})</span>
      </span>
      
      <span className="text-muted-foreground/50">·</span>
      
      {/* Online count */}
      <span className="inline-flex items-center gap-1">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
        </span>
        <Users className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="font-medium text-foreground">{onlineCount}</span>
        <span>online</span>
      </span>
      
      <span className="text-muted-foreground/50 hidden sm:inline">·</span>
      
      {/* Last request (hidden on very small screens) */}
      <span 
        className={`hidden sm:inline-flex items-center gap-1 transition-opacity duration-300 ${
          showRoute ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="font-medium text-foreground">
          {currentRoute.from} → {currentRoute.to}
        </span>
        <Clock className="w-3 h-3 text-muted-foreground" />
        <span>({currentRoute.minutesAgo} Min)</span>
      </span>
    </div>
  );
});

export default HeroMicroProofRow;
