import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { token } = await req.json()

    if (!token) {
      return new Response(JSON.stringify({ error: 'token is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Try by download_token first, then by stripe_session_id
    let query = supabase
      .from('orders')
      .select('*, photos(hd_path)')
      .eq('status', 'paid')

    const isStripeSession = token.startsWith('cs_')
    if (isStripeSession) {
      query = query.eq('stripe_session_id', token)
    } else {
      query = query.eq('download_token', token)
    }

    const { data: order, error: orderError } = await query.single()

    if (orderError || !order) {
      return new Response(JSON.stringify({ error: 'Invalid or expired token' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (order.download_expires_at && new Date(order.download_expires_at) < new Date()) {
      return new Response(JSON.stringify({ error: 'Download link has expired' }), {
        status: 410,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const hdPath = order.photos?.hd_path
    if (!hdPath) {
      return new Response(JSON.stringify({ error: 'Photo file not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { data: signedData, error: signedError } = await supabase.storage
      .from('originals')
      .createSignedUrl(hdPath, 60 * 60)

    if (signedError || !signedData?.signedUrl) {
      return new Response(JSON.stringify({ error: 'Could not generate download URL' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ url: signedData.signedUrl }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal error'
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
