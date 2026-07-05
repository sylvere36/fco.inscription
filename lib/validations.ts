import { z } from 'zod'
import { VICARIATS, PAROISSE_AUTRE } from './vicariats'
import {
  TYPES_PRODUIT,
  CAPACITES_PRODUCTION,
  RESEAUX_ESTIMES,
  DISPONIBILITES,
  CANAUX_VENTE,
} from './options'

// -----------------------------------------------------------------------------
// Contraintes photo (cf. cahier des charges §4.2 / §3.2)
// -----------------------------------------------------------------------------
export const MAX_PHOTO_SIZE = 5 * 1024 * 1024 // 5 Mo
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

// WhatsApp — format béninois (+229…) ou international, souple mais non vide.
export const WHATSAPP_REGEX = /^\+?[0-9][0-9\s().-]{6,17}$/

const asEnum = <T extends readonly [string, ...string[]]>(values: T) =>
  z.enum(values)

// Convertit '' / null en undefined : un <select> non renseigné renvoie ''.
// Sans ça, '' est validé contre l'enum et affiche le message brut de Zod au
// lieu du message français porté par la règle conditionnelle.
const emptyToUndef = (v: unknown) => (v === '' || v == null ? undefined : v)

// Enums dérivés des listes d'options (source unique de vérité).
const profilEnum = z.enum(['encadreur', 'ambassadeur'], {
  errorMap: () => ({ message: 'Veuillez choisir un profil' }),
})
const vicariatEnum = z.enum(VICARIATS as unknown as [string, ...string[]], {
  errorMap: () => ({ message: 'Veuillez sélectionner votre vicariat' }),
})
const typeProduitEnum = asEnum(TYPES_PRODUIT as unknown as [string, ...string[]])
const capaciteEnum = asEnum(
  CAPACITES_PRODUCTION as unknown as [string, ...string[]],
)
const reseauEnum = asEnum(RESEAUX_ESTIMES as unknown as [string, ...string[]])
const dispoEnum = asEnum(DISPONIBILITES as unknown as [string, ...string[]])
const canalEnum = asEnum(CANAUX_VENTE as unknown as [string, ...string[]])

// -----------------------------------------------------------------------------
// Champs communs — partagés client & serveur
// -----------------------------------------------------------------------------
const communFields = {
  profil: profilEnum,
  prenom: z.string().trim().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  nom: z.string().trim().min(2, 'Le nom doit contenir au moins 2 caractères'),
  whatsapp: z
    .string()
    .trim()
    .regex(WHATSAPP_REGEX, 'Numéro WhatsApp invalide (format béninois ou international)'),
  email: z
    .union([z.literal(''), z.string().trim().email('Adresse email invalide')])
    .optional()
    .transform((v) => (v === '' ? undefined : v)),
  vicariat: vicariatEnum,
  secteur_activite: z
    .string()
    .trim()
    .min(2, "Veuillez renseigner votre secteur d'activité"),
  profession: z.string().trim().min(2, 'Veuillez renseigner votre profession'),
  employeur: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v === '' ? undefined : v)),
}

// Champs spécifiques (tous optionnels au niveau du type — la présence
// obligatoire est imposée conditionnellement via superRefine).
const encadreurFields = {
  // union avec '' : un <select> non renseigné renvoie '' (et non undefined).
  // On l'accepte ici pour éviter le message brut de l'enum ; la présence
  // obligatoire est imposée par la règle conditionnelle (message français).
  type_produit: z.union([z.literal(''), typeProduitEnum]).optional(),
  description_produit: z.string().trim().optional(),
  capacite_production: z.union([z.literal(''), capaciteEnum]).optional(),
  besoin_rebranding: z.boolean().optional().default(false),
  lien_produit: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v === '' ? undefined : v)),
}

const ambassadeurFields = {
  motivation_ambassadeur: z.string().trim().optional(),
  reseau_estime: z.union([z.literal(''), reseauEnum]).optional(),
  disponibilite: z.union([z.literal(''), dispoEnum]).optional(),
  canaux_vente: z.array(canalEnum).optional().default([]),
}

// Règles conditionnelles communes aux deux schémas.
function appliquerReglesConditionnelles(
  data: Record<string, unknown>,
  ctx: z.RefinementCtx,
) {
  if (data.profil === 'encadreur') {
    if (!data.type_produit) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['type_produit'],
        message: 'Veuillez choisir un type de produit',
      })
    }
    const desc = typeof data.description_produit === 'string' ? data.description_produit : ''
    if (desc.trim().length < 50) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['description_produit'],
        message: 'La description doit contenir au moins 50 caractères',
      })
    }
    if (!data.capacite_production) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['capacite_production'],
        message: 'Veuillez indiquer votre capacité de production',
      })
    }
  }

  if (data.profil === 'ambassadeur') {
    const motiv = typeof data.motivation_ambassadeur === 'string' ? data.motivation_ambassadeur : ''
    if (motiv.trim().length < 50) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['motivation_ambassadeur'],
        message: 'Votre motivation doit contenir au moins 50 caractères',
      })
    }
    if (!data.reseau_estime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['reseau_estime'],
        message: 'Veuillez estimer votre réseau',
      })
    }
    if (!data.disponibilite) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['disponibilite'],
        message: 'Veuillez indiquer votre disponibilité',
      })
    }
  }
}

// -----------------------------------------------------------------------------
// Schéma CLIENT (React Hook Form) — types riches (booléens, tableaux).
// -----------------------------------------------------------------------------
export const formSchema = z
  .object({
    ...communFields,
    // Paroisse : choisie dans un menu dépendant du vicariat. La sentinelle
    // PAROISSE_AUTRE révèle un champ libre `paroisse_autre`.
    paroisse: z.string().min(1, 'Veuillez sélectionner votre paroisse'),
    paroisse_autre: z.string().trim().optional(),
    ...encadreurFields,
    ...ambassadeurFields,
    consent: z.literal(true, {
      errorMap: () => ({ message: 'Vous devez certifier et accepter pour continuer' }),
    }),
  })
  .superRefine((data, ctx) => {
    appliquerReglesConditionnelles(data, ctx)
    if (data.paroisse === PAROISSE_AUTRE) {
      const autre =
        typeof data.paroisse_autre === 'string' ? data.paroisse_autre : ''
      if (autre.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['paroisse_autre'],
          message: 'Veuillez saisir le nom de votre paroisse',
        })
      }
    }
  })

export type FormValues = z.input<typeof formSchema>

// -----------------------------------------------------------------------------
// Schéma SERVEUR — reçoit des chaînes (FormData). Coercition puis mêmes règles.
// -----------------------------------------------------------------------------
const toBool = (v: unknown) => v === 'true' || v === 'on' || v === true

const parseCanaux = (v: unknown): unknown => {
  if (Array.isArray(v)) return v
  if (typeof v === 'string' && v.trim() !== '') {
    try {
      const parsed = JSON.parse(v)
      return Array.isArray(parsed) ? parsed : [v]
    } catch {
      return v.split(',').map((s) => s.trim()).filter(Boolean)
    }
  }
  return []
}

export const inscriptionSchema = z
  .object({
    ...communFields,
    // Le client a déjà résolu « Autre » → texte libre ; on stocke une chaîne.
    paroisse: z.string().trim().min(2, 'Veuillez renseigner votre paroisse'),
    type_produit: z.preprocess(emptyToUndef, typeProduitEnum.optional()),
    description_produit: z.preprocess(emptyToUndef, z.string().trim().optional()),
    capacite_production: z.preprocess(emptyToUndef, capaciteEnum.optional()),
    besoin_rebranding: z.preprocess(toBool, z.boolean()).default(false),
    lien_produit: z.preprocess(emptyToUndef, z.string().trim().optional()),
    motivation_ambassadeur: z.preprocess(emptyToUndef, z.string().trim().optional()),
    reseau_estime: z.preprocess(emptyToUndef, reseauEnum.optional()),
    disponibilite: z.preprocess(emptyToUndef, dispoEnum.optional()),
    canaux_vente: z.preprocess(parseCanaux, z.array(canalEnum)).default([]),
    consent: z.preprocess(toBool, z.literal(true, {
      errorMap: () => ({ message: 'Consentement obligatoire' }),
    })),
  })
  .superRefine(appliquerReglesConditionnelles)

export type InscriptionInput = z.infer<typeof inscriptionSchema>
