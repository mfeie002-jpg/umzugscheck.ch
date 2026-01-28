import CityLandingTemplate from '@/components/CityLandingTemplate';
import heroImage from '@/assets/city-generic-navy-alpine.jpg';

const Adliswil = () => {
  return (
    <CityLandingTemplate
      city="Adliswil"
      heroImage={heroImage}
      canton="Zürich"
      region="Sihltal"
      description="Umzugsexperte für Adliswil und das Sihltal. Wir bieten professionelle Umzugsdienstleistungen in dieser attraktiven Wohngemeinde südlich von Zürich."
      highlights={['Direkte S-Bahn-Anbindung nach Zürich', 'Erfahrung mit Hanglagen', 'Familienfreundlicher Service', 'Flexible Wochenendtermine']}
      testimonial={{ text: "Sehr zufrieden! Das Team hat unseren Umzug nach Adliswil perfekt gemeistert.", author: "Claudia R.", location: "Umzug ins Sihltal" }}
      stats={{ moves: '260', rating: '4.9', years: '7' }}
      nearbyAreas={['Zürich', 'Thalwil', 'Langnau', 'Kilchberg']}
    />
  );
};

export default Adliswil;