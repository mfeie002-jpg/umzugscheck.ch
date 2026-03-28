import ServiceLandingTemplate from '@/components/ServiceLandingTemplate';

const Entsorgung = () => {
  return (
    <ServiceLandingTemplate
      service="Entrümpelung & Entsorgung"
      serviceSlug="entsorgung"
      description="Professionelle Entrümpelung und umweltgerechte Entsorgung. Wir räumen Keller, Dachböden, Wohnungen und Häuser – schnell, sauber und nachhaltig."
      longDescription="Ob Haushaltsauflösung, Kellerentrümpelung oder Räumung nach einem Todesfall – wir übernehmen die komplette Entrümpelung mit Fingerspitzengefühl und Professionalität. Brauchbare Gegenstände werden auf Wunsch gespendet, wiederverwertbare Materialien recycelt und der Rest fachgerecht entsorgt. Wir arbeiten diskret und respektvoll, besonders bei sensiblen Situationen. Nach der Entrümpelung hinterlassen wir die Räumlichkeiten besenrein."
      benefits={[
        "Komplette Räumung aus einer Hand",
        "Umweltgerechte Entsorgung und Recycling",
        "Spende brauchbarer Gegenstände",
        "Besenreine Übergabe",
        "Diskrete Abwicklung",
        "Festpreisgarantie nach Besichtigung"
      ]}
      process={[
        { step: 1, title: "Besichtigung", description: "Wir besichtigen die Räumlichkeiten und erstellen ein verbindliches Angebot." },
        { step: 2, title: "Sortierung", description: "Wir sortieren vor Ort: Was wird gespendet, recycelt oder entsorgt?" },
        { step: 3, title: "Räumung", description: "Schnelle und gründliche Räumung aller Gegenstände." },
        { step: 4, title: "Reinigung", description: "Besenreine Übergabe der leeren Räumlichkeiten." }
      ]}
      pricing={{ from: "CHF 500", unit: "pauschal" }}
      testimonial={{
        text: "Nach dem Tod meiner Mutter haben sie die komplette Wohnungsauflösung übernommen. Sehr einfühlsam und professionell. Vieles konnte gespendet werden.",
        author: "Thomas B.",
        location: "Basel"
      }}
      faqs={[
        { question: "Wie schnell können Sie räumen?", answer: "Je nach Umfang können wir oft innerhalb von 2-5 Werktagen mit der Räumung beginnen. Notfall-Räumungen sind auch kurzfristiger möglich." },
        { question: "Was passiert mit brauchbaren Gegenständen?", answer: "Gut erhaltene Möbel und Gegenstände vermitteln wir an Sozialkaufhäuser oder gemeinnützige Organisationen. Wertvolle Stücke können auch verkauft werden." },
        { question: "Entrümpeln Sie auch Keller und Estriche?", answer: "Ja, wir räumen alle Räumlichkeiten: Keller, Estriche, Garagen, Gärten, Büros und komplette Liegenschaften." },
        { question: "Wie wird der Preis berechnet?", answer: "Nach einer kostenlosen Besichtigung erhalten Sie einen verbindlichen Festpreis. Der Preis hängt von Menge, Zugänglichkeit und Entsorgungsaufwand ab." }
      ]}
      relatedServices={[
        { title: "Seniorenumzug", href: "/plan/seniorenumzug", description: "Einfühlsamer Umzugsservice für Senioren" },
        { title: "Einlagerung", href: "/plan/einlagerung", description: "Sichere Lagerung Ihrer Möbel" },
        { title: "Reinigungsservice", href: "/plan/reinigung", description: "Professionelle Endreinigung" },
        { title: "Verpackungsservice", href: "/plan/verpackungsservice", description: "Professionelle Verpackung" }
      ]}
      keywords="entrümpelung zürich, wohnungsauflösung, haushaltsauflösung, kellerentrümpelung, entsorgung möbel, räumung, sperrmüll entsorgung"
      metaDescription="Professionelle Entrümpelung & Entsorgung von Feierabend Umzüge. ✓ Umweltgerechte Entsorgung ✓ Spenden ✓ Besenreine Übergabe. Jetzt kostenlose Besichtigung!"
    />
  );
};

export default Entsorgung;
