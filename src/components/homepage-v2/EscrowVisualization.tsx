/**
 * Escrow Visualization V2
 * Animierte Visualisierung: Geld -> Treuhand -> Umzug -> Freigabe
 */
import { memo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Lock, Truck, CheckCircle, ArrowRight, Shield } from 'lucide-react';

const steps = [
  {
    icon: Wallet,
    label: 'Zahlung',
    description: 'Sie zahlen sicher ein',
    color: 'bg-blue-500',
  },
  {
    icon: Lock,
    label: 'Treuhand',
    description: 'Geld wird gesichert',
    color: 'bg-purple-500',
  },
  {
    icon: Truck,
    label: 'Umzug',
    description: 'Firma führt aus',
    color: 'bg-orange-500',
  },
  {
    icon: CheckCircle,
    label: 'Freigabe',
    description: 'Nach Ihrer Abnahme',
    color: 'bg-green-500',
  },
];

export const EscrowVisualization = memo(function EscrowVisualization() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 md:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 rounded-full px-4 py-2 mb-4">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-semibold">Smart Escrow – Schweizer Treuhand</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ihr Geld ist geschützt
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Zahlung erst nach erfolgreichem Umzug. So funktioniert unser Treuhand-System:
            </p>
          </div>

          {/* Steps Visualization */}
          <div className="relative">
            {/* Desktop: Horizontal */}
            <div className="hidden md:flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center flex-1">
                  <motion.div
                    animate={{
                      scale: activeStep === index ? 1.1 : 1,
                      opacity: activeStep >= index ? 1 : 0.5,
                    }}
                    className="text-center flex-1"
                  >
                    <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg ${activeStep === index ? 'ring-4 ring-offset-2 ring-secondary/30' : ''}`}>
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="font-bold">{step.label}</div>
                    <div className="text-sm text-muted-foreground">{step.description}</div>
                  </motion.div>

                  {index < steps.length - 1 && (
                    <motion.div
                      animate={{ opacity: activeStep > index ? 1 : 0.3 }}
                      className="flex-shrink-0 px-2"
                    >
                      <ArrowRight className="w-6 h-6 text-muted-foreground" />
                    </motion.div>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile: Vertical */}
            <div className="md:hidden space-y-4">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  animate={{
                    opacity: activeStep >= index ? 1 : 0.5,
                    x: activeStep === index ? 8 : 0,
                  }}
                  className="flex items-center gap-4"
                >
                  <div className={`w-12 h-12 ${step.color} rounded-xl flex items-center justify-center shadow-md flex-shrink-0 ${activeStep === index ? 'ring-2 ring-offset-2 ring-secondary/30' : ''}`}>
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold">{step.label}</div>
                    <div className="text-sm text-muted-foreground">{step.description}</div>
                  </div>
                  {activeStep === index && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-3 h-3 bg-secondary rounded-full"
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Trust Note */}
          <div className="mt-10 text-center">
            <p className="text-sm text-muted-foreground">
              Gesichert durch Swiss Fintech Association (SFTA) • 
              Ihr Geld verlässt nie die Schweiz
            </p>
          </div>
        </div>
      </div>
    </section>
  );
});
