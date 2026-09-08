/** SmileCare logo — file-based logo shown in Navbar and Footer. Plays a sound on click. */

let lastSfx = null
function playLogoSfx() {
  try {
    lastSfx?.pause()
    lastSfx = new Audio('/lirename.mp3')
    lastSfx.volume = 1
    lastSfx.play().catch(() => {})
  } catch { /* ignore */ }
}

export default function Logo({ className = 'h-6', imgClassName = '', sound = true }) {
  return (
    <img
      src="/logo.png"
      alt="SmileCare Dental Clinic"
      className={`${className} ${imgClassName}`}
      draggable={false}
      onClick={sound ? playLogoSfx : undefined}
    />
  )
}