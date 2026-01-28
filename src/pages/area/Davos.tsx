import CityLandingTemplate from '@/components/CityLandingTemplate';
import cityImage from '@/assets/city-generic-navy-alpine.jpg';

const DavosPage = () => {
  return (
    <CityLandingTemplate
      city="Davos"
      canton="Graubünden"
      region="Davos, Klosters & Prättigau"
      heroImage={cityImage}
      description="Davos – höchstgelegene Stadt Europas, Weltbekannt für WEF und Wintersport. Wir kennen die Herausforderungen alpiner Umzüge und meistern sie professionell."
      highlights={[
        'Erfahrung mit Bergstrassen & Schnee',
        'Chalet- & Ferienhaus-Umzüge',
        'Saisonale Umzüge (Sommer/Winter)',
        'Verbindung Davos ↔ Chur ↔ Zürich'
      ]}
      testimonial={{
        text: "Umzug in 1560m Höhe perfekt gemeistert. Das Team kennt die Herausforderungen der Alpen.",
        author: "Hans Caflisch",
        location: "Davos Platz → Davos Dorf"
      }}
      stats={{
        moves: '89',
        rating: '4.9',
        years: '12+'
      }}
      districts={['Davos Platz', 'Davos Dorf', 'Klosters', 'Klosters Dorf', 'Wolfgang', 'Frauenkirch', 'Glaris', 'Monstein', 'Schatzalp', 'Wiesen']}
      nearbyAreas={['Chur', 'Klosters', 'Arosa', 'Lenzerheide']}
    />
  );
};

export default DavosPage;
