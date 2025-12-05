import { motion } from "framer-motion";
import { Calculator, FileText, Phone, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const actions = [
  {
    icon: Calculator,
    label: "Preisrechner",
    href: "/rechner",
    color: "bg-blue-500"
  },
  {
    icon: FileText,
    label: "Offerte",
    href: "/umzugsofferten",
    color: "bg-primary"
  },
  {
    icon: Phone,
    label: "Anrufen",
    href: "tel:+41445551234",
    color: "bg-green-500"
  },
  {
    icon: MessageCircle,
    label: "Chat",
    href: "/kontakt",
    color: "bg-purple-500"
  }
];

export const QuickActionButtons = () => {
  return (
    <div className="fixed bottom-20 left-4 right-4 md:hidden z-40">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-card/95 backdrop-blur-lg rounded-2xl border border-border shadow-lg p-2"
      >
        <div className="grid grid-cols-4 gap-1">
          {actions.map((action) => (
            <Link
              key={action.label}
              to={action.href}
              className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-muted transition-colors"
            >
              <div className={`w-10 h-10 rounded-full ${action.color} flex items-center justify-center`}>
                <action.icon className="h-5 w-5 text-white" />
              </div>
              <span className="text-xs font-medium text-foreground">{action.label}</span>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
