import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { CheckCircle, Download, Loader2, ArrowLeft } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function SuccessPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!token) {
      setLoading(false)
      setError(true)
      return
    }

    supabase.functions
      .invoke('get-download-url', { body: { token } })
      .then(({ data, error: fnError }) => {
        if (fnError || !data?.url) {
          setError(true)
        } else {
          setDownloadUrl(data.url)
        }
      })
      .finally(() => setLoading(false))
  }, [token])

  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="text-green-400" size={32} />
      </div>

      <h1 className="text-3xl font-bold mb-2">Payment Confirmed</h1>
      <p className="text-white/60 mb-8">Thank you! Your HD photo is ready to download.</p>

      {loading && (
        <div className="flex items-center justify-center gap-2 text-white/50">
          <Loader2 className="animate-spin" size={18} />
          <span>Preparing your download…</span>
        </div>
      )}

      {error && (
        <div className="text-red-400 text-sm space-y-2">
          <p>Could not prepare download link.</p>
          <p className="text-white/40">Please contact support with your order reference.</p>
        </div>
      )}

      {downloadUrl && (
        <a
          href={downloadUrl}
          download
          className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark transition-colors text-white px-8 py-3.5 rounded-xl font-semibold text-lg"
        >
          <Download size={20} />
          Download HD Photo
        </a>
      )}

      <div className="mt-8">
        <Link to="/photos" className="text-white/40 hover:text-white text-sm transition-colors flex items-center justify-center gap-1.5">
          <ArrowLeft size={14} />
          Back to gallery
        </Link>
      </div>
    </div>
  )
}
