import * as fs from 'fs'
import * as path from 'path'

const LOG_FILE = path.join(process.cwd(), 'photoinstant-uploader.log')

function timestamp(): string {
  return new Date().toISOString()
}

function write(level: string, message: string): void {
  const line = `[${timestamp()}] [${level}] ${message}`
  console.log(line)
  fs.appendFileSync(LOG_FILE, line + '\n', 'utf8')
}

export const logger = {
  info: (msg: string) => write('INFO', msg),
  success: (msg: string) => write('OK  ', msg),
  warn: (msg: string) => write('WARN', msg),
  error: (msg: string) => write('ERR ', msg),
}
