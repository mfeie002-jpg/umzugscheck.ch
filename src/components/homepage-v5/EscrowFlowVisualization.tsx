/**
 * Escrow Flow Visualization V5 - Shows money flow
 * Addresses: "Dynamische Escrow-Visualisierung"
 */
import { memo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Building2, Truck, CheckCircle2, ArrowRight, Shield, Lock } from 'lucide-react';

interface FlowStep {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  status: 'waiting' | 'active' | 'completed';
}

export const EscrowFlowVisualization = memo(function EscrowFlowVisualization() {
  const [activeStep, setActiveStep] = useState(0);

  const steps: FlowStep[] = [
    {
      id: 'payment',
      icon: Wallet,
      title: 'Sichere Zahlung',
      description: 'Ihr Geld geht auf ein reguliertes Treuhandkonto',
      status: activeStep >= 0 ? 'completed' : 'waiting',
    },
    {
      id: 'escrow',
      icon: Building2,
      title: 'Treuhänder verwahrt',
      description: 'Geschützt bei der SRO PolyReg (FINMA-reguliert)',
      status: activeStep >= 1 ? 'completed' : activeStep === 0 ? 'active' : 'waiting',
    },
    {
      id: 'move',
      icon: Truck,
      title: 'Umzug findet statt',
      description: 'Die Firma führt Ihren Umzug durch',
      status: activeStep >= 2 ? 'completed' : activeStep === 1 ? 'active' : 'waiting',
    },
    {
      id: 'release',
      icon: CheckCircle2,
      title: 'Sie bestätigen',
      description: 'Erst nach Ihrer Freigabe erhält die Firma das Geld',
      status: activeStep >= 3 ? 'completed' : activeStep === 2 ? 'active' : 'waiting',
    },
  ];

  // Auto-advance animation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-2 mb-4">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">Sichere Zahlungsabwicklung</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ihr Geld ist geschützt
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Mit unserem Treuhandsystem zahlen Sie erst, wenn der Umzug 
              erfolgreich abgeschlossen ist
            </p>
          </div>

          {/* Flow Visualization */}
          <div className="bg-card rounded-2xl border shadow-lg p-6 md:p-10">
            {/* Desktop Flow */}
            <div className="hidden md:flex items-center justify-between relative">
              {/* Connection Line */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-muted -translate-y-1/2 z-0">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-secondary"
                  initial={{ width: '0%' }}
                  animate={{ width: `${(activeStep / 3) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              {steps.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = step.status === 'completed';
                const isActive = step.status === 'active';

                return (
                  <motion.div
                    key={step.id}
                    className="relative z-10 flex flex-col items-center text-center"
                    initial={{ opacity: 0.5, scale: 0.9 }}
                    animate={{
                      opacity: isCompleted || isActive ? 1 : 0.5,
                      scale: isActive ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-3 transition-colors ${
                        isCompleted
                          ? 'bg-green-100 text-green-600'
                          : isActive
                          ? 'bg-primary text-white shadow-lg'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      <Icon className="w-8 h-8" />
                    </div>
                    <h4 className="font-semibold text-sm mb-1">{step.title}</h4>
                    <p className="text-xs text-muted-foreground max-w-[140px]">
                      {step.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            {/* Mobile Flow */}
            <div className="md:hidden space-y-4">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = step.status === 'completed';
                const isActive = step.status === 'active';

                return (
                  <motion.div
                    key={step.id}
                    className={`flex items-start gap-4 p-4 rounded-xl transition-colors ${
                      isActive ? 'bg-primary/5 border border-primary/20' : ''
                    }`}
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: isCompleted || isActive ? 1 : 0.5 }}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isCompleted
                          ? 'bg-green-100 text-green-600'
                          : isActive
                          ? 'bg-primary text-white'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{step.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                    {isCompleted && (
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 ml-auto" />
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Trust Footer */}
            <div className="mt-8 pt-6 border-t flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary" />
                SRO PolyReg reguliert
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" />
                FINMA-konform
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-secondary" />
                100% Käuferschutz
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
