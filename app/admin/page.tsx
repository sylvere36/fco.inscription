'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Inscription, Profil, Statut } from '@/types/inscription'
import { PROFIL_LABELS, STATUT_LABELS } from '@/types/inscription'
import { downloadCSV } from '@/lib/csv'

const PW_KEY = 'fco_admin_pw'

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

const STATUT_STYLE: Record<Statut, string> = {
  en_attente: 'bg-or/15 text-[#8a6d08]',
  valide: 'bg-succes/15 text-succes',
  rejete: 'bg-erreur/15 text-erreur',
}

function StatutBadge({ statut }: { statut: Statut }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${STATUT_STYLE[statut]}`}
    >
      {STATUT_LABELS[statut]}
    </span>
  )
}

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)
  const [rows, setRows] = useState<Inscription[]>([])
  const [filtreProfil, setFiltreProfil] = useState<'all' | Profil>('all')
  const [filtreStatut, setFiltreStatut] = useState<'all' | Statut>('all')
  const [selected, setSelected] = useState<Inscription | null>(null)

  const fetchRows = useCallback(async (pw: string) => {
    setLoading(true)
    setLoginError(null)
    try {
      const res = await fetch('/api/admin/inscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pw }),
      })
      if (res.status === 401) {
        setLoginError('Mot de passe incorrect.')
        sessionStorage.removeItem(PW_KEY)
        setAuthed(false)
        return
      }
      if (!res.ok) throw new Error('server')
      const json = await res.json()
      setRows(json.inscriptions ?? [])
      setAuthed(true)
      sessionStorage.setItem(PW_KEY, pw)
    } catch {
      setLoginError('Erreur serveur. Réessayez.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const stored = sessionStorage.getItem(PW_KEY)
    if (stored) {
      setPassword(stored)
      fetchRows(stored)
    }
  }, [fetchRows])

  const filtered = useMemo(
    () =>
      rows.filter(
        (r) =>
          (filtreProfil === 'all' || r.profil === filtreProfil) &&
          (filtreStatut === 'all' || r.statut === filtreStatut),
      ),
    [rows, filtreProfil, filtreStatut],
  )

  async function changerStatut(id: string, statut: Statut) {
    const pw = sessionStorage.getItem(PW_KEY)
    if (!pw) return
    const res = await fetch('/api/admin/statut', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pw, id, statut }),
    })
    if (!res.ok) {
      alert("Échec de la mise à jour du statut.")
      return
    }
    const { inscription } = await res.json()
    setRows((prev) => prev.map((r) => (r.id === id ? inscription : r)))
    setSelected((prev) => (prev && prev.id === id ? inscription : prev))
  }

  function logout() {
    sessionStorage.removeItem(PW_KEY)
    setAuthed(false)
    setRows([])
    setPassword('')
  }

  // ---------------------------------------------------------------- Login gate
  if (!authed) {
    return (
      <main className="flex min-h-screen items-center justify-center px-5">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            fetchRows(password)
          }}
          className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-card"
        >
          <h1 className="text-xl font-bold text-nuit">Espace administration</h1>
          <p className="mt-1 text-sm text-nuit/60">
            Réservé au Bureau Diocésain FCO.
          </p>
          <label htmlFor="pw" className="fco-label mt-6">
            Mot de passe
          </label>
          <input
            id="pw"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="fco-input"
            autoFocus
          />
          {loginError && <p className="fco-error">{loginError}</p>}
          <button
            type="submit"
            disabled={loading || !password}
            className="fco-btn-primary mt-6 w-full"
          >
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>
      </main>
    )
  }

  // --------------------------------------------------------------- Dashboard
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-nuit">Inscriptions FCO</h1>
          <p className="text-sm text-nuit/60">
            {filtered.length} inscription{filtered.length > 1 ? 's' : ''}{' '}
            affichée{filtered.length > 1 ? 's' : ''} · {rows.length} au total
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              downloadCSV(filtered, `inscriptions-fco-${filtreProfil}-${filtreStatut}.csv`)
            }
            className="fco-btn-primary px-4 py-2 text-sm"
          >
            ⬇ Export CSV
          </button>
          <button onClick={logout} className="fco-btn-ghost px-4 py-2 text-sm">
            Déconnexion
          </button>
        </div>
      </div>

      {/* Filtres */}
      <div className="mb-4 flex flex-wrap gap-3">
        <select
          value={filtreProfil}
          onChange={(e) => setFiltreProfil(e.target.value as 'all' | Profil)}
          className="fco-input max-w-[220px] py-2 text-sm"
        >
          <option value="all">Tous les profils</option>
          <option value="encadreur">Encadreur avec travaux</option>
          <option value="ambassadeur">Ambassadeur</option>
        </select>
        <select
          value={filtreStatut}
          onChange={(e) => setFiltreStatut(e.target.value as 'all' | Statut)}
          className="fco-input max-w-[220px] py-2 text-sm"
        >
          <option value="all">Tous les statuts</option>
          <option value="en_attente">En attente</option>
          <option value="valide">Validé</option>
          <option value="rejete">Rejeté</option>
        </select>
      </div>

      {/* Tableau */}
      <div className="overflow-x-auto rounded-2xl bg-white shadow-card">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-ciel/60 text-xs uppercase tracking-wide text-nuit/60">
            <tr>
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Profil</th>
              <th className="px-4 py-3">Vicariat</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-nuit/5">
            {filtered.map((r) => (
              <tr
                key={r.id}
                onClick={() => setSelected(r)}
                className="cursor-pointer transition hover:bg-ciel/40"
              >
                <td className="px-4 py-3 font-medium text-nuit">
                  {r.prenom} {r.nom}
                </td>
                <td className="px-4 py-3 text-nuit/70">
                  {PROFIL_LABELS[r.profil]}
                </td>
                <td className="px-4 py-3 text-nuit/70">{r.vicariat}</td>
                <td className="px-4 py-3 text-nuit/70">
                  {formatDate(r.created_at)}
                </td>
                <td className="px-4 py-3">
                  <StatutBadge statut={r.statut} />
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-nuit/50">
                  Aucune inscription pour ces filtres.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <FicheModal
          inscription={selected}
          onClose={() => setSelected(null)}
          onValider={() => changerStatut(selected.id, 'valide')}
          onRejeter={() => changerStatut(selected.id, 'rejete')}
        />
      )}
    </main>
  )
}

// ---------------------------------------------------------------- Modal fiche
function Ligne({ label, value }: { label: string; value: React.ReactNode }) {
  if (value === null || value === undefined || value === '') return null
  return (
    <div className="flex flex-col gap-0.5 border-b border-nuit/5 py-2">
      <span className="text-xs uppercase tracking-wide text-nuit/45">
        {label}
      </span>
      <span className="text-sm text-nuit">{value}</span>
    </div>
  )
}

function FicheModal({
  inscription: r,
  onClose,
  onValider,
  onRejeter,
}: {
  inscription: Inscription
  onClose: () => void
  onValider: () => void
  onRejeter: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-nuit/50 p-0 sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-6 shadow-card sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            {r.photo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={r.photo_url}
                alt={`${r.prenom} ${r.nom}`}
                className="h-16 w-16 rounded-2xl object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-ciel text-2xl">
                👤
              </div>
            )}
            <div>
              <h2 className="text-lg font-bold text-nuit">
                {r.prenom} {r.nom}
              </h2>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-sm text-nuit/60">
                  {PROFIL_LABELS[r.profil]}
                </span>
                <StatutBadge statut={r.statut} />
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-nuit/50 hover:bg-ciel"
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        <div className="mb-2">
          <Ligne label="WhatsApp" value={r.whatsapp} />
          <Ligne label="Email" value={r.email} />
          <Ligne label="Vicariat" value={r.vicariat} />
          <Ligne label="Paroisse" value={r.paroisse} />
          <Ligne label="Secteur d'activité" value={r.secteur_activite} />
          <Ligne label="Profession" value={r.profession} />
          <Ligne label="Employeur" value={r.employeur} />

          {r.profil === 'encadreur' && (
            <>
              <Ligne label="Type de produit" value={r.type_produit} />
              <Ligne label="Description" value={r.description_produit} />
              <Ligne label="Capacité de production" value={r.capacite_production} />
              <Ligne
                label="Besoin de rebranding"
                value={r.besoin_rebranding ? 'Oui' : 'Non'}
              />
              <Ligne label="Lien / photo produit" value={r.lien_produit} />
            </>
          )}

          {r.profil === 'ambassadeur' && (
            <>
              <Ligne label="Motivation" value={r.motivation_ambassadeur} />
              <Ligne label="Réseau estimé" value={r.reseau_estime} />
              <Ligne label="Disponibilité" value={r.disponibilite} />
              <Ligne
                label="Canaux de vente"
                value={r.canaux_vente?.join(', ')}
              />
              <Ligne label="Code de parrainage" value={r.code_parrainage} />
            </>
          )}

          <Ligne label="Inscrit le" value={formatDate(r.created_at)} />
        </div>

        <div className="mt-4 flex gap-3">
          <button
            onClick={onValider}
            disabled={r.statut === 'valide'}
            className="fco-btn flex-1 bg-succes text-white hover:bg-succes/90 disabled:opacity-50"
          >
            ✓ Valider
          </button>
          <button
            onClick={onRejeter}
            disabled={r.statut === 'rejete'}
            className="fco-btn flex-1 bg-erreur text-white hover:bg-erreur/90 disabled:opacity-50"
          >
            ✕ Rejeter
          </button>
        </div>
      </div>
    </div>
  )
}
