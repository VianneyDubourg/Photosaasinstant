import { Link } from 'react-router-dom'
import { ArrowRight, Camera, Download, CreditCard } from 'lucide-react'
import { usePhotos } from '../hooks/usePhotos'
import PhotoGrid from '../components/PhotoGrid'

export default function HomePage() {
  const { data: photos, isLoading } = usePhotos()
  const latest = photos?.slice(0, 8) ?? []

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            Your night,{' '}
            <span className="text-gradient">captured.</span>
          </h1>
          <p className="text-white/60 text-lg mb-8 max-w-xl mx-auto">
            Find your photos from the event. Preview for free, download the HD version for just 1 AUD.
          </p>
          <Link
            to="/photos"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark transition-colors text-white px-8 py-3.5 rounded-xl font-semibold text-lg"
          >
            Find My Photo
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="py-12 px-4 bg-night-900/40">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-center text-white/80 mb-8">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Camera, title: 'Find your photo', desc: 'Browse by date, time or location' },
              { icon: CreditCard, title: 'Pay 1 AUD', desc: 'Secure checkout via Stripe' },
              { icon: Download, title: 'Download HD', desc: 'Instant access to full resolution' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center p-6 rounded-xl bg-night-800 border border-white/10">
                <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Icon className="text-accent-light" size={22} />
                </div>
                <h3 className="font-semibold mb-1">{title}</h3>
                <p className="text-white/50 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Photos */}
      {latest.length > 0 && (
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Latest Photos</h2>
              <Link to="/photos" className="text-accent-light hover:underline text-sm">
                View all →
              </Link>
            </div>
            <PhotoGrid photos={latest} loading={isLoading} />
          </div>
        </section>
      )}
    </div>
  )
}
