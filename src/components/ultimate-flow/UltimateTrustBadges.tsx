/**
 * Ultimate Trust Badges
 * 
 * Schweizer Qualitätslabels + Kundenbewertungen
 * Prominent im Header platziert
 */

import { Shield, Star, Clock, Users } from "lucide-react";

export function UltimateTrustBadges() {
  return (
    <div className="flex items-center justify-between gap-2">
      {/* Logo/Brand */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-sm">UC</span>
        </div>
        <span className="font-semibold text-foreground hidden sm:inline">
          Umzugscheck.ch
        </span>
      </div>

      {/* Trust Indicators */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Rating */}
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          <span className="text-sm font-medium">4.9</span>
          <span className="text-xs text-muted-foreground hidden sm:inline">
            (2.4k)
          </span>
        </div>

        {/* Free */}
        <div className="flex items-center gap-1 text-green-600">
          <Shield className="h-4 w-4" />
          <span className="text-xs font-medium">Kostenlos</span>
        </div>

        {/* Fast */}
        <div className="hidden sm:flex items-center gap-1 text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span className="text-xs">~2 Min</span>
        </div>
      </div>
    </div>
  );
}

export function UltimateTrustPills({ context = 'default' }: { context?: string }) {
  const pills = {
    default: [
      { icon: Shield, text: "100% kostenlos", color: "text-green-600" },
      { icon: Users, text: "200+ Firmen", color: "text-primary" },
      { icon: Clock, text: "Antwort in 24h", color: "text-muted-foreground" },
    ],
    contact: [
      { icon: Shield, text: "Daten geschützt", color: "text-green-600" },
      { icon: Clock, text: "Keine Telefonpflicht", color: "text-primary" },
      { icon: Users, text: "Nur an gewählte Firmen", color: "text-muted-foreground" },
    ],
    summary: [
      { icon: Shield, text: "Unverbindlich", color: "text-green-600" },
      { icon: Star, text: "Geprüfte Partner", color: "text-yellow-600" },
      { icon: Clock, text: "Jederzeit änderbar", color: "text-muted-foreground" },
    ],
  };

  const items = pills[context as keyof typeof pills] || pills.default;

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {items.map((item, i) => (
        <div 
          key={i}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 ${item.color}`}
        >
          <item.icon className="h-3.5 w-3.5" />
          <span className="text-xs font-medium">{item.text}</span>
        </div>
      ))}
    </div>
  );
}
