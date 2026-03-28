import ServiceLandingTemplate from '@/components/ServiceLandingTemplate';

const Moebelmontage = () => {
  return (
    <ServiceLandingTemplate
      service="Möbelmontage & Demontage"
      serviceSlug="montage"
      description="Professioneller Auf- und Abbau Ihrer Möbel. Unsere erfahrenen Monteure arbeiten präzise und schonen Ihre wertvollen Einrichtungsgegenstände."
      longDescription="Ob IKEA-Möbel, Designer-Stücke oder antike Möbel – unsere Monteure haben jahrelange Erfahrung im fachgerechten Auf- und Abbau aller Möbeltypen. Wir demontieren Ihre Möbel am alten Standort und bauen sie in Ihrer neuen Wohnung wieder präzise auf. Dabei achten wir auf jedes Detail und stellen sicher, dass alle Teile sicher transportiert werden. Auch komplexe Möbelsysteme wie begehbare Schränke oder Einbauküchen sind für uns kein Problem."
      benefits={[
        "Erfahrene und geschulte Möbelmonteure",
        "Professionelles Werkzeug immer dabei",
        "Schonender Umgang mit allen Möbeltypen",
        "Auch für komplexe Einbauschränke",
        "Sichere Verpackung aller Einzelteile",
        "Beschriftungssystem für schnellen Wiederaufbau"
      ]}
      process={[
        { step: 1, title: "Bestandsaufnahme", description: "Wir prüfen alle Möbelstücke und erstellen einen Montageplan." },
        { step: 2, title: "Demontage", description: "Fachgerechter Abbau mit Beschriftung aller Teile und Schrauben." },
        { step: 3, title: "Transport", description: "Sichere Verpackung und Transport der Einzelteile." },
        { step: 4, title: "Aufbau", description: "Präziser Wiederaufbau an Ihrem neuen Standort." }
      ]}
      pricing={{ from: "CHF 50", unit: "pro Stunde" }}
      testimonial={{
        text: "Die Monteure haben unseren kompletten begehbaren Kleiderschrank abgebaut und perfekt wieder aufgebaut. Alle Schrauben waren sortiert und beschriftet. Top Service!",
        author: "Michael und Lisa K.",
        location: "Winterthur"
      }}
      faqs={[
        { question: "Welche Möbel können Sie montieren?", answer: "Wir montieren alle Arten von Möbeln: IKEA, Designer-Möbel, Einbauschränke, Küchen, Betten, Regalsysteme und mehr. Auch antike Möbel behandeln wir mit besonderer Sorgfalt." },
        { question: "Was kostet die Möbelmontage?", answer: "Die Möbelmontage wird nach Zeitaufwand berechnet, ab CHF 50 pro Stunde. Gerne erstellen wir Ihnen nach einer Besichtigung ein Pauschalangebot." },
        { question: "Bringen Sie eigenes Werkzeug mit?", answer: "Ja, unsere Monteure sind vollständig ausgerüstet mit professionellem Werkzeug für alle Möbeltypen und -systeme." },
        { question: "Was passiert bei fehlenden Schrauben?", answer: "Wir führen ein Sortiment an Ersatzteilen mit. Sollten spezielle Teile fehlen, organisieren wir Ersatz beim Hersteller." }
      ]}
      relatedServices={[
        { title: "Privatumzug", href: "/plan/private", description: "Kompletter Umzugsservice für Ihr Zuhause" },
        { title: "Verpackungsservice", href: "/plan/verpackungsservice", description: "Professionelle Verpackung" },
        { title: "Büroumzug", href: "/plan/bueroumzug", description: "Umzug für Unternehmen" },
        { title: "Einlagerung", href: "/plan/einlagerung", description: "Sichere Zwischenlagerung" }
      ]}
      keywords="möbelmontage zürich, möbel aufbauen, möbel abbauen, ikea montage, schrank montage, küchenmontage, möbelaufbau service"
      metaDescription="Professionelle Möbelmontage & Demontage von Feierabend Umzüge. ✓ Erfahrene Monteure ✓ Alle Möbeltypen ✓ Schonender Umgang. Jetzt Offerte anfordern!"
    />
  );
};

export default Moebelmontage;
