/**
 * Partner OS Subscription Plans Component
 * Pricing cards for SaaS subscription tiers
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Zap, Building2, Crown } from 'lucide-react';
import { 
  SUBSCRIPTION_PLANS, 
  SubscriptionPlan,
  calculateSubscriptionValue 
} from '@/lib/partner-os';

interface SubscriptionPlansProps {
  currentPlan?: SubscriptionPlan;
  onSelectPlan?: (plan: SubscriptionPlan) => void;
  billingCycle?: 'monthly' | 'annual';
}

const PLAN_ICONS: Record<SubscriptionPlan, React.ReactNode> = {
  starter: <Zap className="h-6 w-6" />,
  professional: <Building2 className="h-6 w-6" />,
  enterprise: <Crown className="h-6 w-6" />
};

export function SubscriptionPlans({ 
  currentPlan, 
  onSelectPlan,
  billingCycle = 'monthly'
}: SubscriptionPlansProps) {
  const plans = Object.entries(SUBSCRIPTION_PLANS) as [SubscriptionPlan, typeof SUBSCRIPTION_PLANS[SubscriptionPlan]][];

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {plans.map(([planId, config]) => {
        const isCurrentPlan = currentPlan === planId;
        const isProfessional = planId === 'professional';
        const value = calculateSubscriptionValue(planId);
        const displayPrice = billingCycle === 'annual' 
          ? Math.round(value.annual / 12) 
          : value.monthly;

        return (
          <Card 
            key={planId}
            className={`relative transition-all ${
              isProfessional 
                ? 'border-2 border-primary shadow-lg scale-105' 
                : 'hover:border-primary/50'
            } ${isCurrentPlan ? 'ring-2 ring-primary' : ''}`}
          >
            {isProfessional && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary">Beliebteste Wahl</Badge>
              </div>
            )}
            
            <CardHeader className="text-center pb-2">
              <div className={`mx-auto p-3 rounded-xl w-fit ${
                isProfessional ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}>
                {PLAN_ICONS[planId]}
              </div>
              <CardTitle className="mt-4">{config.name}</CardTitle>
              <CardDescription>{config.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Pricing */}
              <div className="text-center">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold">CHF {displayPrice}</span>
                  <span className="text-muted-foreground">/Monat</span>
                </div>
                {billingCycle === 'annual' && (
                  <p className="text-sm text-emerald-600 mt-1">
                    Spare CHF {value.savings}/Jahr
                  </p>
                )}
              </div>

              {/* Highlights */}
              <ul className="space-y-3">
                {config.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-sm">{highlight}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button 
                className="w-full"
                variant={isProfessional ? 'default' : 'outline'}
                disabled={isCurrentPlan}
                onClick={() => onSelectPlan?.(planId)}
              >
                {isCurrentPlan ? 'Aktueller Plan' : 'Plan wählen'}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default SubscriptionPlans;
