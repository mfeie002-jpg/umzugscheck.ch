import CityLandingTemplate from '@/components/CityLandingTemplate';
import cityImage from '@/assets/city-rapperswil-navy-alpine.jpg';

const RapperswilPage = () => {
  return (
    <CityLandingTemplate
      city="Rapperswil-Jona"
      canton="St. Gallen"
      region="Rapperswil-Jona & Obersee"
      heroImage={cityImage}
      description="Rapperswil-Jona – wo das mittelalterliche Schloss auf den glitzernden Zürichsee trifft. Grösste Stadt des Kantons St. Gallen und Tor zur Ostschweiz."
      highlights={[
        'Historische Altstadt & Schloss-Nähe',
        'HSR Campus & Studenten-Umzüge',
        'Seepromenaden & Villen',
        'Schnelle Verbindung nach Zürich'
      ]}
      testimonial={{
        text: "Umzug aus der historischen Altstadt perfekt gemeistert. Das Schloss war beeindruckender Hintergrund!",
        author: "Michael Zbinden",
        location: "Rapperswil Altstadt → Jona"
      }}
      stats={{
        moves: '267',
        rating: '4.9',
        years: '15+'
      }}
      districts={['Altstadt', 'Jona', 'Kempraten', 'Wagen', 'Bollingen', 'Eschenbach', 'Schmerikon', 'Uznach', 'Lachen', 'Pfäffikon SZ']}
      nearbyAreas={['Zürich', 'St. Gallen', 'Pfäffikon', 'Uznach']}
    />
  );
};

export default RapperswilPage;
