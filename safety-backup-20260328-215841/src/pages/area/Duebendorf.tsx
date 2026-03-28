import CityLandingTemplate from '@/components/CityLandingTemplate';
import cityImage from '@/assets/city-generic-navy-alpine.jpg';

const Duebendorf = () => {
  return (
    <CityLandingTemplate
      city="Dübendorf"
      canton="Zürich"
      region="Glattal"
      heroImage={cityImage}
      description="Professionelle Umzüge in Dübendorf und dem Glattal. Wir kennen die Region und bieten massgeschneiderte Lösungen für jeden Umzug."
      highlights={[
        'Umzüge im Glattal',
        'Nähe zu Zürich und Flughafen',
        'Erfahrung mit Gewerbeumzügen',
        'Schnelle Verfügbarkeit'
      ]}
      testimonial={{
        text: "Sehr zufrieden mit dem Umzug nach Dübendorf. Kompetentes und freundliches Team!",
        author: "Sandra M.",
        location: "Umzug ins Glattal"
      }}
      stats={{
        moves: '310',
        rating: '4.8',
        years: '8'
      }}
      nearbyAreas={['Zürich', 'Kloten', 'Uster', 'Wallisellen']}
    />
  );
};

export default Duebendorf;
