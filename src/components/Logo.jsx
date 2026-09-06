/** SmileCare logo — file-based logo shown in Navbar and Footer. */

export default function Logo({ className = 'h-6', imgClassName = '' }) {
  return (
    <img
      src="/logo.png"
      alt="SmileCare Dental Clinic"
      className={`${className} ${imgClassName}`}
      draggable={false}
    />
  )
}