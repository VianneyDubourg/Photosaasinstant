import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export interface Lead {
  id: string
  created_at: string
  email: string
  name: string | null
  venue_name: string | null
}

export function useLeads() {
  return useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leads')
        .select('id, created_at, email, name, venue_name')
        .order('created_at', { ascending: false })
      if (error) throw error
      return (data ?? []) as Lead[]
    },
  })
}
