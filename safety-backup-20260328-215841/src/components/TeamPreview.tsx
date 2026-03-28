import { Link } from "react-router-dom";
import { ArrowRight, Users } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import AnimatedSection from "./AnimatedSection";
import founderMale from "@/assets/team-founder-male.jpg";
import founderFemale from "@/assets/team-founder-female.jpg";
import teamLeader from "@/assets/team-leader-new.jpg";

interface TeamMemberData {
  name: string;
  role: string;
  image: string;
  quote?: string;
}

const teamMembers: TeamMemberData[] = [
  {
    name: "Peter Feierabend",
    role: "Geschäftsführer",
    image: founderMale,
    quote: "Qualität ist kein Zufall – sie ist das Ergebnis von Engagement und Erfahrung."
  },
  {
    name: "Sarah Feierabend",
    role: "Kundenbetreuung",
    image: founderFemale,
    quote: "Jeder Umzug ist einzigartig – genau wie unsere Kunden."
  },
  {
    name: "Marco Brunner",
    role: "Teamleiter",
    image: teamLeader,
    quote: "Sorgfalt und Präzision – das zeichnet uns aus."
  }
];

export default function TeamPreview() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-alpine bg-alpine/10 rounded-full mb-4">
            <Users className="inline-block w-3 h-3 mr-1" />
            Unser Team
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 font-display">
            Die Menschen hinter <span className="text-gradient">Feierabend Umzüge</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Ein Familienunternehmen mit Herzblut und über 40 Jahren Erfahrung
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
          {teamMembers.map((member, index) => (
            <AnimatedSection key={index} delay={index * 0.1}>
              <Card className="overflow-hidden hover-lift">
                <div className="aspect-[4/5] relative">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="font-bold text-xl">{member.name}</h3>
                    <p className="text-sm text-white/80">{member.role}</p>
                  </div>
                </div>
                {member.quote && (
                  <div className="p-6 bg-muted/30">
                    <p className="text-sm text-muted-foreground italic">
                      "{member.quote}"
                    </p>
                  </div>
                )}
              </Card>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.3} className="text-center">
          <Link to="/team">
            <Button variant="outline" size="lg">
              Das gesamte Team kennenlernen
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}
