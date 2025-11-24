// Swiss postal codes with city names for major cities and regions
export interface PostalCodeEntry {
  code: string;
  city: string;
  canton: string;
}

export const swissPostalCodes: PostalCodeEntry[] = [
  // Zürich
  { code: "8000", city: "Zürich", canton: "ZH" },
  { code: "8001", city: "Zürich", canton: "ZH" },
  { code: "8002", city: "Zürich", canton: "ZH" },
  { code: "8003", city: "Zürich", canton: "ZH" },
  { code: "8004", city: "Zürich", canton: "ZH" },
  { code: "8005", city: "Zürich", canton: "ZH" },
  { code: "8006", city: "Zürich", canton: "ZH" },
  { code: "8008", city: "Zürich", canton: "ZH" },
  { code: "8037", city: "Zürich", canton: "ZH" },
  { code: "8050", city: "Zürich Oerlikon", canton: "ZH" },
  { code: "8051", city: "Zürich Schwamendingen", canton: "ZH" },
  { code: "8057", city: "Zürich", canton: "ZH" },
  { code: "8302", city: "Kloten", canton: "ZH" },
  { code: "8304", city: "Wallisellen", canton: "ZH" },
  { code: "8400", city: "Winterthur", canton: "ZH" },
  { code: "8401", city: "Winterthur", canton: "ZH" },
  { code: "8600", city: "Dübendorf", canton: "ZH" },
  { code: "8610", city: "Uster", canton: "ZH" },
  { code: "8620", city: "Wetzikon", canton: "ZH" },
  { code: "8700", city: "Küsnacht", canton: "ZH" },
  { code: "8800", city: "Thalwil", canton: "ZH" },
  { code: "8810", city: "Horgen", canton: "ZH" },
  
  // Bern
  { code: "3000", city: "Bern", canton: "BE" },
  { code: "3001", city: "Bern", canton: "BE" },
  { code: "3003", city: "Bern", canton: "BE" },
  { code: "3004", city: "Bern", canton: "BE" },
  { code: "3005", city: "Bern", canton: "BE" },
  { code: "3006", city: "Bern", canton: "BE" },
  { code: "3007", city: "Bern", canton: "BE" },
  { code: "3008", city: "Bern", canton: "BE" },
  { code: "3010", city: "Bern", canton: "BE" },
  { code: "3011", city: "Bern", canton: "BE" },
  { code: "3012", city: "Bern", canton: "BE" },
  { code: "3013", city: "Bern", canton: "BE" },
  { code: "3014", city: "Bern", canton: "BE" },
  { code: "3018", city: "Bern", canton: "BE" },
  { code: "3019", city: "Bern", canton: "BE" },
  { code: "3027", city: "Bern", canton: "BE" },
  { code: "3032", city: "Hinterkappelen", canton: "BE" },
  { code: "3600", city: "Thun", canton: "BE" },
  { code: "3800", city: "Interlaken", canton: "BE" },
  { code: "2500", city: "Biel/Bienne", canton: "BE" },
  
  // Basel
  { code: "4000", city: "Basel", canton: "BS" },
  { code: "4001", city: "Basel", canton: "BS" },
  { code: "4002", city: "Basel", canton: "BS" },
  { code: "4051", city: "Basel", canton: "BS" },
  { code: "4052", city: "Basel", canton: "BS" },
  { code: "4053", city: "Basel", canton: "BS" },
  { code: "4054", city: "Basel", canton: "BS" },
  { code: "4055", city: "Basel", canton: "BS" },
  { code: "4056", city: "Basel", canton: "BS" },
  { code: "4057", city: "Basel", canton: "BS" },
  { code: "4058", city: "Basel", canton: "BS" },
  { code: "4059", city: "Basel", canton: "BS" },
  { code: "4102", city: "Binningen", canton: "BL" },
  { code: "4123", city: "Allschwil", canton: "BL" },
  { code: "4125", city: "Riehen", canton: "BS" },
  { code: "4132", city: "Muttenz", canton: "BL" },
  { code: "4142", city: "Münchenstein", canton: "BL" },
  { code: "4153", city: "Reinach", canton: "BL" },
  
  // Luzern
  { code: "6000", city: "Luzern", canton: "LU" },
  { code: "6003", city: "Luzern", canton: "LU" },
  { code: "6004", city: "Luzern", canton: "LU" },
  { code: "6005", city: "Luzern", canton: "LU" },
  { code: "6006", city: "Luzern", canton: "LU" },
  { code: "6010", city: "Kriens", canton: "LU" },
  { code: "6020", city: "Emmenbrücke", canton: "LU" },
  { code: "6030", city: "Ebikon", canton: "LU" },
  
  // St. Gallen
  { code: "9000", city: "St. Gallen", canton: "SG" },
  { code: "9001", city: "St. Gallen", canton: "SG" },
  { code: "9004", city: "St. Gallen", canton: "SG" },
  { code: "9006", city: "St. Gallen", canton: "SG" },
  { code: "9008", city: "St. Gallen", canton: "SG" },
  { code: "9010", city: "St. Gallen", canton: "SG" },
  { code: "9012", city: "St. Gallen", canton: "SG" },
  { code: "9014", city: "St. Gallen", canton: "SG" },
  { code: "9016", city: "St. Gallen", canton: "SG" },
  
  // Lausanne
  { code: "1000", city: "Lausanne", canton: "VD" },
  { code: "1003", city: "Lausanne", canton: "VD" },
  { code: "1004", city: "Lausanne", canton: "VD" },
  { code: "1005", city: "Lausanne", canton: "VD" },
  { code: "1006", city: "Lausanne", canton: "VD" },
  { code: "1007", city: "Lausanne", canton: "VD" },
  { code: "1008", city: "Lausanne", canton: "VD" },
  { code: "1010", city: "Lausanne", canton: "VD" },
  { code: "1012", city: "Lausanne", canton: "VD" },
  { code: "1018", city: "Lausanne", canton: "VD" },
  
  // Genève
  { code: "1200", city: "Genève", canton: "GE" },
  { code: "1201", city: "Genève", canton: "GE" },
  { code: "1202", city: "Genève", canton: "GE" },
  { code: "1203", city: "Genève", canton: "GE" },
  { code: "1204", city: "Genève", canton: "GE" },
  { code: "1205", city: "Genève", canton: "GE" },
  { code: "1206", city: "Genève", canton: "GE" },
  { code: "1207", city: "Genève", canton: "GE" },
  { code: "1208", city: "Genève", canton: "GE" },
  { code: "1209", city: "Genève", canton: "GE" },
  { code: "1210", city: "Genève", canton: "GE" },
  { code: "1211", city: "Genève", canton: "GE" },
  { code: "1212", city: "Genève", canton: "GE" },
  { code: "1213", city: "Genève", canton: "GE" },
  { code: "1214", city: "Genève", canton: "GE" },
  { code: "1215", city: "Genève", canton: "GE" },
  { code: "1216", city: "Genève", canton: "GE" },
  { code: "1217", city: "Genève", canton: "GE" },
  { code: "1218", city: "Genève", canton: "GE" },
  { code: "1219", city: "Genève", canton: "GE" },
  { code: "1220", city: "Genève", canton: "GE" },
  
  // Other major cities
  { code: "5000", city: "Aarau", canton: "AG" },
  { code: "6900", city: "Lugano", canton: "TI" },
  { code: "7000", city: "Chur", canton: "GR" },
  { code: "2000", city: "Neuchâtel", canton: "NE" },
  { code: "1700", city: "Fribourg", canton: "FR" },
  { code: "4500", city: "Solothurn", canton: "SO" },
  { code: "6460", city: "Altdorf", canton: "UR" },
  { code: "6440", city: "Brunnen", canton: "SZ" },
  { code: "8880", city: "Walenstadt", canton: "SG" },
  { code: "3900", city: "Brig", canton: "VS" },
  { code: "1950", city: "Sion", canton: "VS" },
  { code: "3930", city: "Visp", canton: "VS" },
];

export const searchPostalCodes = (query: string): PostalCodeEntry[] => {
  if (!query || query.length < 2) return [];
  
  const lowerQuery = query.toLowerCase();
  
  return swissPostalCodes
    .filter(entry => 
      entry.code.includes(query) || 
      entry.city.toLowerCase().includes(lowerQuery)
    )
    .slice(0, 10); // Limit to 10 results
};

export const getPostalCodeInfo = (code: string): PostalCodeEntry | undefined => {
  return swissPostalCodes.find(entry => entry.code === code);
};

export const validatePostalCode = (code: string): boolean => {
  return /^\d{4}$/.test(code) && swissPostalCodes.some(entry => entry.code === code);
};
