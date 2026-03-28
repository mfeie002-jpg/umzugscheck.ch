import CityLandingTemplate from '@/components/CityLandingTemplate';
import heroImage from '@/assets/city-generic-navy-alpine.jpg';

const Yverdon = () => {
  return (
    <CityLandingTemplate
      city="Yverdon-les-Bains"
      heroImage={heroImage}
      canton="Waadt"
      region="Nord Vaudois"
      description="Déménagements à Yverdon-les-Bains et dans le Nord Vaudois. Service professionnel et fiable pour tous types de déménagements."
      highlights={['Couverture du Nord Vaudois', 'Proximité Lausanne et Neuchâtel', 'Service thermalisme et bien-être', 'Déménagements pour entreprises tech']}
      testimonial={{ text: "Très satisfaits du déménagement à Yverdon. Service rapide et soigné!", author: "Pierre et Marie L.", location: "Déménagement Nord Vaudois" }}
      stats={{ moves: '220', rating: '4.8', years: '7' }}
      nearbyAreas={['Lausanne', 'Neuchâtel', 'Payerne', 'Orbe']}
    />
  );
};

export default Yverdon;