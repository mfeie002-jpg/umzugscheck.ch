import CityLandingTemplate from '@/components/CityLandingTemplate';
import cityImage from '@/assets/city-fribourg-navy-alpine.jpg';

const FribourgPage = () => {
  return (
    <CityLandingTemplate
      city="Freiburg"
      canton="Freiburg"
      region="Mittelland"
      heroImage={cityImage}
      description="An der Sprachgrenze zu Hause – wir sprechen Deutsch und Französisch und kennen die Region wie unsere Westentasche."
      highlights={[
        'Zweisprachig (DE/FR)',
        'Universitäts-Umzüge',
        'Altstadt-Erfahrung',
        'Basse-Ville Expertise'
      ]}
      testimonial={{
        text: "Trotz der Sprachgrenze war die Kommunikation perfekt. Das zweisprachige Team ist ein grosses Plus!",
        author: "Familie Zbinden",
        location: "Bern → Fribourg Schönberg"
      }}
      stats={{
        moves: '150+',
        rating: '4.8',
        years: '40+'
      }}
      nearbyAreas={['Bern', 'Lausanne', 'Murten', 'Bulle']}
    />
  );
};

export default FribourgPage;
