import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

Deno.serve(async () => {
  const cutoff = new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString()

  // Fetch photos older than 10 hours
  const { data: photos, error: fetchError } = await supabase
    .from('photos')
    .select('id, preview_path, hd_path')
    .lt('taken_at', cutoff)

  if (fetchError) {
    return new Response(JSON.stringify({ error: fetchError.message }), { status: 500 })
  }

  if (!photos || photos.length === 0) {
    return new Response(JSON.stringify({ deleted: 0, message: 'Nothing to clean up' }))
  }

  const previewPaths = photos.map((p) => p.preview_path)
  const hdPaths = photos.map((p) => p.hd_path)
  const ids = photos.map((p) => p.id)

  // Delete storage files
  await supabase.storage.from('previews').remove(previewPaths)
  await supabase.storage.from('originals').remove(hdPaths)

  // Delete database records
  const { error: deleteError } = await supabase
    .from('photos')
    .delete()
    .in('id', ids)

  if (deleteError) {
    return new Response(JSON.stringify({ error: deleteError.message }), { status: 500 })
  }

  console.log(`Cleaned up ${photos.length} photos older than 10 hours`)

  return new Response(
    JSON.stringify({ deleted: photos.length, ids }),
    { headers: { 'Content-Type': 'application/json' } }
  )
})
