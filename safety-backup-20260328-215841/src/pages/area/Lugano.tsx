import CityLandingTemplate from '@/components/CityLandingTemplate';
import cityImage from '@/assets/city-lugano-navy-alpine.jpg';

const LuganoPage = () => {
  return (
    <CityLandingTemplate
      city="Lugano"
      canton="Tessin"
      region="Südschweiz"
      heroImage={cityImage}
      description="Il vostro partner di fiducia per traslochi a Lugano e nel Ticino. Qualità svizzera, servizio bilingue."
      highlights={[
        'Servizio bilingue (DE/IT)',
        'Lago di Lugano Expertise',
        'Grenzregion Italien',
        'Hanglagen-Erfahrung'
      ]}
      testimonial={{
        text: "Servizio eccellente! Team professionale e molto attento ai dettagli.",
        author: "Marco Bentivoglio",
        location: "Lugano - Paradiso"
      }}
      stats={{
        moves: '420',
        rating: '5.0',
        years: '40+'
      }}
      nearbyAreas={['Bellinzona', 'Locarno', 'Como (IT)', 'Mendrisio']}
    />
  );
};

export default LuganoPage;
