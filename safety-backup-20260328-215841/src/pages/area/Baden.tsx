import CityLandingTemplate from '@/components/CityLandingTemplate';
import cityImage from '@/assets/city-baden-navy-alpine.jpg';

const BadenPage = () => {
  return (
    <CityLandingTemplate
      city="Baden"
      canton="Aargau"
      region="Region Aargau"
      heroImage={cityImage}
      description="Baden – historische Bäderstadt mit modernem Flair. Vom mittelalterlichen Stadtkern bis zum Hightech-Standort Brown Boveri – wir kennen jede Ecke."
      highlights={[
        'Erfahrung mit historischen Altstadthäusern',
        'Nähe zu Zürich – schnelle Anfahrt',
        'ABB-Areal & Gewerbeumzüge',
        'Thermalquartier-Spezialist'
      ]}
      testimonial={{
        text: "Umzug aus dem historischen Zentrum perfekt gemeistert. Alle engen Gassen wurden problemlos bewältigt!",
        author: "Claudia Meier",
        location: "Baden Altstadt → Baden Kappelerhof"
      }}
      stats={{
        moves: '312',
        rating: '4.9',
        years: '15+'
      }}
      districts={['Altstadt', 'Kappelerhof', 'Dättwil', 'Rütihof', 'Meierhof', 'Münzlishausen', 'Allmend', 'Römerstrasse', 'Haselfeld', 'Martinsberg']}
      nearbyAreas={['Zürich', 'Wettingen', 'Brugg', 'Aarau']}
    />
  );
};

export default BadenPage;
