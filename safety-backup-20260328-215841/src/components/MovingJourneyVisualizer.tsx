import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, ClipboardCheck, Package, Truck, Home, CheckCircle, ArrowRight } from 'lucide-react';

const steps = [
  {
    id: 1,
    icon: Phone,
    title: 'Erstberatung',
    description: 'Kostenlose Beratung und Besichtigung vor Ort',
    duration: '30 Min.',
    color: 'from-alpine to-alpine/70',
  },
  {
    id: 2,
    icon: ClipboardCheck,
    title: 'Offerte',
    description: 'Detailliertes Festpreisangebot innerhalb 24h',
    duration: '1 Tag',
    color: 'from-forest to-forest/70',
  },
  {
    id: 3,
    icon: Package,
    title: 'Verpackung',
    description: 'Professionelle Verpackung mit Premium-Material',
    duration: 'Optional',
    color: 'from-warm to-warm/70',
  },
  {
    id: 4,
    icon: Truck,
    title: 'Transport',
    description: 'Sicherer Transport mit modernster Flotte',
    duration: 'Umzugstag',
    color: 'from-alpine to-forest',
  },
  {
    id: 5,
    icon: Home,
    title: 'Aufbau',
    description: 'Fachgerechter Aufbau an Ihrem neuen Standort',
    duration: 'Umzugstag',
    color: 'from-forest to-alpine',
  },
  {
    id: 6,
    icon: CheckCircle,
    title: 'Fertig!',
    description: 'Abnahme und Ihr neues Zuhause ist bereit',
    duration: 'Geschafft!',
    color: 'from-forest to-forest/70',
  },
];

const MovingJourneyVisualizer = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="relative">
      {/* Progress Line */}
      <div className="absolute top-[60px] left-0 right-0 h-1 bg-muted hidden lg:block">
        <motion.div
          className="h-full bg-gradient-to-r from-alpine to-forest"
          initial={{ width: '0%' }}
          animate={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Steps */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index <= activeStep;
          const isCurrent = index === activeStep;

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative"
              onClick={() => setActiveStep(index)}
            >
              <motion.div
                className={`relative z-10 cursor-pointer group ${
                  isCurrent ? 'scale-110' : ''
                }`}
                whileHover={{ scale: 1.05 }}
                animate={{ scale: isCurrent ? 1.05 : 1 }}
              >
                {/* Icon Container */}
                <motion.div
                  className={`w-16 h-16 lg:w-20 lg:h-20 mx-auto rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 ${
                    isActive
                      ? `bg-gradient-to-br ${step.color} shadow-lg`
                      : 'bg-muted'
                  }`}
                  animate={{
                    boxShadow: isCurrent
                      ? '0 10px 30px -10px rgba(45, 100, 160, 0.5)'
                      : 'none',
                  }}
                >
                  <Icon
                    className={`h-8 w-8 lg:h-10 lg:w-10 transition-colors ${
                      isActive ? 'text-white' : 'text-muted-foreground'
                    }`}
                  />
                </motion.div>

                {/* Step Number */}
                <div
                  className={`absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    isActive
                      ? 'bg-alpine text-white'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {step.id}
                </div>

                {/* Text */}
                <div className="text-center">
                  <h4
                    className={`font-semibold mb-1 transition-colors ${
                      isActive ? 'text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    {step.title}
                  </h4>
                  <p
                    className={`text-xs leading-relaxed transition-colors ${
                      isCurrent ? 'text-muted-foreground' : 'text-muted-foreground/70'
                    } hidden md:block`}
                  >
                    {step.description}
                  </p>
                  <span
                    className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-alpine/10 text-alpine'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {step.duration}
                  </span>
                </div>
              </motion.div>

              {/* Arrow (mobile) */}
              {index < steps.length - 1 && (
                <div className="absolute top-8 -right-2 hidden lg:block">
                  <ArrowRight
                    className={`h-4 w-4 ${
                      index < activeStep ? 'text-alpine' : 'text-muted'
                    }`}
                  />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Interactive Controls */}
      <div className="flex justify-center gap-4 mt-8">
        <motion.button
          className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
          disabled={activeStep === 0}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ← Zurück
        </motion.button>
        <motion.button
          className="px-4 py-2 text-sm font-medium bg-alpine text-white rounded-lg hover:bg-alpine/90 transition-colors disabled:opacity-50"
          onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))}
          disabled={activeStep === steps.length - 1}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Weiter →
        </motion.button>
      </div>
    </div>
  );
};

export default MovingJourneyVisualizer;
