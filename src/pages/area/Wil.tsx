import CityLandingTemplate from '@/components/CityLandingTemplate';
import heroImage from '@/assets/city-generic-navy-alpine.jpg';

const Wil = () => {
  return (
    <CityLandingTemplate
      city="Wil"
      heroImage={heroImage}
      canton="St. Gallen"
      region="Ostschweiz"
      description="Ihr professioneller Umzugspartner in Wil und der Region Ostschweiz. Lokale Expertise kombiniert mit Schweizer Qualitätsstandards für Ihren stressfreien Umzug."
      highlights={['Zentrale Lage in der Ostschweiz', 'Gute Anbindung nach St. Gallen und Zürich', 'Erfahrung mit Altstadt-Umzügen', 'Flexible Terminplanung']}
      testimonial={{ text: "Exzellenter Umzugsservice in Wil! Das Team war pünktlich, freundlich und sehr sorgfältig mit unseren Möbeln.", author: "Familie Brunner", location: "Umzug innerhalb Wil" }}
      stats={{ moves: '250', rating: '4.9', years: '7' }}
      nearbyAreas={['St. Gallen', 'Winterthur', 'Frauenfeld', 'Gossau']}
    />
  );
};

export default Wil;