import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface Props {
  isLoading?: boolean;
}

export const ProgressiveLoadingIndicator = ({ isLoading = false }: Props) => {
  if (!isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="inline-block mb-4"
        >
          <Loader2 className="w-12 h-12 text-primary" />
        </motion.div>
        <p className="text-foreground font-semibold">Lädt...</p>
        <p className="text-sm text-muted-foreground">Bitte warten Sie einen Moment</p>
      </div>
    </motion.div>
  );
};
