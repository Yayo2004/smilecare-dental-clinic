import { useState, useEffect } from 'react'

/**
 * Lightweight typewriter hook.
 * Returns { displayed, isComplete } — the progressively revealed string
 * and whether typing has finished. Resets when `text` changes (e.g. on language switch).
 *
 * @param {string}  text   — full string to type
 * @param {number}  speed  — ms per character (default 35)
 * @param {boolean} enable — pause/resume toggle (default true)
 */
export function useTypewriter(text, speed = 35, enable = true) {
  const [displayed, setDisplayed] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    setDisplayed('')
    setIsComplete(false)

    if (!enable || !text) return

    let i = 0
    const id = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) {
        setIsComplete(true)
        clearInterval(id)
      }
    }, speed)

    return () => clearInterval(id)
  }, [text, speed, enable])

  return { displayed, isComplete }
}
