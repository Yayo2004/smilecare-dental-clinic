import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const LOG_PATH = path.join(__dirname, 'server.log')

export function log(...args) {
  const line = `[${new Date().toISOString()}] ${args.map((a) => (typeof a === 'string' ? a : JSON.stringify(a))).join(' ')}`
  try {
    fs.appendFileSync(LOG_PATH, line + '\n', 'utf-8')
  } catch {
    /* ignore */
  }
  try {
    console.log(line)
  } catch {
    /* ignore */
  }
}