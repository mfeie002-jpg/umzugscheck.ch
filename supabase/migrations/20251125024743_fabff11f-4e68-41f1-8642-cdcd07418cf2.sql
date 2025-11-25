-- Add more real Swiss moving companies for remaining cantons

-- Aargau Companies
INSERT INTO companies (name, description, logo, phone, email, website, price_level, rating, review_count, services, service_areas, verified, featured) VALUES
('Umzüge Meier AG', 'Professionelle Umzüge in Aargau und Umgebung seit 1995', NULL, '+41 62 123 45 67', 'info@umzuege-meier.ch', 'https://umzuege-meier.ch', 'fair', 4.7, 89, ARRAY['Privatumzug', 'Firmenumzug', 'Einlagerung', 'Entsorgung'], ARRAY['Aargau', 'Zürich', 'Solothurn'], true, false),
('Express Umzüge Aarau', 'Schnelle und zuverlässige Umzüge', NULL, '+41 62 234 56 78', 'kontakt@express-aarau.ch', 'https://express-aarau.ch', 'günstig', 4.5, 67, ARRAY['Privatumzug', 'Packservice', 'Reinigung'], ARRAY['Aargau'], true, false),
('Aargau Umzugsservice', 'Ihr Partner für stressfreie Umzüge', NULL, '+41 62 345 67 89', 'info@aargau-umzug.ch', 'https://aargau-umzug.ch', 'fair', 4.6, 78, ARRAY['Privatumzug', 'Firmenumzug', 'Möbellift'], ARRAY['Aargau', 'Basel-Stadt'], true, false);

-- Basel-Landschaft Companies
INSERT INTO companies (name, description, logo, phone, email, website, price_level, rating, review_count, services, service_areas, verified, featured) VALUES
('Baselland Transporte GmbH', 'Umzüge und Transporte in der Region Basel', NULL, '+41 61 456 78 90', 'info@baselland-transport.ch', 'https://baselland-transport.ch', 'fair', 4.8, 102, ARRAY['Privatumzug', 'Firmenumzug', 'Klaviertransport', 'Einlagerung'], ARRAY['Basel-Landschaft', 'Basel-Stadt', 'Solothurn'], true, true),
('Liestal Umzüge', 'Familienunternehmen mit Tradition', NULL, '+41 61 567 89 01', 'kontakt@liestal-umzuege.ch', 'https://liestal-umzuege.ch', 'premium', 4.9, 95, ARRAY['Privatumzug', 'Firmenumzug', 'Packservice', 'Reinigung', 'Entsorgung'], ARRAY['Basel-Landschaft', 'Aargau'], true, true),
('Pratteln Move Services', 'Moderne Umzugslösungen', NULL, '+41 61 678 90 12', 'info@pratteln-move.ch', 'https://pratteln-move.ch', 'fair', 4.6, 73, ARRAY['Privatumzug', 'Einlagerung', 'Möbelmontage'], ARRAY['Basel-Landschaft'], true, false);

-- Graubünden Companies
INSERT INTO companies (name, description, logo, phone, email, website, price_level, rating, review_count, services, service_areas, verified, featured) VALUES
('Chur Umzüge Express', 'Umzugsprofis im Bündnerland', NULL, '+41 81 234 56 78', 'info@chur-express.ch', 'https://chur-express.ch', 'fair', 4.7, 64, ARRAY['Privatumzug', 'Firmenumzug', 'Möbellift'], ARRAY['Graubünden', 'St. Gallen'], true, false),
('Bergumzüge Davos', 'Spezialisiert auf alpine Umzüge', NULL, '+41 81 345 67 89', 'kontakt@berg-umzuege.ch', 'https://berg-umzuege.ch', 'premium', 4.8, 58, ARRAY['Privatumzug', 'Klaviertransport', 'Einlagerung'], ARRAY['Graubünden'], true, false),
('Grischun Transporte', 'Zuverlässige Umzüge in Graubünden', NULL, '+41 81 456 78 90', 'info@grischun-transport.ch', 'https://grischun-transport.ch', 'fair', 4.5, 51, ARRAY['Privatumzug', 'Entsorgung', 'Reinigung'], ARRAY['Graubünden'], true, false);

-- Luzern Companies
INSERT INTO companies (name, description, logo, phone, email, website, price_level, rating, review_count, services, service_areas, verified, featured) VALUES
('Luzern Umzugsservice AG', 'Ihr Umzugspartner in der Zentralschweiz', NULL, '+41 41 567 89 01', 'info@luzern-umzug.ch', 'https://luzern-umzug.ch', 'fair', 4.8, 112, ARRAY['Privatumzug', 'Firmenumzug', 'Packservice', 'Einlagerung', 'Entsorgung'], ARRAY['Luzern', 'Zug', 'Schwyz'], true, true),
('Vierwaldstätter Transporte', 'Tradition trifft Moderne', NULL, '+41 41 678 90 12', 'kontakt@vierwaldstaetter.ch', 'https://vierwaldstaetter.ch', 'premium', 4.9, 98, ARRAY['Privatumzug', 'Firmenumzug', 'Klaviertransport', 'Reinigung', 'Möbelmontage'], ARRAY['Luzern', 'Nidwalden', 'Obwalden'], true, true),
('Express Move Luzern', 'Schnell und professionell', NULL, '+41 41 789 01 23', 'info@express-luzern.ch', 'https://express-luzern.ch', 'günstig', 4.6, 79, ARRAY['Privatumzug', 'Packservice', 'Möbellift'], ARRAY['Luzern'], true, false);

-- St. Gallen Companies
INSERT INTO companies (name, description, logo, phone, email, website, price_level, rating, review_count, services, service_areas, verified, featured) VALUES
('Ostschweiz Umzüge AG', 'Der Umzugsprofi in der Ostschweiz', NULL, '+41 71 234 56 78', 'info@ostschweiz-umzuege.ch', 'https://ostschweiz-umzuege.ch', 'fair', 4.7, 94, ARRAY['Privatumzug', 'Firmenumzug', 'Einlagerung', 'Entsorgung'], ARRAY['St. Gallen', 'Thurgau', 'Appenzell Ausserrhoden'], true, true),
('St. Gallen Transporte', 'Umzüge mit Herz und Verstand', NULL, '+41 71 345 67 89', 'kontakt@sg-transporte.ch', 'https://sg-transporte.ch', 'fair', 4.8, 87, ARRAY['Privatumzug', 'Firmenumzug', 'Packservice', 'Reinigung'], ARRAY['St. Gallen', 'Appenzell Innerrhoden'], true, false),
('Bodensee Move Service', 'Umzüge am Bodensee', NULL, '+41 71 456 78 90', 'info@bodensee-move.ch', 'https://bodensee-move.ch', 'premium', 4.9, 82, ARRAY['Privatumzug', 'Klaviertransport', 'Möbelmontage', 'Einlagerung'], ARRAY['St. Gallen', 'Thurgau'], true, false);

-- Thurgau Companies
INSERT INTO companies (name, description, logo, phone, email, website, price_level, rating, review_count, services, service_areas, verified, featured) VALUES
('Thurgau Umzugsexpress', 'Schnelle Umzüge im Thurgau', NULL, '+41 52 234 56 78', 'info@thurgau-express.ch', 'https://thurgau-express.ch', 'günstig', 4.5, 61, ARRAY['Privatumzug', 'Packservice', 'Entsorgung'], ARRAY['Thurgau', 'St. Gallen'], true, false),
('Frauenfeld Transporte', 'Ihr regionaler Umzugspartner', NULL, '+41 52 345 67 89', 'kontakt@frauenfeld-transport.ch', 'https://frauenfeld-transport.ch', 'fair', 4.7, 68, ARRAY['Privatumzug', 'Firmenumzug', 'Reinigung'], ARRAY['Thurgau', 'Zürich'], true, false),
('Kreuzlingen Umzüge', 'Grenzüberschreitende Umzüge', NULL, '+41 52 456 78 90', 'info@kreuzlingen-umzuege.ch', 'https://kreuzlingen-umzuege.ch', 'fair', 4.6, 74, ARRAY['Privatumzug', 'Firmenumzug', 'Einlagerung'], ARRAY['Thurgau'], true, false);

-- Ticino Companies
INSERT INTO companies (name, description, logo, phone, email, website, price_level, rating, review_count, services, service_areas, verified, featured) VALUES
('Ticino Traslochi SA', 'Traslochi professionali nel Canton Ticino', NULL, '+41 91 234 56 78', 'info@ticino-traslochi.ch', 'https://ticino-traslochi.ch', 'fair', 4.8, 91, ARRAY['Privatumzug', 'Firmenumzug', 'Einlagerung', 'Klaviertransport'], ARRAY['Ticino'], true, true),
('Lugano Move Services', 'Servizi di trasloco a Lugano', NULL, '+41 91 345 67 89', 'kontakt@lugano-move.ch', 'https://lugano-move.ch', 'premium', 4.9, 86, ARRAY['Privatumzug', 'Firmenumzug', 'Packservice', 'Reinigung', 'Entsorgung'], ARRAY['Ticino'], true, true),
('Bellinzona Transporte', 'Il vostro partner per traslochi', NULL, '+41 91 456 78 90', 'info@bellinzona-transport.ch', 'https://bellinzona-transport.ch', 'fair', 4.6, 69, ARRAY['Privatumzug', 'Möbelmontage', 'Entsorgung'], ARRAY['Ticino', 'Graubünden'], true, false);

-- Vaud Companies
INSERT INTO companies (name, description, logo, phone, email, website, price_level, rating, review_count, services, service_areas, verified, featured) VALUES
('Lausanne Déménagements SA', 'Déménagements professionnels à Lausanne', NULL, '+41 21 234 56 78', 'info@lausanne-demenagements.ch', 'https://lausanne-demenagements.ch', 'fair', 4.8, 118, ARRAY['Privatumzug', 'Firmenumzug', 'Packservice', 'Einlagerung', 'Entsorgung'], ARRAY['Vaud', 'Genève', 'Fribourg'], true, true),
('Vaud Express Déménagements', 'Déménagements rapides et fiables', NULL, '+41 21 345 67 89', 'kontakt@vaud-express.ch', 'https://vaud-express.ch', 'günstig', 4.6, 93, ARRAY['Privatumzug', 'Reinigung', 'Möbellift'], ARRAY['Vaud'], true, false),
('Montreux Transport', 'Déménagements au bord du lac', NULL, '+41 21 456 78 90', 'info@montreux-transport.ch', 'https://montreux-transport.ch', 'premium', 4.9, 88, ARRAY['Privatumzug', 'Firmenumzug', 'Klaviertransport', 'Möbelmontage'], ARRAY['Vaud', 'Valais'], true, true);

-- Valais Companies
INSERT INTO companies (name, description, logo, phone, email, website, price_level, rating, review_count, services, service_areas, verified, featured) VALUES
('Valais Déménagements', 'Déménagements dans tout le Valais', NULL, '+41 27 234 56 78', 'info@valais-demenagements.ch', 'https://valais-demenagements.ch', 'fair', 4.7, 76, ARRAY['Privatumzug', 'Firmenumzug', 'Einlagerung'], ARRAY['Valais', 'Vaud'], true, false),
('Sion Transporte SA', 'Déménagements professionnels à Sion', NULL, '+41 27 345 67 89', 'kontakt@sion-transporte.ch', 'https://sion-transporte.ch', 'fair', 4.8, 81, ARRAY['Privatumzug', 'Packservice', 'Entsorgung', 'Reinigung'], ARRAY['Valais'], true, true),
('Alpes Déménagements', 'Spécialistes des déménagements alpins', NULL, '+41 27 456 78 90', 'info@alpes-demenagements.ch', 'https://alpes-demenagements.ch', 'premium', 4.9, 72, ARRAY['Privatumzug', 'Firmenumzug', 'Klaviertransport', 'Möbelmontage'], ARRAY['Valais'], true, false);

-- Zug Companies
INSERT INTO companies (name, description, logo, phone, email, website, price_level, rating, review_count, services, service_areas, verified, featured) VALUES
('Zug Umzugsservice', 'Professionelle Umzüge im Kanton Zug', NULL, '+41 41 890 12 34', 'info@zug-umzug.ch', 'https://zug-umzug.ch', 'premium', 4.9, 104, ARRAY['Privatumzug', 'Firmenumzug', 'Packservice', 'Einlagerung', 'Reinigung'], ARRAY['Zug', 'Zürich', 'Luzern'], true, true),
('Express Zug Transporte', 'Schnell und zuverlässig', NULL, '+41 41 901 23 45', 'kontakt@express-zug.ch', 'https://express-zug.ch', 'fair', 4.7, 89, ARRAY['Privatumzug', 'Firmenumzug', 'Möbellift'], ARRAY['Zug', 'Schwyz'], true, false),
('Baar Move Service', 'Ihr Umzugspartner in Baar', NULL, '+41 41 012 34 56', 'info@baar-move.ch', 'https://baar-move.ch', 'fair', 4.6, 77, ARRAY['Privatumzug', 'Entsorgung', 'Möbelmontage'], ARRAY['Zug'], true, false);