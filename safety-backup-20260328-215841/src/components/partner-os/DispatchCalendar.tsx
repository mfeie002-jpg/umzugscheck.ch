/**
 * Partner OS Dispatch Calendar Component
 * Visual calendar for managing moving jobs
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Truck, 
  Users, 
  Clock,
  MapPin
} from 'lucide-react';
import { 
  DispatchJob, 
  JOB_STATUS_CONFIG,
  formatDuration 
} from '@/lib/partner-os';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { de } from 'date-fns/locale';

interface DispatchCalendarProps {
  jobs: DispatchJob[];
  onJobClick?: (job: DispatchJob) => void;
  onAddJob?: (date: Date) => void;
}

export function DispatchCalendar({ jobs, onJobClick, onAddJob }: DispatchCalendarProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => 
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));
  
  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentWeekStart(prev => addDays(prev, direction === 'next' ? 7 : -7));
  };

  const getJobsForDay = (date: Date) => {
    return jobs.filter(job => {
      const jobDate = new Date(job.scheduledDate);
      return isSameDay(jobDate, date);
    }).sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));
  };

  const isToday = (date: Date) => isSameDay(date, new Date());

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-primary" />
            Einsatzplanung
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => navigateWeek('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[180px] text-center">
              {format(currentWeekStart, 'd. MMM', { locale: de })} – {format(addDays(currentWeekStart, 6), 'd. MMM yyyy', { locale: de })}
            </span>
            <Button variant="outline" size="icon" onClick={() => navigateWeek('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="grid grid-cols-7 gap-2">
          {/* Day Headers */}
          {weekDays.map((day, idx) => (
            <div 
              key={idx}
              className={`text-center p-2 rounded-lg ${
                isToday(day) ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}
            >
              <div className="text-xs font-medium">
                {format(day, 'EEE', { locale: de })}
              </div>
              <div className="text-lg font-bold">
                {format(day, 'd')}
              </div>
            </div>
          ))}
          
          {/* Day Content */}
          {weekDays.map((day, idx) => {
            const dayJobs = getJobsForDay(day);
            
            return (
              <div 
                key={`content-${idx}`}
                className="min-h-[200px] border rounded-lg p-2 space-y-2"
              >
                {dayJobs.map(job => {
                  const statusConfig = JOB_STATUS_CONFIG[job.status];
                  
                  return (
                    <div
                      key={job.id}
                      className={`p-2 rounded-lg cursor-pointer transition-all hover:ring-2 hover:ring-primary/50 ${statusConfig.color}`}
                      onClick={() => onJobClick?.(job)}
                    >
                      <div className="flex items-center gap-1 text-xs font-medium">
                        <Clock className="h-3 w-3" />
                        {job.scheduledTime}
                      </div>
                      <div className="font-medium text-sm truncate mt-1">
                        {job.customerName}
                      </div>
                      <div className="flex items-center gap-1 text-xs mt-1 opacity-80">
                        <MapPin className="h-3 w-3" />
                        {job.fromAddress.city} → {job.toAddress.city}
                      </div>
                      <div className="flex items-center gap-2 mt-2 text-xs">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {job.crew.length}
                        </span>
                        <span className="flex items-center gap-1">
                          <Truck className="h-3 w-3" />
                          {job.vehicles.length}
                        </span>
                        <span>{formatDuration(job.estimatedDuration)}</span>
                      </div>
                    </div>
                  );
                })}
                
                {/* Add Job Button */}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full h-8 border-dashed border"
                  onClick={() => onAddJob?.(day)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>
        
        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t">
          {Object.entries(JOB_STATUS_CONFIG).slice(0, 5).map(([status, config]) => (
            <div key={status} className="flex items-center gap-1 text-xs">
              <span>{config.icon}</span>
              <span className="text-muted-foreground">{config.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default DispatchCalendar;
