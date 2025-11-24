import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useState } from "react";

export const WhatsAppButton = () => {
  const [isHovered, setIsHovered] = useState(false);
  
  const whatsappNumber = "+41445678900";
  const message = "Hallo! Ich interessiere mich für Ihre Umzugsservices.";
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\+/g, "")}?text=${encodeURIComponent(message)}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed bottom-24 right-6 z-40 group"
    >
      <motion.div
        animate={{
          scale: isHovered ? 1.1 : 1,
        }}
        className="relative"
      >
        {/* Pulse Animation */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 bg-green-500 rounded-full"
        />
        
        {/* Button */}
        <div className="relative w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full shadow-2xl flex items-center justify-center transition-colors">
          <MessageCircle className="w-8 h-8 text-white" fill="white" />
        </div>

        {/* Tooltip */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            x: isHovered ? 0 : 10,
          }}
          className="absolute right-20 top-1/2 -translate-y-1/2 bg-card border border-border rounded-lg px-4 py-2 shadow-lg whitespace-nowrap pointer-events-none"
        >
          <p className="text-sm font-semibold text-foreground">
            Chat via WhatsApp
          </p>
          <p className="text-xs text-muted-foreground">
            Schnelle Antwort garantiert
          </p>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-card" />
        </motion.div>
      </motion.div>
    </motion.a>
  );
};
