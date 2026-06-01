import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { Order } from '../types'

export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*, photos(taken_at, location_label, preview_path)')
        .order('created_at', { ascending: false })
      if (error) throw error
      return (data ?? []) as Order[]
    },
  })
}

export function useOrderByToken(token: string) {
  return useQuery({
    queryKey: ['order', token],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*, photos(*)')
        .eq('download_token', token)
        .eq('status', 'paid')
        .single()
      if (error) throw error
      return data as Order & { photos: unknown }
    },
    enabled: !!token,
  })
}
