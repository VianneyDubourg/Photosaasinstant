import * as path from 'path'
import * as fs from 'fs'
import { config as loadDotenv } from 'dotenv'
import { logger } from './logger'
import { startWatcher } from './watcher'

// Load .env from the same directory as the executable
const envPath = path.join(process.cwd(), '.env')
if (fs.existsSync(envPath)) {
  loadDotenv({ path: envPath })
} else {
  loadDotenv()
}

function requireEnv(key: string): string {
  const value = process.env[key]
  if (!value) throw new Error(`Missing required environment variable: ${key}`)
  return value
}

function main() {
  console.log('╔════════════════════════════════════╗')
  console.log('║   PhotoInstant Uploader v1.0.0     ║')
  console.log('╚════════════════════════════════════╝')
  console.log()

  let supabaseUrl: string
  let serviceRoleKey: string
  let watchFolder: string

  try {
    supabaseUrl = requireEnv('SUPABASE_URL')
    serviceRoleKey = requireEnv('SUPABASE_SERVICE_ROLE_KEY')
    watchFolder = requireEnv('WATCH_FOLDER')
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    logger.error(message)
    logger.error('Please create a .env file next to the executable. See .env.example for reference.')
    process.exit(1)
  }

  const locationLabel = process.env.LOCATION_LABEL ?? ''
  const priceCents = parseInt(process.env.PRICE_CENTS ?? '100', 10)
  const currency = process.env.CURRENCY ?? 'AUD'
  const previewWidth = parseInt(process.env.PREVIEW_WIDTH ?? '800', 10)
  const previewQuality = parseInt(process.env.PREVIEW_QUALITY ?? '75', 10)
  const watermarkText = process.env.WATERMARK_TEXT ?? 'photoinstant.au'

  startWatcher(
    watchFolder,
    { supabaseUrl, serviceRoleKey, locationLabel, priceCents, currency },
    { previewWidth, previewQuality, watermarkText }
  )
}

main()
