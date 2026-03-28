import CityLandingTemplate from '@/components/CityLandingTemplate';
import heroImage from '@/assets/city-generic-navy-alpine.jpg';

const Emmen = () => {
  return (
    <CityLandingTemplate
      city="Emmen"
      heroImage={heroImage}
      canton="Luzern"
      region="Zentralschweiz"
      description="Professionelle Umzüge in Emmen und der Zentralschweiz. Als grösste Gemeinde im Kanton Luzern bieten wir erstklassigen Service für Privat- und Geschäftsumzüge."
      highlights={['Grösste Gemeinde im Kanton Luzern', 'Nähe zu Luzern Zentrum', 'Industriegebiet-Erfahrung', 'Günstige Konditionen']}
      testimonial={{ text: "Schnell, professionell und fair! Unser Umzug nach Emmen war bestens organisiert.", author: "Marco S.", location: "Umzug von Luzern nach Emmen" }}
      stats={{ moves: '340', rating: '4.8', years: '9' }}
      nearbyAreas={['Luzern', 'Kriens', 'Horw', 'Rothenburg']}
    />
  );
};

export default Emmen;