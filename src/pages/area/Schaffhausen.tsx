import CityLandingTemplate from '@/components/CityLandingTemplate';
import cityImage from '@/assets/city-schaffhausen-navy-alpine.jpg';

const SchaffhausenPage = () => {
  return (
    <CityLandingTemplate
      city="Schaffhausen"
      canton="Schaffhausen"
      region="Nordschweiz"
      heroImage={cityImage}
      description="Von der historischen Altstadt bis zum grössten Wasserfall Europas – wir sind Ihr lokaler Umzugspartner."
      highlights={[
        'Grenzumzüge DE inklusive',
        'Altstadt-Expertise',
        'Rheinfall-Region',
        'Zollabwicklung'
      ]}
      testimonial={{
        text: "Trotz der engen Erker-Gassen hat alles perfekt geklappt. Sehr professionelles Team!",
        author: "Markus Brunner",
        location: "Schaffhausen Altstadt → Herblingen"
      }}
      stats={{
        moves: '120+',
        rating: '4.9',
        years: '40+'
      }}
      nearbyAreas={['Winterthur', 'Konstanz (DE)', 'Frauenfeld', 'Singen (DE)']}
    />
  );
};

export default SchaffhausenPage;
