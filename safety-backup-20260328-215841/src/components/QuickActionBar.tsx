import { Button } from "@/components/ui/button";
import { Calculator, MessageSquare, Star, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface QuickActionBarProps {
  className?: string;
}

export const QuickActionBar = ({ className }: QuickActionBarProps) => {
  const navigate = useNavigate();

  const actions = [
    {
      icon: Calculator,
      label: "Rechner",
      onClick: () => navigate("/rechner"),
      color: "text-blue-600"
    },
    {
      icon: Star,
      label: "Firmen",
      onClick: () => navigate("/firmen"),
      color: "text-yellow-600"
    },
    {
      icon: FileText,
      label: "Ratgeber",
      onClick: () => navigate("/blog"),
      color: "text-green-600"
    },
    {
      icon: MessageSquare,
      label: "Kontakt",
      onClick: () => navigate("/kontakt"),
      color: "text-purple-600"
    }
  ];

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-t shadow-lg z-40 md:hidden",
      className
    )}>
      <div className="grid grid-cols-4 gap-1 p-2">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant="ghost"
            onClick={action.onClick}
            className="flex-col h-auto py-3 gap-1"
          >
            <action.icon className={cn("h-5 w-5", action.color)} />
            <span className="text-xs">{action.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};
