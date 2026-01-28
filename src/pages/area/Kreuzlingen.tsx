import CityLandingTemplate from '@/components/CityLandingTemplate';
import heroImage from '@/assets/city-generic-navy-alpine.jpg';
const Kreuzlingen = () => {
  return (
    <CityLandingTemplate
      city="Kreuzlingen"
      canton="Thurgau"
      region="Bodensee & Grenzregion"
      heroImage={heroImage}
      description="Ihr Umzugsexperte in Kreuzlingen am Bodensee. Wir bieten auch grenzüberschreitende Umzüge nach Deutschland und Österreich an."
      districts={['Emmishofen', 'Kurzrickenbach', 'Egelshofen', 'Bernrain', 'Tägerwilen']}
      stats={{
        moves: "480+",
        rating: "4.9",
        years: "10+"
      }}
      testimonials={[
        { name: "Familie Schneider", text: "Unser Umzug von Kreuzlingen nach Konstanz wurde reibungslos abgewickelt. Die Zollformalitäten wurden professionell erledigt.", rating: 5, district: "Kreuzlingen" },
        { name: "T. Weber", text: "Super Team, schneller Service. Der grenzüberschreitende Umzug war kein Problem.", rating: 5, district: "Emmishofen" },
        { name: "K. Fischer", text: "Sehr empfehlenswert! Alles hat perfekt geklappt.", rating: 5, district: "Tägerwilen" }
      ]}
      nearbyRoutes={[
        { from: "Kreuzlingen", to: "Konstanz (DE)", distance: "3 km" },
        { from: "Kreuzlingen", to: "Winterthur", distance: "45 km" },
        { from: "Kreuzlingen", to: "St. Gallen", distance: "50 km" },
        { from: "Kreuzlingen", to: "Schaffhausen", distance: "40 km" }
      ]}
    />
  );
};

export default Kreuzlingen;
