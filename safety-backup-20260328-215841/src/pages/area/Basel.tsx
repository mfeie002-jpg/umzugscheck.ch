import CityLandingTemplate from '@/components/CityLandingTemplate';
import cityImage from '@/assets/city-basel-navy-alpine.jpg';

const BaselPage = () => {
  return (
    <CityLandingTemplate
      city="Basel"
      canton="Basel-Stadt"
      region="Dreiländereck"
      heroImage={cityImage}
      description="Ob innerhalb Basels, ins Elsass oder nach Süddeutschland – wir sind Ihr Spezialist für Umzüge in der Grenzregion."
      highlights={[
        'Grenzumzüge DE/FR inklusive',
        'Zollabwicklung',
        'Mehrsprachiges Team',
        'Kenntnis Dreiländereck'
      ]}
      testimonial={{
        text: "Unser Umzug von Zürich nach Basel war dank Feierabend völlig stressfrei. Super Team!",
        author: "Claudia und Peter Roth",
        location: "Zürich → Basel Gundeldingen"
      }}
      stats={{
        moves: '300+',
        rating: '4.9',
        years: '40+'
      }}
      nearbyAreas={['Zürich', 'Aarau', 'Freiburg (DE)', 'Mulhouse (FR)']}
    />
  );
};

export default BaselPage;
