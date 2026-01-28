import CityLandingTemplate from '@/components/CityLandingTemplate';
import cityImage from '@/assets/city-chur-navy-alpine.jpg';

const ChurPage = () => {
  return (
    <CityLandingTemplate
      city="Chur"
      canton="Graubünden"
      region="Bündnerland"
      heroImage={cityImage}
      description="Von der ältesten Stadt der Schweiz bis in die höchsten Berge Graubündens – wir sind Ihr zuverlässiger Umzugspartner."
      highlights={[
        'Bergstrassen-Erfahrung',
        'Engadin-Expertise',
        'Spezialfahrzeuge Alpen',
        'Wetterflex-Garantie'
      ]}
      testimonial={{
        text: "Perfekter Umzug trotz der engen Altstadtgassen. Das Team war äusserst professionell und sorgfältig.",
        author: "Peter Casutt",
        location: "Chur Altstadt → Maladers"
      }}
      stats={{
        moves: '200+',
        rating: '4.9',
        years: '40+'
      }}
      nearbyAreas={['Davos', 'St. Moritz', 'Landquart', 'Arosa']}
    />
  );
};

export default ChurPage;
