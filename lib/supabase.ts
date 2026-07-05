import { createClient } from '@supabase/supabase-js'

// -----------------------------------------------------------------------------
// Clients Supabase.
//
// - supabaseAdmin : utilise la clé service_role. Bypass RLS. SERVEUR UNIQUEMENT
//   (API Routes). Ne JAMAIS importer côté client.
// - createBrowserClient : clé anon publique, pour un éventuel usage côté client.
// -----------------------------------------------------------------------------

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL

export function getSupabaseAdmin() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!SUPABASE_URL || !serviceKey) {
    throw new Error(
      'Variables Supabase manquantes : NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont requises.',
    )
  }
  return createClient(SUPABASE_URL, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

export const FCO_PHOTOS_BUCKET = 'fco-photos'
