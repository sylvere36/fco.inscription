// =============================================================================
// Liste des vicariats actifs de l'Archidiocèse de Cotonou.
// Codés en dur (pas de BDD nécessaire). Cf. cahier des charges §VIII.
//
// ⚠️  Noms provisoires — à remplacer par les noms EXACTS des 12 vicariats
//     actifs fournis par AKAMBI Sylvère / le Bureau Diocésain MADEB.
//     Les 3 vicariats inactifs ne doivent PAS figurer ici.
// =============================================================================

export const VICARIATS = [
  'Vicariat 1',
  'Vicariat 2',
  'Vicariat 3',
  'Vicariat 4',
  'Vicariat 5',
  'Vicariat 6',
  'Vicariat 7',
  'Vicariat 8',
  'Vicariat 9',
  'Vicariat 10',
  'Vicariat 11',
  'Vicariat 12',
] as const

export type Vicariat = (typeof VICARIATS)[number]
