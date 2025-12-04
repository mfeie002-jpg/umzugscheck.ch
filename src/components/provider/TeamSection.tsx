import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users } from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  photo?: string;
  bio?: string;
}

interface TeamSectionProps {
  teamMembers: TeamMember[];
  teamSize: number;
}

export const TeamSection = ({ teamMembers, teamSize }: TeamSectionProps) => {
  if (!teamMembers || teamMembers.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Unser Team ({teamSize} Mitarbeiter)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member, index) => (
            <div key={index} className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                {member.photo ? (
                  <img src={member.photo} alt={member.name} loading="lazy" />
                ) : (
                  <AvatarFallback className="text-lg">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1">
                <h4 className="font-bold">{member.name}</h4>
                <p className="text-sm text-muted-foreground mb-1">{member.role}</p>
                {member.bio && (
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
