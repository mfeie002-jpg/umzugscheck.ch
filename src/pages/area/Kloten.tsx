import CityLandingTemplate from '@/components/CityLandingTemplate';
import cityImage from '@/assets/city-generic-navy-alpine.jpg';

const Kloten = () => {
  return (
    <CityLandingTemplate
      city="Kloten"
      canton="Zürich"
      region="Flughafenregion"
      heroImage={cityImage}
      description="Umzüge in Kloten und der Flughafenregion. Perfekte Anbindung und flexible Zeiten für Umzüge in der dynamischen Flughafenstadt."
      highlights={[
        'Umzüge rund um den Flughafen',
        '24/7 Verfügbarkeit für Expats',
        'Internationale Umzugserfahrung',
        'Lagerung für Expat-Umzüge'
      ]}
      testimonial={{
        text: "Perfekt für unseren Expat-Umzug! Flexibel, schnell und sehr professionell.",
        author: "James W.",
        location: "Relocation nach Kloten"
      }}
      stats={{
        moves: '380',
        rating: '4.8',
        years: '10'
      }}
      nearbyAreas={['Zürich', 'Opfikon', 'Bülach', 'Dübendorf']}
    />
  );
};

export default Kloten;
