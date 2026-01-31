/**
 * Swiss Admin Autopilot Component
 * 
 * Orchestrates all Swiss-specific administrative tasks:
 * - eUmzugCH (commune registration)
 * - Swiss Post address forwarding
 * - Serafe notification
 * - Third-party notifications
 */

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle2, Circle, Zap, Building2, Mail, Tv, Users } from 'lucide-react';
import { EUmzugCHIntegration } from './EUmzugCHIntegration';
import { SwissPostReminder } from './SwissPostReminder';
import { SerafeNotification } from './SerafeNotification';
import { supabase } from '@/integrations/supabase/client';

interface SwissAdminTask {
  id: string;
  type: 'eumzug' | 'swiss_post' | 'serafe' | 'address_change' | 'utility_notification' | 'custom';
  label: string;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  icon: React.ReactNode;
}

export interface SwissAdminAutopilotProps {
  journeyId?: string;
  moveDate: Date;
  oldAddress: {
    street: string;
    houseNumber: string;
    postalCode: string;
    city: string;
    canton: string;
  };
  newAddress: {
    street: string;
    houseNumber: string;
    postalCode: string;
    city: string;
    canton: string;
  };
  personData: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    nationality: string;
  };
  householdType?: 'single' | 'family';
  onAllComplete?: () => void;
}

export const SwissAdminAutopilot = ({
  journeyId,
  moveDate,
  oldAddress,
  newAddress,
  personData,
  householdType = 'single',
  onAllComplete,
}: SwissAdminAutopilotProps) => {
  const [tasks, setTasks] = useState<SwissAdminTask[]>([
    { id: 'eumzug', type: 'eumzug', label: 'Ummeldung (eUmzugCH)', status: 'pending', icon: <Building2 className="h-4 w-4" /> },
    { id: 'swiss_post', type: 'swiss_post', label: 'Nachsendeauftrag', status: 'pending', icon: <Mail className="h-4 w-4" /> },
    { id: 'serafe', type: 'serafe', label: 'Serafe Meldung', status: 'pending', icon: <Tv className="h-4 w-4" /> },
    { id: 'address_change', type: 'address_change', label: 'Weitere Adressänderungen', status: 'pending', icon: <Users className="h-4 w-4" /> },
  ]);

  const [activeTab, setActiveTab] = useState('tasks');

  // Load task status from database if journeyId exists
  useEffect(() => {
    if (!journeyId) return;

    const loadTasks = async () => {
      const { data, error } = await supabase
        .from('swiss_admin_tasks')
        .select('*')
        .eq('journey_id', journeyId);

      if (error) {
        console.error('Error loading tasks:', error);
        return;
      }

      if (data && data.length > 0) {
        setTasks(prev => 
          prev.map(task => {
            const dbTask = data.find(d => d.task_type === task.type);
            if (dbTask) {
              return { ...task, status: dbTask.status as SwissAdminTask['status'] };
            }
            return task;
          })
        );
      }
    };

    loadTasks();
  }, [journeyId]);

  const completedCount = useMemo(
    () => tasks.filter(t => t.status === 'completed' || t.status === 'skipped').length,
    [tasks]
  );

  const progressPercentage = useMemo(
    () => Math.round((completedCount / tasks.length) * 100),
    [completedCount, tasks.length]
  );

  const handleTaskComplete = async (taskType: SwissAdminTask['type']) => {
    setTasks(prev => 
      prev.map(task => 
        task.type === taskType 
          ? { ...task, status: 'completed' as const } 
          : task
      )
    );

    // Persist to database if journeyId exists
    if (journeyId) {
      await supabase
        .from('swiss_admin_tasks')
        .upsert({
          journey_id: journeyId,
          task_type: taskType,
          status: 'completed',
          completed_at: new Date().toISOString(),
        }, {
          onConflict: 'journey_id,task_type',
        });
    }

    // Check if all tasks are complete
    const newCompletedCount = tasks.filter(t => 
      t.status === 'completed' || t.status === 'skipped' || t.type === taskType
    ).length;
    
    if (newCompletedCount === tasks.length) {
      onAllComplete?.();
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-xl">Swiss Admin Autopilot</CardTitle>
              <CardDescription>
                Alle Behördengänge digital erledigen
              </CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="text-lg px-3 py-1">
            {completedCount}/{tasks.length}
          </Badge>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Fortschritt</span>
            <span className="font-medium">{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
            <TabsTrigger 
              value="tasks" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Aufgaben
            </TabsTrigger>
            <TabsTrigger 
              value="overview" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Übersicht
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="p-4 space-y-4">
            {/* Quick Status Overview */}
            <div className="flex flex-wrap gap-2 pb-4 border-b">
              {tasks.map(task => (
                <Badge
                  key={task.id}
                  variant={task.status === 'completed' ? 'default' : 'outline'}
                  className={`flex items-center gap-1.5 ${
                    task.status === 'completed' 
                      ? 'bg-green-600' 
                      : 'text-muted-foreground'
                  }`}
                >
                  {task.status === 'completed' ? (
                    <CheckCircle2 className="h-3 w-3" />
                  ) : (
                    <Circle className="h-3 w-3" />
                  )}
                  {task.label}
                </Badge>
              ))}
            </div>

            {/* Task Cards */}
            <Accordion type="single" collapsible className="space-y-3">
              <AccordionItem value="eumzug" className="border rounded-lg overflow-hidden">
                <AccordionTrigger className="px-4 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-4 w-4 text-primary" />
                    <span>Ummeldung (eUmzugCH)</span>
                    {tasks.find(t => t.type === 'eumzug')?.status === 'completed' && (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <EUmzugCHIntegration
                    moveDate={moveDate}
                    oldAddress={oldAddress}
                    newAddress={newAddress}
                    personData={personData}
                    isCompleted={tasks.find(t => t.type === 'eumzug')?.status === 'completed'}
                    onComplete={() => handleTaskComplete('eumzug')}
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="swiss_post" className="border rounded-lg overflow-hidden">
                <AccordionTrigger className="px-4 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-yellow-600" />
                    <span>Post Nachsendeauftrag</span>
                    {tasks.find(t => t.type === 'swiss_post')?.status === 'completed' && (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <SwissPostReminder
                    moveDate={moveDate}
                    oldAddress={oldAddress}
                    newAddress={newAddress}
                    householdType={householdType}
                    isCompleted={tasks.find(t => t.type === 'swiss_post')?.status === 'completed'}
                    onComplete={() => handleTaskComplete('swiss_post')}
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="serafe" className="border rounded-lg overflow-hidden">
                <AccordionTrigger className="px-4 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Tv className="h-4 w-4 text-purple-600" />
                    <span>Serafe Meldung</span>
                    {tasks.find(t => t.type === 'serafe')?.status === 'completed' && (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <SerafeNotification
                    moveDate={moveDate}
                    newAddress={newAddress}
                    isCompleted={tasks.find(t => t.type === 'serafe')?.status === 'completed'}
                    onComplete={() => handleTaskComplete('serafe')}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>

          <TabsContent value="overview" className="p-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {tasks.map(task => (
                  <div 
                    key={task.id}
                    className={`p-4 rounded-lg border text-center ${
                      task.status === 'completed' 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-muted/50'
                    }`}
                  >
                    <div className={`mx-auto mb-2 p-2 rounded-full w-fit ${
                      task.status === 'completed' ? 'bg-green-100' : 'bg-muted'
                    }`}>
                      {task.status === 'completed' ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        task.icon
                      )}
                    </div>
                    <p className="text-sm font-medium">{task.label}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {task.status === 'completed' ? 'Erledigt' : 'Ausstehend'}
                    </p>
                  </div>
                ))}
              </div>

              {progressPercentage === 100 && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                  <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="font-semibold text-green-800">
                    Alle administrativen Aufgaben erledigt!
                  </p>
                  <p className="text-sm text-green-600 mt-1">
                    Sie haben alle Behördengänge für Ihren Umzug abgeschlossen.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
