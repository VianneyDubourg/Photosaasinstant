import { useEffect, useState, useCallback } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { usePhotos } from '../hooks/usePhotos'
import { getPreviewUrl } from '../lib/supabase'

const SLIDE_DURATION = 4000
const SITE_URL = import.meta.env.VITE_SITE_URL ?? window.location.origin

export default function SlideshowPage() {
  const { data: photos = [] } = usePhotos()
  const [current, setCurrent] = useState(0)
  const [fade, setFade] = useState(true)

  const next = useCallback(() => {
    if (photos.length === 0) return
    setFade(false)
    setTimeout(() => {
      setCurrent((c) => (c + 1) % photos.length)
      setFade(true)
    }, 400)
  }, [photos.length])

  useEffect(() => {
    if (photos.length === 0) return
    const interval = setInterval(next, SLIDE_DURATION)
    return () => clearInterval(interval)
  }, [next, photos.length])

  const photo = photos[current]
  const imageUrl = photo ? getPreviewUrl(photo.preview_path) : null

  return (
    <div className="fixed inset-0 bg-black flex overflow-hidden select-none">

      {/* Background photo — full bleed blur */}
      {imageUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center scale-110"
          style={{
            backgroundImage: `url(${imageUrl})`,
            filter: 'blur(24px) brightness(0.3)',
            transition: 'opacity 0.4s ease',
            opacity: fade ? 1 : 0,
          }}
        />
      )}

      {/* Left — Main photo */}
      <div className="relative flex-1 flex items-center justify-center p-8">
        {imageUrl ? (
          <img
            key={current}
            src={imageUrl}
            alt=""
            className="max-h-full max-w-full object-contain rounded-2xl shadow-2xl"
            style={{
              transition: 'opacity 0.4s ease',
              opacity: fade ? 1 : 0,
            }}
          />
        ) : (
          <div className="text-white/20 text-xl">Loading photos…</div>
        )}

        {/* Dot indicators */}
        {photos.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5">
            {photos.slice(0, 12).map((_, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === current % 12 ? 20 : 6,
                  height: 6,
                  background: i === current % 12 ? '#a78bfa' : 'rgba(255,255,255,0.3)',
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Right panel */}
      <div className="relative w-80 flex flex-col items-center justify-center gap-8 px-8 border-l border-white/10 bg-black/40 backdrop-blur-xl">

        {/* Logo / Brand */}
        <div className="text-center">
          <p className="text-white/50 text-xs tracking-[0.3em] uppercase mb-1">PhotoInstant</p>
          <div className="w-12 h-0.5 bg-purple-400 mx-auto" />
        </div>

        {/* Price */}
        <div className="text-center">
          <p className="text-white/60 text-sm mb-1 tracking-wide">Your photo in HD</p>
          <p className="text-white font-bold tracking-tight leading-none"
             style={{ fontSize: '5rem' }}>
            1<span className="text-purple-400">$</span>
          </p>
          <p className="text-white/50 text-sm mt-1">AUD · No account needed</p>
        </div>

        {/* QR Code */}
        <div className="flex flex-col items-center gap-3">
          <div className="bg-white p-3 rounded-2xl shadow-xl">
            <QRCodeSVG
              value={SITE_URL}
              size={160}
              bgColor="#ffffff"
              fgColor="#0a0a14"
              level="M"
            />
          </div>
          <p className="text-white/50 text-xs text-center leading-relaxed">
            Scan to find &amp; download<br />your photo instantly
          </p>
        </div>

        {/* Steps */}
        <div className="w-full space-y-2">
          {[
            { n: '1', label: 'Scan the QR code' },
            { n: '2', label: 'Find your photo' },
            { n: '3', label: 'Pay 1 AUD · Download HD' },
          ].map(({ n, label }) => (
            <div key={n} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-purple-500/30 border border-purple-400/40 flex items-center justify-center flex-shrink-0">
                <span className="text-purple-300 text-xs font-bold">{n}</span>
              </div>
              <span className="text-white/60 text-sm">{label}</span>
            </div>
          ))}
        </div>

        {/* URL */}
        <p className="text-white/30 text-xs text-center break-all">{SITE_URL}</p>
      </div>
    </div>
  )
}
