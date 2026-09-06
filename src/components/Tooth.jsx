/**
 * Decorative tooth image (public/dent.png).
 * Used as a design element — big and small — across the website.
 */
export default function Tooth({ className = 'h-10 w-10', imgClassName = '', style }) {
  return (
    <img
      src="/dent.png"
      alt=""
      aria-hidden="true"
      draggable={false}
      loading="lazy"
      className={`select-none ${className} ${imgClassName}`}
      style={style}
    />
  )
}