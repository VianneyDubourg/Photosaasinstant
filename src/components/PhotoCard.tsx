import { Link } from 'react-router-dom'
import { MapPin, Clock } from 'lucide-react'
import type { Photo } from '../types'
import { getPreviewUrl } from '../lib/supabase'

interface Props {
  photo: Photo
}

export default function PhotoCard({ photo }: Props) {
  const previewUrl = getPreviewUrl(photo.preview_path)
  const time = new Date(photo.taken_at).toLocaleTimeString('en-AU', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <Link
      to={`/photo/${photo.id}`}
      className="group block rounded-xl overflow-hidden bg-night-800 border border-white/10 hover:border-accent/50 transition-all hover:scale-[1.02]"
    >
      <div className="aspect-[3/2] overflow-hidden relative">
        <img
          src={previewUrl}
          alt="Event photo preview"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-2 left-2 flex items-center gap-3 text-white/80 text-xs">
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {time}
          </span>
          {photo.location_label && (
            <span className="flex items-center gap-1">
              <MapPin size={11} />
              {photo.location_label}
            </span>
          )}
        </div>
      </div>
      <div className="p-3 flex items-center justify-between">
        <span className="text-white/50 text-xs">HD Download</span>
        <span className="text-accent-light font-semibold text-sm">
          {(photo.price_cents / 100).toFixed(2)} {photo.currency}
        </span>
      </div>
    </Link>
  )
}
