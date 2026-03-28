import CityLandingTemplate from '@/components/CityLandingTemplate';
import cityImage from '@/assets/city-lausanne-navy-alpine.jpg';

const LausannePage = () => {
  return (
    <CityLandingTemplate
      city="Lausanne"
      canton="Waadt"
      region="Genfersee-Region"
      heroImage={cityImage}
      description="Die Hügelstadt am Genfersee stellt besondere Anforderungen an Umzüge. Unser erfahrenes Team kennt jede Steigung und jeden Winkel von Lausanne."
      highlights={[
        'Steile Strassen & Treppen',
        'Spezialmaterial für Hanglagen',
        'EPFL/UNIL Service',
        'Zweisprachig (DE/FR)'
      ]}
      testimonial={{
        text: "Umzug vom Flon nach Ouchy mit Blick auf den See. Das Team hat unsere Möbel perfekt durch die engen Treppen transportiert.",
        author: "Jean-Luc Rochat",
        location: "Lausanne - Ouchy"
      }}
      stats={{
        moves: '987',
        rating: '4.8',
        years: '40+'
      }}
      nearbyAreas={['Genf', 'Montreux', 'Yverdon', 'Vevey']}
    />
  );
};

export default LausannePage;
