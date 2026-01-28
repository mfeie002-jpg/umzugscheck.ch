import { Mail, Phone, Linkedin } from "lucide-react";
import { Card } from "@/components/ui/card";

interface TeamMemberProps {
  name: string;
  role: string;
  image: string;
  bio?: string;
  email?: string;
  phone?: string;
  isFounder?: boolean;
  generation?: string;
  className?: string;
}

const TeamMember = ({ 
  name, 
  role, 
  image, 
  bio,
  email, 
  phone,
  isFounder = false,
  generation,
  className = "" 
}: TeamMemberProps) => {
  return (
    <Card className={`overflow-hidden hover-lift group ${className}`}>
      <div className="relative">
        <div className="aspect-[3/4] overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Founder badge */}
        {isFounder && (
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-gradient-warm text-warm-foreground rounded-full shadow-lg">
              {generation || "Gründerfamilie"}
            </span>
          </div>
        )}

        {/* Contact info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex gap-2">
            {email && (
              <a 
                href={`mailto:${email}`}
                className="w-10 h-10 rounded-full bg-background/90 flex items-center justify-center hover:bg-alpine hover:text-alpine-foreground transition-colors"
              >
                <Mail className="h-4 w-4" />
              </a>
            )}
            {phone && (
              <a 
                href={`tel:${phone}`}
                className="w-10 h-10 rounded-full bg-background/90 flex items-center justify-center hover:bg-alpine hover:text-alpine-foreground transition-colors"
              >
                <Phone className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-foreground font-display">{name}</h3>
        <p className="text-sm font-medium text-alpine mb-2">{role}</p>
        {bio && (
          <p className="text-sm text-muted-foreground line-clamp-2">{bio}</p>
        )}
      </div>
    </Card>
  );
};

export default TeamMember;