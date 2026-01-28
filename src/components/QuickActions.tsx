import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calculator,
  Calendar,
  ClipboardList,
  FileText,
  MessageCircle,
  Package,
  Phone,
  Truck,
} from "lucide-react";
import { motion } from "framer-motion";

const actions = [
  {
    icon: Calculator,
    label: "Kostenrechner",
    description: "Schnelle Kostenschätzung",
    href: "/calculator",
    color: "text-blue-500",
  },
  {
    icon: Calendar,
    label: "Online Buchen",
    description: "Termin vereinbaren",
    href: "/booking",
    color: "text-green-500",
  },
  {
    icon: Package,
    label: "Meine Umzüge",
    description: "Umzüge verwalten",
    href: "/my-moves",
    color: "text-purple-500",
  },
  {
    icon: ClipboardList,
    label: "Checkliste",
    description: "Umzugs-Checkliste",
    href: "/checklist",
    color: "text-orange-500",
  },
  {
    icon: Truck,
    label: "Tracking",
    description: "Umzug verfolgen",
    href: "/tracking",
    color: "text-primary",
  },
  {
    icon: FileText,
    label: "Dokumente",
    description: "Dateien verwalten",
    href: "/portal",
    color: "text-yellow-600",
  },
  {
    icon: MessageCircle,
    label: "Kontakt",
    description: "Uns kontaktieren",
    href: "/contact",
    color: "text-pink-500",
  },
  {
    icon: Phone,
    label: "Anrufen",
    description: "Sofort anrufen",
    href: "tel:+41443334455",
    color: "text-red-500",
    external: true,
  },
];

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {actions.map((action, index) => (
        <motion.div
          key={action.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card
            className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 group"
            onClick={() => {
              if (action.external) {
                window.location.href = action.href;
              } else {
                navigate(action.href);
              }
            }}
          >
            <CardContent className="p-4 text-center">
              <div
                className={`w-12 h-12 mx-auto mb-3 rounded-full bg-muted flex items-center justify-center group-hover:scale-110 transition-transform ${action.color}`}
              >
                <action.icon className="w-6 h-6" />
              </div>
              <h3 className="font-medium text-sm">{action.label}</h3>
              <p className="text-xs text-muted-foreground mt-1">
                {action.description}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}