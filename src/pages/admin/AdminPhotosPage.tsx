import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, getPreviewUrl } from '../../lib/supabase'
import { Trash2, Eye, EyeOff, Upload, Loader2 } from 'lucide-react'
import type { Photo } from '../../types'

export default function AdminPhotosPage() {
  const qc = useQueryClient()
  const [uploading, setUploading] = useState(false)

  const { data: photos = [], isLoading } = useQuery({
    queryKey: ['admin-photos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .order('taken_at', { ascending: false })
      if (error) throw error
      return data as Photo[]
    },
  })

  const toggleActive = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from('photos').update({ is_active }).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-photos'] }),
  })

  const deletePhoto = useMutation({
    mutationFn: async (photo: Photo) => {
      const { error } = await supabase.functions.invoke('delete-photo', {
        body: { id: photo.id, preview_path: photo.preview_path, hd_path: photo.hd_path },
      })
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-photos'] }),
  })

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploading(true)

    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop()
      const id = crypto.randomUUID()
      const previewPath = `${id}_preview.${ext}`
      const hdPath = `${id}_hd.${ext}`

      const { error: previewError } = await supabase.storage
        .from('previews')
        .upload(previewPath, file)

      const { error: hdError } = await supabase.storage
        .from('originals')
        .upload(hdPath, file)

      if (!previewError && !hdError) {
        await supabase.from('photos').insert({
          id,
          taken_at: new Date().toISOString(),
          preview_path: previewPath,
          hd_path: hdPath,
          price_cents: 100,
          currency: 'AUD',
          is_active: true,
        })
      }
    }

    setUploading(false)
    qc.invalidateQueries({ queryKey: ['admin-photos'] })
    e.target.value = ''
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Photos</h1>
        <label className="flex items-center gap-2 bg-accent hover:bg-accent-dark transition-colors text-white px-4 py-2 rounded-lg text-sm font-medium cursor-pointer">
          {uploading ? <Loader2 className="animate-spin" size={15} /> : <Upload size={15} />}
          {uploading ? 'Uploading…' : 'Upload Photos'}
          <input type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" disabled={uploading} />
        </label>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-accent-light" size={24} />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className={`relative rounded-xl overflow-hidden border ${photo.is_active ? 'border-white/10' : 'border-red-500/30 opacity-60'}`}
            >
              <img
                src={getPreviewUrl(photo.preview_path)}
                alt=""
                className="w-full aspect-[3/2] object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-1.5">
                <button
                  onClick={() => toggleActive.mutate({ id: photo.id, is_active: !photo.is_active })}
                  className="w-7 h-7 bg-black/60 rounded-lg flex items-center justify-center hover:bg-black/80 transition-colors"
                  title={photo.is_active ? 'Hide' : 'Show'}
                >
                  {photo.is_active ? <Eye size={13} /> : <EyeOff size={13} className="text-red-400" />}
                </button>
                <button
                  onClick={() => {
                    if (confirm('Delete this photo? This cannot be undone.')) deletePhoto.mutate(photo)
                  }}
                  className="w-7 h-7 bg-black/60 rounded-lg flex items-center justify-center hover:bg-red-500/60 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
