/**
 * Team/Founder Section for Vision Page
 * Shows the person behind Umzugscheck.ch
 */

import { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  Code, 
  Rocket, 
  Brain,
  Linkedin,
  Github,
  Mail,
  MapPin,
  GraduationCap,
  Briefcase
} from "lucide-react";
import type { VisionLanguage } from "@/lib/vision-translations";

interface VisionTeamSectionProps {
  language: VisionLanguage;
}

const translations = {
  de: {
    badge: "Das Team",
    title: "Der Kopf hinter Umzugscheck.ch",
    subtitle: "Ein Ein-Mann-Projekt mit der Power eines 10-köpfigen Teams – dank KI",
    role: "Gründer & Entwickler",
    location: "Schweiz",
    bio: "Full-Stack Entwickler mit Leidenschaft für AI-gestützte Lösungen. Ich baue Umzugscheck.ch als Solo-Founder mit intensivem Einsatz: 14-15 Stunden täglich, 7 Tage die Woche.",
    stats: {
      hours: "2'100+",
      hoursLabel: "Entwicklungsstunden",
      daily: "14-15h",
      dailyLabel: "pro Tag",
      components: "1'000+",
      componentsLabel: "Komponenten",
      aiRatio: "95%",
      aiRatioLabel: "KI-Automatisierung"
    },
    commitment: {
      title: "Commitment",
      text: "Dieses Projekt ist nicht nur ein Startup – es ist meine Mission. Jeden Tag programmiere ich an der Vision, die Schweizer Umzugsindustrie zu revolutionieren."
    },
    skills: ["React/TypeScript", "Supabase", "AI/ML", "UX Design", "SEO", "Fintech"],
    contactTitle: "Kontakt",
    whyOnePersonTitle: "Warum funktioniert das mit einer Person?",
    whyOnePersonReasons: [
      "95% der Arbeit wird von KI-Tools erledigt (Copilot, ChatGPT, Claude)",
      "Moderne No-Code/Low-Code Tools beschleunigen die Entwicklung",
      "Fokus auf Automatisierung statt manuelle Prozesse",
      "Lean Startup Methodik: Schnell iterieren, kein Overhead"
    ]
  },
  bg: {
    badge: "Екипът",
    title: "Човекът зад Umzugscheck.ch",
    subtitle: "Проект на един човек със силата на 10-членен екип – благодарение на AI",
    role: "Основател & Разработчик",
    location: "Швейцария",
    bio: "Full-Stack разработчик със страст към AI решения. Изграждам Umzugscheck.ch като соло основател с интензивна работа: 14-15 часа дневно, 7 дни в седмицата.",
    stats: {
      hours: "2'100+",
      hoursLabel: "Часове разработка",
      daily: "14-15ч",
      dailyLabel: "на ден",
      components: "1'000+",
      componentsLabel: "Компоненти",
      aiRatio: "95%",
      aiRatioLabel: "AI автоматизация"
    },
    commitment: {
      title: "Посвещение",
      text: "Този проект не е просто стартъп – това е моята мисия. Всеки ден програмирам за визията да революционизирам швейцарската индустрия за преместване."
    },
    skills: ["React/TypeScript", "Supabase", "AI/ML", "UX Design", "SEO", "Fintech"],
    contactTitle: "Контакт",
    whyOnePersonTitle: "Защо работи с един човек?",
    whyOnePersonReasons: [
      "95% от работата се върши от AI инструменти (Copilot, ChatGPT, Claude)",
      "Модерни No-Code/Low-Code инструменти ускоряват разработката",
      "Фокус върху автоматизация вместо ръчни процеси",
      "Lean Startup методология: Бърза итерация, без overhead"
    ]
  }
};

export const VisionTeamSection = memo(({ language }: VisionTeamSectionProps) => {
  const t = translations[language];
  
  return (
    <section id="vision-team" className="py-12 md:py-16 bg-gradient-to-b from-background to-primary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <Badge variant="secondary" className="mb-3">
            {t.badge}
          </Badge>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            {t.title}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-5 gap-0">
                {/* Left: Avatar & Basic Info */}
                <div className="md:col-span-2 bg-primary/5 p-6 md:p-8 flex flex-col items-center justify-center text-center">
                  {/* Placeholder Avatar */}
                  <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mb-4 shadow-lg">
                    <span className="text-4xl md:text-5xl font-bold text-primary-foreground">DZ</span>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-1">Dimitar Zlatkov</h3>
                  <p className="text-muted-foreground text-sm mb-2">{t.role}</p>
                  
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                    <MapPin className="w-3.5 h-3.5" />
                    {t.location}
                  </div>
                  
                  {/* Social Links */}
                  <div className="flex gap-3">
                    <a href="mailto:info@umzugscheck.ch" className="p-2 rounded-full bg-background hover:bg-muted transition-colors">
                      <Mail className="w-4 h-4" />
                    </a>
                    <a href="#" className="p-2 rounded-full bg-background hover:bg-muted transition-colors">
                      <Linkedin className="w-4 h-4" />
                    </a>
                    <a href="#" className="p-2 rounded-full bg-background hover:bg-muted transition-colors">
                      <Github className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* Right: Details */}
                <div className="md:col-span-3 p-6 md:p-8">
                  <p className="text-muted-foreground mb-6">
                    {t.bio}
                  </p>
                  
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <div className="text-xl md:text-2xl font-bold text-primary">{t.stats.hours}</div>
                      <div className="text-xs text-muted-foreground">{t.stats.hoursLabel}</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <div className="text-xl md:text-2xl font-bold text-primary">{t.stats.daily}</div>
                      <div className="text-xs text-muted-foreground">{t.stats.dailyLabel}</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <div className="text-xl md:text-2xl font-bold text-primary">{t.stats.components}</div>
                      <div className="text-xs text-muted-foreground">{t.stats.componentsLabel}</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <div className="text-xl md:text-2xl font-bold text-primary">{t.stats.aiRatio}</div>
                      <div className="text-xs text-muted-foreground">{t.stats.aiRatioLabel}</div>
                    </div>
                  </div>
                  
                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {t.skills.map((skill, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  
                  {/* Commitment Box */}
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Rocket className="w-4 h-4 text-primary" />
                      {t.commitment.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {t.commitment.text}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Why One Person Works */}
          <Card className="mt-6">
            <CardContent className="p-6">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                {t.whyOnePersonTitle}
              </h4>
              <ul className="space-y-2">
                {t.whyOnePersonReasons.map((reason, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-primary mt-0.5">✓</span>
                    {reason}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
});

VisionTeamSection.displayName = 'VisionTeamSection';
