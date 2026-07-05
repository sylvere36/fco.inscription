// =============================================================================
// Options fixes des menus déroulants et cases à cocher du formulaire.
// Centralisées ici pour rester synchronisées entre l'UI et la validation Zod.
// =============================================================================

export const TYPES_PRODUIT = [
  'Alimentaire transformé',
  'Artisanat',
  'Textile',
  'Autre',
] as const

export const CAPACITES_PRODUCTION = [
  'Petite (usage familial)',
  'Moyenne',
  'Grande (régulière)',
] as const

export const RESEAUX_ESTIMES = [
  'Moins de 50 contacts',
  '50-200',
  '200-500',
  'Plus de 500',
] as const

export const DISPONIBILITES = [
  'Weekends uniquement',
  'Semaine aussi',
  'Très disponible',
] as const

export const CANAUX_VENTE = [
  'WhatsApp',
  'Facebook',
  'Instagram',
  'Marché',
  'Après-messe',
  'Autre',
] as const

export type TypeProduit = (typeof TYPES_PRODUIT)[number]
export type CapaciteProduction = (typeof CAPACITES_PRODUCTION)[number]
export type ReseauEstime = (typeof RESEAUX_ESTIMES)[number]
export type Disponibilite = (typeof DISPONIBILITES)[number]
export type CanalVente = (typeof CANAUX_VENTE)[number]
