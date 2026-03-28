import CityLandingTemplate from '@/components/CityLandingTemplate';
import cityImage from '@/assets/city-bern-navy-alpine.jpg';

const BernPage = () => {
  return (
    <CityLandingTemplate
      city="Bern"
      canton="Bern"
      region="Bundesstadt"
      heroImage={cityImage}
      description="Von der UNESCO-Altstadt bis zum Bundeshaus – wir kennen Bern und seine besonderen Anforderungen wie keine andere Umzugsfirma."
      highlights={[
        'Altstadt-Erfahrung',
        'Laubengang-Expertise',
        'Behörden-Umzüge',
        'Sondergenehmigungen'
      ]}
      testimonial={{
        text: "Die UNESCO-Altstadt ist nicht einfach zu befahren. Feierabend hat alles perfekt gemeistert!",
        author: "Familie Gerber",
        location: "Thun → Bern Breitenrain"
      }}
      stats={{
        moves: '250+',
        rating: '4.9',
        years: '40+'
      }}
      nearbyAreas={['Thun', 'Fribourg', 'Solothurn', 'Biel']}
    />
  );
};

export default BernPage;
