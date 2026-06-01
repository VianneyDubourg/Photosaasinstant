import chokidar from 'chokidar'
import * as path from 'path'
import { logger } from './logger'
import { processPhoto } from './processor'
import { createUploader, type UploaderConfig } from './uploader'
import * as fs from 'fs'

const SUPPORTED_EXTENSIONS = new Set([
  '.jpg', '.jpeg', '.png',
  '.raw', '.arw', '.cr2', '.cr3', '.nef', '.orf', '.rw2',
])

const PROCESSING_DELAY_MS = 3000

export function startWatcher(
  watchFolder: string,
  uploaderConfig: UploaderConfig,
  processorConfig: {
    previewWidth: number
    previewQuality: number
    watermarkText: string
  }
) {
  const upload = createUploader(uploaderConfig)
  const pending = new Set<string>()

  if (!fs.existsSync(watchFolder)) {
    fs.mkdirSync(watchFolder, { recursive: true })
    logger.info(`Created watch folder: ${watchFolder}`)
  }

  logger.info(`Watching folder: ${watchFolder}`)
  logger.info(`Supported formats: ${[...SUPPORTED_EXTENSIONS].join(', ')}`)

  const watcher = chokidar.watch(watchFolder, {
    persistent: true,
    ignoreInitial: true,
    awaitWriteFinish: {
      stabilityThreshold: PROCESSING_DELAY_MS,
      pollInterval: 500,
    },
    depth: 0,
  })

  watcher.on('add', async (filePath: string) => {
    const ext = path.extname(filePath).toLowerCase()
    if (!SUPPORTED_EXTENSIONS.has(ext)) return
    if (pending.has(filePath)) return

    pending.add(filePath)
    logger.info(`New file detected: ${path.basename(filePath)}`)

    try {
      const processed = await processPhoto(filePath, processorConfig)
      const result = await upload(processed.previewPath, processed.originalPath, processed.takenAt)
      logger.success(`Done! Photo ID: ${result.photoId} — visible at /photo/${result.photoId}`)

      // Clean up temp preview
      try { fs.unlinkSync(processed.previewPath) } catch { /* ignore */ }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      logger.error(`Failed to process ${path.basename(filePath)}: ${message}`)
    } finally {
      pending.delete(filePath)
    }
  })

  watcher.on('error', (err: unknown) => {
    const message = err instanceof Error ? err.message : String(err)
    logger.error(`Watcher error: ${message}`)
  })

  logger.info('Watcher started. Drop photos into the folder to upload automatically.')
  logger.info('Press Ctrl+C to stop.\n')

  return watcher
}
