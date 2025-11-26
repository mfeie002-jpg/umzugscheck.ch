import { FileText, Search, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: FileText,
    number: "1",
    title: "Formular ausfüllen",
    description: "Umzugsdetails in 2 Minuten eingeben"
  },
  {
    icon: Search,
    number: "2",
    title: "Firmen vergleichen",
    description: "Bis zu 5 kostenlose Offerten erhalten"
  },
  {
    icon: CheckCircle,
    number: "3",
    title: "Beste Offerte wählen",
    description: "Umzugsfirma direkt beauftragen"
  },
];

export const HowItWorksSimple = () => {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-secondary/20 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Wie funktioniert es?
          </h2>
          <p className="text-lg text-muted-foreground">
            In 3 einfachen Schritten zur besten Umzugsfirma
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12 max-w-5xl mx-auto relative">
          {/* Desktop Connector Lines */}
          <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-1 bg-gradient-to-r from-primary via-accent to-success rounded-full" />

          {steps.map((step, index) => (
            <div key={index} className="relative text-center">
              {/* Number Badge */}
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent text-white text-2xl font-bold mb-6 shadow-lg relative z-10">
                {step.number}
              </div>

              {/* Icon */}
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-card border-2 border-primary/20 shadow-md mb-6 hover:border-primary/40 transition-colors hover:scale-110 transform duration-300">
                <step.icon className="h-10 w-10 text-primary" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold mb-3 text-foreground">
                {step.title}
              </h3>
              <p className="text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
