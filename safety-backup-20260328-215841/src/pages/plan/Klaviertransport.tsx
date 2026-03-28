import ServiceLandingTemplate from '@/components/ServiceLandingTemplate';

const Klaviertransport = () => {
  return (
    <ServiceLandingTemplate
      service="Klaviertransport & Flügeltransport"
      serviceSlug="klaviertransport"
      description="Spezialisierter Transport für Klaviere und Flügel. Mit Fachwissen, Spezialausrüstung und größter Sorgfalt transportieren wir Ihr wertvolles Instrument."
      longDescription="Ein Klavier oder Flügel ist nicht nur ein Möbelstück – es ist ein empfindliches, wertvolles Instrument. Unser Klaviertransport-Team ist speziell geschult und verfügt über die notwendige Spezialausrüstung: Klaviergurte, Polstermaterial, Klavierrollen und bei Bedarf unseren Möbellift. Wir transportieren Klaviere und Flügel aller Marken und Größen, vom Übungsklavier bis zum Konzertflügel."
      benefits={[
        "Speziell geschultes Klaviertransport-Team",
        "Professionelle Klaviergurte und Polsterung",
        "Klimatisierter Transport auf Wunsch",
        "Möbellift für schwierige Zugänge",
        "Versicherung bis CHF 100'000",
        "Optional: Stimmservice nach Transport"
      ]}
      process={[
        { step: 1, title: "Besichtigung", description: "Wir begutachten Ihr Instrument und planen den optimalen Transportweg." },
        { step: 2, title: "Verpackung", description: "Das Klavier wird mit Spezialdecken und Gurten gesichert." },
        { step: 3, title: "Transport", description: "Schonender Transport mit unserem klimatisierten Spezialfahrzeug." },
        { step: 4, title: "Aufstellung", description: "Platzierung an Ihrem Wunschort und Entfernung der Schutzverpackung." }
      ]}
      pricing={{ from: "CHF 450", unit: "Klavier" }}
      testimonial={{
        text: "Mein Bechstein-Flügel wurde mit größter Sorgfalt behandelt. Die Herren wussten genau, was sie taten. Nach dem Transport war nicht einmal eine Nachstimmung nötig!",
        author: "Prof. Werner M.",
        location: "Zürich"
      }}
      faqs={[
        { question: "Transportieren Sie auch Konzertflügel?", answer: "Ja, wir transportieren Flügel aller Größen – vom Stutzflügel bis zum 2.80m Konzertflügel. Unser Team hat Erfahrung mit allen namhaften Marken." },
        { question: "Muss das Klavier nach dem Transport gestimmt werden?", answer: "Bei sorgfältigem Transport und gleichen klimatischen Bedingungen ist oft keine Stimmung nötig. Wir empfehlen jedoch, das Instrument nach 2-3 Wochen Akklimatisierung stimmen zu lassen." },
        { question: "Wie ist mein Klavier versichert?", answer: "Klaviere und Flügel sind während des Transports bis CHF 100'000 versichert. Für besonders wertvolle Instrumente erstellen wir individuelle Versicherungslösungen." },
        { question: "Was kostet ein Flügeltransport?", answer: "Flügeltransporte starten ab CHF 650. Der genaue Preis hängt von Größe, Zugänglichkeit und Distanz ab. Gerne erstellen wir Ihnen ein individuelles Angebot." }
      ]}
      relatedServices={[
        { title: "Möbellift", href: "/plan/moebellift", description: "Transport über Balkon für schwierige Zugänge" },
        { title: "VIP Umzug", href: "/plan/vip-umzug", description: "Premium White Glove Service" },
        { title: "Einlagerung", href: "/plan/einlagerung", description: "Klimatisierte Lagerung für Instrumente" },
        { title: "Verpackungsservice", href: "/plan/verpackungsservice", description: "Professionelle Verpackung" }
      ]}
      keywords="klaviertransport zürich, flügeltransport, piano transport, klavier umzug, flügel transportieren, klavierspedition, instrument transport"
      metaDescription="Spezialisierter Klaviertransport von Feierabend Umzüge. ✓ Geschultes Team ✓ Spezialausrüstung ✓ Versichert bis CHF 100'000. Jetzt Offerte anfordern!"
    />
  );
};

export default Klaviertransport;
