import * as path from 'path'
import * as fs from 'fs'
import * as readline from 'readline'
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

function askQuestion(question: string): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close()
      resolve(answer.trim())
    })
  })
}

async function main() {
  console.log('╔════════════════════════════════════╗')
  console.log('║   PhotoInstant Uploader v1.1.0     ║')
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

  // Ask for location interactively
  const envLocation = process.env.LOCATION_LABEL ?? ''
  let locationLabel: string

  if (envLocation) {
    const override = await askQuestion(`📍 Location [${envLocation}] — press Enter to keep or type a new one: `)
    locationLabel = override || envLocation
  } else {
    locationLabel = await askQuestion('📍 Location for this session (e.g. "Surry Hills", "Sydney CBD"): ')
  }

  if (locationLabel) {
    console.log(`✓ Location set to: ${locationLabel}\n`)
  } else {
    console.log('⚠ No location set — photos will have no location tag\n')
  }

  const priceCents = parseInt(process.env.PRICE_CENTS ?? '100', 10)
  const currency = process.env.CURRENCY ?? 'AUD'
  const previewWidth = parseInt(process.env.PREVIEW_WIDTH ?? '800', 10)
  const previewQuality = parseInt(process.env.PREVIEW_QUALITY ?? '75', 10)
  const watermarkText = process.env.WATERMARK_TEXT ?? 'PREVIEW'

  startWatcher(
    watchFolder,
    { supabaseUrl, serviceRoleKey, locationLabel, priceCents, currency },
    { previewWidth, previewQuality, watermarkText }
  )
}

main()
