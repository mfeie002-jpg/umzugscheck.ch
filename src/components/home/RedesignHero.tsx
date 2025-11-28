import { Button } from "@/components/ui/button";
import { Star, CheckCircle, TrendingDown, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const RedesignHero = () => {
  const [fromPostal, setFromPostal] = useState("");
  const [toPostal, setToPostal] = useState("");
  const [rooms, setRooms] = useState("");
  const navigate = useNavigate();

  const handleCalculate = () => {
    if (fromPostal && toPostal && rooms) {
      navigate(`/rechner?from=${encodeURIComponent(fromPostal)}&to=${encodeURIComponent(toPostal)}&rooms=${rooms}`);
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Modern Background Pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-100 rounded-full blur-3xl opacity-20" />
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
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-slate-900 mb-6">
                Der schnellste Weg zu Ihrem{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                  perfekten Umzug
                </span>{" "}
                in der Schweiz
              </h1>
              
              <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Vergleichen Sie geprüfte Umzugsfirmen, nutzen Sie unseren KI-Rechner und sparen Sie bis zu 40%
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <Button 
                  onClick={handleCalculate}
                  size="lg"
                  className="h-14 px-8 text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg hover:shadow-xl transition-all"
                >
                  Jetzt gratis vergleichen
                </Button>
                <Link to="/rechner">
                  <Button 
                    variant="outline"
                    size="lg"
                    className="h-14 px-8 text-lg font-semibold border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
                  >
                    KI-Rechner starten
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-6 justify-center lg:justify-start text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">4.9/5 Bewertung</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>25'000+ Umzüge</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span>Geprüfte Firmen</span>
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
                      <h3 className="text-2xl font-bold text-slate-900">KI-Rechner</h3>
                      <p className="text-sm text-slate-600">In 60 Sekunden zur Schätzung</p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="text-sm font-semibold text-slate-700 mb-2 block">Von (PLZ)</label>
                      <Input 
                        placeholder="z.B. 8001"
                        value={fromPostal}
                        onChange={(e) => setFromPostal(e.target.value)}
                        className="h-12 border-slate-200 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-slate-700 mb-2 block">Nach (PLZ)</label>
                      <Input 
                        placeholder="z.B. 3011"
                        value={toPostal}
                        onChange={(e) => setToPostal(e.target.value)}
                        className="h-12 border-slate-200 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-slate-700 mb-2 block">Zimmer</label>
                      <Input 
                        type="number"
                        placeholder="z.B. 3"
                        value={rooms}
                        onChange={(e) => setRooms(e.target.value)}
                        className="h-12 border-slate-200 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={handleCalculate}
                    className="w-full h-14 text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-md hover:shadow-lg transition-all"
                    disabled={!fromPostal || !toPostal || !rooms}
                  >
                    Kostenlose Schätzung erhalten
                  </Button>

                  <p className="text-xs text-center text-slate-500 mt-4">
                    ✓ 100% kostenlos & unverbindlich • Keine Kreditkarte erforderlich
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
