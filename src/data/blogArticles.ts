import checklistImage from "@/assets/blog-checklist-new.jpg";
import packingImage from "@/assets/blog-packing-new.jpg";
import costsImage from "@/assets/blog-costs.jpg";
import familyImage from "@/assets/blog-family-move.jpg";
import antiquesImage from "@/assets/blog-antiques.jpg";
import seniorImage from "@/assets/blog-senior.jpg";
import homeofficeImage from "@/assets/blog-homeoffice.jpg";
import ecoImage from "@/assets/blog-eco.jpg";

export interface BlogArticle {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  readTime: string;
  date: string;
  content: BlogSection[];
  metaDescription: string;
}

export interface BlogSection {
  type: 'paragraph' | 'heading' | 'list' | 'tip' | 'card';
  content?: string;
  items?: string[];
  title?: string;
}

export const blogArticles: BlogArticle[] = [
  {
    slug: "umzugscheckliste-schweiz",
    title: "Die ultimative Umzugscheckliste für die Schweiz",
    excerpt: "Mit unserer detaillierten Checkliste vergessen Sie nichts. Von 8 Wochen vor dem Umzug bis zum ersten Tag im neuen Zuhause.",
    image: checklistImage,
    category: "Planung",
    readTime: "8 min",
    date: "15. März 2025",
    metaDescription: "Komplette Umzugscheckliste für die Schweiz: Alle wichtigen Schritte von 8 Wochen vor dem Umzug bis zur Einwohnerummeldung. Jetzt kostenlos herunterladen!",
    content: [
      { type: 'paragraph', content: 'Ein Umzug in der Schweiz erfordert sorgfältige Planung. Mit unserer bewährten Checkliste behalten Sie alle wichtigen Termine und Aufgaben im Blick – vom Kündigungsschreiben bis zur Ummeldung bei der Einwohnerkontrolle.' },
      { type: 'heading', content: '8 Wochen vor dem Umzug' },
      { type: 'list', items: ['Mietvertrag für neue Wohnung unterschreiben', 'Kündigungsfrist alte Wohnung prüfen und kündigen', 'Umzugsfirma kontaktieren und Termine vergleichen', 'Schulen/Kindergärten ummelden', 'Grobe Inventarliste erstellen', 'Budget für Umzugskosten planen'] },
      { type: 'heading', content: '6 Wochen vor dem Umzug' },
      { type: 'list', items: ['Adressänderungen vorbereiten (Post, Behörden, Versicherungen)', 'Kabel-/Internet-Anbieter über Umzug informieren', 'Entrümpelung planen – Was kann weg?', 'Umzugskartons und Material besorgen', 'Parkplatzbewilligung beantragen', 'Sperrgut-Entsorgung organisieren'] },
      { type: 'heading', content: '4 Wochen vor dem Umzug' },
      { type: 'list', items: ['Packen beginnen (Keller, Estrich, Nicht-Alltägliches)', 'Nachsendeauftrag bei der Post einrichten', 'Stromablesung koordinieren', 'Malertermine vereinbaren (falls nötig)', 'Helfer organisieren (falls Eigenleistung)', 'Versicherungsschutz prüfen'] },
      { type: 'heading', content: '1 Woche vor dem Umzug' },
      { type: 'list', items: ['Letzte Gegenstände packen', 'Kühlschrank abtauen', 'Erste-Hilfe-Karton vorbereiten', 'Umzugsgut beschriften', 'Plan für neue Wohnung erstellen', 'Wichtige Dokumente griffbereit halten'] },
      { type: 'heading', content: 'Am Umzugstag' },
      { type: 'card', title: 'Wichtige Aufgaben', items: ['Zählerstände notieren (Strom, Wasser, Gas)', 'Wohnungsübergabe alte Wohnung', 'Möbel und Kartons transportieren', 'Wohnungsübernahme neue Wohnung', 'Möbel aufstellen und einrichten'] },
      { type: 'heading', content: 'Nach dem Umzug' },
      { type: 'list', items: ['Umzug bei Einwohnerkontrolle melden (innerhalb 14 Tagen)', 'Auto ummelden', 'Arzt, Zahnarzt über neue Adresse informieren', 'Abos und Mitgliedschaften aktualisieren', 'In Ruhe auspacken und einrichten'] },
      { type: 'tip', content: 'Starten Sie früh genug mit der Planung! Je mehr Zeit Sie haben, desto entspannter wird Ihr Umzug. Professionelle Hilfe spart oft Zeit, Nerven und am Ende auch Geld.' }
    ]
  },
  {
    slug: "richtig-packen-tipps",
    title: "Richtig packen: Profitipps vom Umzugsprofi",
    excerpt: "Wie packt man Geschirr, Bücher und Kleider richtig? Unsere Experten verraten ihre besten Tricks für sicheres Verpacken.",
    image: packingImage,
    category: "Tipps",
    readTime: "6 min",
    date: "10. März 2025",
    metaDescription: "Professionelle Packtipps für Ihren Umzug: So verpacken Sie Geschirr, Bücher und empfindliche Gegenstände sicher. Experten-Tricks von Feierabend Umzüge.",
    content: [
      { type: 'paragraph', content: 'Richtiges Packen ist die halbe Miete bei einem erfolgreichen Umzug. Unsere erfahrenen Umzugsprofis teilen ihre besten Techniken, die sie in über 40 Jahren Erfahrung perfektioniert haben.' },
      { type: 'heading', content: 'Grundregeln für effizientes Packen' },
      { type: 'list', items: ['Schwere Gegenstände in kleine Kartons', 'Leichte Gegenstände in grosse Kartons', 'Jeden Karton klar beschriften', 'Hohlräume mit Packpapier füllen', 'Maximales Kartongewicht: 20-25 kg'] },
      { type: 'heading', content: 'Geschirr und Gläser' },
      { type: 'paragraph', content: 'Geschirr ist besonders empfindlich und erfordert sorgfältiges Einpacken. Verwenden Sie spezielle Geschirrkartons mit Unterteilungen oder wickeln Sie jeden Teller einzeln in Packpapier.' },
      { type: 'list', items: ['Teller hochkant stellen, nicht stapeln', 'Gläser einzeln einwickeln', 'Zwischenräume mit Zeitungspapier füllen', 'Karton als "Zerbrechlich" markieren', 'Nicht zu voll packen'] },
      { type: 'heading', content: 'Bücher und schwere Gegenstände' },
      { type: 'paragraph', content: 'Bücher sind schwerer als man denkt. Verwenden Sie kleine Kartons und mischen Sie schwere und leichte Gegenstände.' },
      { type: 'list', items: ['Bücherkartons nur halb füllen', 'Oben mit leichten Gegenständen auffüllen', 'Wertvolle Bücher extra schützen', 'Keine Kartons überladen'] },
      { type: 'heading', content: 'Kleidung' },
      { type: 'list', items: ['Kleiderboxen für Anzüge und Kleider', 'Schuhe in Originalkartons oder Stoffbeuteln', 'Saisonale Kleidung separat verpacken', 'Koffer und Taschen als zusätzliche Behälter nutzen'] },
      { type: 'tip', content: 'Investieren Sie in hochwertige Umzugskartons. Alte Bananenkisten oder Kartons vom Supermarkt sind oft instabil und können während des Transports zusammenbrechen.' }
    ]
  },
  {
    slug: "kosten-umzug-schweiz",
    title: "Was kostet ein Umzug in der Schweiz?",
    excerpt: "Transparente Übersicht aller Kostenfaktoren. So kalkulieren Sie Ihr Umzugsbudget richtig.",
    image: costsImage,
    category: "Kosten",
    readTime: "7 min",
    date: "5. März 2025",
    metaDescription: "Umzugskosten Schweiz: Komplette Preisübersicht für Umzüge in Zürich, Basel, Bern. Kostenfaktoren, Spartipps und Preisvergleich. Jetzt informieren!",
    content: [
      { type: 'paragraph', content: 'Die Kosten für einen Umzug in der Schweiz variieren stark je nach Umfang, Distanz und gewähltem Service. Wir geben Ihnen einen transparenten Überblick über alle Kostenfaktoren.' },
      { type: 'heading', content: 'Kostenfaktoren im Überblick' },
      { type: 'list', items: ['Wohnungsgrösse und Anzahl Zimmer', 'Distanz zwischen den Wohnungen', 'Stockwerk und Liftverfügbarkeit', 'Gewählter Serviceumfang', 'Termin (Wochenende/Monatsende teurer)', 'Zusatzleistungen (Packen, Montage)'] },
      { type: 'heading', content: 'Durchschnittliche Kosten' },
      { type: 'paragraph', content: 'Ein Umzug einer 3-Zimmer-Wohnung innerhalb derselben Stadt kostet bei einer professionellen Umzugsfirma durchschnittlich CHF 1\'500 bis CHF 3\'000. Internationale Umzüge können je nach Ziel deutlich teurer sein.' },
      { type: 'card', title: 'Preisbeispiele', items: ['1-Zimmer-Wohnung: CHF 600 - 1\'200', '2-3-Zimmer-Wohnung: CHF 1\'200 - 2\'500', '4-5-Zimmer-Wohnung: CHF 2\'500 - 4\'500', 'Einfamilienhaus: CHF 3\'500 - 7\'000'] },
      { type: 'heading', content: 'Versteckte Kosten vermeiden' },
      { type: 'list', items: ['Kaution für neue Wohnung einplanen', 'Doppelmiete während Übergangszeit', 'Renovierungskosten alte Wohnung', 'Nachreinigung', 'Ummeldungen und Gebühren', 'Neue Möbel und Einrichtung'] },
      { type: 'heading', content: 'Spartipps' },
      { type: 'list', items: ['Umzug unter der Woche planen', 'Mitte des Monats umziehen', 'Selbst packen, Transport durch Profis', 'Entrümpeln reduziert Volumen', 'Mehrere Offerten einholen'] },
      { type: 'tip', content: 'Fordern Sie immer mehrere Offerten an und vergleichen Sie nicht nur den Preis, sondern auch den Leistungsumfang. Das günstigste Angebot ist nicht immer das beste.' }
    ]
  },
  {
    slug: "umzug-mit-kindern",
    title: "Umzug mit Kindern: So wird's stressfrei",
    excerpt: "Tipps und Tricks, wie Sie Kinder auf den Umzug vorbereiten und den Tag für alle entspannt gestalten.",
    image: familyImage,
    category: "Familie",
    readTime: "5 min",
    date: "1. März 2025",
    metaDescription: "Umzug mit Kindern meistern: Praktische Tipps zur Vorbereitung, kindgerechte Erklärungen und Strategien für einen stressfreien Familienumzug.",
    content: [
      { type: 'paragraph', content: 'Ein Umzug ist für Kinder eine grosse Veränderung. Mit der richtigen Vorbereitung und etwas Einfühlungsvermögen können Sie den Übergang für Ihre Familie so angenehm wie möglich gestalten.' },
      { type: 'heading', content: 'Kinder vorbereiten' },
      { type: 'list', items: ['Frühzeitig über den Umzug sprechen', 'Das neue Zuhause gemeinsam besuchen', 'Neue Nachbarschaft erkunden', 'Positive Aspekte betonen', 'Gefühle ernst nehmen und besprechen'] },
      { type: 'heading', content: 'Altersgerechte Kommunikation' },
      { type: 'paragraph', content: 'Je nach Alter verstehen Kinder den Umzug unterschiedlich. Kleinkinder brauchen vor allem Sicherheit und bekannte Gegenstände, während ältere Kinder mehr Informationen und Mitsprache brauchen.' },
      { type: 'list', items: ['Kleinkinder: Lieblingsspielzeug immer griffbereit', 'Grundschulkinder: Beim Packen helfen lassen', 'Teenager: In Entscheidungen einbeziehen', 'Allen: Eigenes Zimmer zuerst einrichten'] },
      { type: 'heading', content: 'Am Umzugstag' },
      { type: 'list', items: ['Betreuung für kleine Kinder organisieren', 'Kinder-Notfallbox packen (Snacks, Spielzeug, Wechselkleidung)', 'Feste Aufgaben für ältere Kinder', 'Regelmässige Pausen einplanen', 'Abends etwas Vertrautes (Pizza, Lieblingsserie)'] },
      { type: 'heading', content: 'Nach dem Umzug' },
      { type: 'list', items: ['Kinderzimmer als erstes einrichten', 'Gewohnte Routinen beibehalten', 'Kontakt zu alten Freunden ermöglichen', 'Neue Umgebung gemeinsam erkunden', 'Geduld haben – Eingewöhnung braucht Zeit'] },
      { type: 'tip', content: 'Lassen Sie Ihr Kind eine "Erinnerungsbox" packen mit Fotos, kleinen Andenken und einer Zeichnung des alten Zuhauses. Das hilft beim Verarbeiten des Abschieds.' }
    ]
  },
  {
    slug: "antiquitaeten-sicher-transportieren",
    title: "Antiquitäten und Kunstwerke sicher transportieren",
    excerpt: "Wertvolle Gegenstände erfordern besondere Sorgfalt. So schützen Sie Ihre Schätze beim Umzug optimal.",
    image: antiquesImage,
    category: "Tipps",
    readTime: "7 min",
    date: "25. Februar 2025",
    metaDescription: "Antiquitäten sicher transportieren: Professionelle Techniken für Kunstwerke, antike Möbel und Wertgegenstände. Versicherungstipps inklusive.",
    content: [
      { type: 'paragraph', content: 'Antiquitäten, Kunstwerke und wertvolle Erbstücke erfordern beim Umzug besondere Aufmerksamkeit. Mit den richtigen Techniken und Materialien schützen Sie Ihre Schätze optimal.' },
      { type: 'heading', content: 'Vorbereitung ist alles' },
      { type: 'list', items: ['Inventarliste mit Fotos erstellen', 'Wertgutachten aktualisieren', 'Versicherungsschutz prüfen und anpassen', 'Klimabedingungen während Transport beachten', 'Spezialisten für besonders wertvolle Stücke'] },
      { type: 'heading', content: 'Gemälde und Kunstwerke' },
      { type: 'list', items: ['Niemals Glas direkt berühren', 'Säurefreies Papier verwenden', 'Spezielle Bilderkartons oder Holzkisten', 'Hochkant transportieren, nie flach stapeln', 'Klimakontrollierter Transport bei empfindlichen Werken'] },
      { type: 'heading', content: 'Antike Möbel' },
      { type: 'list', items: ['Schubladen und Türen sichern', 'Beine und fragile Teile demontieren', 'Möbeldecken statt Plastikfolie (atmungsaktiv)', 'Polsterung an Ecken und Kanten', 'Vorsicht bei Furnieren und Intarsien'] },
      { type: 'heading', content: 'Porzellan und Keramik' },
      { type: 'list', items: ['Jedes Teil einzeln einwickeln', 'Säurefreies Seidenpapier verwenden', 'Hohlräume mit weichem Material füllen', 'Schwere Teile unten, leichte oben', 'Als "Zerbrechlich" und "Oben" markieren'] },
      { type: 'heading', content: 'Versicherung' },
      { type: 'paragraph', content: 'Prüfen Sie vor dem Umzug Ihren Versicherungsschutz. Standard-Umzugsversicherungen decken oft nur einen begrenzten Wert ab. Für hochwertige Antiquitäten empfehlen wir eine separate Kunsttransportversicherung.' },
      { type: 'tip', content: 'Bei besonders wertvollen oder empfindlichen Stücken empfehlen wir unseren VIP-Service mit klimatisiertem Transport und White-Glove-Handling durch spezialisierte Kunstspediteure.' }
    ]
  },
  {
    slug: "seniorenumzug-planen",
    title: "Seniorenumzug: Einfühlsam und stressfrei",
    excerpt: "Besondere Bedürfnisse erfordern besondere Aufmerksamkeit. Tipps für einen gelungenen Umzug im Alter.",
    image: seniorImage,
    category: "Familie",
    readTime: "6 min",
    date: "20. Februar 2025",
    metaDescription: "Seniorenumzug planen: Einfühlsame Begleitung, praktische Tipps und Checkliste für den Umzug ins Alter. Spezialisierte Unterstützung von Feierabend Umzüge.",
    content: [
      { type: 'paragraph', content: 'Ein Umzug im Seniorenalter bringt besondere Herausforderungen mit sich. Oft ist es der Abschied vom langjährigen Zuhause, verbunden mit vielen Erinnerungen. Unser einfühlsames Team begleitet Sie durch diesen wichtigen Lebensabschnitt.' },
      { type: 'heading', content: 'Emotionale Vorbereitung' },
      { type: 'list', items: ['Zeit für den Abschied nehmen', 'Erinnerungsstücke sorgfältig auswählen', 'Familie und Freunde einbeziehen', 'Das neue Zuhause positiv gestalten', 'Professionelle Hilfe annehmen'] },
      { type: 'heading', content: 'Praktische Planung' },
      { type: 'list', items: ['Frühzeitig mit der Planung beginnen', 'Gesundheitliche Einschränkungen berücksichtigen', 'Medikamente und wichtige Dokumente separat packen', 'Neue Wohnung barrierefrei einrichten', 'Notfallinformationen griffbereit halten'] },
      { type: 'heading', content: 'Entrümpeln mit Bedacht' },
      { type: 'paragraph', content: 'Nach vielen Jahren im selben Zuhause sammeln sich viele Dinge an. Das Aussortieren sollte behutsam erfolgen, ohne Druck. Nehmen Sie sich Zeit für diese wichtige Aufgabe.' },
      { type: 'list', items: ['Gemeinsam mit Familie sortieren', 'Erinnerungsstücke fotografieren', 'Wertsachen an Angehörige weitergeben', 'Spenden statt wegwerfen', 'Professionelle Entrümpelung beauftragen'] },
      { type: 'heading', content: 'Am Umzugstag' },
      { type: 'list', items: ['Persönliche Begleitung organisieren', 'Regelmässige Pausen einplanen', 'Wichtige Gegenstände sofort auspacken', 'Bekannte Möbel ähnlich aufstellen', 'Erste Nacht komfortabel gestalten'] },
      { type: 'tip', content: 'Unser spezialisiertes Seniorenumzugs-Team ist geschult im einfühlsamen Umgang und nimmt sich die Zeit, die Sie brauchen. Wir übernehmen auch gerne das komplette Auspacken und Einräumen.' }
    ]
  },
  {
    slug: "homeoffice-umzug",
    title: "Home-Office beim Umzug: Produktiv bleiben",
    excerpt: "So organisieren Sie Arbeit und Umzug parallel. Praktische Tipps für das Arbeiten während der Umzugsphase.",
    image: homeofficeImage,
    category: "Tipps",
    readTime: "5 min",
    date: "15. Februar 2025",
    metaDescription: "Home-Office während dem Umzug: So bleiben Sie produktiv. Tipps für die Arbeitsplatz-Planung, Internet-Setup und Work-Life-Balance beim Umziehen.",
    content: [
      { type: 'paragraph', content: 'Ein Umzug während Sie im Home-Office arbeiten? Das erfordert gute Organisation, ist aber machbar. Mit unseren Tipps bleiben Sie produktiv und behalten den Überblick.' },
      { type: 'heading', content: 'Planung ist entscheidend' },
      { type: 'list', items: ['Arbeitgeber frühzeitig informieren', 'Wichtige Deadlines notieren', 'Wenn möglich Ferientage einplanen', 'Internet-Anschluss priorisieren', 'Backup-Arbeitsort organisieren (Coworking, Café)'] },
      { type: 'heading', content: 'Arbeitsplatz zuerst einrichten' },
      { type: 'paragraph', content: 'Richten Sie Ihren Arbeitsplatz als erstes in der neuen Wohnung ein. So können Sie schnell wieder produktiv sein, auch wenn der Rest noch im Chaos liegt.' },
      { type: 'list', items: ['Arbeitsbereich als Priority markieren', 'Büromaterial separat verpacken', 'Technik (Laptop, Monitor) selbst transportieren', 'Ergonomie auch im Übergang beachten', 'Gute Beleuchtung sicherstellen'] },
      { type: 'heading', content: 'Internet-Kontinuität' },
      { type: 'list', items: ['Neuen Anschluss früh bestellen (4-6 Wochen)', 'Überlappende Verträge prüfen', 'Mobile Hotspot als Backup', 'Wichtige Cloud-Dokumente offline verfügbar machen', 'Videokonferenzen vorübergehend reduzieren'] },
      { type: 'heading', content: 'Work-Life-Balance' },
      { type: 'list', items: ['Klare Grenzen zwischen Arbeit und Umzug', 'Feste Arbeitszeiten auch im Chaos', 'Pausen für Umzugsaufgaben einplanen', 'Abends wirklich abschalten', 'Hilfe annehmen (Umzugsfirma, Freunde)'] },
      { type: 'tip', content: 'Kommunizieren Sie offen mit Ihrem Team und Vorgesetzten. Die meisten haben Verständnis, wenn Sie während des Umzugs etwas weniger erreichbar sind. Transparenz schafft Vertrauen.' }
    ]
  },
  {
    slug: "nachhaltiger-umzug",
    title: "Nachhaltig umziehen: Öko-Tipps",
    excerpt: "Umweltfreundlich umziehen ist möglich. Entdecken Sie nachhaltige Alternativen für Verpackung und Transport.",
    image: ecoImage,
    category: "Tipps",
    readTime: "6 min",
    date: "10. Februar 2025",
    metaDescription: "Nachhaltig umziehen: Öko-Tipps für umweltfreundliche Verpackung, Transport und Entsorgung. Grüne Alternativen für Ihren Umzug in der Schweiz.",
    content: [
      { type: 'paragraph', content: 'Ein Umzug muss nicht mit Bergen von Kartons und Plastik verbunden sein. Mit ein paar cleveren Entscheidungen können Sie Ihren ökologischen Fussabdruck reduzieren – gut für die Umwelt und oft auch für den Geldbeutel.' },
      { type: 'heading', content: 'Nachhaltige Verpackung' },
      { type: 'list', items: ['Wiederverwendbare Umzugsboxen mieten', 'Vorhandene Kartons und Zeitungen nutzen', 'Textilien als Polstermaterial verwenden', 'Koffer, Taschen und Körbe zum Packen nutzen', 'Plastikfolie vermeiden – Möbeldecken nutzen'] },
      { type: 'heading', content: 'Entrümpeln mit Sinn' },
      { type: 'paragraph', content: 'Weniger transportieren bedeutet weniger CO2. Nutzen Sie den Umzug als Chance, bewusst auszusortieren – und geben Sie Dingen ein zweites Leben.' },
      { type: 'list', items: ['Gut erhaltene Dinge verkaufen (Ricardo, tutti.ch)', 'An Sozialkaufhäuser spenden', 'Nachbarn und Freunde beschenken', 'Recycling statt Müll', 'Reparieren statt wegwerfen'] },
      { type: 'heading', content: 'Umweltfreundlicher Transport' },
      { type: 'list', items: ['Umzugsfirma mit modernem Fuhrpark wählen', 'Touren optimieren – weniger Fahrten', 'Auf Elektro- oder Gas-Fahrzeuge achten', 'Bei kurzen Distanzen: Lastenvelo nutzen', 'Sammeltransport bei Teilumzügen'] },
      { type: 'heading', content: 'Im neuen Zuhause' },
      { type: 'list', items: ['Secondhand-Möbel statt neu kaufen', 'Lokale Handwerker für Reparaturen', 'Energieeffiziente Geräte anschaffen', 'Ökostrom-Anbieter wählen', 'Nachhaltige Putzmittel verwenden'] },
      { type: 'heading', content: 'Unsere grünen Initiativen' },
      { type: 'paragraph', content: 'Bei Feierabend Umzüge setzen wir auf Nachhaltigkeit: Unser Fuhrpark wird laufend modernisiert, wir bieten wiederverwendbare Umzugsboxen an und arbeiten mit lokalen Recycling-Partnern zusammen.' },
      { type: 'tip', content: 'Fragen Sie nach unserem "Grünen Umzug"-Paket mit wiederverwendbaren Boxen, Öko-Verpackungsmaterial und CO2-kompensiertem Transport. Gut für Ihr Gewissen und die Umwelt!' }
    ]
  },
  {
    slug: "klaviertransport-tipps",
    title: "Klaviertransport: 10 wichtige Tipps für den sicheren Transport",
    excerpt: "Ein Klavier zu transportieren erfordert Fachwissen und die richtige Ausrüstung. Erfahren Sie, worauf Sie beim Klaviertransport achten müssen.",
    image: antiquesImage,
    category: "Tipps",
    readTime: "8 min",
    date: "9. Dezember 2024",
    metaDescription: "Klaviertransport Tipps: So transportieren Sie Ihr Klavier oder Flügel sicher. Professionelle Anleitung von Feierabend Umzüge.",
    content: [
      { type: 'paragraph', content: 'Ein Klavier ist nicht nur ein wertvolles Möbelstück – es ist ein empfindliches Musikinstrument mit tausenden beweglichen Teilen. Ein unsachgemässer Transport kann zu Verstimmung, Beschädigung der Mechanik oder Kratzern führen.' },
      { type: 'heading', content: 'Warum professioneller Klaviertransport?' },
      { type: 'list', items: ['Ein aufrechtes Klavier wiegt 150-300 kg', 'Ein Flügel kann bis zu 500 kg wiegen', 'Empfindliche Mechanik mit tausenden Teilen', 'Saiten können bei Erschütterung verstimmen oder brechen'] },
      { type: 'heading', content: 'Die 10 wichtigsten Tipps' },
      { type: 'list', items: ['Beauftragen Sie Profis mit Spezialausrüstung', 'Schliessen und sichern Sie den Tastaturdeckel', 'Wickeln Sie das Klavier in Spezialdecken', 'Niemals alleine tragen – mind. 3-4 Personen', 'Prüfen Sie Türbreiten und Treppenhausabmessungen', 'Bei Bedarf Möbellift einsetzen', 'Klimatisierten Transport bei 15-25°C wählen', 'Nicht auf den Rollen transportieren', '2-3 Wochen Akklimatisierung vor dem Stimmen', 'Stimmtermin im Voraus vereinbaren'] },
      { type: 'heading', content: 'Versicherung' },
      { type: 'paragraph', content: 'Bei Feierabend Umzüge sind Klaviere und Flügel während des Transports bis CHF 100\'000 versichert. Für besonders wertvolle Instrumente erstellen wir individuelle Versicherungslösungen.' },
      { type: 'tip', content: 'Fotografieren Sie den Zustand Ihres Klaviers vor dem Transport für Ihre Unterlagen. Dies ist wichtig für Versicherungszwecke.' }
    ]
  },
  {
    slug: "umzugsreinigung-checkliste",
    title: "Umzugsreinigung: Die ultimative Checkliste für die Wohnungsübergabe",
    excerpt: "Mit unserer Checkliste für die Umzugsreinigung bekommen Sie garantiert Ihre Kaution zurück. Alle wichtigen Punkte für die perfekte Endreinigung.",
    image: checklistImage,
    category: "Checkliste",
    readTime: "6 min",
    date: "8. Dezember 2024",
    metaDescription: "Umzugsreinigung Checkliste: So bekommen Sie Ihre Kaution zurück. Komplette Anleitung für Küche, Bad und alle Räume.",
    content: [
      { type: 'paragraph', content: 'Eine gründliche Umzugsreinigung ist entscheidend, um Ihre Mietkaution zurückzubekommen. Hier ist unsere erprobte Checkliste für die perfekte Endreinigung.' },
      { type: 'heading', content: 'Küche' },
      { type: 'list', items: ['Backofen innen und aussen reinigen', 'Kühlschrank und Gefrierfach abtauen und reinigen', 'Dunstabzugshaube und Filter reinigen', 'Alle Schränke innen auswischen', 'Arbeitsflächen und Fliesen reinigen', 'Spüle und Armaturen entkalken'] },
      { type: 'heading', content: 'Badezimmer' },
      { type: 'list', items: ['WC gründlich reinigen inkl. unter dem Rand', 'Dusche/Badewanne entkalken', 'Fugen reinigen', 'Spiegel streifenfrei putzen', 'Waschbecken und Armaturen polieren', 'Lüftungsgitter reinigen'] },
      { type: 'heading', content: 'Alle Räume' },
      { type: 'list', items: ['Fenster innen und aussen putzen', 'Fensterrahmen und -bänke reinigen', 'Heizkörper abstauben', 'Steckdosen und Lichtschalter abwischen', 'Türen und Türrahmen reinigen', 'Sockelleisten abwischen'] },
      { type: 'heading', content: 'Profi-Tipps' },
      { type: 'list', items: ['Von oben nach unten arbeiten', 'Genug Zeit einplanen (4-6 Stunden für 3-Zi-Whg)', 'Die richtigen Mittel verwenden'] },
      { type: 'tip', content: 'Mit unserer professionellen Umzugsreinigung erhalten Sie eine Abnahmegarantie. Sollte die Verwaltung Mängel finden, bessern wir kostenlos nach!' }
    ]
  },
  {
    slug: "moebel-verpacken-anleitung",
    title: "Möbel richtig verpacken: Schritt-für-Schritt Anleitung",
    excerpt: "So verpacken Sie Ihre Möbel und Habseligkeiten professionell für den Umzug. Mit unseren Tipps kommt alles sicher an.",
    image: packingImage,
    category: "Anleitung",
    readTime: "7 min",
    date: "7. Dezember 2024",
    metaDescription: "Möbel richtig verpacken: Professionelle Anleitung für sicheres Verpacken. Tipps für Gläser, Elektronik und empfindliche Gegenstände.",
    content: [
      { type: 'paragraph', content: 'Professionelles Verpacken schützt Ihre Habseligkeiten und erleichtert das Auspacken. Hier unsere Experten-Tipps für sicheres Verpacken.' },
      { type: 'heading', content: 'Grundausstattung' },
      { type: 'list', items: ['Stabile Umzugskartons in verschiedenen Grössen', 'Luftpolsterfolie', 'Packpapier (keine Zeitung wegen Druckerschwärze!)', 'Klebeband und Marker für Beschriftung'] },
      { type: 'heading', content: 'Kartons richtig packen' },
      { type: 'list', items: ['Schwere Gegenstände unten, leichte oben', 'Hohlräume mit Papier oder Luftpolster füllen', 'Maximales Kartongewicht: 20 kg', 'Jeden Karton klar beschriften'] },
      { type: 'heading', content: 'Gläser und Geschirr' },
      { type: 'list', items: ['Jeden Gegenstand einzeln einwickeln', 'Gläser mit Papier ausstopfen', 'Aufrecht stellen, nicht legen', '"ZERBRECHLICH" deutlich markieren'] },
      { type: 'heading', content: 'Elektronik' },
      { type: 'list', items: ['Originalverpackung verwenden wenn möglich', 'Kabel beschriften und zusammenbinden', 'Bildschirme mit Decken schützen', 'Fernseher stehend transportieren'] },
      { type: 'tip', content: 'Keine Zeit zum Verpacken? Unser Verpackungsservice übernimmt alles – inklusive hochwertigem Material und systematischer Beschriftung.' }
    ]
  },
  {
    slug: "moebellift-wann-sinnvoll",
    title: "Möbellift: Wann lohnt sich der Einsatz?",
    excerpt: "Enge Treppenhäuser, sperrige Möbel? Ein Möbellift kann die Lösung sein. Erfahren Sie, wann sich der Einsatz lohnt.",
    image: homeofficeImage,
    category: "Ratgeber",
    readTime: "5 min",
    date: "4. Dezember 2024",
    metaDescription: "Möbellift Einsatz: Wann lohnt sich ein Aussenlift beim Umzug? Kosten, Vorteile und Voraussetzungen erklärt.",
    content: [
      { type: 'paragraph', content: 'Ein Möbellift (auch Aussenlift genannt) transportiert Ihre Möbel über Balkon oder Fenster – oft die einzige Lösung in Altbauten mit engen Treppenhäusern.' },
      { type: 'heading', content: 'Typische Situationen für einen Möbellift' },
      { type: 'list', items: ['Enge Treppenhäuser und Wendeltreppen', 'Sperrige Möbel (L-Sofas, Schränke, Boxspringbetten)', 'Klaviere und Flügel', 'Höhere Stockwerke – schneller als tragen'] },
      { type: 'heading', content: 'Vorteile des Möbellifts' },
      { type: 'list', items: ['Schonend für Möbel und Gebäude', 'Schneller als Treppenhaustransport', 'Weniger Personal nötig', 'Kein Risiko für Treppenhausschäden'] },
      { type: 'heading', content: 'Voraussetzungen' },
      { type: 'list', items: ['Balkon oder grosses Fenster vorhanden', 'Platz auf der Strasse für den Lift', 'Ggf. Kurzzeit-Halteverbot beantragen'] },
      { type: 'card', title: 'Kosten', items: ['Ab CHF 300 pro Einsatz', 'Abhängig von Stockwerk und Dauer', 'Inklusive Auf- und Abbau'] },
      { type: 'tip', content: 'Unser Möbellift erreicht Balkone bis zum 8. Stockwerk. Wir beraten Sie gerne, ob sich der Einsatz für Ihren Umzug lohnt!' }
    ]
  },
  {
    slug: "entruempelung-ratgeber",
    title: "Entrümpelung: Was tun mit alten Möbeln und Hausrat?",
    excerpt: "Wohin mit dem alten Sofa? Unser Ratgeber zeigt, wie Sie entrümpeln, was gespendet werden kann und wie die Entsorgung funktioniert.",
    image: ecoImage,
    category: "Ratgeber",
    readTime: "5 min",
    date: "6. Dezember 2024",
    metaDescription: "Entrümpelung Ratgeber: Wohin mit alten Möbeln? Spenden, verkaufen oder entsorgen – alle Optionen erklärt.",
    content: [
      { type: 'paragraph', content: 'Ob Wohnungsauflösung, Kellerentrümpelung oder Ausmisten vor dem Umzug – hier erfahren Sie, wie Sie effizient entrümpeln und was mit Ihren Sachen passieren kann.' },
      { type: 'heading', content: 'Schritt 1: Kategorisieren' },
      { type: 'list', items: ['Behalten – Was Sie wirklich brauchen', 'Verkaufen – Wertvolle Stücke', 'Spenden – Gut erhaltene Gegenstände', 'Entsorgen – Kaputte oder unbrauchbare Dinge'] },
      { type: 'heading', content: 'Was kann gespendet werden?' },
      { type: 'list', items: ['Gut erhaltene Möbel', 'Funktionsfähige Elektrogeräte', 'Saubere Kleidung', 'Bücher und Spielzeug', 'Haushaltswaren'] },
      { type: 'heading', content: 'Richtig entsorgen' },
      { type: 'list', items: ['Sperrmüll: Grosse Möbel, Matratzen', 'Elektroschrott: Separate Entsorgung', 'Sondermüll: Farben, Chemikalien, Batterien', 'Altpapier/Karton: Kostenlose Abgabe'] },
      { type: 'tip', content: 'Wir arbeiten mit lokalen Sozialkaufhäusern zusammen und organisieren Spenden für Sie! Nach einer kostenlosen Besichtigung erhalten Sie einen verbindlichen Festpreis.' }
    ]
  },
  {
    slug: "seniorenumzug-tipps",
    title: "Seniorenumzug: So gelingt der Umzug im Alter stressfrei",
    excerpt: "Tipps für einen einfühlsamen Umzug im fortgeschrittenen Alter. Von der Planung bis zur Einrichtung des neuen Zuhauses.",
    image: seniorImage,
    category: "Ratgeber",
    readTime: "7 min",
    date: "8. Dezember 2024",
    metaDescription: "Seniorenumzug planen: Praktische Tipps für einen stressfreien Umzug im Alter. Komplettservice, Entrümpelung und Einrichtung.",
    content: [
      { type: 'paragraph', content: 'Ein Umzug im Alter erfordert besondere Planung und Einfühlungsvermögen. Ob ins kleinere Zuhause oder in eine betreute Wohnform – mit der richtigen Vorbereitung gelingt der Übergang sanft.' },
      { type: 'heading', content: 'Frühzeitig planen' },
      { type: 'list', items: ['Mindestens 3 Monate vor dem Umzug beginnen', 'Angehörige einbeziehen', 'Professionelle Hilfe in Betracht ziehen', 'Neue Wohnung mehrmals besichtigen'] },
      { type: 'heading', content: 'Aussortieren mit Bedacht' },
      { type: 'paragraph', content: 'Das Loslassen von liebgewonnenen Gegenständen ist oft der schwierigste Teil. Nehmen Sie sich Zeit und entscheiden Sie in Ruhe, was mit ins neue Zuhause kommt.' },
      { type: 'list', items: ['Erinnerungsstücke fotografieren', 'Wertvolle Stücke an Familie weitergeben', 'Spenden statt wegwerfen', 'Professionelle Entrümpelung nutzen'] },
      { type: 'heading', content: 'Das neue Zuhause einrichten' },
      { type: 'list', items: ['Grundriss vorher planen', 'Vertraute Möbel mitnehmen', 'Gewohnte Einrichtung beibehalten', 'Barrierefreiheit bedenken'] },
      { type: 'tip', content: 'Unser Seniorenumzug-Team nimmt sich extra Zeit und kümmert sich um alles – vom Aussortieren bis zur kompletten Einrichtung. So können Sie sich entspannt zurücklehnen.' }
    ]
  },
  {
    slug: "vip-umzug-white-glove",
    title: "VIP Umzug: Was bedeutet White Glove Service?",
    excerpt: "Erfahren Sie, was einen Premium-Umzug auszeichnet und wann sich der White Glove Service lohnt.",
    image: antiquesImage,
    category: "Premium",
    readTime: "5 min",
    date: "7. Dezember 2024",
    metaDescription: "VIP Umzug & White Glove Service erklärt: Wann lohnt sich der Premium-Umzug? Diskretion, Kunsttransport und persönliche Betreuung.",
    content: [
      { type: 'paragraph', content: 'Der Begriff White Glove kommt aus der Welt des Kunst- und Antiquitätentransports und steht für höchste Sorgfalt und Diskretion. Aber wann lohnt sich dieser Premium-Service?' },
      { type: 'heading', content: 'Was ist White Glove Service?' },
      { type: 'list', items: ['Wertgegenstände werden mit Stoffhandschuhen angefasst', 'Individuelle Verpackung jedes Stücks', 'Persönlicher Projektleiter', 'Absolute Diskretion', 'Premium-Versicherung'] },
      { type: 'heading', content: 'Für wen eignet sich VIP Umzug?' },
      { type: 'list', items: ['Eigentümer von Kunstwerken und Antiquitäten', 'Executives mit wenig Zeit', 'Personen des öffentlichen Lebens', 'Besitzer wertvoller Sammlungen', 'Internationale Expats'] },
      { type: 'heading', content: 'Was kostet VIP Umzug?' },
      { type: 'paragraph', content: 'VIP-Umzüge starten ab CHF 4500 für kleinere Wohnungen. Der Preis richtet sich nach Umfang, Wert der Gegenstände und gewünschten Zusatzleistungen.' },
      { type: 'tip', content: 'Bei uns ist Ihr persönlicher Projektleiter von der ersten Kontaktaufnahme bis zur letzten Bildaufhängung für Sie da. Absolute Diskretion garantiert.' }
    ]
  },
  {
    slug: "bueroumzug-planen",
    title: "Büroumzug planen: So minimieren Sie Ausfallzeiten",
    excerpt: "Praktische Tipps für einen reibungslosen Firmenumzug. IT-Koordination, Mitarbeiter-Kommunikation und Wochenendservice.",
    image: homeofficeImage,
    category: "Business",
    readTime: "8 min",
    date: "5. Dezember 2024",
    metaDescription: "Büroumzug planen: Checkliste für minimale Ausfallzeiten. IT-Transport, Mitarbeiter-Info und Wochenendumzug erklärt.",
    content: [
      { type: 'paragraph', content: 'Ein Büroumzug ist eine logistische Herausforderung. Mit der richtigen Planung minimieren Sie Ausfallzeiten und sorgen für einen nahtlosen Übergang.' },
      { type: 'heading', content: '3 Monate vorher' },
      { type: 'list', items: ['Umzugsfirma mit Büroerfahrung beauftragen', 'IT-Abteilung einbeziehen', 'Projektleiter benennen', 'Mitarbeiter informieren', 'Neues Bürolayout planen'] },
      { type: 'heading', content: 'IT sicher transportieren' },
      { type: 'list', items: ['Datensicherung vor dem Umzug', 'Computer einzeln verpacken', 'Kabel beschriften', 'Server-Downtime planen', 'Testlauf am neuen Standort'] },
      { type: 'heading', content: 'Umzug am Wochenende' },
      { type: 'paragraph', content: 'Die meisten Büroumzüge finden am Wochenende statt. So können Mitarbeiter am Montag normal arbeiten. Der Aufpreis von 15-25% ist oft günstiger als Produktivitätsverlust.' },
      { type: 'card', title: 'Checkliste Umzugstag', items: ['Letzte Datensicherung', 'IT-Systeme herunterfahren', 'Arbeitsplätze räumen', 'Schlüsselübergabe koordinieren', 'Erste Funktionsprüfung'] },
      { type: 'tip', content: 'Wir haben über 500 Büroumzüge in der Schweiz durchgeführt. Unser erfahrener Projektleiter koordiniert alle Gewerke und garantiert minimale Ausfallzeiten.' }
    ]
  },
  {
    slug: "einlagerung-tipps",
    title: "Möbel einlagern: Was Sie wissen müssen",
    excerpt: "Tipps zur Einlagerung von Möbeln und Hausrat. Vorbereitung, Verpackung und die richtige Lagergrösse.",
    image: packingImage,
    category: "Lagerung",
    readTime: "6 min",
    date: "4. Dezember 2024",
    metaDescription: "Möbel einlagern: Tipps zur Vorbereitung, Verpackung und Lagergrössenberechnung. So bleiben Ihre Sachen geschützt.",
    content: [
      { type: 'paragraph', content: 'Ob Zwischenlagerung beim Umzug, Weltreise oder Platzmangel – die richtige Vorbereitung sorgt dafür, dass Ihre Möbel auch nach Monaten in perfektem Zustand sind.' },
      { type: 'heading', content: 'Die richtige Lagergrösse' },
      { type: 'list', items: ['1-Zimmer: ca. 5-8 m³', '2-Zimmer: ca. 10-15 m³', '3-Zimmer: ca. 15-20 m³', '4-Zimmer: ca. 20-30 m³', 'Einfamilienhaus: ca. 30-50 m³'] },
      { type: 'heading', content: 'Möbel vorbereiten' },
      { type: 'list', items: ['Möbel reinigen und trocknen', 'Schränke demontieren', 'Polster mit Folien schützen', 'Matratzen in Schutzhüllen', 'Elektronik separat verpacken'] },
      { type: 'heading', content: 'Worauf achten beim Lager?' },
      { type: 'list', items: ['Klimatisierung (wichtig für Holzmöbel)', 'Versicherungsschutz prüfen', 'Zugangsmöglichkeiten', 'Sicherheit (Videoüberwachung)', 'Flexible Laufzeiten'] },
      { type: 'tip', content: 'Unsere klimatisierten Lagerboxen schützen Ihre Möbel optimal. Transport von und zum Lager übernehmen wir natürlich auch!' }
    ]
  }
];

export const getArticleBySlug = (slug: string): BlogArticle | undefined => {
  return blogArticles.find(article => article.slug === slug);
};

export const getRelatedArticles = (currentSlug: string, count: number = 3): BlogArticle[] => {
  const currentArticle = getArticleBySlug(currentSlug);
  if (!currentArticle) return blogArticles.slice(0, count);
  
  return blogArticles
    .filter(article => article.slug !== currentSlug)
    .filter(article => article.category === currentArticle.category)
    .slice(0, count);
};
