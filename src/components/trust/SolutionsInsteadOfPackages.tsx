import { CheckCircle, Truck, Home, Star } from "lucide-react";

const solutions = [
  {
    title: "Der Muskel-Einsatz",
    subtitle: "Für Sparfüchse, Studenten & Einzelzimmer",
    points: [
      "LKW + Profi-Zügelmänner",
      "Transportversicherung inklusive",
      "Sie packen & zerlegen selbst",
      "Sie stellen Kartons bereit"
    ],
    priceHint: "Günstiger Stunden- oder Pauschaltarif",
    icon: Truck,
    highlight: false,
    cta: "Dafür Offerte anfragen"
  },
  {
    title: "Der Klassiker",
    subtitle: "Unser Bestseller für Familien & Paare",
    points: [
      "Schutz aller Böden & Türrahmen",
      "Fachgerechte Demontage & Montage aller Möbel",
      "Sicherer Transport & Versicherung (bis CHF 5 Mio.)",
      "Platzierung der Möbel am Wunschort"
    ],
    footerNote: "Ihr Aufwand: Nur Kisten packen – den Rest machen wir.",
    priceHint: "Fairer Festpreis nach Besichtigung",
    icon: Home,
    highlight: true,
    cta: "Dafür Offerte anfragen"
  },
  {
    title: "Der totale Feierabend",
    subtitle: "Für Vielbeschäftigte, Senioren & grosse Häuser",
    points: [
      "Ein- & Auspackservice",
      "Lampenmontage & Endreinigung mit Abgabegarantie",
      "Entsorgung & Komplettservice",
      "All-Inclusive Angebot"
    ],
    priceHint: "All-Inclusive Angebot",
    icon: Star,
    highlight: false,
    cta: "Dafür Offerte anfragen"
  }
];

export default function SolutionsInsteadOfPackages() {
  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <div className="container mx-auto px-4 max-w-5xl">
        <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-2 text-primary">Wie viel möchten Sie selbst machen?</h2>
        <p className="text-center text-base md:text-lg text-muted-foreground mb-8">Vom reinen Transport bis zum kompletten "Füsse hoch"-Service. Wir passen uns Ihrem Budget an.</p>
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-stretch justify-center">
          {solutions.map((s, i) => (
            <div
              key={s.title}
              className={`flex-1 bg-white rounded-2xl shadow-lg p-6 md:p-8 flex flex-col items-center border transition-all ${s.highlight ? "border-primary/60 ring-2 ring-primary/10 scale-105 z-10" : "border-slate-200"}`}
            >
              <div className={`mb-3 ${s.highlight ? "text-primary" : "text-slate-400"}`}>
                <s.icon className="w-10 h-10" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-center mb-1">{s.title}</h3>
              <div className="text-sm text-muted-foreground text-center mb-3">{s.subtitle}</div>
              <ul className="flex flex-col gap-2 mb-3 w-full max-w-xs mx-auto">
                {s.points.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              {s.footerNote && (
                <div className="text-xs text-muted-foreground mb-3 text-center max-w-xs">
                  {s.footerNote}
                </div>
              )}
              <div className="text-xs font-semibold text-primary/90 mb-4 text-center">
                {s.priceHint}
              </div>
              <button className={`mt-auto px-4 py-2 rounded-lg font-semibold text-white bg-primary hover:bg-primary/90 transition-colors w-full max-w-xs ${s.highlight ? "shadow-md" : ""}`}>{s.cta}</button>
              {s.highlight && (
                <div className="mt-2 text-xs text-primary font-semibold uppercase tracking-wide">Meistgewählt</div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-10 bg-primary/5 border border-primary/20 rounded-xl py-5 px-4 md:px-8 text-center flex flex-col items-center">
          <span className="inline-flex items-center gap-2 text-primary font-bold text-base md:text-lg mb-1">
            <span role="img" aria-label="Garantie">🛡️</span> Unsere Feierabend-Garantie
          </span>
          <span className="text-sm md:text-base text-muted-foreground max-w-2xl">
            Egal welche Lösung Sie wählen: Sie erhalten vorab einen verbindlichen Festpreis. Keine versteckten Kosten, keine Nachverrechnung am Umzugstag.
          </span>
        </div>
      </div>
    </section>
  );
}
