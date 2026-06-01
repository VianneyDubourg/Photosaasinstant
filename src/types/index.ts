export interface Photo {
  id: string
  created_at: string
  taken_at: string
  latitude: number | null
  longitude: number | null
  location_label: string | null
  preview_path: string
  hd_path: string
  price_cents: number
  currency: string
  is_active: boolean
  preview_url?: string
}

export interface Order {
  id: string
  created_at: string
  photo_id: string
  stripe_session_id: string
  stripe_payment_intent: string | null
  buyer_email: string | null
  amount_total: number
  currency: string
  status: string
  download_token: string
  download_expires_at: string | null
}

export interface PhotoFilters {
  date?: string
  hour_start?: number
  hour_end?: number
  location_label?: string
}
