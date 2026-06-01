import PhotoCard from './PhotoCard'
import type { Photo } from '../types'

interface Props {
  photos: Photo[]
  loading?: boolean
}

export default function PhotoGrid({ photos, loading }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[3/2] rounded-xl bg-night-800 animate-pulse"
          />
        ))}
      </div>
    )
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-16 text-white/40">
        <p className="text-lg">No photos found.</p>
        <p className="text-sm mt-1">Try adjusting your filters.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {photos.map((photo) => (
        <PhotoCard key={photo.id} photo={photo} />
      ))}
    </div>
  )
}
