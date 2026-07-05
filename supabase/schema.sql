-- =============================================================================
-- FOND COEUR D'OR (FCO) — Schéma Supabase
-- À exécuter dans : Supabase Dashboard > SQL Editor.
-- =============================================================================

CREATE TABLE IF NOT EXISTS inscriptions (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Profil
  profil          TEXT NOT NULL CHECK (profil IN ('encadreur', 'ambassadeur')),

  -- Informations personnelles (commun)
  prenom          TEXT NOT NULL,
  nom             TEXT NOT NULL,
  whatsapp        TEXT NOT NULL,
  email           TEXT,
  vicariat        TEXT NOT NULL,
  paroisse        TEXT NOT NULL,
  photo_url       TEXT,

  -- Informations professionnelles (commun)
  secteur_activite TEXT NOT NULL,
  profession       TEXT NOT NULL,
  employeur        TEXT,

  -- Spécifique encadreur avec travaux
  type_produit        TEXT,
  description_produit TEXT,
  capacite_production TEXT,
  besoin_rebranding   BOOLEAN DEFAULT FALSE,
  lien_produit        TEXT,               -- lien ou photo du produit (optionnel)

  -- Spécifique ambassadeur
  motivation_ambassadeur TEXT,
  reseau_estime          TEXT,            -- estimation du réseau (ex: 50-200)
  disponibilite          TEXT,
  canaux_vente           TEXT[],          -- canaux de vente envisagés (multi)

  -- Gestion
  statut          TEXT DEFAULT 'en_attente'
                  CHECK (statut IN ('en_attente', 'valide', 'rejete')),
  code_parrainage TEXT UNIQUE,            -- généré à la validation d'un ambassadeur
  notes_admin     TEXT
);

-- Index pour les recherches fréquentes
CREATE INDEX IF NOT EXISTS idx_inscriptions_profil   ON inscriptions(profil);
CREATE INDEX IF NOT EXISTS idx_inscriptions_statut   ON inscriptions(statut);
CREATE INDEX IF NOT EXISTS idx_inscriptions_vicariat ON inscriptions(vicariat);

-- -----------------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------------
ALTER TABLE inscriptions ENABLE ROW LEVEL SECURITY;

-- Insertion publique autorisée (formulaire anonyme).
DROP POLICY IF EXISTS "insert_public" ON inscriptions;
CREATE POLICY "insert_public" ON inscriptions
  FOR INSERT WITH CHECK (true);

-- Lecture / mise à jour réservées au service_role (page admin via API Route).
DROP POLICY IF EXISTS "select_service" ON inscriptions;
CREATE POLICY "select_service" ON inscriptions
  FOR SELECT USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "update_service" ON inscriptions;
CREATE POLICY "update_service" ON inscriptions
  FOR UPDATE USING (auth.role() = 'service_role');

-- =============================================================================
-- STORAGE — bucket public 'fco-photos'
-- Peut être créé via l'UI (Storage > New bucket, Public = true) OU via ce SQL.
-- =============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'fco-photos',
  'fco-photos',
  true,
  5242880, -- 5 Mo
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;
