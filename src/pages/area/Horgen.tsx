import CityLandingTemplate from '@/components/CityLandingTemplate';
import cityImage from '@/assets/city-generic-navy-alpine.jpg';

const Horgen = () => {
  return (
    <CityLandingTemplate
      city="Horgen"
      canton="Zürich"
      region="Zürichsee"
      heroImage={cityImage}
      description="Umzüge am linken Zürichseeufer. Wir sind Ihr Partner für professionelle Umzüge in Horgen und der gesamten Seeregion."
      highlights={[
        'Spezialist für Seegemeinden',
        'Umzüge in Hanglagen',
        'Erfahrung mit Villen und Einfamilienhäusern',
        'Möbellift für schwierige Zugänge'
      ]}
      testimonial={{
        text: "Exzellenter Service! Der Umzug unserer Villa in Horgen war perfekt organisiert.",
        author: "Familie Meier",
        location: "Umzug am Zürichsee"
      }}
      stats={{
        moves: '290',
        rating: '4.9',
        years: '9'
      }}
      nearbyAreas={['Zürich', 'Thalwil', 'Wädenswil', 'Kilchberg']}
    />
  );
};

export default Horgen;