import { Button } from "@/components/ui/button";
import { Star, CheckCircle, TrendingDown, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getHomepageContent } from "@/lib/content";
import heroMovingFamily from "@/assets/hero-moving-family.jpg";
import { toast } from "sonner";

export const RedesignHero = () => {
  const content = getHomepageContent().hero;
  const [fromPostal, setFromPostal] = useState("");
  const [toPostal, setToPostal] = useState("");
  const [rooms, setRooms] = useState("");
  const navigate = useNavigate();

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
    <section className="relative min-h-screen lg:min-h-[90vh] flex items-center overflow-hidden py-8 lg:py-0">
      {/* Emotional Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroMovingFamily}
          alt="Glückliche Familie bei ihrem Umzug mit professionellen Umzugshelfern"
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/60 to-slate-900/40" />
      </div>

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
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-white mb-4 md:mb-6">
                {content.headline}{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                  {content.highlightedText}
                </span>{" "}
                in der Schweiz
              </h1>
              
              <p className="text-base md:text-lg lg:text-xl text-white/90 mb-6 md:mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                {content.subheadline}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start mb-6 md:mb-8">
                <Link to="/umzugsrechner" className="w-full sm:w-auto">
                  <Button 
                    size="lg"
                    className="w-full sm:w-auto h-12 md:h-14 px-6 md:px-8 text-base md:text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg hover:shadow-xl transition-all"
                  >
                    {content.primaryCTA}
                  </Button>
                </Link>
                <Link to="/fuer-firmen" className="w-full sm:w-auto">
                  <Button 
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto h-12 md:h-14 px-6 md:px-8 text-base md:text-lg font-semibold border-2 border-white/80 text-white hover:bg-white/10"
                  >
                    {content.secondaryCTA}
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
                    className="w-full h-12 md:h-14 text-base md:text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-md hover:shadow-lg transition-all"
                  >
                    {content.calculator.submitButton}
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
