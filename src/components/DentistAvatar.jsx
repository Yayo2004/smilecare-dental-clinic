import React from 'react'

/**
 * Custom flat-illustration dentist portraits, drawn entirely in SVG.
 * Three variants (sophie, marc, clara) with distinct hair, skin tones
 * and background gradients — fully offline, no external images.
 */

const VARIANTS = {
  sophie: {
    bgFrom: '#2A9D8F',
    bgTo: '#74CEC5',
    hair: '#E8B54B',
    hairDark: '#C88F2E',
    skin: '#F4C9A8',
    skinDark: '#D9A37E',
    blush: '#F08C8C',
    accent: '#2A9D8F',
    longHair: true,
    label: 'Dr Sophie Laurent',
  },
  marc: {
    bgFrom: '#3B82F6',
    bgTo: '#84B6F7',
    hair: '#3B2F30',
    hairDark: '#2A2122',
    skin: '#C98E63',
    skinDark: '#AD7449',
    blush: '#E59A72',
    accent: '#3B82F6',
    longHair: false,
    label: 'Dr Marc Nguyen',
  },
  clara: {
    bgFrom: '#4FB3BF',
    bgTo: '#96D9DE',
    hair: '#4A2F24',
    hairDark: '#382119',
    skin: '#A97150',
    skinDark: '#8D5636',
    blush: '#D98F6F',
    accent: '#4FB3BF',
    longHair: true,
    label: 'Dr Clara Moreau',
  },
}

/** Small white tooth emblem used on the coat badge. */
function ToothEmblem({ accent }) {
  return (
    <g transform="translate(53 147)">
      <rect width="14" height="18" rx="3.5" fill={accent} />
      <path
        d="M7 3.4 c-2.1 0-3.8 1.5-3.8 3.4 0 1 .4 1.9 1 2.7 .8 1.1 1.2 1.9 1.2 3 0 .8 .2 1.6 .4 2.1 .2 .5 .8 .8 1.2 .5 .2-.1 .3-.4 .4-.7 .1-.7 .2-1.4 .6-1.7 .2-.2 .4-.2 .6 0 .4.3 .5.9 .6 1.7 .1.3 .2.6 .4.7 .4.3 1 0 1.2-.5 .2-.5 .4-1.3 .4-2.1 0-1.1 .4-1.9 1.2-3 .6-.8 1-1.7 1-2.7 0-1.9-1.7-3.4-3.8-3.4 z"
        fill="#ffffff"
      />
    </g>
  )
}

/** Stylized head-and-shoulders dentist illustration. */
export default function DentistAvatar({ variant = 'sophie', label }) {
  const c = VARIANTS[variant] || VARIANTS.sophie

  return (
    <svg
      viewBox="0 0 200 200"
      className="mx-auto h-44 w-44 sm:h-52 sm:w-52"
      role="img"
      aria-label={label || c.label}
    >
      <defs>
        <linearGradient id={`bg-${variant}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={c.bgFrom} />
          <stop offset="100%" stopColor={c.bgTo} />
        </linearGradient>
        <linearGradient id={`coat-${variant}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E8F1F0" />
        </linearGradient>
      </defs>

      {/* Background disc */}
      <circle cx="100" cy="100" r="98" fill={`url(#bg-${variant})`} />
      <circle
        cx="100"
        cy="100"
        r="86"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.28"
        strokeWidth="1.5"
        strokeDasharray="3 5"
      />
      <circle cx="100" cy="30" r="14" fill="#ffffff" opacity="0.18" />

      {/* Long hair flowing behind the shoulders (female variants) */}
      {c.longHair && (
        <path
          d="M100 34 C58 34 52 88 56 112 C59 134 63 152 70 166 C76 178 86 182 86 182 L100 178 L114 182 C114 182 124 178 130 166 C137 152 141 134 138 112 C142 88 142 34 100 34 Z"
          fill={c.hairDark}
        />
      )}

      {/* Coat / shoulders */}
      <path
        d="M32 200 V168 C32 150 52 142 74 142 H126 C148 142 168 150 168 168 V200 Z"
        fill={`url(#coat-${variant})`}
      />
      {/* Coat collar + lapel */}
      <path d="M100 146 L92 174 C94 184 97 192 100 200 L100 146 Z" fill={c.accent} opacity="0.18" />
      <path d="M100 146 L108 174 C106 184 103 192 100 200 L100 146 Z" fill={c.accent} opacity="0.18" />
      <path d="M88 142 Q100 154 112 142" fill="none" stroke={c.skinDark} strokeWidth="1.5" opacity="0.6" />

      <ToothEmblem accent={c.accent} />

      {/* Neck */}
      <rect x="88" y="110" width="24" height="36" rx="9" fill={c.skin} />
      <rect x="100" y="110" width="12" height="36" fill={c.skinDark} opacity="0.25" />

      {/* Ears */}
      <ellipse cx="62" cy="86" rx="5.5" ry="8.5" fill={c.skin} />
      <ellipse cx="138" cy="86" rx="5.5" ry="8.5" fill={c.skin} />

      {/* Head */}
      <ellipse cx="100" cy="80" rx="36" ry="40" fill={c.skin} />

      {/* Hair fringe */}
      {variant === 'marc' ? (
        <path
          d="M64 78 C64 44 136 44 136 78 L136 84 C136 90 130 94 126 92 C124 82 118 76 100 74 C82 76 76 82 74 92 C70 94 64 90 64 84 Z"
          fill={c.hair}
        />
      ) : (
        <path
          d="M64 82 C64 44 136 44 136 82 C136 98 130 108 118 112 C116 98 112 90 100 88 C88 90 84 98 82 112 C70 108 64 98 64 82 Z"
          fill={c.hair}
        />
      )}

      {/* Side hair panels */}
      <path d="M64 80 C61 102 66 120 74 126 C70 110 70 96 74 88 Z" fill={c.hair} />
      <path d="M136 80 C139 102 134 120 126 126 C130 110 130 96 126 88 Z" fill={c.hair} />

      {/* Eyebrows */}
      <path d="M78 76 Q86 71 93 76" fill="none" stroke={c.hairDark} strokeWidth="2" strokeLinecap="round" />
      <path d="M122 76 Q114 71 107 76" fill="none" stroke={c.hairDark} strokeWidth="2" strokeLinecap="round" />

      {/* Eyes */}
      <ellipse cx="85.5" cy="84" rx="2.6" ry="3.4" fill="#2F2A28" />
      <ellipse cx="114.5" cy="84" rx="2.6" ry="3.4" fill="#2F2A28" />
      <circle cx="86.5" cy="82.8" r="1" fill="#ffffff" />
      <circle cx="115.5" cy="82.8" r="1" fill="#ffffff" />

      {/* Nose */}
      <path d="M100 88 Q104 93 99 97" fill="none" stroke={c.skinDark} strokeWidth="1.6" strokeLinecap="round" />

      {/* Blush */}
      <circle cx="78" cy="95" r="5" fill={c.blush} opacity="0.35" />
      <circle cx="122" cy="95" r="5" fill={c.blush} opacity="0.35" />

      {/* Smile with teeth */}
      <path d="M86 102 Q100 120 114 102 Q100 112 86 102 Z" fill="#B04A58" />
      <rect x="90" y="99.5" width="20" height="6" rx="2.5" fill="#ffffff" />
    </svg>
  )
}
