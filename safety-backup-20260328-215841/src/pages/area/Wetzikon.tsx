import CityLandingTemplate from '@/components/CityLandingTemplate';
import heroImage from '@/assets/city-generic-navy-alpine.jpg';
const Wetzikon = () => {
  return (
    <CityLandingTemplate
      city="Wetzikon"
      canton="Zürich"
      region="Zürcher Oberland"
      heroImage={heroImage}
      description="Professionelle Umzüge in Wetzikon und im Zürcher Oberland. Wir kennen die Region und bieten schnelle, zuverlässige Umzugsservices."
      districts={['Kempten', 'Robenhausen', 'Medikon', 'Robank', 'Ettenhausen']}
      stats={{
        moves: "620+",
        rating: "4.9",
        years: "12+"
      }}
      testimonials={[
        { name: "Markus B.", text: "Sehr professionelles Team! Unser Büroumzug in Wetzikon wurde effizient und ohne Unterbrechung unseres Betriebs durchgeführt.", rating: 5, district: "Wetzikon" },
        { name: "Familie Huber", text: "Pünktlich, freundlich und kompetent. Der Umzug war stressfrei.", rating: 5, district: "Kempten" },
        { name: "C. Schmid", text: "Top Service zum fairen Preis. Gerne wieder!", rating: 5, district: "Robenhausen" }
      ]}
      nearbyRoutes={[
        { from: "Wetzikon", to: "Uster", distance: "8 km" },
        { from: "Wetzikon", to: "Rapperswil", distance: "15 km" },
        { from: "Wetzikon", to: "Zürich", distance: "26 km" },
        { from: "Wetzikon", to: "Winterthur", distance: "22 km" }
      ]}
    />
  );
};

export default Wetzikon;
