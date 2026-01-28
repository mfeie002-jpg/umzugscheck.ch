import CityLandingTemplate from '@/components/CityLandingTemplate';
import cityImage from '@/assets/city-luzern-navy-alpine.jpg';

const LuzernPage = () => {
  return (
    <CityLandingTemplate
      city="Luzern"
      canton="Luzern"
      region="Zentralschweiz"
      heroImage={cityImage}
      description="Von der historischen Altstadt bis zu den Gemeinden rund um den Vierwaldstättersee – wir sind Ihr zuverlässiger Umzugspartner in der Zentralschweiz."
      highlights={[
        'Altstadt-Erfahrung',
        'Seeliegenschaften',
        'Bergregionen-Expertise',
        'Schnelle Reaktionszeiten'
      ]}
      testimonial={{
        text: "Umzug aus der Altstadt war eine Herausforderung, aber das Team hat alles perfekt gemeistert. Sehr professionell!",
        author: "Hans Bühler",
        location: "Luzern Altstadt"
      }}
      stats={{
        moves: '756',
        rating: '4.9',
        years: '40+'
      }}
      nearbyAreas={['Zug', 'Schwyz', 'Stans', 'Sarnen']}
    />
  );
};

export default LuzernPage;
