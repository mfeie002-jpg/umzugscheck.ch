import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Award, Star, Clock, Languages } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  experience: string;
  avatar?: string;
  specialties: string[];
  languages: string[];
  rating?: number;
}

interface CompanyTeamShowcaseProps {
  companyName: string;
  teamSize?: number;
  foundedYear?: number;
}

const mockTeam: TeamMember[] = [
  {
    id: "1",
    name: "Marco Müller",
    role: "Teamleiter",
    experience: "12 Jahre",
    specialties: ["Klaviertransport", "Antiquitäten"],
    languages: ["Deutsch", "Italienisch"],
    rating: 4.9
  },
  {
    id: "2",
    name: "Stefan Brunner",
    role: "Senior Umzugshelfer",
    experience: "8 Jahre",
    specialties: ["Firmenumzüge", "Möbelmontage"],
    languages: ["Deutsch", "Französisch"],
    rating: 4.8
  },
  {
    id: "3",
    name: "Thomas Weber",
    role: "Fahrer & Umzugshelfer",
    experience: "5 Jahre",
    specialties: ["Internationale Umzüge", "Schwertransporte"],
    languages: ["Deutsch", "Englisch"],
    rating: 4.7
  },
  {
    id: "4",
    name: "Lisa Zimmermann",
    role: "Koordinatorin",
    experience: "6 Jahre",
    specialties: ["Projektplanung", "Kundenbetreuung"],
    languages: ["Deutsch", "Englisch", "Französisch"],
    rating: 4.9
  }
];

export const CompanyTeamShowcase = ({
  companyName,
  teamSize = 15,
  foundedYear = 2010
}: CompanyTeamShowcaseProps) => {
  const yearsInBusiness = new Date().getFullYear() - foundedYear;

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Unser Team
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Team Stats */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{teamSize}</div>
            <div className="text-xs text-muted-foreground">Mitarbeiter</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{yearsInBusiness}+</div>
            <div className="text-xs text-muted-foreground">Jahre Erfahrung</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">4.8</div>
            <div className="text-xs text-muted-foreground">⭐ Durchschnitt</div>
          </div>
        </div>

        {/* Team Members */}
        <div className="grid sm:grid-cols-2 gap-4">
          {mockTeam.map((member) => (
            <div
              key={member.id}
              className="p-4 rounded-lg border border-border/50 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-start gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium truncate">{member.name}</h4>
                    {member.rating && (
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{member.rating}</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                  
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{member.experience}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {member.specialties.slice(0, 2).map((spec, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                    <Languages className="h-3 w-3" />
                    <span>{member.languages.join(", ")}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Certifications */}
        <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
          <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
            <Award className="h-5 w-5" />
            <span className="font-medium">Zertifiziertes Team</span>
          </div>
          <p className="text-sm text-green-600 dark:text-green-500 mt-1">
            Alle unsere Mitarbeiter sind geschult und versichert. Regelmässige 
            Weiterbildungen garantieren höchste Qualitätsstandards.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyTeamShowcase;
