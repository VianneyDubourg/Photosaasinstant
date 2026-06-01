import { Link } from 'react-router-dom'
import { Camera } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="border-b border-white/10 bg-night-900/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <Camera className="text-accent-light" size={22} />
          <span className="text-gradient">PhotoInstant</span>
        </Link>
        <Link
          to="/photos"
          className="bg-accent hover:bg-accent-dark transition-colors text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          Find My Photo
        </Link>
      </div>
    </nav>
  )
}
