import ServiceLandingTemplate from '@/components/ServiceLandingTemplate';

const Reinigung = () => {
  return (
    <ServiceLandingTemplate
      service="Umzugsreinigung & Endreinigung"
      serviceSlug="reinigung"
      description="Professionelle Umzugsreinigung mit Abnahmegarantie. Wir reinigen Ihre alte Wohnung, damit Sie die Kaution zurückbekommen."
      longDescription="Die Endreinigung bei Auszug ist oft zeitaufwändig und stressig. Unser Reinigungsteam übernimmt die komplette Umzugsreinigung nach Schweizer Standard. Wir reinigen gründlich alle Räume, Küche, Bad, Fenster und Böden. Bei uns erhalten Sie eine Abnahmegarantie: Sollte die Verwaltung Mängel beanstanden, kommen wir kostenlos zurück und bessern nach. So können Sie sich auf Ihr neues Zuhause konzentrieren."
      benefits={[
        "Abnahmegarantie inklusive",
        "Reinigung nach Schweizer Standard",
        "Erfahrenes Reinigungsteam",
        "Alle Reinigungsmittel inklusive",
        "Fensterreinigung inbegriffen",
        "Flexible Terminvereinbarung"
      ]}
      process={[
        { step: 1, title: "Terminvereinbarung", description: "Wir vereinbaren einen Reinigungstermin passend zu Ihrem Auszug." },
        { step: 2, title: "Gründliche Reinigung", description: "Unser Team reinigt alle Räume, Küche, Bad, Fenster und Böden." },
        { step: 3, title: "Qualitätskontrolle", description: "Wir prüfen jeden Raum nach unserer Checkliste." },
        { step: 4, title: "Übergabe", description: "Die Wohnung ist bereit für die Abnahme durch die Verwaltung." }
      ]}
      pricing={{ from: "CHF 350", unit: "3-Zi-Whg" }}
      testimonial={{
        text: "Die Reinigung war tadellos. Die Wohnungsabnahme verlief problemlos und wir haben die volle Kaution zurückbekommen. Kann ich nur empfehlen!",
        author: "Christina S.",
        location: "Luzern"
      }}
      faqs={[
        { question: "Was ist in der Umzugsreinigung enthalten?", answer: "Unsere Endreinigung umfasst: Alle Räume, Küche inkl. Backofen und Kühlschrank, Badezimmer, alle Fenster, Böden, Sockelleisten, Türen und Steckdosen. Optional auch Balkon und Keller." },
        { question: "Was bedeutet Abnahmegarantie?", answer: "Sollte die Hausverwaltung bei der Abnahme Reinigungsmängel feststellen, kommen wir kostenlos zurück und bessern nach. So bekommen Sie Ihre Kaution zurück." },
        { question: "Wie lange dauert die Reinigung?", answer: "Eine 3-Zimmer-Wohnung dauert typischerweise 4-6 Stunden. Größere Wohnungen oder stark verschmutzte Räume entsprechend länger." },
        { question: "Muss die Wohnung leer sein?", answer: "Ja, für eine gründliche Endreinigung sollte die Wohnung komplett geräumt sein. Wir reinigen auch Einbauschränke und alle versteckten Ecken." }
      ]}
      relatedServices={[
        { title: "Privatumzug", href: "/plan/private", description: "Kompletter Umzugsservice" },
        { title: "Entrümpelung", href: "/plan/entsorgung", description: "Professionelle Räumung und Entsorgung" },
        { title: "Seniorenumzug", href: "/plan/seniorenumzug", description: "Einfühlsamer Umzug für Senioren" },
        { title: "Büroumzug", href: "/plan/bueroumzug", description: "Endreinigung für Geschäftsräume" }
      ]}
      keywords="umzugsreinigung zürich, endreinigung wohnung, auszugsreinigung, wohnungsreinigung, abnahmegarantie, reinigung bei auszug, putzfirma umzug"
      metaDescription="Professionelle Umzugsreinigung mit Abnahmegarantie von Feierabend Umzüge. ✓ Schweizer Standard ✓ Kaution zurück ✓ Flexible Termine. Jetzt anfragen!"
    />
  );
};

export default Reinigung;
