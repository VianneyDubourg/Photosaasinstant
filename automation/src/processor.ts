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
        x="50%" y="40%"
        text-anchor="middle" dominant-baseline="middle"
        font-family="Arial, sans-serif"
        font-size="${Math.round(pw * 0.09)}px"
        font-weight="bold"
        fill="rgba(255,255,255,0.55)"
        transform="rotate(-25, ${pw / 2}, ${ph / 2})"
        letter-spacing="12"
      >${config.watermarkText.toUpperCase()}</text>
      <text
        x="50%" y="62%"
        text-anchor="middle" dominant-baseline="middle"
        font-family="Arial, sans-serif"
        font-size="${Math.round(pw * 0.09)}px"
        font-weight="bold"
        fill="rgba(255,255,255,0.55)"
        transform="rotate(-25, ${pw / 2}, ${ph / 2})"
        letter-spacing="12"
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
  const fontSize = Math.max(12, Math.round(imgWidth * 0.007))
  const bottomMargin = Math.round(fontSize * 1.8)
  const copyrightText = `© Vianney Dubourg · vlogo.fr`

  const copyrightOverlay = Buffer.from(`
    <svg width="${imgWidth}" height="${imgHeight}">
      <text
        x="50%" y="${imgHeight - bottomMargin}"
        text-anchor="middle" dominant-baseline="auto"
        font-family="Arial, Helvetica, sans-serif"
        font-size="${fontSize}px"
        fill="rgba(255,255,255,0.28)"
        letter-spacing="0.5"
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

