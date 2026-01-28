import CityLandingTemplate from '@/components/CityLandingTemplate';
import cityImage from '@/assets/city-generic-navy-alpine.jpg';

const Koeniz = () => {
  return (
    <CityLandingTemplate
      city="Köniz"
      canton="Bern"
      region="Kanton Bern"
      heroImage={cityImage}
      description="Zuverlässige Umzüge in Köniz und der Region Bern. Als viertgrösste Gemeinde der Schweiz kennen wir jeden Winkel von Köniz."
      districts={['Wabern', 'Liebefeld', 'Schliern', 'Niederscherli', 'Oberscherli', 'Spiegel']}
      stats={{
        moves: "720+",
        rating: "4.9",
        years: "14+"
      }}
      testimonials={[
        { name: "Herr und Frau Gerber", text: "Fantastischer Service! Das Team hat unseren Seniorenumzug in Liebefeld mit viel Geduld und Sorgfalt durchgeführt.", rating: 5, district: "Liebefeld" },
        { name: "Familie Bieri", text: "Professionell, pünktlich und sehr freundlich. Top!", rating: 5, district: "Wabern" },
        { name: "A. Moser", text: "Unkomplizierte Abwicklung, faire Preise. Sehr zufrieden.", rating: 5, district: "Spiegel" }
      ]}
      nearbyRoutes={[
        { from: "Köniz", to: "Bern", distance: "5 km" },
        { from: "Köniz", to: "Thun", distance: "25 km" },
        { from: "Köniz", to: "Fribourg", distance: "30 km" },
        { from: "Köniz", to: "Solothurn", distance: "35 km" }
      ]}
    />
  );
};

export default Koeniz;