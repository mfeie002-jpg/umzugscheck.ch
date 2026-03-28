/**
 * Echte Bilder für jeden Kanton/Stadt
 * Hochwertige Unsplash-Bilder mit echten Schweizer Städten/Landschaften
 */

export const REGION_IMAGES: Record<string, string> = {
  // === HAUPTKANTONE mit spezifischen Stadt-Bildern ===
  
  // Zürich - Limmat & Grossmünster
  zuerich: "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=1920&q=80&auto=format&fit=crop",
  
  // Bern - Aare & Altstadt
  bern: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=1920&q=80&auto=format&fit=crop",
  
  // Basel - Rhein & Münster
  basel: "https://images.unsplash.com/photo-1549471013-3472b417ea78?w=1920&q=80&auto=format&fit=crop",
  // Basel-Stadt (Kanton-Slug)
  "basel-stadt": "https://images.unsplash.com/photo-1549471013-3472b417ea78?w=1920&q=80&auto=format&fit=crop",
  
  // Luzern - Kapellbrücke & Pilatus
  luzern: "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?w=1920&q=80&auto=format&fit=crop",
  
  // Genf - Jet d'eau & See
  genf: "https://images.unsplash.com/photo-1573108037329-37aa135a142e?w=1920&q=80&auto=format&fit=crop",
  
  // Lausanne/Waadt - Genfersee
  lausanne: "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=1920&q=80&auto=format&fit=crop",
  waadt: "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=1920&q=80&auto=format&fit=crop",
  
  // St. Gallen - Stiftsbezirk
  stgallen: "https://images.unsplash.com/photo-1548777123-e216912df7d8?w=1920&q=80&auto=format&fit=crop",
  "st-gallen": "https://images.unsplash.com/photo-1548777123-e216912df7d8?w=1920&q=80&auto=format&fit=crop",
  
  // Tessin/Lugano - Luganersee mit Palmen
  tessin: "https://images.unsplash.com/photo-1530538095376-a4936b35b5f0?w=1920&q=80&auto=format&fit=crop",
  lugano: "https://images.unsplash.com/photo-1530538095376-a4936b35b5f0?w=1920&q=80&auto=format&fit=crop",
  
  // Zug - Zugersee & Berge
  zug: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1920&q=80&auto=format&fit=crop",
  
  // Wallis - Matterhorn & Alpen
  wallis: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1920&q=80&auto=format&fit=crop",
  
  // Graubünden - Engadin & Berge
  graubuenden: "https://images.unsplash.com/photo-1491555103944-7c647fd857e6?w=1920&q=80&auto=format&fit=crop",
  
  // Thurgau - Bodensee
  thurgau: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80&auto=format&fit=crop",
  
  // Aargau - Schweizer Mittelland
  aargau: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=80&auto=format&fit=crop",
  
  // Solothurn - Barocke Altstadt
  solothurn: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=1920&q=80&auto=format&fit=crop",
  
  // Schwyz - Mythen & Vierwaldstättersee
  schwyz: "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?w=1920&q=80&auto=format&fit=crop",
  
  // Freiburg - Altstadt
  freiburg: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=1920&q=80&auto=format&fit=crop",
  
  // Neuenburg - Neuenburgersee
  neuenburg: "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=1920&q=80&auto=format&fit=crop",
  
  // Schaffhausen - Rheinfall
  schaffhausen: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80&auto=format&fit=crop",
  
  // Appenzell - Säntis & Hügel
  appenzell: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1920&q=80&auto=format&fit=crop",
  "appenzell-innerrhoden": "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1920&q=80&auto=format&fit=crop",
  "appenzell-ausserrhoden": "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1920&q=80&auto=format&fit=crop",
  
  // Glarus - Glarner Alpen
  glarus: "https://images.unsplash.com/photo-1491555103944-7c647fd857e6?w=1920&q=80&auto=format&fit=crop",
  
  // Uri - Gotthard & Urnersee
  uri: "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?w=1920&q=80&auto=format&fit=crop",
  
  // Obwalden & Nidwalden - Vierwaldstättersee
  obwalden: "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?w=1920&q=80&auto=format&fit=crop",
  nidwalden: "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?w=1920&q=80&auto=format&fit=crop",
  
  // Jura - Juragebirge & Natur
  jura: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80&auto=format&fit=crop",
  
  // Winterthur - ähnlich Zürich
  winterthur: "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=1920&q=80&auto=format&fit=crop",
  
  // Basel-Landschaft
  "basel-landschaft": "https://images.unsplash.com/photo-1549471013-3472b417ea78?w=1920&q=80&auto=format&fit=crop",
  baselland: "https://images.unsplash.com/photo-1549471013-3472b417ea78?w=1920&q=80&auto=format&fit=crop",
};

/**
 * Holt das passende Bild für einen Kanton/Stadt
 * Falls kein spezifisches Bild vorhanden, wird ein Standard-Schweiz-Bild verwendet
 */
export const getRegionImage = (slug: string): string => {
  // Direkter Match
  if (REGION_IMAGES[slug]) {
    return REGION_IMAGES[slug];
  }
  
  // Versuche ohne Bindestriche
  const normalizedSlug = slug.toLowerCase().replace(/-/g, '');
  if (REGION_IMAGES[normalizedSlug]) {
    return REGION_IMAGES[normalizedSlug];
  }
  
  // Fallback: Schönes generisches Schweiz-Alpenbild
  return "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=1920&q=80&auto=format&fit=crop";
};
