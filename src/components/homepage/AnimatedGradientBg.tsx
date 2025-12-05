import { motion } from "framer-motion";

interface AnimatedGradientBgProps {
  children: React.ReactNode;
  className?: string;
}

export const AnimatedGradientBg = ({ children, className = "" }: AnimatedGradientBgProps) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          background: "radial-gradient(circle at 20% 80%, hsl(var(--primary) / 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, hsl(var(--accent) / 0.3) 0%, transparent 50%)"
        }}
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, 0]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};
