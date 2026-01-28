import CityLandingTemplate from '@/components/CityLandingTemplate';
import cityImage from '@/assets/city-winterthur-navy-alpine.jpg';

const WinterthurPage = () => {
  return (
    <CityLandingTemplate
      city="Winterthur"
      canton="Zürich"
      region="Weinland"
      heroImage={cityImage}
      description="Winterthur – die sechstgrösste Stadt der Schweiz mit lebendiger Kulturszene und hoher Lebensqualität. Wir kennen jeden Stadtteil und bringen Sie sicher ins neue Zuhause."
      highlights={[
        'Schnelle Verbindung zu Zürich',
        'Altbau-Expertise',
        'Sulzer-Areal & Lofts',
        'ZHAW Studenten-Rabatte'
      ]}
      testimonial={{
        text: "Von Zürich nach Winterthur-Töss in nur einem halben Tag! Sehr effizient und professionell.",
        author: "Lisa Brunner",
        location: "Winterthur - Töss"
      }}
      stats={{
        moves: '678',
        rating: '4.7',
        years: '40+'
      }}
      nearbyAreas={['Zürich', 'St. Gallen', 'Frauenfeld', 'Schaffhausen']}
    />
  );
};

export default WinterthurPage;
