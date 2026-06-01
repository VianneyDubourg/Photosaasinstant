import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { CheckCircle, Download, Loader2, ArrowLeft, Clock, Mail, Instagram, AlertCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function SuccessPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [downloaded, setDownloaded] = useState(false)

  useEffect(() => {
    if (!token) {
      setLoading(false)
      setError('No download token found.')
      return
    }

    supabase.functions
      .invoke('get-download-url', { body: { token } })
      .then(({ data, error: fnError }) => {
        if (fnError || !data?.url) {
          setError('Could not prepare your download link.')
        } else {
          setDownloadUrl(data.url)
        }
      })
      .finally(() => setLoading(false))
  }, [token])

  return (
    <div className="max-w-lg mx-auto px-4 py-16">

      {/* Header */}
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="text-green-400" size={32} />
        </div>
        <h1 className="text-3xl font-bold mb-2">Payment confirmed</h1>
        <p className="text-white/50">Your HD photo is ready — download it now before the link expires.</p>
      </div>

      {/* Download card */}
      <div className="bg-night-800 border border-white/10 rounded-2xl p-6 mb-5">

        {loading && (
          <div className="flex items-center justify-center gap-2 text-white/50 py-4">
            <Loader2 className="animate-spin" size={18} />
            <span>Preparing your download…</span>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-3 text-red-400 text-sm">
            <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">{error}</p>
              <p className="text-white/40 mt-1">Contact us below and we'll sort it out.</p>
            </div>
          </div>
        )}

        {downloadUrl && (
          <div className="text-center">
            <a
              href={downloadUrl}
              download
              onClick={() => setDownloaded(true)}
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent/80 transition-colors text-white px-8 py-4 rounded-xl font-semibold text-lg w-full justify-center"
            >
              <Download size={20} />
              Download HD Photo
            </a>
            {downloaded && (
              <p className="text-green-400 text-sm mt-3">Downloaded — enjoy your photo!</p>
            )}
          </div>
        )}
      </div>

      {/* Expiry warning */}
      <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 mb-8 text-amber-300 text-sm">
        <Clock size={16} className="flex-shrink-0 mt-0.5" />
        <p>This link is valid for <strong>10 hours</strong> from purchase — the same window as the event photos. Save your photo now.</p>
      </div>

      {/* Support */}
      <div className="border-t border-white/10 pt-6 text-center">
        <p className="text-white/40 text-sm mb-3">Problem with your download?</p>
        <div className="flex items-center justify-center gap-5 text-sm">
          <a href="mailto:hello@vlogo.fr" className="flex items-center gap-1.5 text-white/50 hover:text-accent-light transition-colors">
            <Mail size={14} />
            hello@vlogo.fr
          </a>
          <a href="https://instagram.com/vlogo.photoinstant" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-white/50 hover:text-accent-light transition-colors">
            <Instagram size={14} />
            vlogo.photoinstant
          </a>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link to="/photos" className="text-white/30 hover:text-white text-sm transition-colors inline-flex items-center gap-1.5">
          <ArrowLeft size={13} />
          Back to gallery
        </Link>
      </div>

    </div>
  )
}
