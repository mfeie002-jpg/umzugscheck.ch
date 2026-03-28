import CityLandingTemplate from '@/components/CityLandingTemplate';
import cityImage from '@/assets/city-neuchatel-navy-alpine.jpg';

const NeuchatelPage = () => {
  return (
    <CityLandingTemplate
      city="Neuchâtel"
      canton="Neuenburg"
      region="Arc Jurassien"
      heroImage={cityImage}
      description="Neuchâtel – perle du Jura au bord de son lac émeraude. Ville universitaire, capitale horlogère et joyau architectural."
      highlights={[
        'Service francophone',
        'Expertise vieille ville',
        'Industrie horlogère',
        'Région des Trois-Lacs'
      ]}
      testimonial={{
        text: "Déménagement impeccable! L'équipe a parfaitement géré les escaliers étroits de la vieille ville.",
        author: "Philippe Dubois",
        location: "Neuchâtel - Vieille Ville"
      }}
      stats={{
        moves: '187',
        rating: '4.9',
        years: '40+'
      }}
      nearbyAreas={['La Chaux-de-Fonds', 'Biel', 'Yverdon', 'Bern']}
    />
  );
};

export default NeuchatelPage;
