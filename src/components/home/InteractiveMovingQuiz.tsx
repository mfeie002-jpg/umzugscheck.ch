import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface Question {
  id: number;
  question: string;
  options: { label: string; value: string; route?: string }[];
}

const questions: Question[] = [
  {
    id: 1,
    question: "Wie groß ist Ihre Wohnung?",
    options: [
      { label: "1-2 Zimmer", value: "small" },
      { label: "3-4 Zimmer", value: "medium" },
      { label: "5+ Zimmer / Haus", value: "large" },
    ],
  },
  {
    id: 2,
    question: "Benötigen Sie zusätzliche Services?",
    options: [
      { label: "Nur Umzug", value: "moving-only", route: "/rechner" },
      { label: "Umzug + Reinigung", value: "cleaning", route: "/reinigung-rechner" },
      { label: "Komplett-Paket", value: "complete", route: "/gesamtpreis-konfigurator" },
    ],
  },
];

export const InteractiveMovingQuiz = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isComplete, setIsComplete] = useState(false);
  const navigate = useNavigate();

  const handleAnswer = (value: string, route?: string) => {
    setAnswers({ ...answers, [currentStep]: value });

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsComplete(true);
      if (route) {
        setTimeout(() => navigate(route), 1500);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setAnswers({});
    setIsComplete(false);
  };

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-background to-secondary/10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Finden Sie Ihren perfekten Umzugsservice
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Beantworten Sie 2 kurze Fragen und wir empfehlen den idealen Rechner für Sie
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <Card className="shadow-xl border-2 border-primary/20">
            <CardContent className="p-8">
              <AnimatePresence mode="wait">
                {!isComplete ? (
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Progress Bar */}
                    <div className="mb-8">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">
                          Frage {currentStep + 1} von {questions.length}
                        </span>
                        <span className="text-sm font-semibold text-primary">
                          {Math.round(((currentStep + 1) / questions.length) * 100)}%
                        </span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-primary"
                          initial={{ width: 0 }}
                          animate={{
                            width: `${((currentStep + 1) / questions.length) * 100}%`,
                          }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>

                    {/* Question */}
                    <h3 className="text-2xl font-bold text-foreground mb-6">
                      {questions[currentStep].question}
                    </h3>

                    {/* Options */}
                    <div className="space-y-3 mb-8">
                      {questions[currentStep].options.map((option, index) => (
                        <motion.button
                          key={option.value}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          onClick={() => handleAnswer(option.value, option.route)}
                          className="w-full p-4 text-left border-2 border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                              {option.label}
                            </span>
                            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                        </motion.button>
                      ))}
                    </div>

                    {/* Back Button */}
                    {currentStep > 0 && (
                      <Button
                        variant="ghost"
                        onClick={handleBack}
                        className="w-full"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Zurück
                      </Button>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="complete"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-3">
                      Perfekt! Wir leiten Sie weiter...
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Zum passenden Rechner für Ihre Bedürfnisse
                    </p>
                    <Button
                      variant="ghost"
                      onClick={handleRestart}
                      className="mt-4"
                    >
                      Quiz neu starten
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};
