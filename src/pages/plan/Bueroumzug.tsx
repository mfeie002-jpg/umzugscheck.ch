import ServiceLandingTemplate from '@/components/ServiceLandingTemplate';

const Bueroumzug = () => {
  return (
    <ServiceLandingTemplate
      service="Büroumzug & Firmenumzug"
      serviceSlug="bueroumzug"
      description="Professioneller Büroumzug mit minimaler Betriebsunterbrechung. IT-Koordination, Wochenendservice und effiziente Projektplanung."
      longDescription="Ein Büroumzug erfordert präzise Planung und schnelle Ausführung. Unser erfahrenes Team minimiert Ihre Ausfallzeiten durch sorgfältige Vorbereitung und effiziente Durchführung. Wir koordinieren den Umzug aller Abteilungen, kümmern uns um die sichere Verlagerung von IT-Equipment und Akten und sorgen dafür, dass Ihre Mitarbeiter am Montag produktiv arbeiten können. Von der Einzelperson im Home-Office bis zum Grosskonzern – wir haben für jede Unternehmensgrösse die passende Lösung."
      benefits={[
        "Minimale Betriebsunterbrechung",
        "IT-sichere Verpackung und Transport",
        "Wochenend- und Nachtservice",
        "Erfahrener Projektleiter",
        "Aktenvernichtung auf Wunsch",
        "Entsorgung alter Büromöbel"
      ]}
      process={[
        { step: 1, title: "Analyse & Planung", description: "Wir analysieren Ihre Anforderungen und erstellen einen detaillierten Projektplan." },
        { step: 2, title: "Koordination", description: "Abstimmung mit IT, Hausverwaltung und allen beteiligten Abteilungen." },
        { step: 3, title: "Durchführung", description: "Effizienter Umzug – auf Wunsch am Wochenende oder nachts." },
        { step: 4, title: "Einrichtung", description: "Aufbau der Arbeitsplätze und Funktionstest der IT-Systeme." }
      ]}
      pricing={{ from: "CHF 2'500", unit: "Kleinbüro" }}
      testimonial={{
        text: "Unser Büroumzug mit 50 Arbeitsplätzen wurde am Wochenende durchgeführt. Am Montag konnten alle Mitarbeiter normal arbeiten. Perfekte Organisation!",
        author: "Stefan M., Geschäftsführer",
        location: "Zürich"
      }}
      faqs={[
        { question: "Wie lange dauert ein Büroumzug?", answer: "Das hängt von der Grösse ab. Ein Kleinbüro (5-10 Arbeitsplätze) schaffen wir oft an einem Tag. Grössere Umzüge planen wir über ein Wochenende, um den Betrieb nicht zu stören." },
        { question: "Wer kümmert sich um die IT?", answer: "Wir koordinieren mit Ihrer IT-Abteilung oder externem Dienstleister. Computer werden sicher verpackt und können am neuen Standort sofort angeschlossen werden." },
        { question: "Was passiert mit alten Büromöbeln?", answer: "Wir bieten die komplette Entsorgung oder Vermittlung an soziale Einrichtungen an. Vertrauliche Dokumente vernichten wir auf Wunsch nach DSGVO-Standards." },
        { question: "Ist ein Umzug am Wochenende teurer?", answer: "Für Wochenend- und Nachtarbeit berechnen wir einen Zuschlag von 15-25%. Dies ist oft günstiger als der Produktivitätsverlust durch einen Umzug unter der Woche." }
      ]}
      relatedServices={[
        { title: "Möbelmontage", href: "/plan/montage", description: "Auf- und Abbau von Büromöbeln" },
        { title: "Entrümpelung", href: "/plan/entsorgung", description: "Entsorgung alter Büroausstattung" },
        { title: "Einlagerung", href: "/plan/einlagerung", description: "Zwischenlagerung von Inventar" },
        { title: "VIP Umzug", href: "/plan/vip-umzug", description: "Premium-Service für Führungskräfte" }
      ]}
      keywords="büroumzug zürich, firmenumzug, geschäftsumzug, office relocation, unternehmensumzug schweiz, büro zügelngel, firmenumzug wochenende"
      metaDescription="Professioneller Büroumzug von Feierabend Umzüge. ✓ Minimale Ausfallzeit ✓ IT-Koordination ✓ Wochenendservice. Jetzt kostenlose Offerte anfordern!"
    />
  );
};

export default Bueroumzug;
