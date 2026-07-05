import type { Inscription } from '@/types/inscription'

const COLONNES: { key: keyof Inscription; label: string }[] = [
  { key: 'created_at', label: 'Date' },
  { key: 'profil', label: 'Profil' },
  { key: 'statut', label: 'Statut' },
  { key: 'prenom', label: 'Prénom' },
  { key: 'nom', label: 'Nom' },
  { key: 'whatsapp', label: 'WhatsApp' },
  { key: 'email', label: 'Email' },
  { key: 'vicariat', label: 'Vicariat' },
  { key: 'paroisse', label: 'Paroisse' },
  { key: 'secteur_activite', label: "Secteur d'activité" },
  { key: 'profession', label: 'Profession' },
  { key: 'employeur', label: 'Employeur' },
  { key: 'type_produit', label: 'Type produit' },
  { key: 'description_produit', label: 'Description produit' },
  { key: 'capacite_production', label: 'Capacité production' },
  { key: 'besoin_rebranding', label: 'Besoin rebranding' },
  { key: 'lien_produit', label: 'Lien produit' },
  { key: 'motivation_ambassadeur', label: 'Motivation' },
  { key: 'reseau_estime', label: 'Réseau estimé' },
  { key: 'disponibilite', label: 'Disponibilité' },
  { key: 'canaux_vente', label: 'Canaux de vente' },
  { key: 'code_parrainage', label: 'Code parrainage' },
  { key: 'notes_admin', label: 'Notes admin' },
]

function escapeCell(value: unknown): string {
  if (value === null || value === undefined) return ''
  let s: string
  if (Array.isArray(value)) s = value.join(' | ')
  else if (typeof value === 'boolean') s = value ? 'Oui' : 'Non'
  else s = String(value)
  if (/[",;\n]/.test(s)) s = `"${s.replace(/"/g, '""')}"`
  return s
}

export function toCSV(rows: Inscription[]): string {
  const header = COLONNES.map((c) => c.label).join(';')
  const lines = rows.map((row) =>
    COLONNES.map((c) => escapeCell(row[c.key])).join(';'),
  )
  return [header, ...lines].join('\r\n')
}

export function downloadCSV(rows: Inscription[], filename = 'inscriptions-fco.csv') {
  // BOM UTF-8 pour un affichage correct des accents dans Excel.
  const blob = new Blob(['﻿' + toCSV(rows)], {
    type: 'text/csv;charset=utf-8;',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
