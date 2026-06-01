import { Instagram, Mail, Building2, Users, Zap, Download } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function MarketingFooter() {
  return (
    <footer className="border-t border-white/10 bg-night-900 mt-12">

      {/* B2B widget */}
      <div className="border-b border-white/10 py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-1.5 mb-3">
              <Building2 size={13} className="text-accent-light" />
              <span className="text-accent-light text-xs font-medium tracking-wide uppercase">For venues &amp; organisers</span>
            </div>
            <h2 className="text-white font-bold text-xl mb-1">Want instant photos at your event?</h2>
            <p className="text-white/50 text-sm">Two simple options — pick what works for you.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {/* Option A */}
            <div className="bg-night-800 border border-white/10 hover:border-accent/40 transition-colors rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Users size={15} className="text-green-400" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Budget booking</p>
                  <p className="text-green-400 text-xs">Clients pay for their own photos</p>
                </div>
              </div>
              <p className="text-white/50 text-sm leading-relaxed mb-3">
                I come at a reduced rate. Your clients scan the QR code, pay <strong className="text-white">1 AUD</strong> and download their HD photo instantly. Zero cost to you beyond my booking fee.
              </p>
              <a
                href="mailto:hello@vlogo.fr?subject=Budget booking inquiry&body=Hi, I'm interested in the budget booking option (clients pay 1 AUD for their photos). My event details:"
                className="inline-flex items-center gap-1.5 text-green-400 hover:text-green-300 text-xs font-medium transition-colors"
              >
                Get a quote →
              </a>
            </div>

            {/* Option B */}
            <div className="bg-night-800 border border-accent/30 hover:border-accent/60 transition-colors rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute top-3 right-3">
                <span className="bg-accent/20 text-accent-light text-xs px-2 py-0.5 rounded-full font-medium">Premium</span>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
                  <Zap size={15} className="text-accent-light" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Full service</p>
                  <p className="text-accent-light text-xs">Photos free for all your guests</p>
                </div>
              </div>
              <p className="text-white/50 text-sm leading-relaxed mb-3">
                You pay my full rate, your guests download their HD photos for <strong className="text-white">free</strong>. A premium experience — perfect for brand activations, corporate events or luxury venues.
              </p>
              <a
                href="mailto:hello@vlogo.fr?subject=Full service booking inquiry&body=Hi, I'm interested in the full service option (photos free for guests, I pay the full rate). My event details:"
                className="inline-flex items-center gap-1.5 text-accent-light hover:text-white text-xs font-medium transition-colors"
              >
                Get a quote →
              </a>
            </div>
          </div>

          <p className="text-center text-white/30 text-xs">
            Not sure which option? <a href="mailto:hello@vlogo.fr?subject=Venue inquiry" className="text-accent-light hover:underline">Send me a message</a> and we'll figure it out together.
          </p>
          <div className="text-center mt-3">
            <Link to="/brochure" className="inline-flex items-center gap-1.5 text-white/50 hover:text-accent-light text-xs transition-colors">
              <Download size={12} />
              Download our free brochure (PDF)
            </Link>
          </div>
        </div>
      </div>

      {/* Standard footer */}
      <div className="py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center space-y-2 text-sm text-white/60">
            <p className="text-white/80 font-medium">📸 Organizing an event? Book a photographer.</p>
            <div className="flex flex-wrap items-center justify-center gap-5 mt-3">
              <a
                href="https://instagram.com/photoinstant"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-accent-light transition-colors"
              >
                <Instagram size={15} />
                <span>@photoinstant</span>
              </a>
<a href="mailto:hello@vlogo.fr" className="flex items-center gap-1.5 hover:text-accent-light transition-colors">
                <Mail size={15} />
                <span>hello@vlogo.fr</span>
              </a>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 mt-4 text-white/30 text-xs">
            <Link to="/terms" className="hover:text-white/60 transition-colors">Terms</Link>
            <span>·</span>
            <Link to="/privacy" className="hover:text-white/60 transition-colors">Privacy</Link>
            <span>·</span>
            <Link to="/refund" className="hover:text-white/60 transition-colors">Refund Policy</Link>
          </div>
          <p className="text-center text-white/30 text-xs mt-2">
            &copy; {new Date().getFullYear()} PhotoInstant. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
