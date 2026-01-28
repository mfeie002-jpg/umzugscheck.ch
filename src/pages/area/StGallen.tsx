import CityLandingTemplate from '@/components/CityLandingTemplate';
import cityImage from '@/assets/city-stgallen-navy-alpine.jpg';

const StGallenPage = () => {
  return (
    <CityLandingTemplate
      city="St. Gallen"
      canton="St. Gallen"
      region="Ostschweiz"
      heroImage={cityImage}
      description="Die Textilstadt mit ihrer UNESCO-geschützten Altstadt und den berühmten Erkern erfordert erfahrene Umzugsprofis. Wir kennen jeden Winkel der Ostschweiz."
      highlights={[
        'UNESCO-Gebäude Erfahrung',
        'Spezialtransporte Altstadt',
        'Bodensee & Appenzell',
        'Grenznahe Umzüge'
      ]}
      testimonial={{
        text: "Umzug aus der Altstadt mit UNESCO-geschützten Erkern. Das Team war extrem vorsichtig und professionell!",
        author: "Peter Keller",
        location: "St. Gallen - Rosenberg"
      }}
      stats={{
        moves: '543',
        rating: '4.8',
        years: '40+'
      }}
      nearbyAreas={['Winterthur', 'Konstanz (DE)', 'Herisau', 'Rorschach']}
    />
  );
};

export default StGallenPage;
