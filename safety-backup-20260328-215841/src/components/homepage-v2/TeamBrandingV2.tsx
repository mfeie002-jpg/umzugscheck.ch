/**
 * Team Branding V2 - "Made with Love in Zurich"
 * Echte Gesichter statt Stock-Fotos
 */
import { memo } from 'react';
import { MapPin, Heart, Users, Building2 } from 'lucide-react';

const teamMembers = [
  {
    name: 'Marco',
    role: 'Gründer',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  },
  {
    name: 'Sarah',
    role: 'Kundenbetreuung',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
  },
  {
    name: 'Thomas',
    role: 'Tech Lead',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  },
  {
    name: 'Lisa',
    role: 'Partnermanagement',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
  },
];

export const TeamBrandingV2 = memo(function TeamBrandingV2() {
  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <div className="inline-flex items-center gap-2 text-secondary mb-4">
            <Heart className="w-5 h-5 fill-current" />
            <span className="font-semibold">Made with Love in Zürich</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Echte Menschen. Echte Hilfe.
          </h2>

          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            Wir sind ein kleines Team aus Zürich mit einer grossen Mission: 
            Umziehen soll stressfrei sein.
          </p>

          {/* Team Grid */}
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-3">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-background shadow-lg group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-background flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                </div>
                <div className="font-semibold">{member.name}</div>
                <div className="text-xs text-muted-foreground">{member.role}</div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="font-bold">Zürich</div>
              <div className="text-xs text-muted-foreground">Standort</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                <Users className="w-4 h-4" />
              </div>
              <div className="font-bold">12</div>
              <div className="text-xs text-muted-foreground">Mitarbeiter</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="font-bold">2019</div>
              <div className="text-xs text-muted-foreground">Gegründet</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
