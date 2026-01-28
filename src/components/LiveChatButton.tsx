import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const LiveChatButton = () => {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 2 }}
      className="fixed bottom-24 right-4 z-40 md:bottom-6"
    >
      <Button
        size="lg"
        className="rounded-full w-14 h-14 bg-forest hover:bg-forest/90 shadow-lg"
        onClick={() => window.open("https://wa.me/41765681302", "_blank")}
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    </motion.div>
  );
};

export default LiveChatButton;

