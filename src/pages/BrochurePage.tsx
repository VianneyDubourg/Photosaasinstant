import { useState, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Download, CheckCircle, Loader2, Camera, Zap, Users, TrendingUp } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function BrochurePage() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [venueName, setVenueName] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: fnError } = await supabase.functions.invoke('send-brochure', {
      body: { email, name, venueName },
    })

    if (fnError) {
      setError('Something went wrong. Please try again.')
    } else {
      setDone(true)
    }
    setLoading(false)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">

      {/* Header */}
      <div className="text-center mb-12">
        <span className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-1.5 text-accent-light text-xs font-medium tracking-wide uppercase mb-4">
          For venues &amp; event organisers
        </span>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Instant photos.<br />
          <span className="text-gradient">Shared tonight.</span>
        </h1>
        <p className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed">
          Your guests post on social media while the energy is still alive — not 3 days later when nobody cares. Download our free brochure to see how it works.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-10 items-start">

        {/* Left — benefits */}
        <div className="space-y-5">
          {[
            { icon: Zap, title: 'Instant — not 3 days later', desc: 'Photos available during the event. Guests find theirs in under 2 minutes and post immediately while the mood is alive.' },
            { icon: TrendingUp, title: 'Free advertising for your venue', desc: 'Every guest who posts tags your venue. 50 guests posting = 50 organic stories. No ad budget needed.' },
            { icon: Users, title: 'Two booking options', desc: 'Budget: guests pay 1 AUD (photographer comes cheap). Premium: you pay full rate, guests get photos free.' },
            { icon: Camera, title: 'Professional quality', desc: 'Shot on a Panasonic Lumix S5IIX. Full HD. Not a phone camera, not a photo booth.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex gap-4">
              <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon className="text-accent-light" size={18} />
              </div>
              <div>
                <p className="text-white font-semibold mb-1">{title}</p>
                <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}

          <div className="bg-night-800 border border-white/10 rounded-xl p-4 mt-4">
            <p className="text-white/40 text-xs uppercase tracking-wide mb-2">The key insight</p>
            <p className="text-white/80 text-sm leading-relaxed italic">
              "Traditional photographers deliver in 3 days. By then the moment is dead and nobody posts. With PhotoInstant, your guests are sharing before they've finished their drink."
            </p>
          </div>
        </div>

        {/* Right — form */}
        <div>
          {done ? (
            <div className="bg-night-800 border border-green-500/30 rounded-2xl p-8 text-center">
              <div className="w-14 h-14 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-green-400" size={28} />
              </div>
              <h2 className="text-xl font-bold mb-2">Check your inbox!</h2>
              <p className="text-white/60 text-sm mb-6">
                We've sent the brochure to <strong className="text-white">{email}</strong>. Check your spam folder if you don't see it within a few minutes.
              </p>
              <Link to="/" className="text-accent-light hover:underline text-sm">← Back to home</Link>
            </div>
          ) : (
            <div className="bg-night-800 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-1">
                <Download className="text-accent-light" size={18} />
                <h2 className="text-lg font-bold">Get the free brochure</h2>
              </div>
              <p className="text-white/40 text-sm mb-6">
                PDF · Instant delivery · No spam
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                <div>
                  <label className="block text-sm text-white/60 mb-1.5">Your email *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@yourvenue.com"
                    className="w-full px-3 py-2.5 bg-night-700 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-accent/60 placeholder:text-white/20"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/60 mb-1.5">Your name <span className="text-white/30">(optional)</span></label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex"
                    className="w-full px-3 py-2.5 bg-night-700 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-accent/60 placeholder:text-white/20"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/60 mb-1.5">Venue or event name <span className="text-white/30">(optional)</span></label>
                  <input
                    type="text"
                    value={venueName}
                    onChange={(e) => setVenueName(e.target.value)}
                    placeholder="Club Nova, The Rooftop Bar..."
                    className="w-full px-3 py-2.5 bg-night-700 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-accent/60 placeholder:text-white/20"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-accent hover:bg-accent-dark disabled:opacity-60 transition-colors text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
                  {loading ? 'Sending…' : 'Send me the brochure'}
                </button>

                <p className="text-white/30 text-xs text-center">
                  No spam. One email with the brochure. That's it.
                </p>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
