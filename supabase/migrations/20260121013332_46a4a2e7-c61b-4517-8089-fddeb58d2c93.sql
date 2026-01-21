-- Seed neighborhood profiles for Kanton Zürich (ZH)
INSERT INTO public.neighborhood_profiles (
  city_name, postal_code, canton_code,
  family_score, expat_score, commuter_score, quiet_score, nightlife_score, nature_score,
  tax_rate_single, tax_rate_family, avg_rent_3room, avg_rent_4room, property_price_sqm,
  population, population_growth_percent, foreigner_percent, avg_age,
  train_station_distance_km, highway_distance_km, zurich_commute_minutes,
  description, highlights
) VALUES
-- Zürich Stadt
('Zürich', '8001', 'ZH', 65, 95, 100, 30, 95, 45, 11.5, 10.2, 2850, 3650, 18500, 
 421000, 1.2, 32.5, 38.2, 0.1, 2.0, 0,
 'Grösste Stadt der Schweiz, internationales Finanz- und Kulturzentrum mit höchster Lebensqualität.',
 ARRAY['Weltstadt', 'Seenähe', 'Kulturmetropole', 'ETH/Uni', 'Finanzplatz']),

-- Winterthur
('Winterthur', '8400', 'ZH', 80, 70, 90, 55, 60, 65, 10.8, 9.5, 1950, 2450, 9800,
 115000, 1.5, 25.8, 40.1, 0.2, 1.5, 22,
 'Zweitgrösste Stadt im Kanton, kulturell lebendig mit industriellem Erbe und familiärer Atmosphäre.',
 ARRAY['Kulturstadt', 'Familienfreundlich', 'Grüne Stadt', 'Gute ÖV-Anbindung']),

-- Uster
('Uster', '8610', 'ZH', 82, 55, 88, 60, 35, 70, 10.2, 8.9, 1850, 2300, 9200,
 36000, 1.8, 22.4, 41.0, 0.3, 2.0, 18,
 'Drittgrösste Stadt im Kanton am Greifensee, beliebte Wohngemeinde für Familien.',
 ARRAY['Am Greifensee', 'Familienstadt', 'S-Bahn-Anbindung', 'Naherholung']),

-- Dübendorf
('Dübendorf', '8600', 'ZH', 75, 60, 92, 50, 40, 55, 10.0, 8.7, 1900, 2350, 9500,
 29000, 2.1, 28.5, 39.5, 0.4, 1.0, 12,
 'Innovationsstandort mit Empa und ehemaliger Flugplatz, gut angebunden an Zürich.',
 ARRAY['Innovationspark', 'Glatttal', 'Stadtnah', 'Gute Verkehrslage']),

-- Dietikon
('Dietikon', '8953', 'ZH', 70, 65, 90, 45, 45, 50, 9.8, 8.5, 1750, 2200, 8800,
 28000, 1.4, 35.2, 38.8, 0.2, 0.5, 15,
 'Bezirkshauptort im Limmattal mit urbanem Charakter und sehr guter Verkehrsanbindung.',
 ARRAY['Limmattal', 'Bahn + Autobahn', 'Urban', 'Einkaufszentrum']),

-- Wädenswil
('Wädenswil', '8820', 'ZH', 85, 50, 75, 70, 30, 85, 10.5, 9.2, 1900, 2400, 10200,
 24000, 0.9, 18.5, 42.5, 0.3, 3.0, 25,
 'Weinstadt am Zürichsee mit Hochschule und hoher Lebensqualität.',
 ARRAY['Zürichsee', 'Weinbau', 'ZHAW', 'Naturnah']),

-- Horgen
('Horgen', '8810', 'ZH', 88, 55, 82, 65, 25, 80, 10.3, 9.0, 2100, 2650, 12500,
 23000, 1.1, 20.2, 43.0, 0.2, 2.5, 20,
 'Attraktive Seegemeinde an der Goldküste mit tieferen Steuern als Zürich.',
 ARRAY['Goldküste', 'Seezugang', 'Premium-Wohnlage', 'Tiefe Steuern']),

-- Thalwil
('Thalwil', '8800', 'ZH', 85, 60, 88, 60, 30, 75, 9.8, 8.6, 2200, 2800, 13500,
 18000, 0.8, 22.0, 42.0, 0.1, 2.0, 15,
 'Beliebte Pendlergemeinde an der linken Zürichseeseite mit exzellenter Bahnanbindung.',
 ARRAY['Zürichsee', 'Schnellzughalt', 'Tiefe Steuern', 'Wohnqualität']),

-- Kloten
('Kloten', '8302', 'ZH', 65, 75, 85, 35, 50, 40, 9.2, 8.0, 1650, 2050, 7800,
 20000, 1.6, 38.5, 37.5, 0.3, 0.5, 12,
 'Flughafengemeinde mit internationalem Flair und günstigen Steuern.',
 ARRAY['Flughafennähe', 'Tiefste Steuern ZH', 'International', 'Urban']),

-- Wetzikon
('Wetzikon', '8620', 'ZH', 80, 45, 78, 65, 30, 70, 10.6, 9.3, 1700, 2100, 8500,
 25000, 1.9, 19.8, 40.5, 0.2, 3.0, 28,
 'Wachsende Oberländer Gemeinde mit dörflichem Charakter und urbanem Angebot.',
 ARRAY['Zürcher Oberland', 'Wachstum', 'Familienfreundlich', 'Natur']),

-- Bülach
('Bülach', '8180', 'ZH', 78, 50, 80, 60, 40, 65, 10.4, 9.1, 1650, 2050, 8200,
 22000, 1.7, 24.5, 39.8, 0.2, 1.5, 20,
 'Bezirkshauptort im Zürcher Unterland mit gutem Infrastrukturangebot.',
 ARRAY['Unterland', 'Regionales Zentrum', 'Gute Schulen', 'S-Bahn']),

-- Meilen
('Meilen', '8706', 'ZH', 90, 65, 80, 75, 20, 85, 8.9, 7.8, 2400, 3100, 16000,
 14000, 0.6, 18.0, 44.5, 0.4, 4.0, 22,
 'Exklusive Goldküsten-Gemeinde mit sehr tiefen Steuern und Seeanstoss.',
 ARRAY['Goldküste', 'Tiefste Steuern', 'Premium', 'Seezugang']),

-- Küsnacht
('Küsnacht', '8700', 'ZH', 88, 70, 85, 70, 25, 80, 8.5, 7.5, 2600, 3400, 18000,
 14500, 0.5, 20.5, 45.0, 0.2, 3.5, 12,
 'Eine der steuergünstigsten Gemeinden der Schweiz, direkt am Zürichsee.',
 ARRAY['Goldküste', 'Top-Steuern', 'Exklusiv', 'Zentrumsnah']),

-- Zollikon
('Zollikon', '8702', 'ZH', 85, 75, 90, 60, 30, 70, 8.2, 7.2, 2500, 3200, 17500,
 13500, 0.4, 22.0, 44.0, 0.3, 2.5, 8,
 'Hochstehende Wohngemeinde zwischen Zürich und Küsnacht mit Seezugang.',
 ARRAY['Stadtnah', 'Tiefe Steuern', 'Premium', 'Zürichsee']),

-- Adliswil
('Adliswil', '8134', 'ZH', 75, 55, 88, 55, 35, 60, 10.0, 8.8, 1850, 2300, 9800,
 19000, 1.3, 26.0, 40.0, 0.3, 2.0, 12,
 'Beliebte Wohngemeinde im Sihltal mit Stadtnähe und Naherholung am Uetliberg.',
 ARRAY['Sihltal', 'Uetliberg', 'Stadtnah', 'Wachsend'])

ON CONFLICT (city_name, canton_code) DO UPDATE SET
  postal_code = EXCLUDED.postal_code,
  family_score = EXCLUDED.family_score,
  expat_score = EXCLUDED.expat_score,
  commuter_score = EXCLUDED.commuter_score,
  quiet_score = EXCLUDED.quiet_score,
  nightlife_score = EXCLUDED.nightlife_score,
  nature_score = EXCLUDED.nature_score,
  tax_rate_single = EXCLUDED.tax_rate_single,
  tax_rate_family = EXCLUDED.tax_rate_family,
  avg_rent_3room = EXCLUDED.avg_rent_3room,
  avg_rent_4room = EXCLUDED.avg_rent_4room,
  property_price_sqm = EXCLUDED.property_price_sqm,
  population = EXCLUDED.population,
  population_growth_percent = EXCLUDED.population_growth_percent,
  foreigner_percent = EXCLUDED.foreigner_percent,
  avg_age = EXCLUDED.avg_age,
  train_station_distance_km = EXCLUDED.train_station_distance_km,
  highway_distance_km = EXCLUDED.highway_distance_km,
  zurich_commute_minutes = EXCLUDED.zurich_commute_minutes,
  description = EXCLUDED.description,
  highlights = EXCLUDED.highlights;