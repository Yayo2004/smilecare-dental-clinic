/** SmileCare tooth logo — reusable in Navbar and Footer. */

export default function Logo({ className = 'h-6 w-6' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M32 4C22.6 4 14.9 11 14.9 20.4c0 6 3.2 9.8 5.4 14.6 2.3 5 3.1 9.4 3.9 15.4.6 4.5 2.4 6.8 5.4 6.8 2.4 0 2.8-2.8 2.4-7.3-.2-2.3-.7-4.2-.4-7.1.3-3.6 1.4-6.8 3.6-9.4 1.9-2.2 3.6-4.8 5.2-7.4 1.6 2.6 3.3 5.2 5.2 7.4 2.2 2.6 3.3 5.8 3.6 9.4.3 2.9-.2 4.8-.4 7.1-.4 4.5 0 7.3 2.4 7.3 3 0 4.8-2.3 5.4-6.8.8-6 1.6-10.4 3.9-15.4 2.2-4.8 5.4-8.6 5.4-14.6C49.1 11 41.4 4 32 4z"
      />
      <path
        fill="currentColor"
        d="M54 2l1.4 3.9 3.9 1.4-3.9 1.4L54 12.6l-1.4-3.9-3.9-1.4 3.9-1.4z"
        opacity="0.85"
      />
    </svg>
  )
}