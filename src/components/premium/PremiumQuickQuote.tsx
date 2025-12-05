import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, ArrowRight, Home, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

export const PremiumQuickQuote = () => {
  const navigate = useNavigate();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [rooms, setRooms] = useState("");

  const handleSubmit = () => {
    navigate(`/umzugsrechner?from=${from}&to=${to}&rooms=${rooms}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-card rounded-3xl shadow-2xl border p-6 md:p-8 max-w-4xl mx-auto -mt-16 relative z-20"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
          <Zap className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-bold">Schnell-Offerte</h3>
          <p className="text-sm text-muted-foreground">In 30 Sekunden zum Preis</p>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
          <Input
            placeholder="Von (PLZ/Ort)"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
          <Input
            placeholder="Nach (PLZ/Ort)"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={rooms} onValueChange={setRooms}>
          <SelectTrigger>
            <Home className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Zimmer" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 Zimmer</SelectItem>
            <SelectItem value="1.5">1.5 Zimmer</SelectItem>
            <SelectItem value="2">2 Zimmer</SelectItem>
            <SelectItem value="2.5">2.5 Zimmer</SelectItem>
            <SelectItem value="3">3 Zimmer</SelectItem>
            <SelectItem value="3.5">3.5 Zimmer</SelectItem>
            <SelectItem value="4">4 Zimmer</SelectItem>
            <SelectItem value="4.5">4.5 Zimmer</SelectItem>
            <SelectItem value="5">5+ Zimmer</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={handleSubmit} className="group">
          Preis berechnen
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 mt-6 pt-6 border-t text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-green-500 rounded-full" />
          100% kostenlos
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-green-500 rounded-full" />
          Unverbindlich
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-green-500 rounded-full" />
          Sofortige Preisanzeige
        </span>
      </div>
    </motion.div>
  );
};
