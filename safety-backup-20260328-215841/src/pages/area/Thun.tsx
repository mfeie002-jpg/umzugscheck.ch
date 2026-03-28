import CityLandingTemplate from '@/components/CityLandingTemplate';
import cityImage from '@/assets/city-thun-navy-alpine.jpg';

const ThunPage = () => {
  return (
    <CityLandingTemplate
      city="Thun"
      canton="Bern"
      region="Berner Oberland"
      heroImage={cityImage}
      description="Vom malerischen Thunersee bis in die Berner Alpen – wir sind Ihr zuverlässiger Umzugspartner in der Region."
      highlights={[
        'Seeliegenschaften-Expertise',
        'Bergumzüge',
        'Feriendomizile',
        'Oberland-Netzwerk'
      ]}
      testimonial={{
        text: "Trotz der engen Altstadtgassen hat alles reibungslos geklappt. Das Team war sehr professionell.",
        author: "Familie Gerber",
        location: "Thun Altstadt → Gwatt"
      }}
      stats={{
        moves: '180+',
        rating: '4.9',
        years: '40+'
      }}
      nearbyAreas={['Bern', 'Interlaken', 'Spiez', 'Steffisburg']}
    />
  );
};

export default ThunPage;
