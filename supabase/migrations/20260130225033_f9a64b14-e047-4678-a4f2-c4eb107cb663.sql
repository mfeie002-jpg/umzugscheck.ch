-- Disposal categories for waste classification
CREATE TABLE public.disposal_categories (
  id TEXT PRIMARY KEY,
  name_de TEXT NOT NULL,
  name_fr TEXT,
  name_it TEXT,
  icon TEXT,
  disposal_type TEXT NOT NULL CHECK (disposal_type IN ('collection', 'drop_off', 'special')),
  description_de TEXT,
  tips_de TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.disposal_categories ENABLE ROW LEVEL SECURITY;

-- Public read access for disposal categories
CREATE POLICY "Disposal categories are publicly readable"
ON public.disposal_categories
FOR SELECT
USING (true);

-- Recycling centers with locations
CREATE TABLE public.recycling_centers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city_slug TEXT NOT NULL,
  postal_code TEXT,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  lat NUMERIC,
  lng NUMERIC,
  opening_hours JSONB,
  accepted_categories TEXT[],
  website_url TEXT,
  phone TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.recycling_centers ENABLE ROW LEVEL SECURITY;

-- Public read access for recycling centers
CREATE POLICY "Recycling centers are publicly readable"
ON public.recycling_centers
FOR SELECT
USING (true);

-- Insert standard Swiss disposal categories
INSERT INTO public.disposal_categories (id, name_de, name_fr, name_it, icon, disposal_type, description_de, tips_de) VALUES
('hauskehricht', 'Hauskehricht', 'Ordures ménagères', 'Rifiuti domestici', 'Trash2', 'collection', 'Normaler Haushaltsabfall in Gebühren-Säcken', 'Nur in offiziellen Gebührensäcken entsorgen'),
('papier', 'Papier & Karton', 'Papier et carton', 'Carta e cartone', 'Newspaper', 'collection', 'Zeitungen, Karton, Verpackungen aus Papier', 'Karton flach zusammenlegen, keine beschichteten Papiere'),
('glas', 'Altglas', 'Verre usagé', 'Vetro usato', 'Wine', 'drop_off', 'Flaschen und Gläser nach Farben getrennt', 'Nach Farben trennen: weiss, grün, braun'),
('metall', 'Metall & Dosen', 'Métal et boîtes', 'Metallo e lattine', 'Package', 'drop_off', 'Aludosen, Konservendosen, Metalldeckel', 'Ausspülen vor Entsorgung'),
('pet', 'PET-Flaschen', 'Bouteilles PET', 'Bottiglie PET', 'Recycle', 'drop_off', 'Getränkeflaschen aus PET', 'Nur Getränkeflaschen, keine anderen Kunststoffe'),
('elektro', 'Elektroschrott', 'Déchets électroniques', 'Rifiuti elettronici', 'Plug', 'drop_off', 'Elektrische Geräte aller Art', 'Kostenlose Rückgabe im Fachhandel'),
('sperrgut', 'Sperrgut', 'Encombrants', 'Ingombranti', 'Sofa', 'special', 'Möbel, Matratzen, grosse Gegenstände', 'Anmeldung bei ERZ oder Sammelstelle erforderlich'),
('textilien', 'Textilien & Schuhe', 'Textiles et chaussures', 'Tessili e scarpe', 'Shirt', 'drop_off', 'Tragbare Kleider und Schuhe paarweise', 'Nur saubere und tragbare Textilien'),
('gruengut', 'Grüngut', 'Déchets verts', 'Rifiuti verdi', 'Leaf', 'collection', 'Gartenabfälle, Pflanzenreste', 'In Grüngut-Container oder bei Sammelstelle'),
('oel', 'Speiseöl & Fett', 'Huile et graisse', 'Olio e grasso', 'Droplet', 'drop_off', 'Gebrauchtes Speiseöl und Frittierfett', 'In verschlossenen Behältern zur Sammelstelle'),
('batterien', 'Batterien & Akkus', 'Piles et accus', 'Batterie e accumulatori', 'Battery', 'drop_off', 'Alle Arten von Batterien und Akkus', 'Pole abkleben, kostenlose Rückgabe im Handel'),
('chemie', 'Chemikalien', 'Produits chimiques', 'Prodotti chimici', 'AlertTriangle', 'special', 'Farben, Lacke, Lösungsmittel, Medikamente', 'Sonderabfall - nur bei Sammelstellen abgeben');

-- Insert major recycling centers for MVP cities
INSERT INTO public.recycling_centers (city_slug, postal_code, name, address, lat, lng, opening_hours, accepted_categories, website_url) VALUES
('zuerich', '8005', 'Recyclinghof Hagenholz', 'Hagenholzstrasse 110, 8050 Zürich', 47.4142, 8.5508, '{"mo-fr": "07:00-17:00", "sa": "08:00-16:00"}', ARRAY['sperrgut', 'elektro', 'metall', 'glas', 'textilien', 'oel', 'chemie'], 'https://www.stadt-zuerich.ch/ted/de/index/entsorgung_recycling.html'),
('zuerich', '8005', 'Recyclinghof Werdhölzli', 'Werdhölzlistrasse 100, 8049 Zürich', 47.3994, 8.4822, '{"mo-fr": "07:00-17:00", "sa": "08:00-16:00"}', ARRAY['sperrgut', 'elektro', 'metall', 'glas', 'textilien', 'gruengut'], 'https://www.stadt-zuerich.ch/ted/de/index/entsorgung_recycling.html'),
('basel', '4057', 'Recycling-Paradies Pratteln', 'Güterstrasse 80, 4133 Pratteln', 47.5194, 7.6894, '{"mo-fr": "09:00-18:00", "sa": "08:00-17:00"}', ARRAY['sperrgut', 'elektro', 'metall', 'glas', 'textilien'], 'https://www.recycling-paradies.ch'),
('bern', '3014', 'Entsorgungshof Bern', 'Murtenstrasse 222, 3014 Bern', 46.9589, 7.4086, '{"mo-fr": "07:30-17:00", "sa": "08:00-12:00"}', ARRAY['sperrgut', 'elektro', 'metall', 'glas', 'textilien', 'oel', 'chemie'], 'https://www.bern.ch/entsorgung'),
('luzern', '6014', 'Recyclinghof Ibach', 'Schlundstrasse 21, 6014 Luzern', 47.0378, 8.2869, '{"mo-fr": "08:00-17:00", "sa": "08:00-12:00"}', ARRAY['sperrgut', 'elektro', 'metall', 'glas', 'textilien'], 'https://www.real-luzern.ch'),
('winterthur', '8406', 'Entsorgungshof Rietberg', 'Riedhofstrasse 70, 8406 Winterthur', 47.4778, 8.7167, '{"mo-fr": "07:00-17:00", "sa": "08:00-15:00"}', ARRAY['sperrgut', 'elektro', 'metall', 'glas', 'textilien', 'gruengut'], 'https://stadtwerk.winterthur.ch/entsorgung'),
('stgallen', '9016', 'Entsorgungshof St.Gallen', 'Martinsbruggstrasse 75, 9016 St. Gallen', 47.4342, 9.3875, '{"mo-fr": "07:30-17:00", "sa": "08:00-12:00"}', ARRAY['sperrgut', 'elektro', 'metall', 'glas', 'textilien'], 'https://www.stadt.sg.ch/home/raum-umwelt/entsorgung.html'),
('lausanne', '1018', 'Déchetterie de la Tuilière', 'Route de la Tuilière 2, 1018 Lausanne', 46.5456, 6.5892, '{"mo-fr": "07:00-18:00", "sa": "08:00-16:00"}', ARRAY['sperrgut', 'elektro', 'metall', 'glas', 'textilien', 'oel', 'chemie'], 'https://www.lausanne.ch/dechets'),
('geneve', '1227', 'Déchetterie Carouge', 'Route des Jeunes 10, 1227 Carouge', 46.1822, 6.1367, '{"mo-fr": "07:30-17:30", "sa": "08:00-16:00"}', ARRAY['sperrgut', 'elektro', 'metall', 'glas', 'textilien', 'oel', 'chemie'], 'https://www.geneve.ch/dechets');