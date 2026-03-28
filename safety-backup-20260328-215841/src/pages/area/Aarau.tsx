import CityLandingTemplate from '@/components/CityLandingTemplate';
import cityImage from '@/assets/city-aarau-navy-alpine.jpg';

const AarauPage = () => {
  return (
    <CityLandingTemplate
      city="Aarau"
      canton="Aargau"
      region="Mittelland"
      heroImage={cityImage}
      description="Ihr zuverlässiger Partner für Umzüge in Aarau und im Kanton Aargau. Zentrale Lage, schweizweiter Service."
      highlights={[
        'Kantonshauptstadt-Expertise',
        'Historische Altstadt',
        'Mittelland-Drehkreuz',
        'Regionale Umzüge'
      ]}
      testimonial={{
        text: "Trotz der engen Altstadtgassen hat alles perfekt geklappt. Sehr professionell!",
        author: "Sandra Bürgi",
        location: "Aarau Altstadt"
      }}
      stats={{
        moves: '190+',
        rating: '5.0',
        years: '40+'
      }}
      nearbyAreas={['Zürich', 'Basel', 'Bern', 'Baden']}
    />
  );
};

export default AarauPage;
