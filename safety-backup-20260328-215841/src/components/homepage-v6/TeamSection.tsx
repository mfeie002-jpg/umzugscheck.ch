/**
 * Team Section V6 - Personal touch with real team members
 * Addresses: "Persönlichkeit zeigen (Team/Fotos)"
 */
import { memo } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Linkedin, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  specialties: string[];
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: '1',
    name: 'Thomas Müller',
    role: 'Gründer & CEO',
    image: '/placeholder.svg',
    bio: 'Über 10 Jahre Erfahrung in der Umzugsbranche',
    specialties: ['Strategie', 'Qualitätssicherung'],
  },
  {
    id: '2',
    name: 'Sarah Weber',
    role: 'Kundenbetreuung',
    image: '/placeholder.svg',
    bio: 'Ihr direkter Ansprechpartner bei Fragen',
    specialties: ['Support', 'Beratung'],
  },
  {
    id: '3',
    name: 'Fabian Keller',
    role: 'Umzugsexperte',
    image: '/placeholder.svg',
    bio: 'Spezialist für komplexe Firmenumzüge',
    specialties: ['B2B', 'Logistik'],
  },
];

export const TeamSection = memo(function TeamSection() {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-2 mb-4"
          >
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-medium">Schweizer Team aus Zürich</span>
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Echte Menschen,{' '}
            <span className="text-secondary">echte Hilfe</span>
          </h2>
          
          <p className="text-muted-foreground max-w-xl mx-auto">
            Wir sind ein kleines, engagiertes Team aus Zürich. 
            Bei uns landen Sie nicht im Callcenter – sondern direkt bei uns.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
          {TEAM_MEMBERS.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-2xl border p-6 text-center hover:shadow-lg transition-shadow"
            >
              {/* Avatar */}
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <span className="text-3xl font-bold text-primary">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>

              {/* Info */}
              <h3 className="text-xl font-bold mb-1">{member.name}</h3>
              <p className="text-sm text-secondary font-medium mb-2">{member.role}</p>
              <p className="text-sm text-muted-foreground mb-4">{member.bio}</p>

              {/* Specialties */}
              <div className="flex flex-wrap justify-center gap-2">
                {member.specialties.map((specialty) => (
                  <span
                    key={specialty}
                    className="px-3 py-1 bg-muted rounded-full text-xs font-medium"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Company Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card rounded-2xl border p-6 md:p-8 max-w-2xl mx-auto"
        >
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left: Address */}
            <div>
              <h4 className="font-semibold mb-3">Unser Büro</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>Bahnhofstrasse 10, 8001 Zürich</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" />
                  <span>+41 44 123 45 67</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  <span>info@umzugscheck.ch</span>
                </div>
              </div>
            </div>

            {/* Right: Company Details */}
            <div>
              <h4 className="font-semibold mb-3">Rechtliche Angaben</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>Umzugscheck AG</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>CHE-123.456.789</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>Im Handelsregister Zürich eingetragen</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
});
