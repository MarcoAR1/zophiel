/**
 * Zophiel Logo — Based on the APK icon design
 * Stylized Z with stethoscope flowing into heart + medical cross
 * Uses brand gradient: indigo → purple → violet
 */
interface ZophielLogoProps {
  size?: number;
  className?: string;
  /** Show only the mark (no background), or full icon with gradient bg */
  variant?: 'mark' | 'icon';
}

export default function ZophielLogo({ size = 28, className = '', variant = 'mark' }: ZophielLogoProps) {
  const id = `zl-${Math.random().toString(36).slice(2, 6)}`;

  if (variant === 'icon') {
    // Full icon version with gradient background (for app icon, splash screens)
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="Zophiel"
      >
        <defs>
          <linearGradient id={`${id}-bg`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1d1625" />
            <stop offset="50%" stopColor="#8c25f4" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
        </defs>
        <rect width="120" height="120" rx="26" fill={`url(#${id}-bg)`} />
        <g transform="translate(18, 18) scale(0.7)">
          {renderMark(id)}
        </g>
      </svg>
    );
  }

  // Mark-only version (for inline use in nav, sidebar, footer)
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Zophiel"
    >
      <defs>
        <linearGradient id={`${id}-grad`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8c25f4" />
          <stop offset="50%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
      {renderMarkColored(id)}
    </svg>
  );
}

/** The Z + stethoscope + heart mark in white (for icon variant) */
function renderMark(id: string) {
  return (
    <g fill="none" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
      {/* Z letterform - top bar */}
      <line x1="20" y1="20" x2="75" y2="20" />
      {/* Z diagonal */}
      <line x1="75" y1="20" x2="20" y2="80" />
      {/* Z bottom bar */}
      <line x1="20" y1="80" x2="60" y2="80" />

      {/* Stethoscope tube from top of Z curving right and down */}
      <path d="M75 20 C95 20, 100 35, 100 50" fill="none" />
      {/* Stethoscope earpiece */}
      <circle cx="100" cy="50" r="6" fill="white" stroke="none" />
      <circle cx="100" cy="50" r="3" fill="#8c25f4" stroke="none" />

      {/* Heart shape flowing from bottom of Z */}
      <path
        d="M60 80 C60 72, 67 65, 75 65 C83 65, 90 72, 90 80 C90 95, 75 105, 60 115 C45 105, 30 95, 30 80 C30 72, 37 65, 45 65 C53 65, 60 72, 60 80 Z"
        fill="rgba(255,255,255,0.15)"
        stroke="white"
        strokeWidth="5"
      />

      {/* Medical cross inside heart */}
      <line x1="60" y1="78" x2="60" y2="98" strokeWidth="5" />
      <line x1="50" y1="88" x2="70" y2="88" strokeWidth="5" />
    </g>
  );
}

/** The Z + stethoscope + heart mark in gradient (for mark variant) */
function renderMarkColored(id: string) {
  const stroke = `url(#${id}-grad)`;
  return (
    <g fill="none" stroke={stroke} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
      {/* Z letterform */}
      <line x1="20" y1="20" x2="75" y2="20" />
      <line x1="75" y1="20" x2="20" y2="80" />
      <line x1="20" y1="80" x2="60" y2="80" />

      {/* Stethoscope tube */}
      <path d="M75 20 C95 20, 100 35, 100 50" fill="none" />
      {/* Stethoscope earpiece */}
      <circle cx="100" cy="50" r="6" fill={stroke} stroke="none" />
      <circle cx="100" cy="50" r="3" fill="var(--landing-bg, #08081a)" stroke="none" />

      {/* Heart shape */}
      <path
        d="M60 80 C60 72, 67 65, 75 65 C83 65, 90 72, 90 80 C90 95, 75 105, 60 115 C45 105, 30 95, 30 80 C30 72, 37 65, 45 65 C53 65, 60 72, 60 80 Z"
        fill="none"
        strokeWidth="5"
      />

      {/* Medical cross */}
      <line x1="60" y1="78" x2="60" y2="98" strokeWidth="5" />
      <line x1="50" y1="88" x2="70" y2="88" strokeWidth="5" />
    </g>
  );
}
