import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? ''
const PHOTOGRAPHER_EMAIL = Deno.env.get('PHOTOGRAPHER_EMAIL') ?? 'hello@vlogo.fr'
const BROCHURE_URL = Deno.env.get('BROCHURE_URL') ?? ''
const SITE_URL = Deno.env.get('SITE_URL') ?? 'https://vlogo.fr'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

async function sendEmail(to: string, subject: string, html: string) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'PhotoInstant <noreply@vlogo.fr>',
      to: [to],
      subject,
      html,
    }),
  })
  return res.ok
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, name, venueName } = await req.json()

    if (!email || !isValidEmail(email)) {
      return new Response(
        JSON.stringify({ error: 'Valid email address is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Store lead — always save regardless of email outcome
    const { error: leadError } = await supabase.from('leads').insert({
      email,
      name: name || null,
      venue_name: venueName || null,
    })
    if (leadError) console.error('Lead insert error:', leadError.message)

    // Email to client with brochure link
    const clientHtml = `
      <div style="background:#05050a;color:#ffffff;padding:40px;font-family:sans-serif;max-width:600px;margin:0 auto;">
        <h1 style="color:#a78bfa;font-size:28px;margin-bottom:8px;">PhotoInstant</h1>
        <p style="color:#9ca3af;margin-bottom:24px;">Instant event photography · Australia</p>
        <h2 style="color:#ffffff;font-size:20px;">Here's your free brochure${name ? `, ${name}` : ''}!</h2>
        <p style="color:#9ca3af;line-height:1.6;">
          Thanks for your interest in PhotoInstant. Find everything you need to know about
          how our instant photo service can work for your venue or event.
        </p>
        <div style="margin:32px 0;">
          <a href="${BROCHURE_URL}"
             style="background:#7c3aed;color:#ffffff;padding:14px 28px;border-radius:10px;text-decoration:none;font-weight:600;font-size:16px;display:inline-block;">
            ⬇ Download Brochure (PDF)
          </a>
        </div>
        <div style="border:1px solid #1a1a2e;border-radius:12px;padding:20px;margin:24px 0;">
          <p style="color:#ffffff;font-weight:600;margin:0 0 12px;">Why PhotoInstant?</p>
          <p style="color:#9ca3af;margin:4px 0;">✓ Photos available INSTANTLY — not 3 days later</p>
          <p style="color:#9ca3af;margin:4px 0;">✓ Guests post on social media THAT NIGHT</p>
          <p style="color:#9ca3af;margin:4px 0;">✓ Your venue gets organic exposure for free</p>
          <p style="color:#9ca3af;margin:4px 0;">✓ Only 1 AUD per photo — or free for guests on full service</p>
        </div>
        <p style="color:#9ca3af;">Ready to book? Just reply to this email or reach out directly:</p>
        <p style="color:#a78bfa;">hello@vlogo.fr</p>
        <p style="color:#374151;font-size:12px;margin-top:32px;">© 2026 PhotoInstant · Australia</p>
      </div>
    `

    await sendEmail(email, 'Your PhotoInstant brochure 📸', clientHtml)

    // Notification to photographer
    const notifHtml = `
      <div style="font-family:sans-serif;padding:24px;max-width:500px;">
        <h2 style="color:#7c3aed;">New brochure download 📥</h2>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px 0;color:#6b7280;">Email:</td><td style="padding:8px 0;font-weight:600;">${email}</td></tr>
          ${name ? `<tr><td style="padding:8px 0;color:#6b7280;">Name:</td><td style="padding:8px 0;">${name}</td></tr>` : ''}
          ${venueName ? `<tr><td style="padding:8px 0;color:#6b7280;">Venue:</td><td style="padding:8px 0;">${venueName}</td></tr>` : ''}
          <tr><td style="padding:8px 0;color:#6b7280;">Time:</td><td style="padding:8px 0;">${new Date().toLocaleString('en-AU')}</td></tr>
        </table>
        <p style="color:#374151;margin-top:16px;">Follow up within 24h for best conversion.</p>
        <a href="mailto:${email}?subject=Following up on your PhotoInstant inquiry"
           style="background:#7c3aed;color:white;padding:10px 20px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:8px;">
          Reply to ${email}
        </a>
      </div>
    `

    await sendEmail(PHOTOGRAPHER_EMAIL, `New lead: ${name || email}${venueName ? ` · ${venueName}` : ''}`, notifHtml)

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal error'
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
