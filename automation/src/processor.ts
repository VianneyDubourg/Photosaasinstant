import sharp from 'sharp'
import * as path from 'path'
import * as os from 'os'
import * as fs from 'fs'
import { logger } from './logger'

export interface ProcessedPhoto {
  previewPath: string
  originalPath: string
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

  logger.info(`Processing: ${path.basename(filePath)}`)

  // Read image metadata for taken_at (use file mtime as fallback)
  const stat = fs.statSync(filePath)
  let takenAt = stat.mtime

  try {
    const meta = await sharp(filePath).metadata()
    if (meta.exif) {
      // Try to extract DateTimeOriginal from EXIF if available
      const exifStr = meta.exif.toString('binary')
      const match = exifStr.match(/(\d{4}):(\d{2}):(\d{2}) (\d{2}):(\d{2}):(\d{2})/)
      if (match) {
        takenAt = new Date(`${match[1]}-${match[2]}-${match[3]}T${match[4]}:${match[5]}:${match[6]}`)
      }
    }
  } catch {
    // Use file mtime if EXIF fails
  }

  // Generate watermarked preview
  const watermarkSvg = Buffer.from(`
    <svg width="${config.previewWidth}" height="${Math.round(config.previewWidth * 0.667)}">
      <text
        x="50%"
        y="50%"
        text-anchor="middle"
        dominant-baseline="middle"
        font-family="Arial, sans-serif"
        font-size="${Math.round(config.previewWidth * 0.08)}px"
        font-weight="bold"
        fill="rgba(255,255,255,0.18)"
        transform="rotate(-25, ${config.previewWidth / 2}, ${Math.round(config.previewWidth * 0.667) / 2})"
        letter-spacing="8"
      >${config.watermarkText.toUpperCase()}</text>
    </svg>
  `)

  await sharp(filePath)
    .resize(config.previewWidth, undefined, { withoutEnlargement: true })
    .composite([{ input: watermarkSvg, blend: 'over' }])
    .jpeg({ quality: config.previewQuality })
    .toFile(previewPath)

  logger.success(`Preview generated: ${path.basename(previewPath)}`)

  return {
    previewPath,
    originalPath: filePath,
    takenAt,
  }
}
