// Small reusable SVG shapes used all over the site.

export const PALETTE = {
  rose: '#ff7aa8',
  deepRose: '#e0527f',
  blush: '#ffb3cc',
  baby: '#ffd9e6',
  peach: '#ffc9ad',
  lavender: '#cbbcf5',
  lilac: '#b9a5f0',
  cream: '#fff3df',
  gold: '#ffd98a',
  mint: '#bfe9d6',
}

export const HEART_PATH =
  'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'

const SPARKLE_PATH =
  'M12 0C12.8 7 17 11.2 24 12C17 12.8 12.8 17 12 24C11.2 17 7 12.8 0 12C7 11.2 11.2 7 12 0Z'

export function HeartShape({ className = '', color = PALETTE.rose, size, style, ...rest }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      <path d={HEART_PATH} fill={color} />
    </svg>
  )
}

export function HeartOutline({ className = '', size = 20, strokeWidth = 2 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    >
      <path d={HEART_PATH} />
    </svg>
  )
}

export function SparkleShape({ className = '', color = '#fff', size, style }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      <path d={SPARKLE_PATH} fill={color} />
    </svg>
  )
}

/** Inline heart that sits nicely at the end of a line of text. */
export function InlineHeart({ className = '' }) {
  return (
    <HeartShape
      className={`inline-block align-[-0.12em] h-[0.85em] w-[0.85em] ml-[0.2em] ${className}`}
    />
  )
}
