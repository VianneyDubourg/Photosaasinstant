import { useState, useMemo } from 'react'
import { Calendar, Clock, MapPin, Instagram } from 'lucide-react'
import { usePhotos } from '../hooks/usePhotos'
import PhotoGrid from '../components/PhotoGrid'
import type { PhotoFilters } from '../types'

const HOURS = Array.from({ length: 24 }, (_, i) => i)

function formatHour(h: number) {
  return `${String(h).padStart(2, '0')}:00`
}

export default function GalleryPage() {
  const [date, setDate] = useState('')
  const [hourStart, setHourStart] = useState<number | undefined>()
  const [hourEnd, setHourEnd] = useState<number | undefined>()
  const [location, setLocation] = useState('')

  const filters: PhotoFilters = useMemo(
    () => ({
      date: date || undefined,
      hour_start: hourStart,
      hour_end: hourEnd,
      location_label: location || undefined,
    }),
    [date, hourStart, hourEnd, location]
  )

  const { data: photos = [], isLoading } = usePhotos(filters)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Find My Photo</h1>

      {/* Filters */}
      <div className="bg-night-800 border border-white/10 rounded-xl p-4 mb-8 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Date */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={15} />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-night-700 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-accent/60 [color-scheme:dark]"
              placeholder="Date"
            />
          </div>

          {/* Hour start */}
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={15} />
            <select
              value={hourStart ?? ''}
              onChange={(e) => setHourStart(e.target.value === '' ? undefined : Number(e.target.value))}
              className="w-full pl-9 pr-3 py-2.5 bg-night-700 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-accent/60 appearance-none"
            >
              <option value="">From (hour)</option>
              {HOURS.map((h) => (
                <option key={h} value={h}>{formatHour(h)}</option>
              ))}
            </select>
          </div>

          {/* Hour end */}
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={15} />
            <select
              value={hourEnd ?? ''}
              onChange={(e) => setHourEnd(e.target.value === '' ? undefined : Number(e.target.value))}
              className="w-full pl-9 pr-3 py-2.5 bg-night-700 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-accent/60 appearance-none"
            >
              <option value="">To (hour)</option>
              {HOURS.map((h) => (
                <option key={h} value={h}>{formatHour(h)}</option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={15} />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location (e.g. Club Name)"
              className="w-full pl-9 pr-3 py-2.5 bg-night-700 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-accent/60 placeholder:text-white/30"
            />
          </div>
        </div>

        {(date || hourStart !== undefined || hourEnd !== undefined || location) && (
          <button
            onClick={() => {
              setDate('')
              setHourStart(undefined)
              setHourEnd(undefined)
              setLocation('')
            }}
            className="text-white/50 hover:text-white text-xs transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      <div className="flex items-center justify-between mb-4">
        <p className="text-white/50 text-sm">{isLoading ? 'Loading…' : `${photos.length} photo${photos.length !== 1 ? 's' : ''} found`}</p>
      </div>

      <PhotoGrid photos={photos} loading={isLoading} />

      {/* Can't find your photo */}
      <div className="mt-12 border border-white/10 bg-night-800 rounded-2xl p-6 text-center">
        <p className="text-white/80 font-semibold mb-1">Can't find your photo?</p>
        <p className="text-white/50 text-sm mb-4">
          Photos are available for 10 hours after the event. If yours has expired or you can't find it, send me a DM on Instagram with a photo of yourself and I'll find it for you.
        </p>
        <a
          href="https://instagram.com/photoinstant"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all text-white px-5 py-2.5 rounded-xl font-medium text-sm"
        >
          <Instagram size={16} />
          DM me on Instagram
        </a>
      </div>
    </div>
  )
}
