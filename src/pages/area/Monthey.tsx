import CityLandingTemplate from '@/components/CityLandingTemplate';
import heroImage from '@/assets/city-generic-navy-alpine.jpg';

const Monthey = () => {
  return (
    <CityLandingTemplate
      city="Monthey"
      heroImage={heroImage}
      canton="Wallis"
      region="Chablais"
      description="Déménagements professionnels à Monthey et dans le Chablais. Service de qualité suisse avec une équipe locale expérimentée."
      highlights={['Service bilingue français-allemand', 'Déménagements dans les Alpes', 'Accès aux stations de ski', 'Transport sécurisé en montagne']}
      testimonial={{ text: "Excellent service pour notre déménagement à Monthey. Équipe très professionnelle!", author: "Famille Dupont", location: "Déménagement au Chablais" }}
      stats={{ moves: '180', rating: '4.9', years: '6' }}
      nearbyAreas={['Sion', 'Martigny', 'Aigle', 'Montreux']}
    />
  );
};

export default Monthey;