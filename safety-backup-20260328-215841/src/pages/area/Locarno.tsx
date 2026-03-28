import CityLandingTemplate from '@/components/CityLandingTemplate';
import cityImage from '@/assets/city-locarno-navy-alpine.jpg';

const LocarnoPage = () => {
  return (
    <CityLandingTemplate
      city="Locarno"
      canton="Tessin"
      region="Locarno, Ascona & Lago Maggiore"
      heroImage={cityImage}
      description="Locarno e Ascona – la Riviera svizzera con il suo clima mediterraneo. Dalla Piazza Grande ai grotti montani, vi accompagniamo ovunque."
      highlights={[
        'Città Vecchia & zone pedonali',
        'Residenze di lusso sul lago',
        'Ascona & lungolago',
        'Valli ticinesi (Valle Maggia, Verzasca)'
      ]}
      testimonial={{
        text: "Trasloco impeccabile dalla Città Vecchia. Team esperto con le strade strette.",
        author: "Andrea Bentivoglio",
        location: "Locarno Città Vecchia → Muralto"
      }}
      stats={{
        moves: '178',
        rating: '4.9',
        years: '10+'
      }}
      districts={['Città Vecchia', 'Muralto', 'Minusio', 'Ascona', 'Losone', 'Brissago', 'Ronco sopra Ascona', 'Orselina', 'Solduno', 'Maggia']}
      nearbyAreas={['Bellinzona', 'Lugano', 'Ascona', 'Brissago']}
    />
  );
};

export default LocarnoPage;
