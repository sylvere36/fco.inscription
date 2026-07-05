import { NextRequest, NextResponse } from 'next/server'
import {
  inscriptionSchema,
  ACCEPTED_IMAGE_TYPES,
  MAX_PHOTO_SIZE,
} from '@/lib/validations'
import { getSupabaseAdmin, FCO_PHOTOS_BUCKET } from '@/lib/supabase'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabaseAdmin()
    const formData = await req.formData()

    // 1. Extraire et valider les données texte
    const raw = Object.fromEntries(
      [...formData.entries()].filter(([, v]) => typeof v === 'string'),
    )
    const parsed = inscriptionSchema.safeParse(raw)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      )
    }

    // 2. Upload la photo dans Supabase Storage
    let photo_url: string | null = null
    const photoFile = formData.get('photo')
    if (photoFile instanceof File && photoFile.size > 0) {
      if (!ACCEPTED_IMAGE_TYPES.includes(photoFile.type)) {
        return NextResponse.json(
          { error: 'Format de photo non supporté.' },
          { status: 400 },
        )
      }
      if (photoFile.size > MAX_PHOTO_SIZE) {
        return NextResponse.json(
          { error: 'La photo dépasse la taille maximale (5 Mo).' },
          { status: 400 },
        )
      }

      const ext = (photoFile.name.split('.').pop() || 'jpg').toLowerCase()
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from(FCO_PHOTOS_BUCKET)
        .upload(fileName, photoFile, { contentType: photoFile.type })
      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from(FCO_PHOTOS_BUCKET).getPublicUrl(fileName)
      photo_url = publicUrl
    }

    // 3. Insérer dans la base (on écarte le consentement, non stocké)
    const { consent, ...record } = parsed.data
    void consent

    const { error } = await supabase.from('inscriptions').insert({
      ...record,
      photo_url,
    })
    if (error) throw error

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err) {
    console.error('[api/inscription]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
