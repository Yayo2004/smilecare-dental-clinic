import { useEffect, useRef, useState } from 'react'

/**
 * Lightweight rotating typewriter hook.
 * Types each title character by character, holds it, then deletes it
 * (backspace effect) and moves on to the next title — looping forever.
 *
 * @param {string[]} titles — array of taglines to cycle through
 * @param {object}   opts   — { speed, deleteSpeed, holdMs, enable }
 * @returns {{ displayed: string, phase: string, index: number, ready: boolean }}
 */
export function useRotatingTypewriter(
  titles,
  { speed = 45, deleteSpeed = 28, holdMs = 2000, enable = true } = {},
) {
  const [index, setIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [phase, setPhase] = useState('typing') // 'typing' | 'pause' | 'deleting'
  const [ready, setReady] = useState(false)
  const readyRef = useRef(false)
  const titlesKey = titles.join('|')

  // Reset when the list changes (e.g. language switch)
  useEffect(() => {
    setIndex(0)
    setDisplayed('')
    setPhase('typing')
  }, [titlesKey])

  // Drive the type/hold/delete loop
  useEffect(() => {
    if (!enable || titles.length === 0) return
    const text = titles[index] || ''
    let t

    if (phase === 'typing') {
      if (displayed.length < text.length) {
        t = setTimeout(() => setDisplayed(text.slice(0, displayed.length + 1)), speed)
      } else {
        if (!readyRef.current) {
          readyRef.current = true
          setReady(true)
        }
        setPhase('pause')
      }
    } else if (phase === 'pause') {
      t = setTimeout(() => setPhase('deleting'), holdMs)
    } else if (phase === 'deleting') {
      if (displayed.length > 0) {
        t = setTimeout(() => setDisplayed(text.slice(0, displayed.length - 1)), deleteSpeed)
      } else {
        setIndex((i) => (i + 1) % titles.length)
        setPhase('typing')
      }
    }

    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, displayed, index, titlesKey, speed, deleteSpeed, holdMs, enable])

  return { displayed, phase, index, ready: ready || readyRef.current }
}