import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { checkAdminPassword } from '@/lib/admin-auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json().catch(() => ({}))
    if (!checkAdminPassword(password)) {
      return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 401 })
    }

    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('inscriptions')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json({ inscriptions: data })
  } catch (err) {
    console.error('[api/admin/inscriptions]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
