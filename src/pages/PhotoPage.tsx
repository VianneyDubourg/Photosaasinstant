import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MapPin, Clock, Calendar, ArrowLeft, Download, Loader2, ShieldCheck } from 'lucide-react'
import { usePhoto } from '../hooks/usePhotos'
import { getPreviewUrl, supabase } from '../lib/supabase'

export default function PhotoPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: photo, isLoading, error } = usePhoto(id ?? '')
  const [purchasing, setPurchasing] = useState(false)

  const handlePurchase = async () => {
    if (!photo) return
    setPurchasing(true)
    try {
      const { data, error: fnError } = await supabase.functions.invoke('create-checkout', {
        body: { photoId: photo.id },
      })
      if (fnError) throw fnError
      if (data?.url) window.location.href = data.url
    } catch {
      alert('Payment failed to initialize. Please try again.')
    } finally {
      setPurchasing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-accent-light" size={32} />
      </div>
    )
  }

  if (error || !photo) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <p className="text-white/60 mb-4">Photo not found or has expired.</p>
        <button onClick={() => navigate(-1)} className="text-accent-light hover:underline">← Back to gallery</button>
      </div>
    )
  }

  const previewUrl = getPreviewUrl(photo.preview_path)
  const takenAt = new Date(photo.taken_at)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-white/50 hover:text-white text-sm mb-6 transition-colors">
        <ArrowLeft size={15} />
        Back to gallery
      </button>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div className="relative rounded-2xl overflow-hidden border border-white/10">
          <img
            src={previewUrl}
            alt="Photo preview"
            className="w-full"
          />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-white/20 font-bold text-2xl md:text-4xl rotate-[-25deg] select-none tracking-widest uppercase">
              PREVIEW
            </span>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold mb-3">Event Photo</h1>
            <div className="space-y-2 text-white/60 text-sm">
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                {takenAt.toLocaleDateString('en-AU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} />
                {takenAt.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })}
              </div>
              {photo.location_label && (
                <div className="flex items-center gap-2">
                  <MapPin size={14} />
                  {photo.location_label}
                </div>
              )}
            </div>
          </div>

          <div className="bg-night-800 border border-white/10 rounded-xl p-5">
            <p className="text-white/60 text-sm mb-1">HD Download</p>
            <p className="text-3xl font-bold text-white mb-1">
              {(photo.price_cents / 100).toFixed(2)}{' '}
              <span className="text-accent-light">{photo.currency}</span>
            </p>
            <p className="text-white/40 text-xs mb-4">Full resolution, no watermark</p>

            <button
              onClick={handlePurchase}
              disabled={purchasing}
              className="w-full bg-accent hover:bg-accent-dark disabled:opacity-60 transition-colors text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2"
            >
              {purchasing ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Download size={18} />
              )}
              {purchasing ? 'Redirecting…' : 'Download HD Photo'}
            </button>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-white/30 text-xs">
            <ShieldCheck size={13} />
            Secure payment via Stripe · Instant download
          </div>
        </div>
      </div>
    </div>
  )
}
