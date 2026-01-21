/**
 * Vision Roadmap Timeline Component
 * Shows comprehensive progress: what's done, where we are, what's next
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { 
  CheckCircle2, Clock, Circle, Rocket, Trophy, 
  Code2, Database, Palette, Zap, Target, TrendingUp,
  Calendar, Star, ArrowRight
} from "lucide-react";
import type { VisionTranslations } from "@/lib/vision-translations";

interface VisionRoadmapTimelineProps {
  t: VisionTranslations;
}

export const VisionRoadmapTimeline = memo(({ t }: VisionRoadmapTimelineProps) => {
  // Calculate overall progress
  const calculateProgress = () => {
    let completed = 0;
    let inProgress = 0;
    let total = 0;
    
    t.roadmap.phases.forEach(phase => {
      phase.items.forEach(item => {
        total++;
        if (item.startsWith('✅')) completed++;
        if (item.startsWith('🔄')) inProgress++;
      });
    });
    
    return {
      completed,
      inProgress,
      total,
      percentage: Math.round(((completed + inProgress * 0.5) / total) * 100)
    };
  };
  
  const progress = calculateProgress();
  
  const getPhaseStatus = (items: string[]) => {
    const completed = items.filter(i => i.startsWith('✅')).length;
    const inProgress = items.filter(i => i.startsWith('🔄')).length;
    const total = items.length;
    
    if (completed === total) return 'completed';
    if (completed > 0 || inProgress > 0) return 'in-progress';
    return 'upcoming';
  };
  
  const getPhaseIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle2;
      case 'in-progress': return Clock;
      default: return Circle;
    }
  };
  
  const getPhaseColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100 dark:bg-green-900/50 border-green-300 dark:border-green-700';
      case 'in-progress': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/50 border-blue-300 dark:border-blue-700';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-background via-primary/5 to-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6">
            <Rocket className="w-4 h-4" />
            {t.roadmap.currentPhase}
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">
            {t.roadmap.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.roadmap.subtitle}
          </p>
        </motion.div>
        
        {/* Overall Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto mb-16"
        >
          <div className="bg-card border-2 border-border rounded-3xl p-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Target className="w-6 h-6 text-primary" />
                <span className="font-bold text-lg">{t.roadmap.overallProgress}</span>
              </div>
              <span className="text-4xl font-black text-primary">{progress.percentage}%</span>
            </div>
            
            <div className="h-4 bg-muted rounded-full overflow-hidden mb-4">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${progress.percentage}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-green-500 via-blue-500 to-primary rounded-full"
              />
            </div>
            
            <div className="flex justify-between text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-muted-foreground">
                  {progress.completed} {t.roadmap.completedLabel}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-muted-foreground">
                  {progress.inProgress} {t.roadmap.inProgressLabel}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Circle className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {progress.total - progress.completed - progress.inProgress} {t.roadmap.upcomingLabel}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Timeline Phases */}
        <div className="max-w-5xl mx-auto mb-20">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-green-500 via-blue-500 to-muted rounded-full transform md:-translate-x-1/2" />
            
            {t.roadmap.phases.map((phase, idx) => {
              const status = getPhaseStatus(phase.items);
              const StatusIcon = getPhaseIcon(status);
              const isEven = idx % 2 === 0;
              
              return (
                <motion.div
                  key={phase.phase}
                  initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className={`relative flex items-start gap-6 mb-12 ${
                    isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 z-10">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-4 border-background shadow-lg ${getPhaseColor(status)}`}>
                      <StatusIcon className="w-7 h-7" />
                    </div>
                  </div>
                  
                  {/* Content card */}
                  <div className={`ml-24 md:ml-0 md:w-[45%] ${isEven ? 'md:pr-12' : 'md:pl-12'}`}>
                    <div className={`bg-card border-2 rounded-2xl p-6 ${
                      status === 'in-progress' ? 'border-blue-300 dark:border-blue-700 shadow-lg shadow-blue-500/10' : 'border-border'
                    }`}>
                      {/* Phase header */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                          status === 'completed' ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300' :
                          status === 'in-progress' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {phase.phase}
                        </span>
                        {status === 'in-progress' && (
                          <span className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-medium animate-pulse">
                            <Zap className="w-3 h-3" />
                            {t.roadmap.currentPhase}
                          </span>
                        )}
                      </div>
                      
                      <h3 className="text-xl font-bold mb-1">{phase.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{phase.description}</p>
                      
                      {/* Items list */}
                      <div className="space-y-2">
                        {phase.items.map((item, itemIdx) => (
                          <div 
                            key={itemIdx}
                            className={`text-sm flex items-start gap-2 ${
                              item.startsWith('✅') ? 'text-green-700 dark:text-green-400' :
                              item.startsWith('🔄') ? 'text-blue-700 dark:text-blue-400 font-medium' :
                              'text-muted-foreground'
                            }`}
                          >
                            <span className="flex-shrink-0">{item.substring(0, 2)}</span>
                            <span>{item.substring(2).trim()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
        
        {/* Work Done Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 border-2 border-amber-200 dark:border-amber-800 rounded-3xl p-8 md:p-12">
            {/* Header */}
            <div className="flex items-start gap-4 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
                    {t.roadmap.workDone.months}
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-foreground">
                  {t.roadmap.workDone.title}
                </h3>
                <p className="text-muted-foreground">{t.roadmap.workDone.subtitle}</p>
              </div>
            </div>
            
            {/* Achievements grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {t.roadmap.workDone.items.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.03 }}
                  className="flex items-center gap-3 bg-white dark:bg-black/30 rounded-xl p-4 border border-amber-200 dark:border-amber-800"
                >
                  <Star className="w-5 h-5 text-amber-500 flex-shrink-0" />
                  <span className="text-sm font-medium text-foreground">{item}</span>
                </motion.div>
              ))}
            </div>
            
            {/* Stats highlights */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-amber-200 dark:border-amber-800">
              {[
                { icon: Code2, value: "200+", label: "Komponenten" },
                { icon: Database, value: "20+", label: "DB Tabellen" },
                { icon: Palette, value: "50+", label: "Seiten" },
                { icon: TrendingUp, value: "26", label: "Städte" }
              ].map((stat, idx) => (
                <div key={idx} className="text-center">
                  <stat.icon className="w-6 h-6 mx-auto mb-2 text-amber-600 dark:text-amber-400" />
                  <div className="text-2xl font-black text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
});

VisionRoadmapTimeline.displayName = 'VisionRoadmapTimeline';
