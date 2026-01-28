import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Package, CheckCircle, Clock, Calendar } from "lucide-react";
import { motion } from "framer-motion";

interface Stats {
  total: number;
  completed: number;
  pending: number;
  upcoming: number;
}

export default function MoveStatistics() {
  const [stats, setStats] = useState<Stats>({
    total: 0,
    completed: 0,
    pending: 0,
    upcoming: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - no database table
    setTimeout(() => {
      setStats({ total: 0, completed: 0, pending: 0, upcoming: 0 });
      setLoading(false);
    }, 300);
  }, []);

  const statItems = [
    { label: "Gesamt", value: stats.total, icon: Package, color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30" },
    { label: "Abgeschlossen", value: stats.completed, icon: CheckCircle, color: "text-green-600 bg-green-100 dark:bg-green-900/30" },
    { label: "Ausstehend", value: stats.pending, icon: Clock, color: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30" },
    { label: "Bevorstehend", value: stats.upcoming, icon: Calendar, color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30" },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="animate-pulse">
                <div className="h-10 w-10 bg-muted rounded-full mb-3" />
                <div className="h-8 bg-muted rounded w-12 mb-1" />
                <div className="h-4 bg-muted rounded w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statItems.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${item.color}`}>
                <item.icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold">{item.value}</p>
              <p className="text-sm text-muted-foreground">{item.label}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
