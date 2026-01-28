import CityLandingTemplate from '@/components/CityLandingTemplate';
import cityImage from '@/assets/city-generic-navy-alpine.jpg';

const OltenPage = () => {
  return (
    <CityLandingTemplate
      city="Olten"
      canton="Solothurn"
      region="Region Solothurn"
      heroImage={cityImage}
      description="Olten – der zentrale Verkehrsknotenpunkt der Schweiz. Von hier aus erreichen wir jeden Ort schnell und effizient. Perfekte Ausgangslage für Ihren Umzug."
      highlights={[
        'Zentrale Lage – schnelle Anbindung überall',
        'Erfahrung mit Altstadt-Umzügen',
        'Sälipark & Gewerbeumzüge',
        'Perfekte Anbindung an A1 & A2'
      ]}
      testimonial={{
        text: "Perfekter Umzug! Das Team war pünktlich, freundlich und sehr sorgfältig mit unseren Möbeln.",
        author: "Peter Müller",
        location: "Olten Altstadt → Olten Kleinholz"
      }}
      stats={{
        moves: '234',
        rating: '4.8',
        years: '12+'
      }}
      districts={['Altstadt', 'Kleinholz', 'Sälipark', 'Rötzmatt', 'Bifang', 'Industriequartier', 'Gheid', 'Hagberg', 'Wiler', 'Stadtrand']}
      nearbyAreas={['Aarau', 'Solothurn', 'Basel', 'Bern']}
    />
  );
};

export default OltenPage;
