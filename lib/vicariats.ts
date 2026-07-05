// =============================================================================
// Vicariats forains de l'Archidiocèse de Cotonou et leurs paroisses.
// Source : Bureau Diocésain MADEB (liste fournie par AKAMBI Sylvère).
// Les 15 vicariats forains sont retenus. Communautés chrétiennes et pôles de
// mission sont inclus dans les paroisses.
// =============================================================================

export interface VicariatData {
  nom: string // valeur affichée ET stockée en base
  paroisses: string[]
}

export const VICARIATS_DATA: VicariatData[] = [
  {
    nom: "Notre-Dame — Cotonou",
    paroisses: [
      'Cathédrale Notre-Dame de Miséricorde',
      'Saint Michel',
      'Saint Jean-Baptiste',
      'Sainte Cécile',
      'Sainte Rita',
      'Saint Antoine de Padoue (Zogbo)',
      'Sainte Famille (Djidje)',
      'Sainte Marie Mère du Sauveur (Midedji)',
      'Notre-Dame de la Visitation',
      'Saint Joseph (Vossa)',
    ],
  },
  {
    nom: "Sacré-Cœur",
    paroisses: [
      'Sacré-Cœur',
      'Saint Martin',
      "Sainte Thérèse de l'Enfant-Jésus (PK6)",
      'Saint Joseph (Agbato)',
      'Sainte Trinité (Avotrou)',
      'Saint Augustin (Cotonou)',
      'Saints Pierre et Paul (Yenawa)',
      'Christ-Roi (Akpakpa-Dodome)',
      'Saint Mathieu (Kpondehou)',
      'Saint Antoine de Padoue (Tanto)',
    ],
  },
  {
    nom: "Bon Pasteur",
    paroisses: [
      'Bon Pasteur (Cadjehoun)',
      'Saints Pierre et Paul (Agla–Kouhounou)',
      'Jésus Eucharistie (Vedoko)',
      'Saint Louis (Gbedegbe)',
      "Saint François d'Assise (Fidjrosse)",
      'Saint Charles Lwanga (Agla-Akplomey)',
      'Sainte Famille (Agla-Akogbato)',
      'Communauté chrétienne de Djebou',
      'Sainte Trinité (Agla-Hlazounto)',
      'Marie Auxiliatrice (Menontin)',
      'Saint Jean Bosco (Setovi)',
    ],
  },
  {
    nom: "Sainte-Thérèse — Godomey",
    paroisses: [
      'Sainte Thérèse (Godomey)',
      'Notre-Dame de Charité (Godomey Gare)',
      'Sainte Claire (Togbin Daho)',
      'Communauté chrétienne (Togbin Denou)',
      'Saint Joseph (Dekoungbe)',
      'Saint Jean-Eudes (Atrokpocodji)',
      "Sainte Jeanne d'Arc (Lobozounkpa)",
      'Saint Pio (Cocotomey)',
      'Saint Antoine de Padoue (Cocotomey)',
      'Saint Joseph (Gbodje)',
      'Saint Gabriel (Cococodji)',
    ],
  },
  {
    nom: "Saint-Michel — Togoudo",
    paroisses: [
      'Saint Michel (Togoudo)',
      'Sainte Famille (Tankpe)',
      'Saint Benoît (Womey)',
      'Saint Daniel Comboni (Sodo)',
      'Saint Luc (Yenadjro)',
      'Saint Michel (Houeto)',
      "Sainte Thérèse d'Avila (Gankon)",
      'Communauté chrétienne Immaculée Conception (Djadjo)',
    ],
  },
  {
    nom: "Saint-Antoine-de-Padoue — Calavi",
    paroisses: [
      'Saint Antoine de Padoue (Calavi)',
      'Sainte Joséphine Bakhita (Calavi)',
      'Saint Paul (Zogbadje)',
      'Saint Albert le Grand (Aïtchedji)',
      'Communauté chrétienne Saint Gérard Magellan (Ahossougbeta)',
      'Saint Michel (Calavi Gbodjo)',
      'Sainte Trinité (Calavi Zopah)',
      "Notre-Dame de l'Immaculée Conception (Akassato)",
      'Saint Jean Apôtre (Ouega)',
      'Communauté chrétienne (Kansounkpa)',
      'Sainte Thérèse (Adjagbo)',
      "Communauté chrétienne d'Atadje",
      'Saint Pierre (Tokan)',
    ],
  },
  {
    nom: "Saint-Luc — Ouèdo",
    paroisses: [
      'Saint Luc (Ouedo)',
      'Sainte Bernadette (Hevie Dodji)',
      'Saint Michel Archange (Hevie Houinme)',
      'Saint Isidore (Hevie-Adovie)',
      'Saint Pierre Claver (Djeganto)',
      'Notre-Dame des Douleurs (Amigonien-Come)',
      "Notre-Dame de l'Assomption (Some)",
      'Saint Martin (Ouedo Adjagbo)',
    ],
  },
  {
    nom: "Saint-Jean-l'Évangéliste — Zinvié",
    paroisses: [
      "Saint Jean l'Évangéliste (Zinvie)",
      'Saint Michel (Ze)',
      'Saint Joseph (Hekanme)',
      'Saint Jean-Marie Vianney (Wawata)',
      "Sainte Thérèse de l'Enfant-Jésus (Aïfa)",
      'Saint Pierre Claver (Koundokpoe)',
      'Rosa Mystica (Wawata-Zounto)',
      'Saint Jean-Baptiste (Sedje Denou)',
      'Saint Jean de la Croix (Kpodji-les-Monts)',
      'Sainte Dorothée (Adjan)',
    ],
  },
  {
    nom: "Saint-Joseph — Glo-Yékon",
    paroisses: [
      'Saint Michel (Agbodjedo)',
      'Saint Paul (Tangbo-Djevie)',
      'Saints Pierre et Paul (Djigbe Aga)',
      'Saint Joseph (Glo Yekon)',
      'Saint Étienne (Agongbe)',
      'Sainte Bernadette Soubirous (Agonme)',
      'Sainte Cécile (Domegbo)',
      'Sainte Rita (Gbetagbo)',
      'Notre-Dame du Rosaire (Agassa Godomey)',
    ],
  },
  {
    nom: "Notre-Dame-de-l'Immaculée-Conception — Lac Nokoué",
    paroisses: [
      "Notre-Dame de l'Immaculée Conception (Sô-Tchanhoué)",
      'Saint Ambroise (Lokpo)',
      'Saints Pierre et Paul (Ganvié)',
      'Saint Antoine de Padoue (Dekanmey)',
      'Sainte Bernadette Soubirous (Sô-Ava)',
    ],
  },
  {
    nom: "Sainte-Jeanne-d'Arc — Allada",
    paroisses: [
      "Sainte Jeanne d'Arc (Allada)",
      'Saint Jean-Baptiste (Tori-Bossito)',
      'Saint Mathieu (Tori-Cada)',
      'Saint Étienne (Glotomey)',
      'Saint Christophe (Attogon)',
      "Notre-Dame de l'Immaculée Conception (Tori-Gare)",
      'Saint Joseph (Azohoue Cada)',
      'Saint Christophe (Sekou)',
      "Notre-Dame de l'Immaculée Conception (Ayou)",
      'Transfiguration (Allada Dogoudo)',
    ],
  },
  {
    nom: "Saint-Antoine-de-Padoue — Houègbo",
    paroisses: [
      'Saint Antoine de Padoue (Houegbo)',
      'Saint Benoît (Toffo)',
      'Sacré-Cœur (Sehoue)',
      'Sacré-Cœur (Sey-Couffo)',
      'Saint Cyprien (Dessah)',
      'Sainte Anne (Agon)',
      "Notre-Dame de l'Assomption (Hinvi)",
    ],
  },
  {
    nom: "Sainte-Geneviève — Pahou",
    paroisses: [
      'Sainte Geneviève (Pahou)',
      'Saint Antoine de Padoue (Ahozon)',
      'Saint Jude Thaddée (Zoungoudo)',
      'Sainte Famille (Kpovie)',
      'Saint Paul (Adjarra Adovie)',
      'Saint Grégoire le Grand (Akadjamey)',
    ],
  },
  {
    nom: "Notre-Dame-de-l'Immaculée-Conception — Ouidah",
    paroisses: [
      "Basilique Notre-Dame de l'Immaculée Conception (Ouidah)",
      'Saint Paul (Tove Ouidah)',
      'Saint Jean (Gbena)',
      'Sacré-Cœur (Savi)',
      'Sacré-Cœur (Gbena)',
      'Saint Martin de Tours (Gbezounme)',
      'Épiphanie (Ouesse-Segbanou)',
    ],
  },
  {
    nom: "Saint-Antoine-de-Padoue — Lac Ahémé",
    paroisses: [
      'Saint Antoine de Padoue (Segbohoue)',
      'Sainte Catherine de Sienne (Tokpa Dome)',
      'Sainte Marie Madeleine (Dekanmey)',
      'Sainte Trinité (Atchakanmey)',
      "Saint François d'Assise (Agbanto)",
    ],
  },
]

// Noms des vicariats — pour le menu déroulant et la validation.
export const VICARIATS = VICARIATS_DATA.map((v) => v.nom)

// Valeur sentinelle : paroisse non listée → saisie libre.
export const PAROISSE_AUTRE = 'Autre (non listée)'

export function paroissesPour(vicariat: string | undefined): string[] {
  if (!vicariat) return []
  return VICARIATS_DATA.find((v) => v.nom === vicariat)?.paroisses ?? []
}
