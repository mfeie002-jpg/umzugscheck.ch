import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Shield, Award, Leaf, Clock, Star, CheckCircle2 } from "lucide-react";

interface Certification {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

interface CompanyCertificationsProps {
  companyId: string;
  certifications?: string[];
  isVerified?: boolean;
  yearsInBusiness?: number;
  isEcoFriendly?: boolean;
  hasGuarantee?: boolean;
}

const allCertifications: Record<string, Certification> = {
  iso9001: {
    id: "iso9001",
    name: "ISO 9001",
    icon: <Award className="w-3 h-3" />,
    color: "bg-blue-100 text-blue-700 border-blue-200",
    description: "Zertifiziertes Qualitätsmanagement",
  },
  famo: {
    id: "famo",
    name: "FAMO",
    icon: <Shield className="w-3 h-3" />,
    color: "bg-purple-100 text-purple-700 border-purple-200",
    description: "Fachverband Möbeltransport Schweiz",
  },
  astag: {
    id: "astag",
    name: "ASTAG",
    icon: <CheckCircle2 className="w-3 h-3" />,
    color: "bg-red-100 text-red-700 border-red-200",
    description: "Schweizerischer Nutzfahrzeugverband",
  },
  eco: {
    id: "eco",
    name: "Eco-zertifiziert",
    icon: <Leaf className="w-3 h-3" />,
    color: "bg-green-100 text-green-700 border-green-200",
    description: "Umweltfreundlicher Umzug",
  },
  express: {
    id: "express",
    name: "Express",
    icon: <Clock className="w-3 h-3" />,
    color: "bg-amber-100 text-amber-700 border-amber-200",
    description: "Kurzfristige Buchungen möglich",
  },
  topRated: {
    id: "topRated",
    name: "Top bewertet",
    icon: <Star className="w-3 h-3" />,
    color: "bg-accent/20 text-accent-foreground border-accent/30",
    description: "Über 4.5 Sterne Durchschnitt",
  },
};

const CompanyCertifications = ({
  companyId,
  certifications = ["iso9001", "famo"],
  isVerified = true,
  yearsInBusiness = 15,
  isEcoFriendly = false,
  hasGuarantee = true,
}: CompanyCertificationsProps) => {
  // Build list of badges to show
  const badges: Certification[] = [];

  // Add provided certifications
  certifications.forEach(cert => {
    if (allCertifications[cert]) {
      badges.push(allCertifications[cert]);
    }
  });

  // Add eco certification if applicable
  if (isEcoFriendly && !badges.find(b => b.id === "eco")) {
    badges.push(allCertifications.eco);
  }

  return (
    <TooltipProvider>
      <div className="flex flex-wrap gap-1.5">
        {/* Verified Badge */}
        {isVerified && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200 text-xs gap-1 cursor-help">
                <Shield className="w-3 h-3" />
                Verifiziert
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-medium">Verifizierte Firma</p>
              <p className="text-xs">Identität und Versicherung geprüft</p>
            </TooltipContent>
          </Tooltip>
        )}

        {/* Years in Business */}
        {yearsInBusiness >= 10 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200 text-xs gap-1 cursor-help">
                <Award className="w-3 h-3" />
                Seit {yearsInBusiness} Jahren
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-medium">Erfahrenes Unternehmen</p>
              <p className="text-xs">{yearsInBusiness} Jahre Erfahrung im Umzugsgeschäft</p>
            </TooltipContent>
          </Tooltip>
        )}

        {/* Certifications */}
        {badges.slice(0, 3).map(cert => (
          <Tooltip key={cert.id}>
            <TooltipTrigger asChild>
              <Badge variant="outline" className={`${cert.color} text-xs gap-1 cursor-help`}>
                {cert.icon}
                {cert.name}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-medium">{cert.name}</p>
              <p className="text-xs">{cert.description}</p>
            </TooltipContent>
          </Tooltip>
        ))}

        {/* More badges indicator */}
        {badges.length > 3 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="text-xs cursor-help">
                +{badges.length - 3}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-medium">Weitere Zertifikate</p>
              <ul className="text-xs">
                {badges.slice(3).map(cert => (
                  <li key={cert.id}>{cert.name}</li>
                ))}
              </ul>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
};

export default CompanyCertifications;
