import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { Photo, PhotoFilters } from '../types'

export function usePhotos(filters: PhotoFilters = {}) {
  return useQuery({
    queryKey: ['photos', filters],
    queryFn: async () => {
      let query = supabase
        .from('photos')
        .select('*')
        .eq('is_active', true)
        .order('taken_at', { ascending: false })

      if (filters.date) {
        const start = `${filters.date}T00:00:00`
        const end = `${filters.date}T23:59:59`
        query = query.gte('taken_at', start).lte('taken_at', end)
      }

      if (filters.hour_start !== undefined) {
        const paddedStart = String(filters.hour_start).padStart(2, '0')
        query = query.gte('taken_at::time', `${paddedStart}:00:00`)
      }

      if (filters.hour_end !== undefined) {
        const paddedEnd = String(filters.hour_end).padStart(2, '0')
        query = query.lt('taken_at::time', `${paddedEnd}:00:00`)
      }

      if (filters.location_label) {
        query = query.ilike('location_label', `%${filters.location_label}%`)
      }

      const { data, error } = await query
      if (error) throw error
      return (data ?? []) as Photo[]
    },
  })
}

export function usePhoto(id: string) {
  return useQuery({
    queryKey: ['photo', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single()
      if (error) throw error
      return data as Photo
    },
    enabled: !!id,
  })
}
