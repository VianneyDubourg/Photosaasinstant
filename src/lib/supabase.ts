import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export function getPreviewUrl(path: string): string {
  const { data } = supabase.storage.from('previews').getPublicUrl(path)
  return data.publicUrl
}

export async function getHdSignedUrl(
  token: string
): Promise<string | null> {
  const { data, error } = await supabase.functions.invoke('get-download-url', {
    body: { token },
  })
  if (error) return null
  return data?.url ?? null
}
