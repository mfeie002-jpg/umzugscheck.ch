-- Seed Swiss moving companies into service_providers table
-- quality_score and profile_completeness are decimal 0-1 (precision 3, scale 2)
INSERT INTO service_providers (
  company_name,
  contact_person_name,
  email,
  password_hash,
  phone,
  website,
  street,
  zip,
  city,
  country,
  cantons_served,
  services_offered,
  description,
  fleet_size,
  employees_count,
  price_level,
  verification_status,
  account_status,
  certifications,
  response_time_minutes,
  short_description,
  slug,
  quality_score,
  profile_completeness,
  is_featured,
  ranking_position
) VALUES
-- ZÜRICH
('Züri Umzüge AG', 'Thomas Müller', 'info@zueri-umzuege.ch', 'not-set', '+41 44 123 45 67', 'https://zueri-umzuege.ch', 'Bahnhofstrasse 100', '8001', 'Zürich', 'CH', ARRAY['ZH', 'ZG', 'AG'], ARRAY['umzug', 'firmenumzug', 'reinigung', 'lagerung', 'packservice'], 'Ihr professioneller Umzugspartner in Zürich seit 1995.', 8, 25, 'fair', 'approved', 'active', ARRAY['ISO 9001', 'SVDU Mitglied', 'TÜV geprüft'], 120, 'Professionelle Umzüge seit 1995', 'zueri-umzuege', 0.85, 0.90, true, 1),
('SwissMove Zürich', 'Anna Weber', 'kontakt@swissmove-zh.ch', 'not-set', '+41 44 234 56 78', 'https://swissmove-zh.ch', 'Limmatquai 50', '8001', 'Zürich', 'CH', ARRAY['ZH', 'ZG', 'SZ'], ARRAY['umzug', 'firmenumzug', 'reinigung', 'entsorgung', 'lagerung'], 'Premium Umzugsservice mit höchsten Qualitätsstandards.', 12, 40, 'premium', 'approved', 'active', ARRAY['ISO 9001', 'FIDI Certified'], 60, 'Premium Umzugsservice', 'swissmove-zuerich', 0.92, 0.95, true, 2),
('Blitz Umzug Zürich', 'Patrick Brunner', 'info@blitz-umzug.ch', 'not-set', '+41 44 333 44 55', 'https://blitz-umzug.ch', 'Langstrasse 150', '8004', 'Zürich', 'CH', ARRAY['ZH', 'AG', 'TG'], ARRAY['umzug', 'reinigung', 'entsorgung', 'express'], 'Schnelle Express-Umzüge in Zürich.', 5, 15, 'fair', 'approved', 'active', ARRAY['Express-Service', 'Versichert'], 90, 'Express-Umzüge in Zürich', 'blitz-umzug-zuerich', 0.77, 0.82, false, 17),
('Studenten Umzug Zürich', 'Lisa Meier', 'info@studenten-umzug-zh.ch', 'not-set', '+41 44 444 55 66', 'https://studenten-umzug.ch', 'Universitätstrasse 25', '8006', 'Zürich', 'CH', ARRAY['ZH'], ARRAY['umzug', 'packservice'], 'Günstiger Umzugsservice für Studenten.', 3, 8, 'günstig', 'approved', 'active', ARRAY['Studentenrabatt', 'Versichert'], 120, 'Günstige Umzüge für Studenten', 'studenten-umzug-zuerich', 0.70, 0.75, false, 18),
-- BASEL
('Basel Express Umzüge', 'Marco Bianchi', 'info@basel-express.ch', 'not-set', '+41 61 345 67 89', 'https://basel-express.ch', 'Freie Strasse 25', '4051', 'Basel', 'CH', ARRAY['BS', 'BL', 'AG'], ARRAY['umzug', 'reinigung', 'entsorgung', 'packservice'], 'Schnelle und zuverlässige Umzüge in der Region Basel.', 6, 18, 'fair', 'approved', 'active', ARRAY['SVDU Partner', 'Vollversichert'], 180, 'Schnelle Umzüge zu fairen Preisen', 'basel-express', 0.78, 0.85, false, 3),
('RheinUmzug Basel', 'Peter Schmid', 'kontakt@rheinumzug.ch', 'not-set', '+41 61 456 78 90', 'https://rheinumzug.ch', 'Rheinstrasse 15', '4056', 'Basel', 'CH', ARRAY['BS', 'BL'], ARRAY['umzug', 'reinigung', 'entsorgung'], 'Günstige Umzüge ohne Qualitätsverlust.', 4, 12, 'günstig', 'approved', 'active', ARRAY['Versichert', 'Lokaler Betrieb'], 240, 'Günstige Umzüge', 'rheinumzug-basel', 0.72, 0.80, false, 4),
('Dreiland Umzüge Basel', 'Claude Müller', 'info@dreiland-umzuege.ch', 'not-set', '+41 61 555 66 77', 'https://dreiland-umzuege.ch', 'Steinenvorstadt 30', '4051', 'Basel', 'CH', ARRAY['BS', 'BL', 'AG', 'SO'], ARRAY['umzug', 'firmenumzug', 'reinigung', 'international'], 'Umzüge im Dreiländereck.', 7, 20, 'fair', 'approved', 'active', ARRAY['FIDI Certified', 'Versichert'], 120, 'Internationale Umzüge im Dreiländereck', 'dreiland-umzuege-basel', 0.81, 0.84, true, 20),
-- BERN
('Berner Umzugsprofis', 'Hans Keller', 'info@berner-umzugsprofis.ch', 'not-set', '+41 31 567 89 01', 'https://berner-umzugsprofis.ch', 'Kramgasse 10', '3011', 'Bern', 'CH', ARRAY['BE', 'SO', 'FR'], ARRAY['umzug', 'firmenumzug', 'reinigung', 'lagerung'], 'Professionelle Umzüge in der Bundesstadt.', 7, 22, 'fair', 'approved', 'active', ARRAY['ISO 9001', 'SVDU Mitglied'], 120, 'Professionelle Umzüge in der Bundesstadt', 'berner-umzugsprofis', 0.82, 0.88, true, 5),
('Capital Umzüge Bern', 'Martin Wyss', 'info@capital-umzuege.ch', 'not-set', '+41 31 666 77 88', 'https://capital-umzuege.ch', 'Bundesgasse 5', '3011', 'Bern', 'CH', ARRAY['BE', 'SO', 'FR', 'NE'], ARRAY['umzug', 'firmenumzug', 'reinigung', 'lagerung'], 'Premium-Umzugsservice in der Bundesstadt.', 6, 18, 'premium', 'approved', 'active', ARRAY['ISO 9001', 'SVDU Mitglied'], 90, 'Premium-Umzüge in Bern', 'capital-umzuege-bern', 0.83, 0.87, true, 19),
-- LUZERN
('Luzern Umzüge & Transport', 'Stefan Huber', 'info@luzern-umzuege.ch', 'not-set', '+41 41 678 90 12', 'https://luzern-umzuege.ch', 'Pilatusstrasse 30', '6003', 'Luzern', 'CH', ARRAY['LU', 'ZG', 'NW', 'OW', 'UR'], ARRAY['umzug', 'transport', 'reinigung', 'packservice'], 'Ihr zuverlässiger Partner in der Zentralschweiz.', 5, 16, 'fair', 'approved', 'active', ARRAY['SVDU Partner', 'Versichert'], 180, 'Zuverlässige Umzüge in der Zentralschweiz', 'luzern-umzuege', 0.76, 0.82, false, 6),
-- ST. GALLEN
('St. Galler Umzugsservice', 'Markus Steiner', 'kontakt@stgaller-umzug.ch', 'not-set', '+41 71 789 01 23', 'https://stgaller-umzug.ch', 'Marktgasse 20', '9000', 'St. Gallen', 'CH', ARRAY['SG', 'AR', 'AI', 'TG'], ARRAY['umzug', 'reinigung', 'entsorgung', 'lagerung'], 'Umzüge in der Ostschweiz mit Herz und Verstand.', 4, 14, 'fair', 'approved', 'active', ARRAY['Versichert', 'Lokaler Betrieb'], 180, 'Umzüge in der Ostschweiz', 'stgaller-umzugsservice', 0.74, 0.78, false, 7),
-- WINTERTHUR
('Winterthur Umzüge Plus', 'Beat Zimmermann', 'info@winterthur-umzuege.ch', 'not-set', '+41 52 890 12 34', 'https://winterthur-umzuege.ch', 'Stadthausstrasse 15', '8400', 'Winterthur', 'CH', ARRAY['ZH', 'SH', 'TG'], ARRAY['umzug', 'firmenumzug', 'reinigung', 'packservice'], 'Kompetente Umzüge in Winterthur.', 4, 12, 'fair', 'approved', 'active', ARRAY['SVDU Partner', 'Versichert'], 180, 'Kompetente Umzüge in Winterthur', 'winterthur-umzuege-plus', 0.75, 0.80, false, 8),
-- LAUSANNE
('Déménagement Lausanne Pro', 'Jean-Pierre Dubois', 'info@lausanne-pro.ch', 'not-set', '+41 21 901 23 45', 'https://lausanne-pro.ch', 'Avenue de la Gare 30', '1003', 'Lausanne', 'CH', ARRAY['VD', 'GE', 'VS', 'NE'], ARRAY['umzug', 'firmenumzug', 'reinigung', 'lagerung', 'packservice'], 'Service professionnel en Suisse romande.', 6, 20, 'fair', 'approved', 'active', ARRAY['ISO 9001', 'SVDU Membre'], 120, 'Déménagements professionnels en Romandie', 'demenagement-lausanne-pro', 0.80, 0.85, true, 9),
-- GENF
('Genève Déménagements Express', 'François Martin', 'contact@geneve-demenagements.ch', 'not-set', '+41 22 012 34 56', 'https://geneve-demenagements.ch', 'Rue du Rhône 50', '1204', 'Genf', 'CH', ARRAY['GE', 'VD', 'VS'], ARRAY['umzug', 'firmenumzug', 'reinigung', 'lagerung', 'international'], 'Déménagements de luxe et internationaux.', 10, 35, 'premium', 'approved', 'active', ARRAY['FIDI Certified', 'ISO 9001'], 60, 'Déménagements premium et internationaux', 'geneve-demenagements', 0.90, 0.95, true, 10),
-- ZUG
('Zug Umzugspartner', 'Michael Roth', 'info@zug-umzugspartner.ch', 'not-set', '+41 41 123 45 67', 'https://zug-umzugspartner.ch', 'Baarerstrasse 50', '6300', 'Zug', 'CH', ARRAY['ZG', 'ZH', 'LU', 'SZ'], ARRAY['umzug', 'firmenumzug', 'reinigung', 'lagerung', 'packservice'], 'Premium-Umzüge im Kanton Zug.', 5, 15, 'premium', 'approved', 'active', ARRAY['ISO 9001', 'SVDU Mitglied', 'TÜV geprüft'], 120, 'Premium-Umzüge im Kanton Zug', 'zug-umzugspartner', 0.84, 0.88, true, 11),
-- LUGANO
('Traslochi Lugano Professional', 'Roberto Bernasconi', 'info@traslochi-lugano.ch', 'not-set', '+41 91 234 56 78', 'https://traslochi-lugano.ch', 'Via Nassa 25', '6900', 'Lugano', 'CH', ARRAY['TI', 'GR'], ARRAY['umzug', 'reinigung', 'entsorgung', 'lagerung'], 'Traslochi professionali in Ticino.', 4, 14, 'fair', 'approved', 'active', ARRAY['SVDU Partner', 'Assicurato'], 180, 'Traslochi professionali in Ticino', 'traslochi-lugano', 0.76, 0.80, false, 12),
-- AARAU
('Aarau Umzugsdienst', 'Daniel Frey', 'kontakt@aarau-umzug.ch', 'not-set', '+41 62 456 78 90', 'https://aarau-umzug.ch', 'Bahnhofstrasse 20', '5000', 'Aarau', 'CH', ARRAY['AG', 'BS', 'ZH', 'SO'], ARRAY['umzug', 'reinigung', 'transport', 'packservice'], 'Zuverlässige Umzüge im Aargau.', 3, 11, 'fair', 'approved', 'active', ARRAY['SVDU Partner', 'Versichert'], 180, 'Zuverlässige Umzüge im Aargau', 'aarau-umzugsdienst', 0.73, 0.78, false, 13),
-- CHUR
('Chur Bergumzüge', 'Christian Caflisch', 'info@chur-bergumzuege.ch', 'not-set', '+41 81 678 90 12', 'https://chur-bergumzuege.ch', 'Alexanderstrasse 10', '7000', 'Chur', 'CH', ARRAY['GR', 'GL', 'SG'], ARRAY['umzug', 'transport', 'lagerung', 'spezialtransporte'], 'Spezialisiert auf Bergumzüge.', 4, 12, 'fair', 'approved', 'active', ARRAY['SVDU Partner', 'Bergumzug-Spezialist'], 180, 'Bergumzug-Spezialisten in Graubünden', 'chur-bergumzuege', 0.79, 0.82, false, 14),
-- SCHAFFHAUSEN
('Schaffhausen Umzüge Rheinfall', 'Urs Graf', 'info@schaffhausen-umzuege.ch', 'not-set', '+41 52 567 89 01', 'https://schaffhausen-umzuege.ch', 'Vordergasse 50', '8200', 'Schaffhausen', 'CH', ARRAY['SH', 'TG', 'ZH'], ARRAY['umzug', 'reinigung', 'entsorgung'], 'Günstige Umzüge in Schaffhausen.', 2, 8, 'günstig', 'approved', 'active', ARRAY['Versichert', 'Lokaler Betrieb'], 240, 'Günstige Umzüge in Schaffhausen', 'schaffhausen-umzuege', 0.68, 0.72, false, 15),
-- THUN
('Thun Umzugsteam', 'Simon Gerber', 'info@thun-umzugsteam.ch', 'not-set', '+41 33 222 33 44', 'https://thun-umzugsteam.ch', 'Hauptgasse 15', '3600', 'Thun', 'CH', ARRAY['BE', 'FR', 'VS'], ARRAY['umzug', 'reinigung', 'lagerung'], 'Ihr Umzugspartner in der Region Thun-Oberland.', 3, 10, 'fair', 'approved', 'active', ARRAY['Versichert', 'Lokaler Betrieb'], 180, 'Umzüge in der Region Thun-Oberland', 'thun-umzugsteam', 0.74, 0.76, false, 16);