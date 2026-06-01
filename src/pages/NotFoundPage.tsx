import { Link } from 'react-router-dom'
import { Camera, ArrowLeft } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <Camera className="text-accent-light" size={28} />
      </div>
      <p className="text-accent-light font-mono text-sm mb-3 tracking-widest">404</p>
      <h1 className="text-3xl font-bold mb-3">Page not found</h1>
      <p className="text-white/50 mb-8">This page doesn't exist or has been removed.</p>
      <Link
        to="/photos"
        className="inline-flex items-center gap-2 bg-accent hover:bg-accent/80 transition-colors text-white px-6 py-3 rounded-xl font-medium"
      >
        <ArrowLeft size={16} />
        Browse photos
      </Link>
    </div>
  )
}
