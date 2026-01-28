/**
 * Team/Founder Section for Vision Page
 * Shows the person behind Umzugscheck.ch
 * Updated: 13.5h/day average since 31.10.2024
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
  Calendar
} from "lucide-react";
import type { VisionLanguage } from "@/lib/vision-translations";

// Import background image
import youngProfessionalUnpacking from "@/assets/vision/young-professional-unpacking.jpg";

interface VisionTeamSectionProps {
  language: VisionLanguage;
}

// Calculate days since start (31.10.2026)
const getProjectDays = () => {
  const startDate = new Date('2026-10-31');
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - startDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Calculate total hours (13.5h average per day)
const getTotalHours = () => {
  const days = getProjectDays();
  return Math.round(days * 13.5);
};

const translations = {
  de: {
    badge: "Das Team",
    title: "Der Kopf hinter Umzugscheck.ch",
    subtitle: "Ein Ein-Mann-Projekt mit der Power eines 10-köpfigen Teams – dank KI",
    role: "Gründer & Entwickler",
    location: "Schweiz",
    bio: `Full-Stack Entwickler mit Leidenschaft für AI-gestützte Lösungen. Ich baue Umzugscheck.ch als Solo-Founder mit intensivem Einsatz: durchschnittlich 13.5 Stunden täglich, 7 Tage die Woche, seit dem 31. Oktober 2026.`,
    stats: {
      hours: `${getTotalHours().toLocaleString('de-CH')}+`,
      hoursLabel: "Entwicklungsstunden",
      daily: "13.5h",
      dailyLabel: "Ø pro Tag",
      days: getProjectDays().toString(),
      daysLabel: "Tage seit Start",
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
    ],
    startDate: "Start: 31. Oktober 2026"
  },
  bg: {
    badge: "Екипът",
    title: "Човекът зад Umzugscheck.ch",
    subtitle: "Проект на един човек със силата на 10-членен екип – благодарение на AI",
    role: "Основател & Разработчик",
    location: "Швейцария",
    bio: `Full-Stack разработчик със страст към AI решения. Изграждам Umzugscheck.ch като соло основател с интензивна работа: средно 13.5 часа дневно, 7 дни в седмицата, от 31 октомври 2024.`,
    stats: {
      hours: `${getTotalHours().toLocaleString('de-CH')}+`,
      hoursLabel: "Часове разработка",
      daily: "13.5ч",
      dailyLabel: "Ø на ден",
      days: getProjectDays().toString(),
      daysLabel: "Дни от старта",
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
    ],
    startDate: "Старт: 31 октомври 2024"
  },
  it: {
    badge: "Il Team",
    title: "La mente dietro Umzugscheck.ch",
    subtitle: "Un progetto di una persona con la forza di un team di 10 – grazie all'AI",
    role: "Fondatore & Sviluppatore",
    location: "Svizzera",
    bio: `Sviluppatore Full-Stack con passione per soluzioni AI. Costruisco Umzugscheck.ch come fondatore singolo con impegno intenso: in media 13.5 ore al giorno, 7 giorni alla settimana, dal 31 ottobre 2024.`,
    stats: {
      hours: `${getTotalHours().toLocaleString('de-CH')}+`,
      hoursLabel: "Ore di sviluppo",
      daily: "13.5h",
      dailyLabel: "Ø al giorno",
      days: getProjectDays().toString(),
      daysLabel: "Giorni dall'inizio",
      aiRatio: "95%",
      aiRatioLabel: "Automazione AI"
    },
    commitment: {
      title: "Impegno",
      text: "Questo progetto non è solo una startup – è la mia missione. Ogni giorno programmo per la visione di rivoluzionare l'industria dei traslochi svizzera."
    },
    skills: ["React/TypeScript", "Supabase", "AI/ML", "UX Design", "SEO", "Fintech"],
    contactTitle: "Contatto",
    whyOnePersonTitle: "Perché funziona con una persona?",
    whyOnePersonReasons: [
      "95% del lavoro viene svolto da strumenti AI (Copilot, ChatGPT, Claude)",
      "Strumenti No-Code/Low-Code moderni accelerano lo sviluppo",
      "Focus sull'automazione invece di processi manuali",
      "Metodologia Lean Startup: iterazione rapida, nessun overhead"
    ],
    startDate: "Inizio: 31 ottobre 2024"
  }
};

export const VisionTeamSection = memo(({ language }: VisionTeamSectionProps) => {
  const t = translations[language] || translations.de;
  
  return (
    <section id="vision-team" className="py-12 md:py-16 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={youngProfessionalUnpacking}
          alt="Working hard"
          className="w-full h-full object-cover opacity-10"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
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
          <Card className="overflow-hidden bg-background/95 backdrop-blur-sm">
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
                  
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                    <MapPin className="w-3.5 h-3.5" />
                    {t.location}
                  </div>
                  
                  <div className="flex items-center gap-1 text-xs text-primary font-medium mb-4">
                    <Calendar className="w-3 h-3" />
                    {t.startDate}
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
                  
                  {/* Stats Grid - Updated with accurate data */}
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
                      <div className="text-xl md:text-2xl font-bold text-primary">{t.stats.days}</div>
                      <div className="text-xs text-muted-foreground">{t.stats.daysLabel}</div>
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
          <Card className="mt-6 bg-background/95 backdrop-blur-sm">
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
