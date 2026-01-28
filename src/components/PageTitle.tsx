import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface PageMeta {
  title: string;
  description: string;
}

const pageMeta: Record<string, PageMeta> = {
  '/': {
    title: 'Feierabend Umzüge – Premium Umzugsservice Schweiz',
    description: 'Schweizer Familienunternehmen für professionelle Umzüge. Privat-, Büro- und Internationale Umzüge mit 40+ Jahren Erfahrung. Premium Service, faire Preise.'
  },
  '/about': {
    title: 'Über uns | Feierabend Umzüge',
    description: 'Lernen Sie unser familiengeführtes Umzugsunternehmen kennen. 40+ Jahre Erfahrung, Schweizer Qualität und persönlicher Service.'
  },
  '/plan': {
    title: 'Unsere Leistungen | Feierabend Umzüge',
    description: 'Entdecken Sie unser umfassendes Angebot: Privatumzüge, Büroumzüge, Verpackungsservice und mehr. Massgeschneiderte Lösungen für jeden Bedarf.'
  },
  '/plan/private': {
    title: 'Privatumzüge | Feierabend Umzüge',
    description: 'Professionelle Privatumzüge in der Schweiz. Stressfrei umziehen mit unserem erfahrenen Team. Jetzt Offerte anfragen.'
  },
  '/plan/office': {
    title: 'Büroumzüge | Feierabend Umzüge',
    description: 'Effiziente Büro- und Firmenumzüge. Minimale Ausfallzeiten, maximale Sicherheit für Ihre Geschäftsausstattung.'
  },
  '/plan/international': {
    title: 'Internationale Umzüge | Feierabend Umzüge',
    description: 'Weltweite Umzüge aus der Schweiz. Zollabwicklung, Transport und Lagerung - alles aus einer Hand.'
  },
  '/plan/packing': {
    title: 'Verpackungsservice | Feierabend Umzüge',
    description: 'Professioneller Verpackungsservice für Ihren Umzug. Hochwertiges Material, sorgfältige Handhabung.'
  },
  '/plan/storage': {
    title: 'Lagerung & Einlagerung | Feierabend Umzüge',
    description: 'Sichere Lagerräume für Möbel und Hausrat. Klimatisiert, überwacht und flexibel buchbar.'
  },
  '/plan/assembly': {
    title: 'Möbelmontage | Feierabend Umzüge',
    description: 'Fachgerechte Möbelmontage und -demontage. Unsere Experten kümmern sich um Ihre Einrichtung.'
  },
  '/plan/senior': {
    title: 'Seniorenumzüge | Feierabend Umzüge',
    description: 'Einfühlsame Umzugsbegleitung für Senioren. Mit Geduld und Sorgfalt in Ihr neues Zuhause.'
  },
  '/plan/vip': {
    title: 'VIP Umzugsservice | Feierabend Umzüge',
    description: 'Exklusiver Premium-Umzugsservice. Diskretion, höchste Qualität und persönliche Betreuung.'
  },
  '/plan/piano': {
    title: 'Klaviertransport & Flügeltransport | Feierabend Umzüge',
    description: 'Professioneller Klaviertransport in der Schweiz. Spezialisiertes Fachpersonal für Klaviere, Flügel und Pianos.'
  },
  '/plan/disposal': {
    title: 'Entsorgung & Räumung | Feierabend Umzüge',
    description: 'Umweltgerechte Entsorgung und Räumung. Möbelentsorgung, Haushaltsauflösung und Recycling.'
  },
  '/plan/cleaning': {
    title: 'Umzugsreinigung | Feierabend Umzüge',
    description: 'Professionelle Reinigung bei Umzug. Endreinigung, Grundreinigung und Abgabereinigung der Wohnung.'
  },
  '/plan/basic': {
    title: 'Basic Paket | Feierabend Umzüge',
    description: 'Unser günstiges Basis-Umzugspaket. Transport und Tragarbeiten zum fairen Preis.'
  },
  '/plan/half': {
    title: 'Halb-Service Paket | Feierabend Umzüge',
    description: 'Der goldene Mittelweg: Wir packen, Sie entscheiden. Flexibler Umzugsservice.'
  },
  '/plan/full': {
    title: 'Full-Service Paket | Feierabend Umzüge',
    description: 'Rundum-Sorglos-Umzug. Wir übernehmen alles von der Verpackung bis zum Aufbau.'
  },
  '/plan/student': {
    title: 'Studentenumzüge | Feierabend Umzüge',
    description: 'Günstige Umzüge für Studenten. Flexible Termine und studentenfreundliche Preise.'
  },
  '/plan/ladies': {
    title: 'Ladies Umzugsservice | Feierabend Umzüge',
    description: 'Umzugsservice speziell für Frauen. Vertrauensvolle Betreuung durch unser Damenteam.'
  },
  '/plan/compare': {
    title: 'Pakete vergleichen | Feierabend Umzüge',
    description: 'Vergleichen Sie unsere Umzugspakete und finden Sie die perfekte Lösung für Ihre Bedürfnisse.'
  },
  '/option': {
    title: 'Zusatzleistungen | Feierabend Umzüge',
    description: 'Entdecken Sie unsere Zusatzoptionen: Reinigung, Entsorgung, Handwerkerservice und mehr.'
  },
  '/option/free': {
    title: 'Kostenlose Services | Feierabend Umzüge',
    description: 'Diese Leistungen sind bei uns inklusive. Keine versteckten Kosten, volle Transparenz.'
  },
  '/option/pricing': {
    title: 'Preise & Tarife | Feierabend Umzüge',
    description: 'Transparente Preisgestaltung für alle Umzugsleistungen. Faire Konditionen ohne Überraschungen.'
  },
  '/contact': {
    title: 'Kontakt | Feierabend Umzüge',
    description: 'Kontaktieren Sie uns für eine kostenlose Offerte. Telefon, E-Mail oder Kontaktformular - wir sind für Sie da.'
  },
  '/concierge/faq': {
    title: 'Häufige Fragen (FAQ) | Feierabend Umzüge',
    description: 'Antworten auf die häufigsten Fragen zu unseren Umzugsservices. Alles was Sie wissen müssen.'
  },
  '/area/zurich': {
    title: 'Umzugsfirma Zürich | Feierabend Umzüge',
    description: 'Ihr lokaler Umzugspartner in Zürich. Kennen jede Strasse, jeden Winkel. Schnell und zuverlässig.'
  },
  '/area/basel': {
    title: 'Umzugsfirma Basel | Feierabend Umzüge',
    description: 'Professionelle Umzüge in Basel und Umgebung. Grenzüberschreitend nach Deutschland und Frankreich.'
  },
  '/area/bern': {
    title: 'Umzugsfirma Bern | Feierabend Umzüge',
    description: 'Umzugsservice in der Bundesstadt Bern. Von der Altstadt bis zum Umland.'
  },
  '/area/geneva': {
    title: 'Umzugsfirma Genf | Feierabend Umzüge',
    description: 'Déménagement à Genève. Umzüge in Genf und der Romandie. Zweisprachiger Service.'
  },
  '/area/luzern': {
    title: 'Umzugsfirma Luzern | Feierabend Umzüge',
    description: 'Umzüge in Luzern und Zentralschweiz. Vom Vierwaldstättersee bis in die Berge.'
  },
  '/area/stgallen': {
    title: 'Umzugsfirma St. Gallen | Feierabend Umzüge',
    description: 'Umzugsservice in St. Gallen und Ostschweiz. Auch grenzüberschreitend nach Österreich.'
  },
  '/area/winterthur': {
    title: 'Umzugsfirma Winterthur | Feierabend Umzüge',
    description: 'Lokale Umzüge in Winterthur. Ihr zuverlässiger Partner für Stadt und Region.'
  },
  '/area/lausanne': {
    title: 'Umzugsfirma Lausanne | Feierabend Umzüge',
    description: 'Service de déménagement à Lausanne. Umzüge am Genfersee und in der Westschweiz.'
  },
  '/guide': {
    title: 'Umzugsratgeber & Blog | Feierabend Umzüge',
    description: 'Tipps und Tricks für Ihren Umzug. Checklisten, Ratgeber und nützliche Informationen.'
  },
  '/calculator': {
    title: 'Umzugskostenrechner | Feierabend Umzüge',
    description: 'Berechnen Sie die Kosten für Ihren Umzug online. Schnell, einfach und unverbindlich.'
  },
  '/checklist': {
    title: 'Umzugscheckliste | Feierabend Umzüge',
    description: 'Die ultimative Checkliste für Ihren Umzug. Nichts vergessen, alles im Griff.'
  },
  '/gallery': {
    title: 'Bildergalerie | Feierabend Umzüge',
    description: 'Einblicke in unsere Arbeit. Sehen Sie unsere Projekte und unser Team in Aktion.'
  },
  '/fleet': {
    title: 'Unsere Flotte | Feierabend Umzüge',
    description: 'Moderne Fahrzeugflotte für jeden Umzug. Vom Transporter bis zum LKW.'
  },
  '/team': {
    title: 'Unser Team | Feierabend Umzüge',
    description: 'Lernen Sie unser erfahrenes Umzugsteam kennen. Profis mit Herz und Verstand.'
  },
  '/references': {
    title: 'Referenzen & Bewertungen | Feierabend Umzüge',
    description: 'Was unsere Kunden über uns sagen. Echte Bewertungen und Erfahrungsberichte.'
  },
  '/booking': {
    title: 'Online Buchen | Feierabend Umzüge',
    description: 'Buchen Sie Ihren Umzug bequem online. Schnelle Terminbestätigung und faire Preise.'
  },
  '/map': {
    title: 'Servicegebiet Schweiz | Feierabend Umzüge',
    description: 'Wir sind in der ganzen Schweiz für Sie da. Interaktive Karte unseres Servicegebiets.'
  },
  '/portal': {
    title: 'Kundenportal | Feierabend Umzüge',
    description: 'Verwalten Sie Ihren Umzug online. Status, Dokumente und Kommunikation an einem Ort.'
  },
  '/dashboard': {
    title: 'Dashboard | Feierabend Umzüge',
    description: 'Ihr persönliches Umzugs-Dashboard. Alle wichtigen Informationen auf einen Blick.'
  },
  '/tracking': {
    title: 'Umzug verfolgen | Feierabend Umzüge',
    description: 'Verfolgen Sie Ihren Umzug in Echtzeit. Live-Status und Updates.'
  },
  '/tools': {
    title: 'Umzugs-Tools | Feierabend Umzüge',
    description: 'Nützliche Tools für Ihren Umzug: Rechner, Planer und Checklisten.'
  },
  '/my-moves': {
    title: 'Meine Umzüge | Feierabend Umzüge',
    description: 'Übersicht über Ihre gebuchten Umzüge. Historie und aktuelle Aufträge.'
  },
  '/auth': {
    title: 'Anmelden | Feierabend Umzüge',
    description: 'Melden Sie sich an oder erstellen Sie ein Konto für Ihr persönliches Kundenportal.'
  },
  '/impressum': {
    title: 'Impressum | Feierabend Umzüge',
    description: 'Rechtliche Informationen und Impressum der Feierabend Umzüge GmbH.'
  },
  '/datenschutz': {
    title: 'Datenschutz | Feierabend Umzüge',
    description: 'Informationen zum Datenschutz und zur Verarbeitung Ihrer personenbezogenen Daten.'
  },
  '/agb': {
    title: 'AGB | Feierabend Umzüge',
    description: 'Allgemeine Geschäftsbedingungen der Feierabend Umzüge GmbH für Umzugsdienstleistungen in der Schweiz.'
  },
};

const defaultMeta: PageMeta = {
  title: 'Feierabend Umzüge | Premium Umzugsservice Schweiz',
  description: 'Feierabend Umzüge - Ihr Premium Umzugsservice in der Schweiz. Familiengeführt, zuverlässig und professionell.'
};

const PageTitle = () => {
  const location = useLocation();

  useEffect(() => {
    // Handle dynamic routes like /guide/:slug and /move/:id
    let meta = pageMeta[location.pathname];
    
    if (!meta) {
      // Check for dynamic routes
      if (location.pathname.startsWith('/guide/')) {
        meta = {
          title: 'Ratgeber | Feierabend Umzüge',
          description: 'Lesen Sie unseren Umzugsratgeber mit wertvollen Tipps und Informationen.'
        };
      } else if (location.pathname.startsWith('/move/')) {
        meta = {
          title: 'Umzugsdetails | Feierabend Umzüge',
          description: 'Details zu Ihrem Umzugsauftrag.'
        };
      } else {
        meta = defaultMeta;
      }
    }
    
    // Update title
    document.title = meta.title;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', meta.description);
    }
    
    // Update OG tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogTitle) ogTitle.setAttribute('content', meta.title);
    if (ogDescription) ogDescription.setAttribute('content', meta.description);
    
    // Update Twitter tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterTitle) twitterTitle.setAttribute('content', meta.title);
    if (twitterDescription) twitterDescription.setAttribute('content', meta.description);
    
    // Update canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', `https://feierabend-umzuege.ch${location.pathname}`);
    }
  }, [location.pathname]);

  return null;
};

export default PageTitle;