import CityLandingTemplate from '@/components/CityLandingTemplate';
import heroImage from '@/assets/city-generic-navy-alpine.jpg';
const Frauenfeld = () => {
  return (
    <CityLandingTemplate
      city="Frauenfeld"
      canton="Thurgau"
      region="Ostschweiz"
      heroImage={heroImage}
      description="Ihr zuverlässiger Umzugspartner in Frauenfeld und im Thurgau. Als Hauptstadt des Kantons Thurgau bieten wir Ihnen professionelle Umzugsdienstleistungen mit lokaler Expertise."
      highlights={[
        'Umzüge in der Altstadt und Neustadt',
        'Gute Anbindung an Winterthur und Zürich',
        'Erfahrung mit historischen Gebäuden',
        'Flexible Terminplanung'
      ]}
      testimonial={{
        text: "Sehr professioneller Umzug nach Frauenfeld. Das Team war pünktlich und hat alles sicher transportiert.",
        author: "Familie Keller",
        location: "Umzug nach Frauenfeld"
      }}
      stats={{
        moves: '280',
        rating: '4.9',
        years: '8'
      }}
      nearbyAreas={['Winterthur', 'Kreuzlingen', 'Konstanz', 'Schaffhausen']}
    />
  );
};

export default Frauenfeld;
