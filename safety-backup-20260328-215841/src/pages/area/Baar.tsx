import CityLandingTemplate from '@/components/CityLandingTemplate';
import heroImage from '@/assets/city-generic-navy-alpine.jpg';

const Baar = () => {
  return (
    <CityLandingTemplate
      city="Baar"
      heroImage={heroImage}
      canton="Zug"
      region="Zentralschweiz"
      description="Premium Umzugsservice in Baar und dem Kanton Zug. Profitieren Sie von unserem erstklassigen Service in einer der wirtschaftsstärksten Regionen der Schweiz."
      highlights={['Zweitgrösste Gemeinde im Kanton Zug', 'Premium-Wohnlagen', 'Diskreter VIP-Service', 'Internationale Expat-Erfahrung']}
      testimonial={{ text: "Perfekter Umzug für unsere Familie! Besonders die Sorgfalt mit unseren Antiquitäten hat uns beeindruckt.", author: "Dr. Stefan M.", location: "Umzug nach Baar" }}
      stats={{ moves: '310', rating: '5.0', years: '10' }}
      nearbyAreas={['Zug', 'Cham', 'Steinhausen', 'Rotkreuz']}
    />
  );
};

export default Baar;