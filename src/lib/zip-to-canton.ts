// Swiss ZIP code ranges mapped to canton slugs
// Based on official Swiss postal code system

export const getCantonFromZip = (zip: string): string | null => {
  const zipNum = parseInt(zip, 10);
  
  if (isNaN(zipNum)) return null;
  
  // Zürich (80xx - 89xx)
  if (zipNum >= 8000 && zipNum <= 8099) return "zuerich";
  if (zipNum >= 8100 && zipNum <= 8199) return "zuerich";
  if (zipNum >= 8300 && zipNum <= 8399) return "zuerich"; // Kloten, etc.
  if (zipNum >= 8400 && zipNum <= 8499) return "zuerich"; // Winterthur
  if (zipNum >= 8500 && zipNum <= 8599) return "thurgau"; // Frauenfeld
  if (zipNum >= 8600 && zipNum <= 8699) return "zuerich"; // Dübendorf
  if (zipNum >= 8700 && zipNum <= 8799) return "zuerich"; // Küsnacht
  if (zipNum >= 8800 && zipNum <= 8899) return "schwyz"; // Thalwil area mostly ZH, Einsiedeln SZ
  if (zipNum >= 8900 && zipNum <= 8999) return "zuerich"; // Uster
  
  // Bern (30xx - 39xx)
  if (zipNum >= 3000 && zipNum <= 3999) return "bern";
  
  // Basel (40xx - 48xx)
  if (zipNum >= 4000 && zipNum <= 4199) return "basel";
  if (zipNum >= 4200 && zipNum <= 4299) return "basel"; // Baselland
  if (zipNum >= 4300 && zipNum <= 4499) return "solothurn";
  if (zipNum >= 4500 && zipNum <= 4699) return "solothurn";
  if (zipNum >= 4700 && zipNum <= 4799) return "solothurn";
  if (zipNum >= 4800 && zipNum <= 4899) return "aargau"; // Zofingen area
  
  // Aargau (50xx - 56xx)
  if (zipNum >= 5000 && zipNum <= 5699) return "aargau";
  
  // Central Switzerland (60xx - 69xx)
  if (zipNum >= 6000 && zipNum <= 6099) return "luzern"; // Luzern city
  if (zipNum >= 6100 && zipNum <= 6199) return "luzern";
  if (zipNum >= 6200 && zipNum <= 6299) return "luzern"; // Sempach etc.
  if (zipNum >= 6300 && zipNum <= 6349) return "zug";
  if (zipNum >= 6350 && zipNum <= 6399) return "zug";
  if (zipNum >= 6400 && zipNum <= 6449) return "schwyz"; // Brunnen etc.
  if (zipNum >= 6450 && zipNum <= 6499) return "uri"; // Altdorf
  if (zipNum >= 6500 && zipNum <= 6599) return "tessin"; // Bellinzona
  if (zipNum >= 6600 && zipNum <= 6699) return "tessin"; // Locarno
  if (zipNum >= 6700 && zipNum <= 6799) return "tessin";
  if (zipNum >= 6800 && zipNum <= 6899) return "tessin"; // Lugano area
  if (zipNum >= 6900 && zipNum <= 6999) return "tessin";
  
  // Graubünden (70xx - 77xx)
  if (zipNum >= 7000 && zipNum <= 7799) return "graubuenden";
  
  // St. Gallen (90xx - 94xx)
  if (zipNum >= 9000 && zipNum <= 9499) return "stgallen";
  
  // Appenzell (90xx - 91xx overlaps with SG)
  if (zipNum >= 9050 && zipNum <= 9058) return "appenzell"; // Appenzell AI
  if (zipNum >= 9100 && zipNum <= 9108) return "appenzell"; // Herisau AR
  
  // Thurgau (82xx - 86xx, 95xx)
  if (zipNum >= 9500 && zipNum <= 9599) return "thurgau";
  if (zipNum >= 8200 && zipNum <= 8299) return "schaffhausen"; // Schaffhausen
  
  // Schaffhausen
  if (zipNum >= 8200 && zipNum <= 8248) return "schaffhausen";
  
  // Romandie - Genève (12xx)
  if (zipNum >= 1200 && zipNum <= 1299) return "geneve";
  
  // Vaud/Waadt (10xx - 18xx)
  if (zipNum >= 1000 && zipNum <= 1199) return "waadt"; // Lausanne area
  if (zipNum >= 1300 && zipNum <= 1399) return "waadt";
  if (zipNum >= 1400 && zipNum <= 1499) return "waadt";
  if (zipNum >= 1500 && zipNum <= 1599) return "fribourg";
  if (zipNum >= 1600 && zipNum <= 1699) return "fribourg"; // some waadt
  if (zipNum >= 1700 && zipNum <= 1799) return "fribourg"; // Fribourg city
  if (zipNum >= 1800 && zipNum <= 1899) return "waadt"; // Vevey, Montreux
  
  // Valais/Wallis (19xx)
  if (zipNum >= 1900 && zipNum <= 1999) return "wallis"; // Sion etc.
  
  // Neuchâtel (20xx - 23xx)
  if (zipNum >= 2000 && zipNum <= 2399) return "neuchatel";
  
  // Jura (28xx - 29xx)
  if (zipNum >= 2800 && zipNum <= 2999) return "jura";
  
  // Bern Jura region (25xx - 27xx)
  if (zipNum >= 2500 && zipNum <= 2799) return "bern";
  
  // Glarus (87xx - 88xx)
  if (zipNum >= 8750 && zipNum <= 8799) return "glarus";
  
  // Nidwalden & Obwalden (63xx - 64xx)
  if (zipNum >= 6360 && zipNum <= 6389) return "nidwalden"; // Stans area
  if (zipNum >= 6052 && zipNum <= 6078) return "obwalden"; // Sarnen area
  
  // Default - try to match first digit pattern
  const firstDigit = Math.floor(zipNum / 1000);
  switch (firstDigit) {
    case 1: return "waadt";
    case 2: return "neuchatel";
    case 3: return "bern";
    case 4: return "basel";
    case 5: return "aargau";
    case 6: return "luzern";
    case 7: return "graubuenden";
    case 8: return "zuerich";
    case 9: return "stgallen";
    default: return null;
  }
};

// Get canton display name from ZIP
export const getCantonNameFromZip = (zip: string): string | null => {
  const cantonSlug = getCantonFromZip(zip);
  if (!cantonSlug) return null;
  
  const cantonNames: Record<string, string> = {
    zuerich: "Zürich",
    bern: "Bern",
    basel: "Basel",
    aargau: "Aargau",
    luzern: "Luzern",
    stgallen: "St. Gallen",
    graubuenden: "Graubünden",
    tessin: "Tessin",
    waadt: "Waadt",
    geneve: "Genève",
    wallis: "Wallis",
    fribourg: "Fribourg",
    solothurn: "Solothurn",
    thurgau: "Thurgau",
    schwyz: "Schwyz",
    zug: "Zug",
    schaffhausen: "Schaffhausen",
    appenzell: "Appenzell",
    glarus: "Glarus",
    jura: "Jura",
    neuchatel: "Neuchâtel",
    uri: "Uri",
    obwalden: "Obwalden",
    nidwalden: "Nidwalden",
  };
  
  return cantonNames[cantonSlug] || cantonSlug;
};
