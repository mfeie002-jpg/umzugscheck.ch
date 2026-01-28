import CityLandingTemplate from '@/components/CityLandingTemplate';
import cityImage from '@/assets/city-generic-navy-alpine.jpg';

const Buelach = () => {
  return (
    <CityLandingTemplate
      city="Bülach"
      canton="Zürich"
      region="Zürcher Unterland"
      heroImage={cityImage}
      description="Ihr lokaler Umzugsexperte in Bülach und dem Zürcher Unterland. Wir kennen die Region und bieten massgeschneiderte Lösungen für jeden Umzug."
      highlights={[
        'Hauptort des Zürcher Unterlands',
        'Flughafennähe',
        'Erfahrung mit Neubaugebieten',
        'Schnelle Verfügbarkeit'
      ]}
      testimonial={{
        text: "Hervorragender Service! Der Umzug in unser neues Haus in Bülach verlief reibungslos.",
        author: "Familie Huber",
        location: "Umzug nach Bülach"
      }}
      stats={{
        moves: '290',
        rating: '4.9',
        years: '8'
      }}
      nearbyAreas={['Kloten', 'Dübendorf', 'Opfikon', 'Embrach']}
    />
  );
};

export default Buelach;
