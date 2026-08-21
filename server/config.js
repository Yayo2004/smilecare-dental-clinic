import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CONFIG_PATH = path.join(__dirname, 'config.json')

const DEFAULTS = {
  adminPass: process.env.ADMIN_PASS || 'smilecare2024',
}

export function getConfig() {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'))
    }
  } catch { /* ignore corrupt file */ }
  return { ...DEFAULTS }
}

export function saveConfig(cfg) {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(cfg, null, 2))
}

export function getAdminPass() {
  return getConfig().adminPass
}

export function setAdminPass(newPass) {
  const cfg = getConfig()
  cfg.adminPass = newPass
  saveConfig(cfg)
}
