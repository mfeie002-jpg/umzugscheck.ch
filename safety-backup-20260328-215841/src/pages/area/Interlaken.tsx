import CityLandingTemplate from '@/components/CityLandingTemplate';
import cityImage from '@/assets/city-interlaken-navy-alpine.jpg';

const InterlakenPage = () => {
  return (
    <CityLandingTemplate
      city="Interlaken"
      canton="Bern"
      region="Berner Oberland"
      heroImage={cityImage}
      description="Interlaken – zwischen Thuner- und Brienzersee, mit Blick auf Eiger, Mönch und Jungfrau. Wir sind Ihre Umzugsexperten für das gesamte Berner Oberland."
      highlights={[
        'Bergbahn & Seilbahn Erfahrung',
        'Autofreie Orte (Wengen, Mürren)',
        'Chalets & Hotels',
        'Jungfrau-Region'
      ]}
      testimonial={{
        text: "Umzug mit Blick auf Eiger, Mönch und Jungfrau. Das Team war super professionell!",
        author: "Beat Aeschbacher",
        location: "Interlaken - Höhematte"
      }}
      stats={{
        moves: '134',
        rating: '4.9',
        years: '40+'
      }}
      nearbyAreas={['Thun', 'Grindelwald', 'Brienz', 'Meiringen']}
    />
  );
};

export default InterlakenPage;
