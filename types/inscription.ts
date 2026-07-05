// =============================================================================
// Types TypeScript reflétant la table `inscriptions` de Supabase.
// =============================================================================

export type Profil = 'encadreur' | 'ambassadeur'
export type Statut = 'en_attente' | 'valide' | 'rejete'

export interface Inscription {
  id: string
  created_at: string

  // Profil
  profil: Profil

  // Informations personnelles (commun)
  prenom: string
  nom: string
  whatsapp: string
  email: string | null
  vicariat: string
  paroisse: string
  photo_url: string | null

  // Informations professionnelles (commun)
  secteur_activite: string
  profession: string
  employeur: string | null

  // Spécifique encadreur avec travaux
  type_produit: string | null
  description_produit: string | null
  capacite_production: string | null
  besoin_rebranding: boolean
  lien_produit: string | null

  // Spécifique ambassadeur
  motivation_ambassadeur: string | null
  reseau_estime: string | null
  disponibilite: string | null
  canaux_vente: string[] | null

  // Gestion
  statut: Statut
  code_parrainage: string | null
  notes_admin: string | null
}

export const STATUT_LABELS: Record<Statut, string> = {
  en_attente: 'En attente',
  valide: 'Validé',
  rejete: 'Rejeté',
}

export const PROFIL_LABELS: Record<Profil, string> = {
  encadreur: 'Encadreur avec travaux',
  ambassadeur: 'Ambassadeur',
}
