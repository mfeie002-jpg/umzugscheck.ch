import CityLandingTemplate from '@/components/CityLandingTemplate';
import heroImage from '@/assets/city-generic-navy-alpine.jpg';

const Dietikon = () => {
  return (
    <CityLandingTemplate
      city="Dietikon"
      heroImage={heroImage}
      canton="Zürich"
      region="Limmattal"
      description="Professionelle Umzüge in Dietikon und dem Limmattal. Als grösste Stadt im Limmattal bieten wir schnelle und zuverlässige Umzugsdienstleistungen."
      highlights={['Umzüge im gesamten Limmattal', 'Direkte S-Bahn-Anbindung nach Zürich', 'Erfahrung mit Neubauwohnungen', 'Günstige Tarife für Kurzstrecken']}
      testimonial={{ text: "Schneller Umzug von Zürich nach Dietikon. Alles hat reibungslos geklappt!", author: "Michael B.", location: "Umzug ins Limmattal" }}
      stats={{ moves: '320', rating: '4.8', years: '7' }}
      nearbyAreas={['Zürich', 'Baden', 'Schlieren', 'Spreitenbach']}
    />
  );
};

export default Dietikon;