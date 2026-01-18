import { ArrowRight, Shield, Clock, Percent, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { SmartCTAButton } from "@/components/conversion/SmartCTAButton";
const OffertenCTA = () => {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Multi-layer gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary/90" />
      <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/5" />
      
      {/* Animated gradient orbs */}
      <motion.div
        className="absolute -top-32 -left-32 w-96 h-96 bg-white/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -40, 0],
          y: [0, -40, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Mesh pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
        backgroundSize: '32px 32px'
      }} />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2.5 mb-6"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-white text-sm font-medium">Jetzt bis zu 40% sparen</span>
          </motion.div>
          
          <h2 className="font-manrope text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6 leading-tight">
            Bereit für Ihren <br className="hidden sm:block" />
            <span className="relative">
              stressfreien Umzug
              <motion.div
                className="absolute -bottom-2 left-0 right-0 h-1 bg-secondary/60 rounded-full"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.5 }}
              />
            </span>?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-10 max-w-2xl mx-auto">
            Vergleichen Sie jetzt kostenlos Offerten von geprüften Schweizer Umzugsfirmen 
            und sparen Sie bares Geld.
          </p>

          {/* Trust Points */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-10">
            {[
              { icon: Shield, text: "Geprüfte Firmen" },
              { icon: Clock, text: "Offerten in 24h" },
              { icon: Percent, text: "100% kostenlos" },
            ].map((item, index) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center gap-2.5 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2"
              >
                <item.icon className="w-5 h-5 text-white" />
                <span className="text-primary-foreground/95 font-medium">{item.text}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="max-w-md mx-auto"
          >
            <SmartCTAButton 
              to="/umzugsofferten" 
              location="offerten-cta" 
              size="xl"
            />
          </motion.div>
          
          {/* Micro trust text */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7 }}
            className="text-sm text-primary-foreground/60 mt-6"
          >
            Bereits über 15'000 erfolgreiche Umzüge vermittelt
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default OffertenCTA;
