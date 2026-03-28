import ServiceLandingTemplate from '@/components/ServiceLandingTemplate';

const Moebellift = () => {
  return (
    <ServiceLandingTemplate
      service="Möbellift & Aussenlift"
      serviceSlug="moebellift"
      description="Möbeltransport über Balkon oder Fenster mit professionellem Möbellift. Die schonende Alternative zum Treppenhaus – auch für enge Treppenhäuser."
      longDescription="Nicht alle Möbel passen durchs Treppenhaus. Mit unserem modernen Möbellift transportieren wir auch sperrige Gegenstände wie Klaviere, große Sofas, Schränke oder Boxspringbetten sicher über Balkon oder Fenster. Der Möbellift reicht bis zum 8. Stock und ist die schonende Alternative für Ihre wertvollen Möbel. Besonders in Altbauten mit engen Treppenhäusern ist der Aussenlift oft die einzige Lösung."
      benefits={[
        "Reichweite bis 8. Stockwerk",
        "Schonend für Möbel und Gebäude",
        "Ideal für enge Treppenhäuser",
        "Schneller als Treppenhaus-Transport",
        "Für Klaviere und schwere Gegenstände",
        "Erfahrene Liftbediener"
      ]}
      process={[
        { step: 1, title: "Besichtigung", description: "Wir prüfen die Zugänglichkeit und den optimalen Aufstellort für den Lift." },
        { step: 2, title: "Aufstellung", description: "Der Möbellift wird sicher vor Ihrem Gebäude positioniert." },
        { step: 3, title: "Transport", description: "Ihre Möbel werden schonend über Balkon oder Fenster transportiert." },
        { step: 4, title: "Abbau", description: "Der Lift wird abgebaut und wir hinterlassen alles sauber." }
      ]}
      pricing={{ from: "CHF 300", unit: "pro Einsatz" }}
      testimonial={{
        text: "Unser Flügel passte nie und nimmer durch das alte Treppenhaus. Mit dem Möbellift war er in 20 Minuten sicher in der neuen Wohnung. Fantastisch!",
        author: "Familie Huber",
        location: "Bern"
      }}
      faqs={[
        { question: "Bis zu welcher Höhe reicht der Möbellift?", answer: "Unser Möbellift erreicht Balkone und Fenster bis zum 8. Stockwerk (ca. 25 Meter Höhe)." },
        { question: "Was kann mit dem Möbellift transportiert werden?", answer: "Wir transportieren alle sperrigen Gegenstände: Klaviere, Flügel, große Sofas, Schränke, Boxspringbetten, Fitnessgeräte, Aquarien und mehr." },
        { question: "Braucht es eine Genehmigung?", answer: "In den meisten Fällen reicht eine kurze Absperrung des Gehwegs. Bei längeren Einsätzen oder Sperrungen organisieren wir die notwendigen Genehmigungen." },
        { question: "Wie lange dauert ein Möbellift-Einsatz?", answer: "Aufstellung und Abbau dauern ca. 30-45 Minuten. Der eigentliche Transport ist sehr schnell – oft schneller als über das Treppenhaus." }
      ]}
      relatedServices={[
        { title: "Klaviertransport", href: "/plan/klaviertransport", description: "Spezialtransport für Klaviere und Flügel" },
        { title: "VIP Umzug", href: "/plan/vip-umzug", description: "Premium White Glove Service" },
        { title: "Möbelmontage", href: "/plan/montage", description: "Auf- und Abbau Ihrer Möbel" },
        { title: "Verpackungsservice", href: "/plan/verpackungsservice", description: "Professionelle Verpackung" }
      ]}
      keywords="möbellift zürich, aussenlift umzug, möbel über balkon, möbeltransport lift, piano lift, klaviertransport lift, möbellift mieten"
      metaDescription="Professioneller Möbellift bis 8. Stock von Feierabend Umzüge. ✓ Schonender Transport ✓ Für Klaviere & sperrige Möbel ✓ Schnell & sicher. Jetzt anfragen!"
    />
  );
};

export default Moebellift;
