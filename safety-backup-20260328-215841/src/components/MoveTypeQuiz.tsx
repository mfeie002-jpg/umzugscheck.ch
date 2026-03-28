import { motion } from "framer-motion";
import { useState } from "react";
import { Home, Building2, Users, Briefcase, Heart, Crown } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const MoveTypeQuiz = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  const questions = [
    {
      question: "Was beschreibt Ihre Situation am besten?",
      options: [
        { label: "Privatumzug", value: "private", icon: Home },
        { label: "Geschäftsumzug", value: "business", icon: Building2 },
      ],
    },
    {
      question: "Wie gross ist Ihr Haushalt?",
      options: [
        { label: "1-2 Zimmer", value: "small", icon: Users },
        { label: "3-4 Zimmer", value: "medium", icon: Users },
        { label: "5+ Zimmer", value: "large", icon: Users },
      ],
    },
    {
      question: "Welchen Service bevorzugen Sie?",
      options: [
        { label: "Ich packe selbst", value: "basic", icon: Briefcase },
        { label: "Teil-Unterstützung", value: "half", icon: Heart },
        { label: "Alles inklusive", value: "full", icon: Crown },
      ],
    },
  ];

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);
    if (step < questions.length - 1) {
      setStep(step + 1);
    }
  };

  const getRecommendation = () => {
    const serviceLevel = answers[2];
    if (serviceLevel === "full") return { name: "Voll-Paket", link: "/plan/full" };
    if (serviceLevel === "half") return { name: "Halb-Paket", link: "/plan/half" };
    return { name: "Basis-Paket", link: "/plan/basic" };
  };

  const isComplete = answers.length === questions.length;

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl border border-border shadow-medium p-6 md:p-8"
      >
        {!isComplete ? (
          <>
            {/* Progress */}
            <div className="flex gap-2 mb-6">
              {questions.map((_, idx) => (
                <div
                  key={idx}
                  className={`flex-1 h-2 rounded-full ${
                    idx <= step ? "bg-primary" : "bg-muted"
                  } transition-colors`}
                />
              ))}
            </div>

            {/* Question */}
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h3 className="font-display text-xl md:text-2xl font-semibold mb-6 text-center">
                {questions[step].question}
              </h3>

              <div className="grid gap-3">
                {questions[step].options.map((option, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(option.value)}
                    className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all text-left"
                  >
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <option.icon className="w-6 h-6 text-primary" />
                    </div>
                    <span className="font-medium text-foreground">{option.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-alpine flex items-center justify-center">
              <Crown className="w-10 h-10 text-white" />
            </div>
            
            <h3 className="font-display text-2xl font-bold mb-2">
              Unsere Empfehlung für Sie:
            </h3>
            <p className="text-3xl font-bold text-primary mb-4">
              {getRecommendation().name}
            </p>
            <p className="text-muted-foreground mb-6">
              Basierend auf Ihren Angaben ist dieses Paket optimal für Sie.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild className="bg-gradient-to-r from-primary to-alpine text-white">
                <Link to={getRecommendation().link}>Paket ansehen</Link>
              </Button>
              <Button variant="outline" onClick={() => { setStep(0); setAnswers([]); }}>
                Quiz wiederholen
              </Button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default MoveTypeQuiz;
