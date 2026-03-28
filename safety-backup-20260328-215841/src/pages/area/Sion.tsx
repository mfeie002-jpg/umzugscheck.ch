import CityLandingTemplate from '@/components/CityLandingTemplate';
import cityImage from '@/assets/city-sion-navy-alpine.jpg';

const SionPage = () => {
  return (
    <CityLandingTemplate
      city="Sion"
      canton="Wallis"
      region="Sion/Sitten & Wallis"
      heroImage={cityImage}
      description="Sion/Sitten – die sonnige Hauptstadt des Wallis am Fusse der majestätischen Alpen. Wir bieten zweisprachigen Service für alle Ihre Umzugsbedürfnisse."
      highlights={[
        'Zweisprachiger Service (DE/FR)',
        'Expertise für Bergregionen & Chalets',
        'Vieille Ville & historische Gebäude',
        'Ski-Resort Umzüge (Crans-Montana, Verbier)'
      ]}
      testimonial={{
        text: "Déménagement parfait depuis la vieille ville. Équipe très professionnelle et ponctuelle.",
        author: "Jean-Pierre Roux",
        location: "Sion Vieille Ville → Sion Bramois"
      }}
      stats={{
        moves: '198',
        rating: '4.8',
        years: '10+'
      }}
      districts={['Vieille Ville', 'Bramois', 'Châteauneuf', 'Uvrier', 'Saint-Léonard', 'Les Creusets', 'Platta', 'Sous-Gare', 'Champsec', 'Vissigen']}
      nearbyAreas={['Martigny', 'Sierre', 'Verbier', 'Crans-Montana']}
    />
  );
};

export default SionPage;
