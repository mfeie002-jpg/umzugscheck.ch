/**
 * VisionHumanStorySection - Emotional Human-Centered Visual Section
 * 
 * Shows the human side of moving with emotional imagery and relatable stories.
 * Designed to break up text-heavy sections with visual storytelling.
 */

import { motion } from "framer-motion";
import { Heart, Home, Users, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface VisionHumanStorySectionProps {
  language?: 'de' | 'it' | 'bg';
}

const TRANSLATIONS = {
  de: {
    badge: "Die menschliche Seite",
    title: "Umziehen ist mehr als Kartons packen",
    subtitle: "Es ist ein Neuanfang. Ein Kapitel, das endet. Eines, das beginnt.",
    stories: [
      {
        emoji: "👨‍👩‍👧",
        title: "Die junge Familie",
        story: "Laura und Marco erwarten ihr zweites Kind. Die 2-Zimmer-Wohnung wird zu eng. Sie brauchen mehr Platz – aber weniger Stress.",
        solution: "Mit Umzugscheck: 3 Offerten in 24h, Escrow-Schutz, ein Klick zur Traumwohnung.",
      },
      {
        emoji: "👴",
        title: "Der Senior",
        story: "Herr Müller, 78, zieht nach 40 Jahren ins betreute Wohnen. Der Hausstand eines Lebens. Die Überforderung ist real.",
        solution: "Full-Service-Umzug mit Entrümpelung, Reinigung, allem. Er muss nur zusehen.",
      },
      {
        emoji: "💼",
        title: "Die Berufseinsteigerin",
        story: "Sarah hat ihren Traumjob in Zürich. In 3 Wochen muss sie da sein. Budget: knapp. Zeit: keine.",
        solution: "Preisrechner zeigt: 890 CHF. Studentenrabatt. Termin steht.",
      },
    ],
    cta: "Für wen ziehen Sie um?",
    stats: [
      { value: "450'000", label: "Umzüge pro Jahr in der Schweiz" },
      { value: "5.2h", label: "Durchschnittliche Recherchezeit" },
      { value: "CHF 1'200", label: "Ersparnis durch Vergleich" },
    ],
  },
  it: {
    badge: "Il lato umano",
    title: "Traslocare è più che imballare scatole",
    subtitle: "È un nuovo inizio. Un capitolo che finisce. Uno che inizia.",
    stories: [
      {
        emoji: "👨‍👩‍👧",
        title: "La giovane famiglia",
        story: "Laura e Marco aspettano il secondo figlio. L'appartamento di 2 stanze diventa stretto.",
        solution: "Con Umzugscheck: 3 preventivi in 24h, protezione Escrow, un clic per la casa dei sogni.",
      },
      {
        emoji: "👴",
        title: "Il senior",
        story: "Il signor Müller, 78 anni, si trasferisce in una casa di cura dopo 40 anni.",
        solution: "Trasloco full-service con sgombero, pulizia, tutto. Deve solo guardare.",
      },
      {
        emoji: "💼",
        title: "La neolaureata",
        story: "Sarah ha il lavoro dei suoi sogni a Zurigo. Deve essere lì in 3 settimane.",
        solution: "Il calcolatore mostra: 890 CHF. Sconto studenti. Appuntamento confermato.",
      },
    ],
    cta: "Per chi traslochi?",
    stats: [
      { value: "450'000", label: "Traslochi all'anno in Svizzera" },
      { value: "5.2h", label: "Tempo medio di ricerca" },
      { value: "CHF 1'200", label: "Risparmio con il confronto" },
    ],
  },
  bg: {
    badge: "Човешката страна",
    title: "Преместването е повече от опаковане на кашони",
    subtitle: "Това е ново начало. Глава, която свършва. Друга, която започва.",
    stories: [
      {
        emoji: "👨‍👩‍👧",
        title: "Младото семейство",
        story: "Лаура и Марко очакват второто си дете. Двустайният апартамент става тесен.",
        solution: "С Umzugscheck: 3 оферти за 24 часа, Escrow защита, един клик до мечтания дом.",
      },
      {
        emoji: "👴",
        title: "Пенсионерът",
        story: "Господин Мюлер, 78 години, се премества след 40 години в дом за възрастни.",
        solution: "Пълно обслужване с почистване, изхвърляне, всичко. Той само гледа.",
      },
      {
        emoji: "💼",
        title: "Младият специалист",
        story: "Сара има работата на мечтите си в Цюрих. Трябва да е там след 3 седмици.",
        solution: "Калкулаторът показва: 890 CHF. Студентска отстъпка. Датата е потвърдена.",
      },
    ],
    cta: "За кого се местите?",
    stats: [
      { value: "450'000", label: "Премествания годишно в Швейцария" },
      { value: "5.2h", label: "Средно време за проучване" },
      { value: "CHF 1'200", label: "Спестявания чрез сравнение" },
    ],
  }
};

export const VisionHumanStorySection = ({ language = 'de' }: VisionHumanStorySectionProps) => {
  const t = TRANSLATIONS[language];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4 px-4 py-2">
            <Heart className="w-4 h-4 mr-2 text-[#8B0000]" />
            {t.badge}
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            {t.title}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto italic">
            {t.subtitle}
          </p>
        </motion.div>

        {/* Story Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {t.stories.map((story, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="group"
            >
              <div className="bg-card rounded-2xl p-6 md:p-8 shadow-lg border hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                {/* Emoji Avatar */}
                <div className="text-5xl mb-4">{story.emoji}</div>
                
                {/* Title */}
                <h3 className="text-xl font-bold mb-3">{story.title}</h3>
                
                {/* Story */}
                <p className="text-muted-foreground mb-4 flex-grow leading-relaxed">
                  {story.story}
                </p>
                
                {/* Solution */}
                <div className="bg-primary/5 rounded-lg p-4 border-l-4 border-primary">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <p className="text-sm font-medium">{story.solution}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Row */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-3 gap-4 md:gap-8 max-w-3xl mx-auto mb-12"
        >
          {t.stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl md:text-4xl font-bold text-primary mb-1">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button size="lg" className="min-h-[56px] px-8 text-lg group">
            {t.cta}
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default VisionHumanStorySection;
