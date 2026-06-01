import Stripe from 'https://esm.sh/stripe@14.25.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

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
    const { photoId } = await req.json()

    if (!photoId) {
      return new Response(JSON.stringify({ error: 'photoId is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { data: photo, error } = await supabase
      .from('photos')
      .select('id, price_cents, currency, location_label, taken_at, is_active')
      .eq('id', photoId)
      .eq('is_active', true)
      .single()

    if (error || !photo) {
      return new Response(JSON.stringify({ error: 'Photo not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const origin = req.headers.get('origin') ?? 'https://vlogo.fr'

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: photo.currency.toLowerCase(),
            product_data: {
              name: 'HD Event Photo',
              description: `${photo.location_label ?? 'Event'} — ${new Date(photo.taken_at).toLocaleDateString('en-AU')}`,
            },
            unit_amount: photo.price_cents,
          },
          quantity: 1,
        },
      ],
      metadata: {
        photo_id: photo.id,
      },
      success_url: `${origin}/success?token={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/photo/${photo.id}`,
    })

    return new Response(JSON.stringify({ url: session.url }), {
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
