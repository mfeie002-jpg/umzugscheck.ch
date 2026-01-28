import ServiceLandingTemplate from '@/components/ServiceLandingTemplate';

const Verpackungsservice = () => {
  return (
    <ServiceLandingTemplate
      service="Professioneller Verpackungsservice"
      serviceSlug="verpackungsservice"
      description="Lassen Sie Ihre Habseligkeiten von unseren erfahrenen Experten sicher und effizient verpacken. Wir verwenden hochwertige Materialien für maximalen Schutz."
      longDescription="Unser professioneller Verpackungsservice nimmt Ihnen die zeitaufwändigste Arbeit beim Umzug ab. Unsere geschulten Mitarbeiter verpacken Ihr gesamtes Hab und Gut mit grösster Sorgfalt. Wir verwenden ausschliesslich hochwertige Verpackungsmaterialien: stabile Umzugskartons, Luftpolsterfolie, Seidenpapier für empfindliche Gegenstände und spezielle Kleiderboxen für Ihre Garderobe. Besonders empfindliche Stücke wie Antiquitäten, Kunstwerke oder Elektronikartikel erhalten eine maßgeschneiderte Verpackung."
      benefits={[
        "Professionelle Verpackung durch geschultes Personal",
        "Hochwertige Verpackungsmaterialien inklusive",
        "Spezialverpackung für Kunst und Antiquitäten",
        "Zeit- und Stressersparnis für Sie",
        "Beschriftung und Inventarlisten",
        "Vollständiger Versicherungsschutz"
      ]}
      process={[
        { step: 1, title: "Bestandsaufnahme", description: "Wir besichtigen Ihr Zuhause und erstellen eine detaillierte Übersicht aller zu verpackenden Gegenstände." },
        { step: 2, title: "Materiallieferung", description: "Alle benötigten Verpackungsmaterialien werden rechtzeitig zu Ihnen geliefert." },
        { step: 3, title: "Verpackung", description: "Unser Team verpackt systematisch alle Gegenstände mit größter Sorgfalt." },
        { step: 4, title: "Dokumentation", description: "Jeder Karton wird beschriftet und in einer Inventarliste dokumentiert." }
      ]}
      pricing={{ from: "CHF 45", unit: "pro Stunde" }}
      testimonial={{
        text: "Der Verpackungsservice war jeden Franken wert. Alles war perfekt verpackt und beschriftet. Das Auspacken ging dadurch super schnell!",
        author: "Sandra M.",
        location: "Zürich"
      }}
      faqs={[
        { question: "Was ist im Verpackungsservice enthalten?", answer: "Unser Verpackungsservice beinhaltet alle Verpackungsmaterialien (Kartons, Polstermaterial, Klebeband), die professionelle Verpackung durch unser Team sowie die Beschriftung aller Kartons." },
        { question: "Wie lange dauert das Verpacken einer Wohnung?", answer: "Eine 3-Zimmer-Wohnung kann typischerweise in 4-6 Stunden vollständig verpackt werden. Bei größeren Haushalten oder vielen empfindlichen Gegenständen kann es länger dauern." },
        { question: "Verpacken Sie auch empfindliche Gegenstände?", answer: "Ja, wir sind spezialisiert auf das Verpacken von Kunstwerken, Antiquitäten, Glaswaren, Elektronik und anderen empfindlichen Gegenständen mit speziellem Schutzmaterial." },
        { question: "Kann ich nur teilweise verpacken lassen?", answer: "Selbstverständlich! Sie können uns nur für bestimmte Räume oder Gegenstände beauftragen. Besonders beliebt ist die Verpackung von Küche und Gläsern." }
      ]}
      relatedServices={[
        { title: "Privatumzug", href: "/plan/private", description: "Kompletter Umzugsservice für Ihr Zuhause" },
        { title: "Möbelmontage", href: "/plan/montage", description: "Auf- und Abbau Ihrer Möbel" },
        { title: "Einlagerung", href: "/plan/einlagerung", description: "Sichere Lagerung Ihrer Möbel" },
        { title: "Seniorenumzug", href: "/plan/seniorenumzug", description: "Einfühlsamer Service für Senioren" }
      ]}
      keywords="verpackungsservice zürich, umzug verpackung, möbel verpacken, professionell verpacken, umzugskartons, verpackungsmaterial, einpackservice"
      metaDescription="Professioneller Verpackungsservice von Feierabend Umzüge. ✓ Hochwertige Materialien ✓ Geschultes Personal ✓ Spezialverpackung für Kunst & Antiquitäten. Jetzt anfragen!"
    />
  );
};

export default Verpackungsservice;
