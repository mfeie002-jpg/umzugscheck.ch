/**
 * Phase 6 Enhancements Dashboard
 * Strategic growth features for post-launch optimization
 */

import { memo, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain,
  Mail,
  DollarSign,
  BarChart3,
  Lightbulb,
  Target,
  TrendingUp,
  Users,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Flame,
  Thermometer,
  Snowflake
} from "lucide-react";
import {
  LEAD_SCORING_FACTORS,
  calculateLeadScore,
  FOLLOW_UP_SEQUENCES,
  DYNAMIC_PRICING_RULES,
  PROVIDER_PERFORMANCE,
  CUSTOMER_JOURNEY_INSIGHTS,
  PHASE_6_ENHANCEMENTS
} from "@/lib/phase-6-enhancements";

export const Phase6Dashboard = memo(function Phase6Dashboard() {
  const [selectedTab, setSelectedTab] = useState('overview');

  // Demo lead score
  const demoScore = calculateLeadScore({
    volume: 35,
    daysUntilMove: 21,
    hasPackingService: true,
    hasCleaningService: false,
    profileComplete: true,
    pagesViewed: 8
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Zap className="w-6 h-6 text-primary" />
            Phase 6: Growth Enhancements
          </h2>
          <p className="text-muted-foreground">
            5 strategische Features für post-launch Wachstum
          </p>
        </div>

        <Badge className="bg-success text-success-foreground gap-2">
          <CheckCircle2 className="w-4 h-4" />
          Alle 5 Features aktiv
        </Badge>
      </div>

      {/* Enhancement Overview */}
      <div className="grid md:grid-cols-5 gap-4">
        {PHASE_6_ENHANCEMENTS.map((enh, index) => {
          const icons = [Brain, Mail, DollarSign, BarChart3, Lightbulb];
          const Icon = icons[index];
          
          return (
            <Card key={enh.id} className="border-primary/20">
              <CardContent className="pt-4 text-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="font-medium text-sm">{enh.name}</div>
                <Badge variant="outline" className="text-success border-success mt-2 text-xs">
                  Aktiv
                </Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Übersicht</TabsTrigger>
          <TabsTrigger value="scoring">Lead Scoring</TabsTrigger>
          <TabsTrigger value="sequences">Follow-Ups</TabsTrigger>
          <TabsTrigger value="pricing">Dynamic Pricing</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-4 space-y-4">
          {PHASE_6_ENHANCEMENTS.map((enh, index) => {
            const icons = [Brain, Mail, DollarSign, BarChart3, Lightbulb];
            const Icon = icons[index];
            
            return (
              <Card key={enh.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold">{enh.name}</h3>
                        <Badge variant="outline" className="text-success border-success text-xs">
                          {enh.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {enh.description}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-primary">
                        <TrendingUp className="w-4 h-4" />
                        <span>{enh.impact}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        {/* Lead Scoring Tab */}
        <TabsContent value="scoring" className="mt-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  Lead Scoring Faktoren
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {LEAD_SCORING_FACTORS.map(factor => (
                  <div key={factor.name} className="flex items-center justify-between">
                    <span className="text-sm">{factor.name}</span>
                    <div className="flex items-center gap-2">
                      <Progress value={factor.weight} className="w-24 h-2" />
                      <span className="text-sm font-medium w-8">{factor.weight}%</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Demo Lead Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-5xl font-bold text-primary mb-2">
                    {demoScore.totalScore}
                  </div>
                  <Badge className={
                    demoScore.priority === 'hot' ? 'bg-destructive' :
                    demoScore.priority === 'warm' ? 'bg-warning text-warning-foreground' :
                    'bg-muted'
                  }>
                    {demoScore.priority === 'hot' && <Flame className="w-3 h-3 mr-1" />}
                    {demoScore.priority === 'warm' && <Thermometer className="w-3 h-3 mr-1" />}
                    {demoScore.priority === 'cold' && <Snowflake className="w-3 h-3 mr-1" />}
                    {demoScore.priority.toUpperCase()}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Empfohlene Aktion:</span>
                    <span className="font-medium">{demoScore.recommendedAction}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Geschätzter Wert:</span>
                    <span className="font-medium">{demoScore.estimatedValue.toLocaleString('de-CH')} CHF</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Follow-Up Sequences Tab */}
        <TabsContent value="sequences" className="mt-4 space-y-4">
          {FOLLOW_UP_SEQUENCES.map(seq => (
            <Card key={seq.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold flex items-center gap-2">
                      <Mail className="w-4 h-4 text-primary" />
                      {seq.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{seq.trigger}</p>
                  </div>
                  <Badge variant={seq.isActive ? 'default' : 'outline'}>
                    {seq.isActive ? 'Aktiv' : 'Inaktiv'}
                  </Badge>
                </div>

                {/* Steps */}
                <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
                  {seq.steps.map((step, index) => (
                    <div key={index} className="flex items-center">
                      <div className="px-3 py-1.5 rounded-full bg-primary/10 text-xs font-medium whitespace-nowrap">
                        Tag {step.dayOffset}: {step.channel}
                      </div>
                      {index < seq.steps.length - 1 && (
                        <ArrowRight className="w-4 h-4 text-muted-foreground mx-1" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold">{seq.stats.sent}</div>
                    <div className="text-xs text-muted-foreground">Gesendet</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold">{seq.stats.opened}</div>
                    <div className="text-xs text-muted-foreground">Geöffnet</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold">{seq.stats.clicked}</div>
                    <div className="text-xs text-muted-foreground">Geklickt</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-success">{seq.stats.converted}</div>
                    <div className="text-xs text-muted-foreground">Konvertiert</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Dynamic Pricing Tab */}
        <TabsContent value="pricing" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                Dynamic Pricing Regeln
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {DYNAMIC_PRICING_RULES.map(rule => (
                  <div 
                    key={rule.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant={rule.isActive ? 'default' : 'outline'}>
                        {rule.isActive ? '✓' : '○'}
                      </Badge>
                      <div>
                        <div className="font-medium">{rule.name}</div>
                        <div className="text-xs text-muted-foreground">{rule.condition}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <Badge 
                        variant="outline"
                        className={rule.modifier > 0 ? 'text-success border-success' : 'text-primary border-primary'}
                      >
                        {rule.modifier > 0 ? '+' : ''}{rule.modifier}%
                      </Badge>
                      <div className="text-sm text-muted-foreground">
                        {rule.appliedCount}× angewendet
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="mt-4 space-y-4">
          {CUSTOMER_JOURNEY_INSIGHTS.map(insight => (
            <Card 
              key={insight.id}
              className={
                insight.impact === 'high' ? 'border-warning/50' : ''
              }
            >
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    insight.impact === 'high' ? 'bg-warning/10' : 'bg-primary/10'
                  }`}>
                    {insight.impact === 'high' ? (
                      <AlertTriangle className="w-5 h-5 text-warning" />
                    ) : (
                      <Lightbulb className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold">{insight.title}</h3>
                      <Badge variant="outline" className={
                        insight.impact === 'high' ? 'border-warning text-warning' : ''
                      }>
                        {insight.impact === 'high' ? 'Hoher Impact' : 'Mittlerer Impact'}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {insight.insight}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {insight.dataPoints.map((dp, i) => (
                        <Badge key={i} variant="secondary" className="font-normal">
                          {dp.label}: <span className="font-bold ml-1">{dp.value}</span>
                        </Badge>
                      ))}
                    </div>

                    <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                      <div className="text-xs text-muted-foreground mb-1">Empfehlung:</div>
                      <div className="text-sm font-medium">{insight.recommendation}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
});
