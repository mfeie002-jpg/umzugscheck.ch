import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calculator, 
  Building2, 
  FileText, 
  Phone, 
  MessageCircle,
  HelpCircle,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const quickActions = [
  {
    icon: Calculator,
    label: "Preis berechnen",
    description: "Sofort-Schätzung",
    href: "/rechner",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Building2,
    label: "Firmen finden",
    description: "Alle Anbieter",
    href: "/umzugsfirmen",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    icon: FileText,
    label: "Offerte anfragen",
    description: "Kostenlos",
    href: "/umzugsofferten",
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    icon: MessageCircle,
    label: "Live Chat",
    description: "Sofort Hilfe",
    href: "/kontakt",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    icon: HelpCircle,
    label: "Ratgeber",
    description: "Tipps & Tricks",
    href: "/ratgeber",
    color: "text-amber-600",
    bgColor: "bg-amber-100",
  },
  {
    icon: Phone,
    label: "Kontakt",
    description: "Wir helfen",
    href: "/kontakt",
    color: "text-teal-600",
    bgColor: "bg-teal-100",
  },
];

export const QuickActionsWidget = () => {
  return (
    <Card className="border-border/50 shadow-sm">
      <CardContent className="p-4">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link to={action.href}>
                <Button
                  variant="ghost"
                  className="h-auto py-3 px-2 flex flex-col items-center gap-1.5 w-full hover:bg-muted/50"
                >
                  <div className={`p-2 rounded-lg ${action.bgColor}`}>
                    <action.icon className={`h-5 w-5 ${action.color}`} />
                  </div>
                  <span className="text-xs font-medium">{action.label}</span>
                  <span className="text-xs text-muted-foreground hidden sm:block">
                    {action.description}
                  </span>
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActionsWidget;
