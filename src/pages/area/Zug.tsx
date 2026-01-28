import CityLandingTemplate from '@/components/CityLandingTemplate';
import cityImage from '@/assets/city-zug-navy-alpine.jpg';

const ZugPage = () => {
  return (
    <CityLandingTemplate
      city="Zug"
      canton="Zug"
      region="Crypto Valley"
      heroImage={cityImage}
      description="Diskreter Premium-Service für anspruchsvolle Kunden. Wir verstehen die besonderen Anforderungen im Wirtschaftsstandort Zug."
      highlights={[
        'Absolute Diskretion',
        'Weisser-Handschuh-Service',
        'Kunst- & Antiquitäten',
        'Expat-Betreuung'
      ]}
      testimonial={{
        text: "Perfekter Umzug in den Crypto Valley. Sehr professionell und diskret mit wertvollen Gütern.",
        author: "Michael Baumgartner",
        location: "Zürich → Zug Stadt"
      }}
      stats={{
        moves: '250+',
        rating: '4.9',
        years: '40+'
      }}
      nearbyAreas={['Zürich', 'Luzern', 'Schwyz', 'Baar']}
    />
  );
};

export default ZugPage;
