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
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
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
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-white mb-6">
                {content.headline}{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                  {content.highlightedText}
                </span>{" "}
                in der Schweiz
              </h1>
              
              <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                {content.subheadline}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <Link to="/umzugsrechner">
                  <Button 
                    size="lg"
                    className="h-14 px-8 text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg hover:shadow-xl transition-all"
                  >
                    {content.primaryCTA}
                  </Button>
                </Link>
                <Link to="/fuer-firmen">
                  <Button 
                    variant="outline"
                    size="lg"
                    className="h-14 px-8 text-lg font-semibold border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
                  >
                    {content.secondaryCTA}
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-6 justify-center lg:justify-start text-sm text-white/90">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{content.trustIndicators.rating}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span>{content.trustIndicators.movesCount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-400" />
                  <span>{content.trustIndicators.verifiedText}</span>
                </div>
              </div>
            </motion.div>

            {/* Right: AI Calculator Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-100 relative overflow-hidden">
                {/* Glow Effect */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full blur-3xl opacity-20" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                      <TrendingDown className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">{content.calculator.title}</h3>
                      <p className="text-sm text-slate-600">{content.calculator.subtitle}</p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="text-sm font-semibold text-slate-700 mb-2 block">{content.calculator.fromLabel}</label>
                      <Input 
                        placeholder={content.calculator.fromPlaceholder}
                        value={fromPostal}
                        onChange={(e) => setFromPostal(e.target.value)}
                        className="h-12 border-slate-200 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-slate-700 mb-2 block">{content.calculator.toLabel}</label>
                      <Input 
                        placeholder={content.calculator.toPlaceholder}
                        value={toPostal}
                        onChange={(e) => setToPostal(e.target.value)}
                        className="h-12 border-slate-200 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-slate-700 mb-2 block">{content.calculator.roomsLabel}</label>
                      <Input 
                        type="number"
                        placeholder={content.calculator.roomsPlaceholder}
                        value={rooms}
                        onChange={(e) => setRooms(e.target.value)}
                        className="h-12 border-slate-200 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={handleCalculate}
                    className="w-full h-14 text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-md hover:shadow-lg transition-all"
                  >
                    {content.calculator.submitButton}
                  </Button>

                  <p className="text-xs text-center text-slate-500 mt-4">
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
