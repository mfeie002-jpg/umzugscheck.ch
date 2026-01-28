import ServiceLandingTemplate from '@/components/ServiceLandingTemplate';

const Seniorenumzug = () => {
  return (
    <ServiceLandingTemplate
      service="Seniorenumzug"
      serviceSlug="seniorenumzug"
      description="Einfühlsamer Umzugsservice für Senioren. Mit Geduld, Verständnis und umfassender Betreuung begleiten wir Sie in Ihr neues Zuhause."
      longDescription="Ein Umzug im fortgeschrittenen Alter stellt besondere Anforderungen. Unser Seniorenumzug-Team ist speziell geschult, um älteren Menschen einen stressfreien Wohnungswechsel zu ermöglichen. Wir nehmen uns Zeit, hören zu und kümmern uns um alles – vom Aussortieren und Verpacken bis zur kompletten Einrichtung des neuen Zuhauses. Dabei respektieren wir Ihre Wünsche und gehen behutsam mit liebgewonnenen Erinnerungsstücken um. Auf Wunsch koordinieren wir auch Behördengänge, Adressänderungen und die Wohnungsübergabe."
      benefits={[
        "Einfühlsames, geduldiges Team",
        "Komplettservice von A bis Z",
        "Aussortieren und Entrümpeln inklusive",
        "Einrichten am neuen Standort",
        "Koordination mit Pflegediensten",
        "Behördengänge auf Wunsch"
      ]}
      process={[
        { step: 1, title: "Persönliches Gespräch", description: "Wir nehmen uns Zeit für Ihre Wünsche und Bedürfnisse." },
        { step: 2, title: "Bestandsaufnahme", description: "Gemeinsam entscheiden wir, was mitkommt und was entsorgt wird." },
        { step: 3, title: "Verpackung & Transport", description: "Wir packen sorgfältig ein und transportieren alles sicher." },
        { step: 4, title: "Einrichtung", description: "Wir richten Ihr neues Zuhause nach Ihren Wünschen ein." }
      ]}
      pricing={{ from: "CHF 1'800", unit: "Komplettpaket" }}
      testimonial={{
        text: "Der Umzug meiner Mutter ins Altersheim war emotional sehr schwer. Das Team von Feierabend Umzüge hat sich so liebevoll um alles gekümmert. Mama konnte sich entspannt zurücklehnen.",
        author: "Ursula T.",
        location: "Zürich"
      }}
      faqs={[
        { question: "Was unterscheidet den Seniorenumzug vom normalen Umzug?", answer: "Beim Seniorenumzug bieten wir einen umfassenderen Service: Wir helfen beim Aussortieren, koordinieren mit Pflegediensten, kümmern uns um Behördengänge und richten das neue Zuhause komplett ein. Unser Team ist besonders geduldig und einfühlsam." },
        { question: "Können Sie auch in Altersheime umziehen?", answer: "Ja, wir haben viel Erfahrung mit Umzügen in Alters- und Pflegeheime. Wir kennen die besonderen Anforderungen und stimmen uns eng mit den Einrichtungen ab." },
        { question: "Was passiert mit Möbeln, die nicht mitkommen?", answer: "Wir bieten einen kompletten Entrümpelungsservice an. Gut erhaltene Möbel vermitteln wir an soziale Einrichtungen, der Rest wird umweltgerecht entsorgt." },
        { question: "Können Angehörige beim Umzug dabei sein?", answer: "Selbstverständlich! Wir begrüssen es, wenn Angehörige dabei sind. Falls Sie verhindert sind, halten wir Sie telefonisch auf dem Laufenden." }
      ]}
      relatedServices={[
        { title: "Entrümpelung", href: "/plan/entsorgung", description: "Räumung und umweltgerechte Entsorgung" },
        { title: "Verpackungsservice", href: "/plan/verpackungsservice", description: "Professionelles Ein- und Auspacken" },
        { title: "Einlagerung", href: "/plan/einlagerung", description: "Sichere Zwischenlagerung" },
        { title: "Reinigung", href: "/plan/reinigung", description: "Endreinigung der alten Wohnung" }
      ]}
      keywords="seniorenumzug zürich, umzug senioren, altersheim umzug, betreuter umzug, umzug ältere menschen, seniorenumzug schweiz, umzug pflegeheim"
      metaDescription="Einfühlsamer Seniorenumzug von Feierabend Umzüge. ✓ Komplettservice ✓ Geduldiges Team ✓ Einrichten inklusive. Wir begleiten Sie liebevoll in Ihr neues Zuhause."
    />
  );
};

export default Seniorenumzug;
