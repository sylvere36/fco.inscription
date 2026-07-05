import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin, FCO_PHOTOS_BUCKET } from '@/lib/supabase'
import { checkAdminPassword } from '@/lib/admin-auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Extrait le nom de fichier dans le bucket à partir de l'URL publique.
// ex: https://xxx.supabase.co/storage/v1/object/public/fco-photos/123-abc.png → 123-abc.png
function fichierDepuisUrl(url: string | null): string | null {
  if (!url) return null
  const marqueur = `/${FCO_PHOTOS_BUCKET}/`
  const i = url.indexOf(marqueur)
  if (i === -1) return null
  return decodeURIComponent(url.slice(i + marqueur.length))
}

export async function POST(req: NextRequest) {
  try {
    const { password, id } = await req.json().catch(() => ({}))
    if (!checkAdminPassword(password)) {
      return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 401 })
    }
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Requête invalide' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()

    // Récupérer la photo pour la supprimer du Storage après coup.
    const { data: existing } = await supabase
      .from('inscriptions')
      .select('photo_url')
      .eq('id', id)
      .single()

    const { error } = await supabase.from('inscriptions').delete().eq('id', id)
    if (error) throw error

    // Suppression best-effort de la photo (n'échoue pas la requête si KO).
    const fichier = fichierDepuisUrl(existing?.photo_url ?? null)
    if (fichier) {
      await supabase.storage.from(FCO_PHOTOS_BUCKET).remove([fichier])
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[api/admin/supprimer]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
