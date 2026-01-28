import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuickAction {
  icon: LucideIcon;
  title: string;
  description: string;
  link: string;
  color: string;
}

interface QuickActionsGridProps {
  actions: QuickAction[];
  className?: string;
}

const QuickActionsGrid = ({ actions, className = "" }: QuickActionsGridProps) => {
  return (
    <div className={`grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 ${className}`}>
      {actions.map((action, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
        >
          <Link to={action.link} className="block group">
            <div className="relative p-6 rounded-2xl bg-card border border-border shadow-soft hover:shadow-medium hover:border-primary/30 transition-all duration-300 h-full">
              <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center mb-4`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              
              <h3 className="font-display text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                {action.title}
              </h3>
              
              <p className="text-sm text-muted-foreground mb-4">
                {action.description}
              </p>
              
              <div className="flex items-center text-primary text-sm font-medium">
                Mehr erfahren
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
};

export default QuickActionsGrid;
