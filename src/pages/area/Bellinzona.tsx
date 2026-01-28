import CityLandingTemplate from '@/components/CityLandingTemplate';
import cityImage from '@/assets/city-bellinzona-navy-alpine.jpg';

const BellinzonaPage = () => {
  return (
    <CityLandingTemplate
      city="Bellinzona"
      canton="Tessin"
      region="Bellinzona & Alto Ticino"
      heroImage={cityImage}
      description="Bellinzona – capitale ticinese con i suoi tre castelli UNESCO. Porta delle Alpi e cuore del Ticino. Offriamo servizio completo in italiano."
      highlights={[
        'Servizio completo in italiano',
        'Centro storico & zone pedonali',
        'Esperienza con edifici storici',
        'Traslochi Bellinzona ↔ Lugano/Locarno'
      ]}
      testimonial={{
        text: "Trasloco perfetto! Team molto professionale e puntuale. Consiglio vivamente.",
        author: "Marco Bentivoglio",
        location: "Bellinzona Centro → Giubiasco"
      }}
      stats={{
        moves: '145',
        rating: '4.8',
        years: '8+'
      }}
      districts={['Centro storico', 'Daro', 'Giubiasco', 'Camorino', 'Monte Carasso', 'Sementina', 'Gudo', 'Arbedo', 'Castione', 'Claro']}
      nearbyAreas={['Lugano', 'Locarno', 'Mendrisio', 'Chiasso']}
    />
  );
};

export default BellinzonaPage;
