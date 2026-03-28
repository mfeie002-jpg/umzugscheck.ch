import ServiceLandingTemplate from '@/components/ServiceLandingTemplate';

const Einlagerung = () => {
  return (
    <ServiceLandingTemplate
      service="Einlagerung & Möbellager"
      serviceSlug="einlagerung"
      description="Sichere und klimatisierte Lagerung für Ihre Möbel und Gegenstände. Flexible Laufzeiten und 24/7 Zugang auf Wunsch."
      longDescription="Ob Zwischenlagerung während eines Umbaus, langfristige Aufbewahrung oder Lagerung von Saisonartikeln – unsere modernen Lagerräume bieten optimale Bedingungen für Ihre Habseligkeiten. Alle Lager sind klimatisiert, trocken und videoüberwacht. Sie können zwischen verschiedenen Boxengrössen wählen und haben auf Wunsch 24/7 Zugang zu Ihren Sachen. Transport von und zum Lager übernehmen wir natürlich auch."
      benefits={[
        "Klimatisierte, trockene Lagerräume",
        "Videoüberwachung & Alarmanlage",
        "Flexible Laufzeiten ab 1 Monat",
        "Verschiedene Boxengrössen",
        "24/7 Zugang möglich",
        "Transport inklusive möglich"
      ]}
      process={[
        { step: 1, title: "Beratung", description: "Wir ermitteln Ihren Platzbedarf und die optimale Lösung." },
        { step: 2, title: "Transport", description: "Wir holen Ihre Gegenstände ab und bringen sie ins Lager." },
        { step: 3, title: "Lagerung", description: "Sichere Aufbewahrung unter optimalen Bedingungen." },
        { step: 4, title: "Rückgabe", description: "Lieferung an Ihre Wunschadresse, wenn Sie die Sachen brauchen." }
      ]}
      pricing={{ from: "CHF 89", unit: "pro m³/Monat" }}
      testimonial={{
        text: "Während unserer Weltreise waren alle Möbel bei Feierabend Umzüge eingelagert. Nach einem Jahr war alles in perfektem Zustand. Absolut empfehlenswert!",
        author: "Markus und Sandra W.",
        location: "Winterthur"
      }}
      faqs={[
        { question: "Wie gross sollte meine Lagerbox sein?", answer: "Als Faustregel: Für eine 3-Zimmer-Wohnung benötigen Sie ca. 15-20 m³. Wir beraten Sie gerne und können den Bedarf bei einer Besichtigung genau ermitteln." },
        { question: "Sind meine Sachen versichert?", answer: "Grundsätzlich ja, bis zu einem bestimmten Wert. Für besonders wertvolle Gegenstände empfehlen wir eine Zusatzversicherung, die wir vermitteln können." },
        { question: "Kann ich jederzeit an meine Sachen?", answer: "Ja, mit unserer 24/7-Option haben Sie rund um die Uhr Zugang zu Ihrer Lagerbox. Im Standardtarif ist der Zugang während der Geschäftszeiten möglich." },
        { question: "Wie lange kann ich einlagern?", answer: "Die Mindestlaufzeit beträgt 1 Monat. Danach können Sie flexibel Monat für Monat verlängern oder jederzeit mit 14 Tagen Frist kündigen." }
      ]}
      relatedServices={[
        { title: "Privatumzug", href: "/plan/private", description: "Kompletter Umzugsservice" },
        { title: "Verpackungsservice", href: "/plan/verpackungsservice", description: "Sichere Verpackung für die Lagerung" },
        { title: "Entrümpelung", href: "/plan/entsorgung", description: "Aussortieren vor der Einlagerung" },
        { title: "Möbelmontage", href: "/plan/montage", description: "Demontage vor der Einlagerung" }
      ]}
      keywords="möbel einlagern zürich, lagerraum mieten, self storage zürich, möbellager, zwischenlagerung umzug, lagerbox mieten, selfstorage schweiz"
      metaDescription="Sichere Möbel-Einlagerung von Feierabend Umzüge. ✓ Klimatisiert ✓ Videoüberwacht ✓ Flexible Laufzeiten ab CHF 89/m³. Jetzt Lagerplatz reservieren!"
    />
  );
};

export default Einlagerung;
