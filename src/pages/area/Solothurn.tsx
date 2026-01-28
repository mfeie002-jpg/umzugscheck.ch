import CityLandingTemplate from '@/components/CityLandingTemplate';
import cityImage from '@/assets/city-solothurn-navy-alpine.jpg';

const SolothurnPage = () => {
  return (
    <CityLandingTemplate
      city="Solothurn"
      canton="Solothurn"
      region="Mittelland"
      heroImage={cityImage}
      description="Die schönste Barockstadt der Schweiz verdient einen besonderen Umzugsservice. Wir kennen jede Gasse und jedes historische Gebäude."
      highlights={[
        'Altstadt-Erfahrung',
        'Historische Gebäude',
        'Denkmalschutz-Kenntnis',
        'Barock-Expertise'
      ]}
      testimonial={{
        text: "Trotz der engen Barockgassen lief alles reibungslos. Sehr professionelles Team!",
        author: "Familie Weber",
        location: "Solothurn Altstadt → Zuchwil"
      }}
      stats={{
        moves: '140+',
        rating: '4.8',
        years: '40+'
      }}
      nearbyAreas={['Bern', 'Basel', 'Biel', 'Olten']}
    />
  );
};

export default SolothurnPage;
