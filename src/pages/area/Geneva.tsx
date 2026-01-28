import CityLandingTemplate from '@/components/CityLandingTemplate';
import cityImage from '@/assets/city-geneva-navy-alpine.jpg';

const GenevaPage = () => {
  return (
    <CityLandingTemplate
      city="Genf"
      canton="Genf"
      region="Romandie"
      heroImage={cityImage}
      description="Als zweisprachiges Umzugsunternehmen kennen wir Genf wie unsere Westentasche. Von den Rues Basses bis nach Carouge – wir bringen Sie sicher ans Ziel."
      highlights={[
        'Zweisprachiger Service (DE/FR)',
        'Internationale Organisationen',
        'Expat-Service',
        'Parkbewilligungen inklusive'
      ]}
      testimonial={{
        text: "Umzug von der Altstadt nach Carouge. Das Team war pünktlich, professionell und sehr sorgfältig mit unseren Antiquitäten.",
        author: "Marie Dubois",
        location: "Genève - Carouge"
      }}
      stats={{
        moves: '1234',
        rating: '4.7',
        years: '40+'
      }}
      nearbyAreas={['Lausanne', 'Nyon', 'Annemasse (FR)', 'Thonon (FR)']}
    />
  );
};

export default GenevaPage;
