import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import { logger } from './logger'

export interface UploaderConfig {
  supabaseUrl: string
  serviceRoleKey: string
  locationLabel: string
  priceCents: number
  currency: string
}

export function createUploader(config: UploaderConfig) {
  const supabase = createClient(config.supabaseUrl, config.serviceRoleKey)

  return async function upload(
    previewPath: string,
    originalPath: string,
    takenAt: Date
  ): Promise<{ photoId: string }> {
    const id = crypto.randomUUID()
    const ext = path.extname(originalPath).toLowerCase().replace('.', '')
    const safeExt = ['jpg', 'jpeg', 'png'].includes(ext) ? ext : 'jpg'

    const previewStoragePath = `${id}_preview.jpg`
    const hdStoragePath = `${id}_hd.${safeExt}`

    // Upload preview (public bucket)
    logger.info(`Uploading preview to storage…`)
    const previewBuffer = fs.readFileSync(previewPath)
    const { error: previewError } = await supabase.storage
      .from('previews')
      .upload(previewStoragePath, previewBuffer, {
        contentType: 'image/jpeg',
        upsert: false,
      })

    if (previewError) throw new Error(`Preview upload failed: ${previewError.message}`)
    logger.success(`Preview uploaded: ${previewStoragePath}`)

    // Upload original (private bucket)
    logger.info(`Uploading HD original to storage…`)
    const originalBuffer = fs.readFileSync(originalPath)
    const { error: hdError } = await supabase.storage
      .from('originals')
      .upload(hdStoragePath, originalBuffer, {
        contentType: `image/${safeExt === 'jpg' ? 'jpeg' : safeExt}`,
        upsert: false,
      })

    if (hdError) throw new Error(`HD upload failed: ${hdError.message}`)
    logger.success(`HD uploaded: ${hdStoragePath}`)

    // Create database record
    logger.info(`Creating database record…`)
    const { error: dbError } = await supabase.from('photos').insert({
      id,
      taken_at: takenAt.toISOString(),
      location_label: config.locationLabel || null,
      preview_path: previewStoragePath,
      hd_path: hdStoragePath,
      price_cents: config.priceCents,
      currency: config.currency,
      is_active: true,
    })

    if (dbError) throw new Error(`Database insert failed: ${dbError.message}`)
    logger.success(`Photo record created: ${id}`)

    return { photoId: id }
  }
}
