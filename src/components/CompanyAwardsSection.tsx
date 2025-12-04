import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Award, Star, Medal, Crown, Shield } from "lucide-react";
import { motion } from "framer-motion";

interface CompanyAward {
  id: string;
  name: string;
  year: string;
  icon: React.ReactNode;
  description: string;
  color: string;
}

interface CompanyAwardsSectionProps {
  companyName: string;
  awards?: CompanyAward[];
}

const DEFAULT_AWARDS: CompanyAward[] = [
  {
    id: "1",
    name: "Beste Umzugsfirma 2024",
    year: "2024",
    icon: <Trophy className="h-5 w-5" />,
    description: "Auszeichnung von Umzugscheck.ch",
    color: "text-amber-500",
  },
  {
    id: "2",
    name: "Top Kundenzufriedenheit",
    year: "2024",
    icon: <Star className="h-5 w-5" />,
    description: "Über 98% positive Bewertungen",
    color: "text-yellow-500",
  },
  {
    id: "3",
    name: "Zertifizierter Betrieb",
    year: "2023",
    icon: <Shield className="h-5 w-5" />,
    description: "ISO 9001 zertifiziert",
    color: "text-blue-500",
  },
  {
    id: "4",
    name: "Umwelt-Champion",
    year: "2024",
    icon: <Medal className="h-5 w-5" />,
    description: "Nachhaltige Umzugspraktiken",
    color: "text-green-500",
  },
];

export const CompanyAwardsSection = ({ 
  companyName, 
  awards = DEFAULT_AWARDS 
}: CompanyAwardsSectionProps) => {
  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Award className="h-5 w-5 text-amber-500" />
          Auszeichnungen & Zertifikate
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {awards.map((award, index) => (
            <motion.div
              key={award.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className={`${award.color} mb-2`}>
                {award.icon}
              </div>
              <p className="font-medium text-sm">{award.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{award.description}</p>
              <Badge variant="outline" className="mt-2 text-xs">
                {award.year}
              </Badge>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyAwardsSection;
