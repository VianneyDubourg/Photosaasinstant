import { Instagram, Phone, Mail, Building2, ArrowRight } from 'lucide-react'

export default function MarketingFooter() {
  return (
    <footer className="border-t border-white/10 bg-night-900 mt-12">

      {/* B2B widget */}
      <div className="border-b border-white/10 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-gradient-to-r from-accent/20 to-pink-500/10 border border-accent/30 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-accent/30 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                <Building2 className="text-accent-light" size={20} />
              </div>
              <div>
                <p className="text-white font-semibold text-base mb-0.5">
                  Bar, nightclub or event organiser?
                </p>
                <p className="text-white/50 text-sm leading-relaxed">
                  I provide on-site instant photo service for your clients — they scan, pay 1 AUD and download their HD photo in seconds. Perfect for bars, clubs, festivals and private events.
                </p>
              </div>
            </div>
            <a
              href="mailto:contact@photoinstant.au?subject=Photo service inquiry"
              className="flex-shrink-0 inline-flex items-center gap-2 bg-accent hover:bg-accent-dark transition-colors text-white px-5 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap"
            >
              Contact me
              <ArrowRight size={15} />
            </a>
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
              <a href="tel:+61400000000" className="flex items-center gap-1.5 hover:text-accent-light transition-colors">
                <Phone size={15} />
                <span>+61 400 000 000</span>
              </a>
              <a href="mailto:contact@photoinstant.au" className="flex items-center gap-1.5 hover:text-accent-light transition-colors">
                <Mail size={15} />
                <span>contact@photoinstant.au</span>
              </a>
            </div>
          </div>
          <p className="text-center text-white/30 text-xs mt-5">
            &copy; {new Date().getFullYear()} PhotoInstant. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
