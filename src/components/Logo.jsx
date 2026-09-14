/** Site logo — file-based logo shown in Navbar and Footer. */

export default function Logo({ className = 'h-6', imgClassName = '', src = '/logo.png', alt = 'Myriam Lahlou — Cabinet Dentaire' }) {
  return (
    <img
      src={src}
      alt={alt}
      className={`${className} ${imgClassName}`}
      draggable={false}
    />
  )
}