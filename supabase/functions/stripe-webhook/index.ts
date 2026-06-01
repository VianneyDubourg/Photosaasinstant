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

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? ''
const SITE_URL = Deno.env.get('SITE_URL') ?? 'https://vlogo.fr'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
}

async function sendConfirmationEmail(to: string, downloadToken: string) {
  if (!RESEND_API_KEY) return
  const downloadUrl = `${SITE_URL}/success?token=${downloadToken}`
  const html = `
    <div style="background:#05050a;color:#ffffff;padding:40px;font-family:sans-serif;max-width:600px;margin:0 auto;">
      <h1 style="color:#a78bfa;font-size:28px;margin-bottom:4px;">PhotoInstant</h1>
      <p style="color:#6b7280;margin-bottom:32px;">Instant event photography · Australia</p>

      <h2 style="color:#ffffff;font-size:22px;margin-bottom:8px;">Your photo is ready! 🎉</h2>
      <p style="color:#9ca3af;line-height:1.6;margin-bottom:24px;">
        Payment confirmed. Click the button below to download your HD photo.
      </p>

      <div style="margin:32px 0;text-align:center;">
        <a href="${downloadUrl}"
           style="background:#7c3aed;color:#ffffff;padding:16px 32px;border-radius:12px;text-decoration:none;font-weight:700;font-size:18px;display:inline-block;">
          ⬇ Download HD Photo
        </a>
      </div>

      <div style="background:#0f0f1a;border:1px solid #1a1a2e;border-radius:12px;padding:16px;margin:24px 0;">
        <p style="color:#f59e0b;margin:0;font-size:14px;">
          ⏱ <strong>This link expires in 10 hours</strong> — download your photo now.
        </p>
      </div>

      <p style="color:#6b7280;font-size:13px;line-height:1.6;">
        Problem with your download? Contact us at
        <a href="mailto:hello@vlogo.fr" style="color:#a78bfa;">hello@vlogo.fr</a>
        or DM us on Instagram <a href="https://instagram.com/photoinstant" style="color:#a78bfa;">@photoinstant</a>.
      </p>

      <p style="color:#374151;font-size:12px;margin-top:32px;">© 2026 PhotoInstant · vlogo.fr</p>
    </div>
  `

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'PhotoInstant <noreply@vlogo.fr>',
      to: [to],
      subject: '📸 Your PhotoInstant photo is ready to download',
      html,
    }),
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const signature = req.headers.get('stripe-signature')
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? ''

  if (!signature) {
    return new Response('Missing stripe-signature header', { status: 400 })
  }

  let event: Stripe.Event

  try {
    const body = await req.text()
    event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Webhook verification failed'
    return new Response(JSON.stringify({ error: message }), { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    const photoId = session.metadata?.photo_id
    if (!photoId) {
      return new Response('Missing photo_id in metadata', { status: 400 })
    }

    const downloadToken = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 10 * 60 * 60 * 1000).toISOString()
    const buyerEmail = session.customer_details?.email ?? null

    const { error } = await supabase.from('orders').insert({
      photo_id: photoId,
      stripe_session_id: session.id,
      stripe_payment_intent: typeof session.payment_intent === 'string' ? session.payment_intent : null,
      buyer_email: buyerEmail,
      amount_total: session.amount_total ?? 0,
      currency: session.currency ?? 'aud',
      status: 'paid',
      download_token: downloadToken,
      download_expires_at: expiresAt,
    })

    if (error) {
      console.error('Failed to create order:', error)
      return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    }

    if (buyerEmail) {
      await sendConfirmationEmail(buyerEmail, downloadToken).catch(console.error)
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})
