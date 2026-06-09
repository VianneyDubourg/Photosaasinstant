import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const { id, preview_path, hd_path } = await req.json()

  if (!id) {
    return new Response(JSON.stringify({ error: 'Missing photo id' }), { status: 400 })
  }

  const errors: string[] = []

  if (preview_path) {
    const { error } = await supabase.storage.from('previews').remove([preview_path])
    if (error) errors.push(`preview: ${error.message}`)
  }

  if (hd_path) {
    const { error } = await supabase.storage.from('originals').remove([hd_path])
    if (error) errors.push(`hd: ${error.message}`)
  }

  const { error: dbError } = await supabase.from('photos').delete().eq('id', id)
  if (dbError) {
    return new Response(JSON.stringify({ error: dbError.message }), { status: 500 })
  }

  return new Response(
    JSON.stringify({ success: true, storageErrors: errors }),
    { headers: { 'Content-Type': 'application/json' } }
  )
})
