import CityLandingTemplate from '@/components/CityLandingTemplate';
import heroImage from '@/assets/city-generic-navy-alpine.jpg';
const Uster = () => {
  return (
    <CityLandingTemplate
      city="Uster"
      canton="Zürich"
      region="Zürcher Oberland"
      heroImage={heroImage}
      description="Ihr zuverlässiger Umzugspartner in Uster. Als drittgrösste Stadt im Kanton Zürich bieten wir massgeschneiderte Umzugslösungen für Familien und Unternehmen."
      districts={['Niederuster', 'Oberuster', 'Nänikon', 'Wermatswil', 'Freudwil', 'Riedikon']}
      stats={{
        moves: "850+",
        rating: "4.9",
        years: "15+"
      }}
      testimonials={[
        { name: "Familie Meier", text: "Der Umzug in unser neues Haus in Niederuster war perfekt organisiert. Das Team war pünktlich und sehr sorgfältig.", rating: 5, district: "Niederuster" },
        { name: "M. Keller", text: "Schneller und professioneller Service. Sehr zu empfehlen!", rating: 5, district: "Oberuster" },
        { name: "S. Brunner", text: "Freundliches Team, faire Preise. Alles hat bestens geklappt.", rating: 5, district: "Nänikon" }
      ]}
      nearbyRoutes={[
        { from: "Uster", to: "Zürich", distance: "18 km" },
        { from: "Uster", to: "Winterthur", distance: "15 km" },
        { from: "Uster", to: "Wetzikon", distance: "8 km" },
        { from: "Uster", to: "Rapperswil", distance: "22 km" }
      ]}
    />
  );
};

export default Uster;
