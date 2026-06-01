import sharp from 'sharp'
import * as path from 'path'
import * as os from 'os'
import * as fs from 'fs'
import { logger } from './logger'

export interface ProcessedPhoto {
  previewPath: string
  hdPath: string
  takenAt: Date
}

export async function processPhoto(filePath: string, config: {
  previewWidth: number
  previewQuality: number
  watermarkText: string
}): Promise<ProcessedPhoto> {
  const tmpDir = os.tmpdir()
  const baseName = path.basename(filePath, path.extname(filePath))
  const previewPath = path.join(tmpDir, `${baseName}_preview.jpg`)
  const hdPath = path.join(tmpDir, `${baseName}_hd.jpg`)

  logger.info(`Processing: ${path.basename(filePath)}`)

  // Read image metadata for taken_at (use file mtime as fallback)
  const stat = fs.statSync(filePath)
  let takenAt = stat.mtime

  const meta = await sharp(filePath).metadata()

  try {
    if (meta.exif) {
      const exifStr = meta.exif.toString('binary')
      const match = exifStr.match(/(\d{4}):(\d{2}):(\d{2}) (\d{2}):(\d{2}):(\d{2})/)
      if (match) {
        takenAt = new Date(`${match[1]}-${match[2]}-${match[3]}T${match[4]}:${match[5]}:${match[6]}`)
      }
    }
  } catch {
    // Use file mtime if EXIF fails
  }

  const imgWidth = meta.width ?? 1920
  const imgHeight = meta.height ?? 1280

  // ── 1. Preview — resized + diagonal PREVIEW watermark ──────────────────
  const pw = config.previewWidth
  const ph = Math.round(pw * 0.667)

  const previewWatermark = Buffer.from(`
    <svg width="${pw}" height="${ph}">
      <text
        x="50%" y="50%"
        text-anchor="middle" dominant-baseline="middle"
        font-family="Arial, sans-serif"
        font-size="${Math.round(pw * 0.08)}px"
        font-weight="bold"
        fill="rgba(255,255,255,0.18)"
        transform="rotate(-25, ${pw / 2}, ${ph / 2})"
        letter-spacing="8"
      >${config.watermarkText.toUpperCase()}</text>
    </svg>
  `)

  await sharp(filePath)
    .resize(pw, undefined, { withoutEnlargement: true })
    .composite([{ input: previewWatermark, blend: 'over' }])
    .jpeg({ quality: config.previewQuality })
    .toFile(previewPath)

  logger.success(`Preview generated: ${path.basename(previewPath)}`)

  // ── 2. HD — full resolution + subtle copyright at bottom center ─────────
  const fontSize = Math.max(18, Math.round(imgWidth * 0.012))
  const barHeight = Math.round(fontSize * 2.4)
  const copyrightText = `© Vianney Dubourg · vlogo.fr`

  const copyrightOverlay = Buffer.from(`
    <svg width="${imgWidth}" height="${imgHeight}">
      <rect
        x="0" y="${imgHeight - barHeight}"
        width="${imgWidth}" height="${barHeight}"
        fill="rgba(0,0,0,0.38)"
      />
      <text
        x="50%" y="${imgHeight - barHeight / 2}"
        text-anchor="middle" dominant-baseline="middle"
        font-family="Arial, Helvetica, sans-serif"
        font-size="${fontSize}px"
        fill="rgba(255,255,255,0.72)"
        letter-spacing="1"
      >${copyrightText}</text>
    </svg>
  `)

  await sharp(filePath)
    .composite([{ input: copyrightOverlay, blend: 'over' }])
    .jpeg({ quality: 95 })
    .toFile(hdPath)

  logger.success(`HD processed with copyright: ${path.basename(hdPath)}`)

  return {
    previewPath,
    hdPath,
    takenAt,
  }
}

