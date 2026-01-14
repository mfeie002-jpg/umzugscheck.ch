/**
 * ARCHETYP COMMAND CENTER - Stats Bar
 * 
 * Key metrics at a glance. No clutter.
 */

import React from 'react';
import { Layers, MapPin, TrendingUp, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CommandCenterStats } from './types';

interface StatsBarProps {
  stats: CommandCenterStats;
}

export function StatsBar({ stats }: StatsBarProps) {
  const items = [
    {
      icon: Layers,
      label: 'Flows',
      value: stats.totalFlows,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-950',
    },
    {
      icon: MapPin,
      label: 'Pages',
      value: stats.totalPages,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-950',
    },
    {
      icon: TrendingUp,
      label: 'Ø Score',
      value: `${stats.avgScore}/100`,
      color: stats.avgScore >= 70 ? 'text-green-600' : stats.avgScore >= 50 ? 'text-yellow-600' : 'text-red-600',
      bgColor: stats.avgScore >= 70 ? 'bg-green-100 dark:bg-green-950' : stats.avgScore >= 50 ? 'bg-yellow-100 dark:bg-yellow-950' : 'bg-red-100 dark:bg-red-950',
    },
    {
      icon: MessageSquare,
      label: 'Ohne Feedback',
      value: stats.pendingFeedback,
      color: stats.pendingFeedback > 0 ? 'text-orange-600' : 'text-green-600',
      bgColor: stats.pendingFeedback > 0 ? 'bg-orange-100 dark:bg-orange-950' : 'bg-green-100 dark:bg-green-950',
    },
  ];

  return (
    <div className="h-12 border-b bg-muted/30 px-4 flex items-center gap-6">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <div className={cn('p-1.5 rounded', item.bgColor)}>
            <item.icon className={cn('h-3.5 w-3.5', item.color)} />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className={cn('text-sm font-medium', item.color)}>
              {item.value}
            </span>
            <span className="text-xs text-muted-foreground">
              {item.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
