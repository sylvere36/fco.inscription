import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { checkAdminPassword } from '@/lib/admin-auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const STATUTS = ['en_attente', 'valide', 'rejete'] as const

function genererCodeParrainage(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // sans caractères ambigus
  let suffix = ''
  for (let i = 0; i < 6; i++) {
    suffix += alphabet[Math.floor(Math.random() * alphabet.length)]
  }
  return `FCO-${suffix}`
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const { password, id, statut } = body as {
      password?: string
      id?: string
      statut?: string
    }

    if (!checkAdminPassword(password)) {
      return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 401 })
    }
    if (!id || !statut || !STATUTS.includes(statut as (typeof STATUTS)[number])) {
      return NextResponse.json({ error: 'Requête invalide' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()

    // Récupérer l'inscription pour connaître le profil et l'éventuel code existant.
    const { data: existing, error: fetchError } = await supabase
      .from('inscriptions')
      .select('profil, code_parrainage')
      .eq('id', id)
      .single()
    if (fetchError) throw fetchError

    const update: Record<string, unknown> = { statut }

    // Génération du code de parrainage à la validation d'un ambassadeur.
    if (
      statut === 'valide' &&
      existing.profil === 'ambassadeur' &&
      !existing.code_parrainage
    ) {
      // Quelques tentatives en cas de collision sur la contrainte UNIQUE.
      for (let attempt = 0; attempt < 5; attempt++) {
        const code = genererCodeParrainage()
        const { data, error } = await supabase
          .from('inscriptions')
          .update({ statut, code_parrainage: code })
          .eq('id', id)
          .select('*')
          .single()
        if (!error) {
          return NextResponse.json({ inscription: data })
        }
        // 23505 = unique_violation ; on réessaie avec un autre code.
        if ((error as { code?: string }).code !== '23505') throw error
      }
      return NextResponse.json(
        { error: 'Impossible de générer un code unique, réessayez.' },
        { status: 500 },
      )
    }

    const { data, error } = await supabase
      .from('inscriptions')
      .update(update)
      .eq('id', id)
      .select('*')
      .single()
    if (error) throw error

    return NextResponse.json({ inscription: data })
  } catch (err) {
    console.error('[api/admin/statut]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
