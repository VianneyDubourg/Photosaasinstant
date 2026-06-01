import { Instagram, Phone, Mail } from 'lucide-react'

export default function MarketingFooter() {
  return (
    <footer className="border-t border-white/10 bg-night-900 py-8 mt-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center space-y-2 text-sm text-white/60">
          <p className="text-white/80 font-medium">Organizing an event? Book a photographer.</p>
          <div className="flex items-center justify-center gap-6 mt-3">
            <a
              href="https://instagram.com"
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
        <p className="text-center text-white/30 text-xs mt-6">
          &copy; {new Date().getFullYear()} PhotoInstant. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
