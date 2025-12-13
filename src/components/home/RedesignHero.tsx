import { Button } from "@/components/ui/button";
import { Star, CheckCircle, TrendingDown, Shield, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { Input } from "@/components/ui/input";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getHomepageContent } from "@/lib/content";
import heroMovingFamily from "@/assets/hero-moving-family.jpg";
import { toast } from "sonner";
import { useTypewriter } from "@/hooks/useTypewriter";

export const RedesignHero = () => {
  const content = getHomepageContent().hero;
  const [fromPostal, setFromPostal] = useState("");
  const [toPostal, setToPostal] = useState("");
  const [rooms, setRooms] = useState("");
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  
  const fullHeadline = `${content.headline} ${content.highlightedText} in der Schweiz`;
  const { displayedText, isComplete } = useTypewriter({ text: fullHeadline, speed: 40, delay: 300 });

  const handleCalculate = () => {
    if (!fromPostal || !toPostal || !rooms) {
      toast.error("Bitte füllen Sie alle Felder aus", {
        description: "Geben Sie Start-PLZ, Ziel-PLZ und Zimmeranzahl ein."
      });
      return;
    }
    navigate(`/umzugsrechner?from=${encodeURIComponent(fromPostal)}&to=${encodeURIComponent(toPostal)}&rooms=${rooms}`);
  };

  return (
    <section ref={sectionRef} className="relative min-h-screen lg:min-h-[90vh] flex items-center overflow-hidden py-8 lg:py-0">
      {/* Emotional Background Image with Parallax */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ y: backgroundY }}
      >
        <img 
          src={heroMovingFamily}
          alt="Glückliche Familie bei ihrem Umzug mit professionellen Umzugshelfern"
          className="w-full h-[120%] object-cover"
        />
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/60 to-slate-900/40" />
      </motion.div>

      {/* OPTION 1: Large Watermark Checkmark in Background */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.08, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="absolute right-[5%] top-1/2 -translate-y-1/2 z-[1] pointer-events-none hidden lg:block"
      >
        <Check className="w-[400px] h-[400px] text-white stroke-[1.5]" />
      </motion.div>

      <div className="container mx-auto px-4 py-16 md:py-20 relative z-10">
        <div className="max-w-6xl mx-auto">
          
          {/* Hero Content Grid */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left: Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center lg:text-left"
            >
              {/* OPTION 2: Animated Checkmark Badge next to mini-headline */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10, delay: 1 }}
                  className="w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center"
                >
                  <Check className="w-4 h-4 text-white stroke-[3]" />
                </motion.div>
                <span className="text-white text-sm font-medium">In 2 Minuten zum Vergleich</span>
              </motion.div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-white mb-4 md:mb-6 min-h-[2.5em] sm:min-h-[2em]">
                {displayedText.split(content.highlightedText).map((part, index, arr) => (
                  <span key={index}>
                    {part}
                    {index < arr.length - 1 && (
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                        {content.highlightedText}
                      </span>
                    )}
                  </span>
                ))}
                {!isComplete && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                    className="inline-block w-[3px] h-[1em] bg-white ml-1 align-middle"
                  />
                )}
              </h1>
              
              <p className="text-base md:text-lg lg:text-xl text-white/90 mb-6 md:mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                {content.subheadline}
              </p>

              {/* CTA Buttons - Primary leads to Offerten, removed redundant secondary */}
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start mb-6 md:mb-8">
                <Link to="/umzugsofferten" className="w-full sm:w-auto">
                  <Button 
                    size="lg"
                    className="w-full sm:w-auto h-12 md:h-14 px-6 md:px-8 text-base md:text-lg font-bold bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-lg hover:shadow-xl transition-all"
                  >
                    Jetzt Offerten erhalten
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-4 md:gap-6 justify-center lg:justify-start text-xs md:text-sm text-white/90">
                <div className="flex items-center gap-1.5 md:gap-2 bg-white/10 px-3 py-1.5 rounded-full">
                  <Star className="h-4 w-4 md:h-5 md:w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{content.trustIndicators.rating}</span>
                </div>
                <div className="flex items-center gap-1.5 md:gap-2 bg-white/10 px-3 py-1.5 rounded-full">
                  <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-400" />
                  <span>{content.trustIndicators.movesCount}</span>
                </div>
                <div className="flex items-center gap-1.5 md:gap-2 bg-white/10 px-3 py-1.5 rounded-full">
                  <Shield className="h-4 w-4 md:h-5 md:w-5 text-blue-400" />
                  <span>{content.trustIndicators.verifiedText}</span>
                </div>
              </div>
            </motion.div>

            {/* Right: AI Calculator Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative mt-8 lg:mt-0"
            >
              {/* OPTION 3: Floating Badge on Calculator Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0, rotate: -12 }}
                animate={{ opacity: 1, scale: 1, rotate: -12 }}
                transition={{ type: "spring", stiffness: 300, damping: 15, delay: 1.2 }}
                className="absolute -top-4 -right-4 z-20 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-full w-16 h-16 md:w-20 md:h-20 flex flex-col items-center justify-center shadow-lg"
              >
                <Check className="w-6 h-6 md:w-8 md:h-8 stroke-[3]" />
                <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-tight">Geprüft</span>
              </motion.div>

              <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl p-5 md:p-8 border border-slate-100 relative overflow-hidden">
                {/* Glow Effect */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full blur-3xl opacity-20" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4 md:mb-6">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                      <TrendingDown className="h-5 w-5 md:h-6 md:w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-slate-900">{content.calculator.title}</h3>
                      <p className="text-xs md:text-sm text-slate-600">{content.calculator.subtitle}</p>
                    </div>
                  </div>

                  <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
                    <div>
                      <label className="text-xs md:text-sm font-semibold text-slate-700 mb-1.5 md:mb-2 block">{content.calculator.fromLabel}</label>
                      <Input 
                        placeholder={content.calculator.fromPlaceholder}
                        value={fromPostal}
                        onChange={(e) => setFromPostal(e.target.value)}
                        className="h-11 md:h-12 border-slate-200 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs md:text-sm font-semibold text-slate-700 mb-1.5 md:mb-2 block">{content.calculator.toLabel}</label>
                      <Input 
                        placeholder={content.calculator.toPlaceholder}
                        value={toPostal}
                        onChange={(e) => setToPostal(e.target.value)}
                        className="h-11 md:h-12 border-slate-200 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs md:text-sm font-semibold text-slate-700 mb-1.5 md:mb-2 block">{content.calculator.roomsLabel}</label>
                      <Input 
                        type="number"
                        placeholder={content.calculator.roomsPlaceholder}
                        value={rooms}
                        onChange={(e) => setRooms(e.target.value)}
                        className="h-11 md:h-12 border-slate-200 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={handleCalculate}
                    className="w-full h-12 md:h-14 text-base md:text-lg font-bold bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all"
                  >
                    Kosten berechnen
                  </Button>

                  <p className="text-xs text-center text-slate-500 mt-3 md:mt-4">
                    {content.calculator.disclaimer}
                  </p>
                </div>
              </div>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
};