/**
 * Persona Content Pack - IT Morris (Italian Fun Mode - Camping/Cycling/Coca-Cola)
 * 30 items per page: 5 sectionOpeners, 5 microTooltips, 5 ctaVariants, 5 interruptCards, 5 visualPrompts, 5 narratorLines
 */

import type { PersonaContentPack } from '@/lib/persona-types';

// ================================
// VISION PAGE - IT Morris
// ================================
export const itVisionContent: PersonaContentPack = {
  sectionOpeners: [
    { id: 'it-v-so1', sectionId: 'hero', text: 'Il trasloco è come il campeggio – preparazione è tutto!', emoji: '⛺' },
    { id: 'it-v-so2', sectionId: 'features', text: 'Funzionalità più fresche di una Coca-Cola ghiacciata.', emoji: '🥤' },
    { id: 'it-v-so3', sectionId: 'revenue', text: 'Guadagni che fanno cantare mio fratello!', emoji: '🎤' },
    { id: 'it-v-so4', sectionId: 'team', text: 'Il team è come la mamma – sempre presente!', emoji: '👩‍👦' },
    { id: 'it-v-so5', sectionId: 'roadmap', text: 'La strada è lunga come un giro in bici. Ma bella!', emoji: '🚴' },
  ],
  microTooltips: [
    { id: 'it-v-mt1', targetId: 'revenue-kpi', text: 'Abbastanza per tante Coca-Cola!' },
    { id: 'it-v-mt2', targetId: 'margin-kpi', text: '90% margine. Come piace a Rosa!' },
    { id: 'it-v-mt3', targetId: 'automation', text: 'AI lavora mentre io dormo. Perfetto!' },
    { id: 'it-v-mt4', targetId: 'escrow', text: 'Soldi sicuri come in una tenda svizzera.' },
    { id: 'it-v-mt5', targetId: 'video-scan', text: 'Scansioniamo tutto. Anche il chiosco.' },
  ],
  ctaVariants: [
    { id: 'it-v-cta1', label: 'Inizia l\'Avventura', sublabel: 'Come un campeggio di lusso', hoverTease: 'Tenda non inclusa!' },
    { id: 'it-v-cta2', label: 'Pedala Verso Casa', sublabel: 'In bici verso il futuro', hoverTease: 'Più veloce del vento!' },
    { id: 'it-v-cta3', label: 'Brinda con Noi', sublabel: 'Con Coca-Cola fredda', hoverTease: 'Ghiacciata, promesso!' },
    { id: 'it-v-cta4', label: 'Chiama la Mamma', sublabel: 'Lei approva!', hoverTease: 'Mamma dice sempre sì.' },
    { id: 'it-v-cta5', label: 'Scopri di Più', sublabel: 'Come un tesoro al chiosco', hoverTease: 'Sorprese garantite!' },
  ],
  interruptCards: [
    { id: 'it-v-ic1', title: 'Morris al Campeggio', body: 'Il trasloco è come montare una tenda – serve pratica!', emoji: '⛺', truthNugget: 'La nostra esperienza? 1000+ traslochi.', afterSection: 'hero' },
    { id: 'it-v-ic2', title: 'Pausa Coca-Cola', body: 'Ogni grande idea merita una Coca-Cola ghiacciata.', emoji: '🥤', truthNugget: 'Rinfrescante come i nostri prezzi.', afterSection: 'features' },
    { id: 'it-v-ic3', title: 'Il Fratello Cantante', body: 'Mio fratello canta. Io faccio soldi. Tutti felici!', emoji: '🎶', truthNugget: 'CHF 553 per cliente. Musica!', afterSection: 'revenue' },
    { id: 'it-v-ic4', title: 'L\'Italia è il Meglio', body: 'Ma per i traslochi in Svizzera... ci siamo noi!', emoji: '🇮🇹', truthNugget: 'Qualità svizzera, cuore italiano.', afterSection: 'team' },
    { id: 'it-v-ic5', title: 'Giro in Bici', body: 'Dopo il trasloco, un bel giro in bici. Meritato!', emoji: '🚴', truthNugget: 'Stile di vita sano = mente lucida.', afterSection: 'roadmap' },
  ],
  visualPrompts: [
    { id: 'it-v-vp1', imagePrompt: 'Tenda da campeggio con scatole di trasloco intorno', styleNotes: 'Avventura divertente', altText: 'Campeggio trasloco', whereToUse: 'hero' },
    { id: 'it-v-vp2', imagePrompt: 'Bicicletta con cassa di Coca-Cola nel cestino', styleNotes: 'Italiano rilassato', altText: 'Bici con Coca-Cola', whereToUse: 'features' },
    { id: 'it-v-vp3', imagePrompt: 'Chiosco italiano con grafici finanziari', styleNotes: 'Business casual', altText: 'Chiosco business', whereToUse: 'revenue' },
    { id: 'it-v-vp4', imagePrompt: 'Mamma italiana che abbraccia un camion trasloco', styleNotes: 'Caloroso e divertente', altText: 'Mamma e trasloco', whereToUse: 'team' },
    { id: 'it-v-vp5', imagePrompt: 'Ciclista su strada svizzera con panorama', styleNotes: 'Panoramico, aspirazionale', altText: 'Ciclismo svizzero', whereToUse: 'roadmap' },
  ],
  narratorLines: [
    { id: 'it-v-nl1', text: '⛺ Come al campeggio – ma meglio!' },
    { id: 'it-v-nl2', text: '🥤 Tempo per una Coca-Cola!' },
    { id: 'it-v-nl3', text: '🇮🇹 L\'Italia è sempre nel cuore!' },
    { id: 'it-v-nl4', text: '🚴 Dopo questo, un giro in bici!' },
    { id: 'it-v-nl5', text: '👩‍👦 La mamma sarebbe fiera!' },
  ],
};

// ================================
// FAMILY PAGE - IT Morris
// ================================
export const itFamilyContent: PersonaContentPack = {
  sectionOpeners: [
    { id: 'it-f-so1', sectionId: 'hero', text: 'La famiglia è tutto. Come dice la mamma!', emoji: '👨‍👩‍👧‍👦' },
    { id: 'it-f-so2', sectionId: 'benefits', text: 'Benefici più dolci di un tiramisù.', emoji: '🍰' },
    { id: 'it-f-so3', sectionId: 'how-it-works', text: 'Funziona come una bici – pedala e vai!', emoji: '🚴' },
    { id: 'it-f-so4', sectionId: 'security', text: 'Sicuro come una tenda svizzera nel vento.', emoji: '⛺' },
    { id: 'it-f-so5', sectionId: 'support', text: 'Supporto come Rosa – sempre presente!', emoji: '🌹' },
  ],
  microTooltips: [
    { id: 'it-f-mt1', targetId: 'simple', text: 'Più semplice di aprire una Coca-Cola.' },
    { id: 'it-f-mt2', targetId: 'safe', text: 'Sicuro come l\'abbraccio della mamma.' },
    { id: 'it-f-mt3', targetId: 'fast', text: 'Veloce come me in bici!' },
    { id: 'it-f-mt4', targetId: 'support', text: 'Supporto 24/7. Come il chiosco.' },
    { id: 'it-f-mt5', targetId: 'price', text: 'Prezzo onesto. Parola di Morris!' },
  ],
  ctaVariants: [
    { id: 'it-f-cta1', label: 'Proteggi la Famiglia', sublabel: 'Come farebbe la mamma', hoverTease: 'Lei approva!' },
    { id: 'it-f-cta2', label: 'Pedala al Successo', sublabel: 'Casa nuova in vista', hoverTease: 'Aria fresca garantita!' },
    { id: 'it-f-cta3', label: 'Brinda al Futuro', sublabel: 'Con Coca-Cola fredda', hoverTease: 'Celebriamo insieme!' },
    { id: 'it-f-cta4', label: 'Chiama Ora', sublabel: 'Come chiameresti Rosa', hoverTease: 'Con amore!' },
    { id: 'it-f-cta5', label: 'Scopri Come', sublabel: 'Avventura familiare', hoverTease: 'Campeggio opzionale!' },
  ],
  interruptCards: [
    { id: 'it-f-ic1', title: 'La Mamma Dice:', body: 'Un buon trasloco è come una buona cena – tutto al posto giusto!', emoji: '👩‍👦', truthNugget: 'Organizziamo tutto noi. Promesso.', afterSection: 'hero' },
    { id: 'it-f-ic2', title: 'Pausa al Chiosco', body: 'Ogni famiglia merita una pausa. Con snack!', emoji: '🏪', truthNugget: 'Processo senza stress garantito.', afterSection: 'benefits' },
    { id: 'it-f-ic3', title: 'Rosa Approva', body: 'La mia ragazza dice: "Questo servizio è perfetto!"', emoji: '🌹', truthNugget: '98% clienti soddisfatti.', afterSection: 'how-it-works' },
    { id: 'it-f-ic4', title: 'Campeggio Familiare', body: 'Il trasloco è un\'avventura. Come il campeggio!', emoji: '⛺', truthNugget: 'Ma con letti comodi alla fine.', afterSection: 'security' },
    { id: 'it-f-ic5', title: 'Il Fratello Canta', body: 'Mio fratello celebra ogni trasloco con una canzone!', emoji: '🎤', truthNugget: 'Ogni cliente merita una festa.', afterSection: 'support' },
  ],
  visualPrompts: [
    { id: 'it-f-vp1', imagePrompt: 'Famiglia italiana che fa un picnic tra scatole', styleNotes: 'Caloroso e familiare', altText: 'Picnic trasloco', whereToUse: 'hero' },
    { id: 'it-f-vp2', imagePrompt: 'Chiosco italiano con famiglia che compra snack', styleNotes: 'Quotidiano allegro', altText: 'Famiglia al chiosco', whereToUse: 'benefits' },
    { id: 'it-f-vp3', imagePrompt: 'Coppia in bici che esplora nuovo quartiere', styleNotes: 'Romantico e avventuroso', altText: 'Coppia in bici', whereToUse: 'how-it-works' },
    { id: 'it-f-vp4', imagePrompt: 'Tenda familiare con lucine e comfort', styleNotes: 'Accogliente campeggio', altText: 'Campeggio lusso', whereToUse: 'security' },
    { id: 'it-f-vp5', imagePrompt: 'Mamma che cucina in nuova cucina', styleNotes: 'Casa e cuore', altText: 'Mamma cucina', whereToUse: 'support' },
  ],
  narratorLines: [
    { id: 'it-f-nl1', text: '👨‍👩‍👧 La famiglia prima di tutto!' },
    { id: 'it-f-nl2', text: '🌹 Rosa manda un bacio!' },
    { id: 'it-f-nl3', text: '🏪 Pausa chiosco meritata!' },
    { id: 'it-f-nl4', text: '⛺ Campeggio mode: ON!' },
    { id: 'it-f-nl5', text: '👩‍👦 La mamma è fiera di te!' },
  ],
};

// ================================
// INVESTOREN PAGE - IT Morris
// ================================
export const itInvestorenContent: PersonaContentPack = {
  sectionOpeners: [
    { id: 'it-i-so1', sectionId: 'hero', text: 'L\'investimento è come il campeggio – preparazione!', emoji: '💼' },
    { id: 'it-i-so2', sectionId: 'market', text: 'Il mercato è come l\'Italia – il migliore!', emoji: '🇮🇹' },
    { id: 'it-i-so3', sectionId: 'numbers', text: 'Numeri più belli di un giro in bici.', emoji: '📊' },
    { id: 'it-i-so4', sectionId: 'team', text: 'Il team è solido. Come la mia bici!', emoji: '🚴' },
    { id: 'it-i-so5', sectionId: 'exit', text: 'L\'exit è come tornare al campeggio – trionfo!', emoji: '🏆' },
  ],
  microTooltips: [
    { id: 'it-i-mt1', targetId: 'roi', text: 'ROI che fa cantare mio fratello!' },
    { id: 'it-i-mt2', targetId: 'market-size', text: 'Mercato grande come l\'amore per l\'Italia.' },
    { id: 'it-i-mt3', targetId: 'growth', text: 'Crescita stabile come pedalare in pianura.' },
    { id: 'it-i-mt4', targetId: 'risk', text: 'Rischio calcolato. Come al campeggio.' },
    { id: 'it-i-mt5', targetId: 'team', text: 'Team affidabile. La mamma approva.' },
  ],
  ctaVariants: [
    { id: 'it-i-cta1', label: 'Investi nel Futuro', sublabel: 'Come comprare una buona bici', hoverTease: 'Pedala verso i profitti!' },
    { id: 'it-i-cta2', label: 'Esplora l\'Opportunità', sublabel: 'Avventura garantita', hoverTease: 'Campeggio dei ricchi!' },
    { id: 'it-i-cta3', label: 'Brinda al ROI', sublabel: 'Con Coca-Cola premium', hoverTease: 'Ghiacciata di successo!' },
    { id: 'it-i-cta4', label: 'Parla con Noi', sublabel: 'Come al chiosco', hoverTease: 'Ma con più numeri!' },
    { id: 'it-i-cta5', label: 'Scarica il Deck', sublabel: 'Tutto in un documento', hoverTease: 'Leggilo in bici!' },
  ],
  interruptCards: [
    { id: 'it-i-ic1', title: 'Morris sull\'Investimento', body: 'Investire è come scegliere il campeggio giusto – conta la posizione!', emoji: '📍', truthNugget: 'Posizionati sul mercato svizzero CHF 420M.', afterSection: 'hero' },
    { id: 'it-i-ic2', title: 'L\'Italia Insegna', body: 'Dall\'Italia ho imparato: qualità sopra quantità.', emoji: '🇮🇹', truthNugget: 'Focus su margini alti, non volume basso.', afterSection: 'market' },
    { id: 'it-i-ic3', title: 'Filosofia del Chiosco', body: 'Al chiosco si trova di tutto. Noi troviamo soluzioni.', emoji: '🏪', truthNugget: '10 flussi di ricavo diversificati.', afterSection: 'numbers' },
    { id: 'it-i-ic4', title: 'Il Pisolino Strategico', body: 'Dormire di giorno? No, penso alle strategie!', emoji: '😴', truthNugget: 'Pianificazione 24/7 per il successo.', afterSection: 'team' },
    { id: 'it-i-ic5', title: 'Exit da Campione', body: 'L\'exit è come vincere il Giro d\'Italia!', emoji: '🏆', truthNugget: 'IPO o M&A – traguardo in vista.', afterSection: 'exit' },
  ],
  visualPrompts: [
    { id: 'it-i-vp1', imagePrompt: 'Investitore in tenda di lusso con laptop', styleNotes: 'Glamping business', altText: 'Glamping investitore', whereToUse: 'hero' },
    { id: 'it-i-vp2', imagePrompt: 'Mappa dell\'Italia con indicatori finanziari', styleNotes: 'Business italiano', altText: 'Italia business', whereToUse: 'market' },
    { id: 'it-i-vp3', imagePrompt: 'Ciclista con briefcase attraversa Svizzera', styleNotes: 'Business adventure', altText: 'Ciclista business', whereToUse: 'numbers' },
    { id: 'it-i-vp4', imagePrompt: 'Team che brinda con Coca-Cola in ufficio', styleNotes: 'Celebrazione casual', altText: 'Team brindisi', whereToUse: 'team' },
    { id: 'it-i-vp5', imagePrompt: 'Podio con trofeo e bandiera italiana', styleNotes: 'Vittoria trionfante', altText: 'Podio vittoria', whereToUse: 'exit' },
  ],
  narratorLines: [
    { id: 'it-i-nl1', text: '💼 Business come campeggio – ma più profittevole!' },
    { id: 'it-i-nl2', text: '🇮🇹 L\'Italia nel cuore, i profitti in tasca!' },
    { id: 'it-i-nl3', text: '🚴 Pedalando verso il ROI!' },
    { id: 'it-i-nl4', text: '🥤 Coca-Cola per celebrare!' },
    { id: 'it-i-nl5', text: '👩‍👦 La mamma sarebbe così fiera!' },
  ],
};
