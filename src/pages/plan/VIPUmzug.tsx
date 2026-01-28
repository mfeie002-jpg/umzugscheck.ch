import ServiceLandingTemplate from '@/components/ServiceLandingTemplate';

const VIPUmzug = () => {
  return (
    <ServiceLandingTemplate
      service="VIP Umzug & White Glove Service"
      serviceSlug="vip-umzug"
      description="Exklusiver Premium-Umzugsservice für höchste Ansprüche. Diskretion, Perfektion und persönliche Betreuung durch Ihren eigenen Projektleiter."
      longDescription="Unser VIP Umzugsservice richtet sich an Kunden, die kompromisslose Qualität und absolute Diskretion erwarten. Von der ersten Kontaktaufnahme bis zum letzten eingeräumten Buch – Ihr persönlicher Projektleiter koordiniert jeden Schritt. Wir transportieren wertvolle Kunstwerke, Antiquitäten und Designer-Möbel mit höchster Sorgfalt. Alle Mitarbeiter sind sicherheitsüberprüft und zur Verschwiegenheit verpflichtet. Auf Wunsch arbeiten wir ausserhalb der regulären Geschäftszeiten oder am Wochenende."
      benefits={[
        "Persönlicher Projektleiter",
        "Sicherheitsüberprüftes Personal",
        "Absolute Diskretion garantiert",
        "White Glove Handling für Kunstwerke",
        "Flexible Termine inkl. Wochenende",
        "Premium-Versicherung bis CHF 500'000"
      ]}
      process={[
        { step: 1, title: "Exklusives Beratungsgespräch", description: "Ihr Projektleiter bespricht alle Details persönlich mit Ihnen." },
        { step: 2, title: "Massgeschneiderte Planung", description: "Detaillierter Ablaufplan mit Zeitfenstern und Spezialanforderungen." },
        { step: 3, title: "Premium-Ausführung", description: "Ausgewählte Fachkräfte führen den Umzug mit höchster Präzision durch." },
        { step: 4, title: "Komplette Einrichtung", description: "Ihr neues Zuhause ist bezugsfertig – bis hin zur Bildaufhängung." }
      ]}
      pricing={{ from: "CHF 4'500", unit: "Komplettpaket" }}
      testimonial={{
        text: "Als CEO mit wenig Zeit brauchte ich einen Umzugspartner, der alles übernimmt. Feierabend Umzüge hat unseren Umzug perfekt organisiert – diskret, professionell und absolut stressfrei.",
        author: "Dr. Thomas H.",
        location: "Zürichberg"
      }}
      faqs={[
        { question: "Was bedeutet White Glove Service?", answer: "White Glove bedeutet höchste Sorgfalt bei jedem Handgriff. Wertvolle Gegenstände werden mit Stoffhandschuhen angefasst, individuell verpackt und transportiert. Jedes Stück erhält besondere Aufmerksamkeit." },
        { question: "Wie ist die Diskretion gewährleistet?", answer: "Alle Mitarbeiter unterschreiben Verschwiegenheitserklärungen. Unsere Fahrzeuge sind neutral gehalten. Auf Wunsch erfolgt der Umzug ausserhalb der üblichen Zeiten." },
        { question: "Können Sie auch Kunstwerke transportieren?", answer: "Ja, wir transportieren Kunstwerke, Skulpturen und Antiquitäten. Bei besonders wertvollen Stücken arbeiten wir mit spezialisierten Kunsttransporteuren zusammen." },
        { question: "Wie hoch ist die Versicherungssumme?", answer: "Im VIP-Paket sind Gegenstände bis CHF 500'000 versichert. Für höhere Werte arrangieren wir individuelle Versicherungslösungen." }
      ]}
      relatedServices={[
        { title: "Klaviertransport", href: "/plan/klaviertransport", description: "Spezialtransport für Instrumente" },
        { title: "Möbellift", href: "/plan/moebellift", description: "Transport über Balkon" },
        { title: "Verpackungsservice", href: "/plan/verpackungsservice", description: "Premium-Verpackung" },
        { title: "Einlagerung", href: "/plan/einlagerung", description: "Klimatisierte Lagerung" }
      ]}
      keywords="vip umzug zürich, premium umzug, white glove umzug, luxus umzug, diskreter umzug, executive relocation, high-end umzug schweiz"
      metaDescription="VIP Umzug & White Glove Service von Feierabend Umzüge. ✓ Persönlicher Projektleiter ✓ Absolute Diskretion ✓ Premium-Versicherung. Exklusiver Service für höchste Ansprüche."
    />
  );
};

export default VIPUmzug;
