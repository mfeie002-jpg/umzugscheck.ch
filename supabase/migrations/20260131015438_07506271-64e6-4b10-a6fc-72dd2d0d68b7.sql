-- ============================================================================
-- PHASE 1: Lebensdauertabelle (Swiss Fixture Lifespan Table)
-- The paritätische Lebensdauertabelle for apartment handover depreciation
-- ============================================================================

-- Create enum for fixture categories
CREATE TYPE fixture_category AS ENUM (
  'walls',        -- Wände
  'floors',       -- Böden
  'kitchen',      -- Küche
  'bathroom',     -- Bad/WC
  'doors_windows',-- Türen/Fenster
  'electrical',   -- Elektro
  'heating',      -- Heizung
  'exterior',     -- Aussen/Balkon
  'miscellaneous' -- Diverses
);

-- Create the fixture_lifespans table
CREATE TABLE public.fixture_lifespans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category fixture_category NOT NULL,
  item_de TEXT NOT NULL,
  item_fr TEXT,
  item_it TEXT,
  lifespan_years INTEGER NOT NULL CHECK (lifespan_years > 0 AND lifespan_years <= 100),
  source TEXT NOT NULL DEFAULT 'Paritätische Lebensdauertabelle 2024',
  notes_de TEXT,
  notes_fr TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for fast lookups
CREATE INDEX idx_fixture_lifespans_category ON public.fixture_lifespans(category);
CREATE INDEX idx_fixture_lifespans_item_de ON public.fixture_lifespans(item_de);

-- Enable RLS (public read, admin write)
ALTER TABLE public.fixture_lifespans ENABLE ROW LEVEL SECURITY;

-- Public read access (no auth required - reference data)
CREATE POLICY "Fixture lifespans are publicly readable"
  ON public.fixture_lifespans
  FOR SELECT
  USING (true);

-- Admin write access
CREATE POLICY "Admins can manage fixture lifespans"
  ON public.fixture_lifespans
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_fixture_lifespans_updated_at
  BEFORE UPDATE ON public.fixture_lifespans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- SEED DATA: Official Paritätische Lebensdauertabelle items (~100 items)
-- Source: Swiss Tenants' Association / Homeowners' Association
-- ============================================================================

INSERT INTO public.fixture_lifespans (category, item_de, item_fr, lifespan_years, notes_de) VALUES
-- WALLS (Wände)
('walls', 'Dispersionsfarbe (weiss)', 'Peinture dispersion (blanc)', 8, 'Standardanstrich'),
('walls', 'Dispersionsfarbe (Farbtöne)', 'Peinture dispersion (couleurs)', 8, 'Farbiger Anstrich'),
('walls', 'Latex/Acrylfarbe', 'Peinture latex/acrylique', 10, 'Abwaschbare Farbe'),
('walls', 'Tapete (Papier)', 'Papier peint (papier)', 12, 'Standard Papiertapete'),
('walls', 'Tapete (Vinyl/Vlies)', 'Papier peint (vinyl/intissé)', 15, 'Hochwertige Tapete'),
('walls', 'Raufaser/Strukturtapete', 'Papier peint à peindre', 12, 'Übermalbar'),
('walls', 'Abrieb/Reibeputz', 'Crépi', 15, 'Strukturputz'),
('walls', 'Wandplatten (Kunststoff)', 'Panneaux muraux (plastique)', 15, NULL),
('walls', 'Wandplatten (Holz)', 'Panneaux muraux (bois)', 20, NULL),
('walls', 'Kalk-/Lehmputz', 'Enduit chaux/argile', 20, 'Natürlicher Putz'),

-- FLOORS (Böden)
('floors', 'Teppich (Standard)', 'Moquette (standard)', 10, 'Normaler Gebrauch'),
('floors', 'Teppich (hochwertig)', 'Moquette (haute qualité)', 15, 'Hochfloriger Teppich'),
('floors', 'PVC/Vinyl Belag', 'Revêtement PVC/vinyl', 15, NULL),
('floors', 'Linoleum', 'Linoléum', 20, NULL),
('floors', 'Laminat', 'Stratifié', 15, NULL),
('floors', 'Parkett (versiegelt)', 'Parquet (vitrifié)', 25, 'Versiegeltes Parkett'),
('floors', 'Parkett (geölt)', 'Parquet (huilé)', 20, 'Regelmässige Pflege nötig'),
('floors', 'Parkett (massiv)', 'Parquet (massif)', 40, 'Abschleifbar'),
('floors', 'Kork', 'Liège', 20, NULL),
('floors', 'Steinboden/Fliesen', 'Carrelage/Pierre', 40, 'Bei normaler Nutzung'),
('floors', 'Naturstein (poliert)', 'Pierre naturelle (polie)', 50, NULL),
('floors', 'Fugen (Boden)', 'Joints (sol)', 20, NULL),
('floors', 'Sockelleisten (Holz)', 'Plinthes (bois)', 25, NULL),
('floors', 'Sockelleisten (Kunststoff)', 'Plinthes (plastique)', 15, NULL),

-- KITCHEN (Küche)
('kitchen', 'Kühlschrank', 'Réfrigérateur', 10, NULL),
('kitchen', 'Gefrierschrank/Tiefkühler', 'Congélateur', 10, NULL),
('kitchen', 'Geschirrspüler', 'Lave-vaisselle', 10, NULL),
('kitchen', 'Backofen (elektrisch)', 'Four (électrique)', 20, NULL),
('kitchen', 'Backofen (Gas)', 'Four (gaz)', 25, NULL),
('kitchen', 'Kochfeld (Glaskeramik)', 'Plaque de cuisson (vitrocéramique)', 15, NULL),
('kitchen', 'Kochfeld (Induktion)', 'Plaque de cuisson (induction)', 15, NULL),
('kitchen', 'Kochfeld (Gas)', 'Plaque de cuisson (gaz)', 20, NULL),
('kitchen', 'Dunstabzugshaube', 'Hotte aspirante', 15, NULL),
('kitchen', 'Mikrowelle (eingebaut)', 'Micro-ondes (encastré)', 10, NULL),
('kitchen', 'Dampfgarer/Steamer', 'Cuiseur vapeur', 15, NULL),
('kitchen', 'Küchenspüle (Chromstahl)', 'Évier (inox)', 25, NULL),
('kitchen', 'Küchenspüle (Kunststein)', 'Évier (pierre synthétique)', 20, NULL),
('kitchen', 'Küchenarmatur', 'Robinetterie cuisine', 15, NULL),
('kitchen', 'Küchenfronten (Lackiert)', 'Façades cuisine (laquées)', 20, NULL),
('kitchen', 'Küchenfronten (Folie)', 'Façades cuisine (film)', 15, NULL),
('kitchen', 'Arbeitsplatte (Laminat)', 'Plan de travail (stratifié)', 15, NULL),
('kitchen', 'Arbeitsplatte (Naturstein)', 'Plan de travail (pierre naturelle)', 30, NULL),
('kitchen', 'Arbeitsplatte (Kunststein)', 'Plan de travail (pierre synthétique)', 25, NULL),
('kitchen', 'Schubladen/Auszüge', 'Tiroirs/Coulisses', 20, NULL),
('kitchen', 'Scharniere', 'Charnières', 20, NULL),

-- BATHROOM (Bad/WC)
('bathroom', 'Lavabo/Waschbecken', 'Lavabo', 25, 'Keramik'),
('bathroom', 'WC-Schüssel', 'Cuvette WC', 30, 'Keramik'),
('bathroom', 'WC-Sitz', 'Abattant WC', 10, NULL),
('bathroom', 'Spülkasten', 'Réservoir de chasse', 20, NULL),
('bathroom', 'Badewanne (Email)', 'Baignoire (émail)', 30, NULL),
('bathroom', 'Badewanne (Acryl)', 'Baignoire (acrylique)', 20, NULL),
('bathroom', 'Dusche/Duschwanne', 'Douche/Receveur', 20, NULL),
('bathroom', 'Duschkabine (Glas)', 'Cabine de douche (verre)', 20, NULL),
('bathroom', 'Duschkabine (Kunststoff)', 'Cabine de douche (plastique)', 15, NULL),
('bathroom', 'Duschwand/-abtrennung', 'Paroi de douche', 20, NULL),
('bathroom', 'Armatur (Standard)', 'Robinetterie (standard)', 15, NULL),
('bathroom', 'Armatur (hochwertig)', 'Robinetterie (haute qualité)', 20, NULL),
('bathroom', 'Thermostatarmatur', 'Mitigeur thermostatique', 15, NULL),
('bathroom', 'Spiegel/Spiegelschrank', 'Miroir/Armoire de toilette', 20, NULL),
('bathroom', 'Badmöbel', 'Meubles de salle de bains', 20, NULL),
('bathroom', 'Handtuchhalter/Accessoires', 'Porte-serviettes/Accessoires', 15, NULL),
('bathroom', 'Wandfliesen (Keramik)', 'Carrelage mural (céramique)', 40, NULL),
('bathroom', 'Bodenfliesen (Keramik)', 'Carrelage sol (céramique)', 40, NULL),
('bathroom', 'Fugen (Silikonfugen)', 'Joints (silicone)', 10, 'Regelmässiger Ersatz'),
('bathroom', 'Fugen (Zementfugen)', 'Joints (ciment)', 25, NULL),

-- DOORS & WINDOWS (Türen/Fenster)
('doors_windows', 'Innentür (Holz massiv)', 'Porte intérieure (bois massif)', 40, NULL),
('doors_windows', 'Innentür (furniert)', 'Porte intérieure (plaquée)', 30, NULL),
('doors_windows', 'Innentür (lackiert)', 'Porte intérieure (laquée)', 25, NULL),
('doors_windows', 'Türgriff/Türklinke', 'Poignée de porte', 25, NULL),
('doors_windows', 'Türschloss', 'Serrure', 25, NULL),
('doors_windows', 'Türzarge/Türrahmen', 'Chambranle/Cadre de porte', 35, NULL),
('doors_windows', 'Fenster (Holz)', 'Fenêtre (bois)', 30, NULL),
('doors_windows', 'Fenster (Kunststoff)', 'Fenêtre (PVC)', 25, NULL),
('doors_windows', 'Fenster (Holz-Alu)', 'Fenêtre (bois-alu)', 35, NULL),
('doors_windows', 'Fensterbeschläge', 'Ferrures de fenêtre', 25, NULL),
('doors_windows', 'Fensterdichtungen', 'Joints de fenêtre', 15, NULL),
('doors_windows', 'Rollläden (mechanisch)', 'Volets roulants (mécaniques)', 20, NULL),
('doors_windows', 'Rollläden (elektrisch)', 'Volets roulants (électriques)', 15, 'Motor anfällig'),
('doors_windows', 'Lamellenstoren', 'Stores à lamelles', 20, NULL),
('doors_windows', 'Sonnenstoren (Stoff)', 'Stores (tissu)', 12, NULL),
('doors_windows', 'Fliegengitter', 'Moustiquaire', 15, NULL),

-- ELECTRICAL (Elektro)
('electrical', 'Steckdosen', 'Prises électriques', 30, NULL),
('electrical', 'Lichtschalter', 'Interrupteurs', 30, NULL),
('electrical', 'Deckenlampe (eingebaut)', 'Plafonnier (encastré)', 20, NULL),
('electrical', 'LED-Einbauspots', 'Spots LED encastrés', 15, NULL),
('electrical', 'Leuchtstoffröhren', 'Tubes fluorescents', 10, NULL),
('electrical', 'Gegensprechanlage', 'Interphone', 20, NULL),
('electrical', 'Klingelanlage', 'Sonnette', 25, NULL),
('electrical', 'Elektrische Heizung', 'Chauffage électrique', 20, NULL),
('electrical', 'Boiler (elektrisch)', 'Chauffe-eau (électrique)', 15, NULL),

-- HEATING (Heizung)
('heating', 'Heizkörper', 'Radiateurs', 30, NULL),
('heating', 'Thermostatventil', 'Vanne thermostatique', 15, NULL),
('heating', 'Bodenheizung', 'Chauffage au sol', 40, 'Unter Bodenbelag'),
('heating', 'Wärmepumpe', 'Pompe à chaleur', 20, NULL),
('heating', 'Pelletofen', 'Poêle à pellets', 15, NULL),
('heating', 'Cheminée/Kaminofen', 'Cheminée/Poêle', 25, NULL),

-- EXTERIOR (Aussen/Balkon)
('exterior', 'Balkonboden (Holz)', 'Sol balcon (bois)', 15, 'Witterungsabhängig'),
('exterior', 'Balkonboden (Fliesen)', 'Sol balcon (carrelage)', 30, NULL),
('exterior', 'Balkongeländer (Metall)', 'Balustrade (métal)', 30, NULL),
('exterior', 'Balkongeländer (Holz)', 'Balustrade (bois)', 20, NULL),
('exterior', 'Sichtschutz', 'Brise-vue', 10, NULL),
('exterior', 'Markise', 'Store', 15, NULL),
('exterior', 'Gartenzaun (Holz)', 'Clôture (bois)', 15, NULL),
('exterior', 'Gartenzaun (Metall)', 'Clôture (métal)', 30, NULL),
('exterior', 'Briefkasten', 'Boîte aux lettres', 20, NULL),

-- MISCELLANEOUS (Diverses)
('miscellaneous', 'Einbauschrank', 'Armoire encastrée', 30, NULL),
('miscellaneous', 'Garderobe (eingebaut)', 'Vestiaire (encastré)', 25, NULL),
('miscellaneous', 'Waschmaschinenanschluss', 'Raccordement machine à laver', 30, NULL),
('miscellaneous', 'Tumbleranschluss', 'Raccordement sèche-linge', 30, NULL),
('miscellaneous', 'Rauchmelderbatterie', 'Pile détecteur de fumée', 5, 'Regelmässiger Ersatz'),
('miscellaneous', 'Rauchmelder', 'Détecteur de fumée', 10, NULL),
('miscellaneous', 'Schlüssel (Kopie)', 'Clé (copie)', 15, NULL),
('miscellaneous', 'Schlüssel (Sicherheit)', 'Clé (sécurité)', 20, NULL);

-- Add comment for documentation
COMMENT ON TABLE public.fixture_lifespans IS 'Swiss Paritätische Lebensdauertabelle - official fixture lifespan data for apartment handover depreciation calculations';