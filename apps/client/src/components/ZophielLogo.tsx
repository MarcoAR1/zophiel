/**
 * Zophiel Logo — Unique brand mark
 * Stylized "Z" with flowing curves suggesting care/wellness
 * Uses the brand gradient: indigo → purple → violet
 */
interface ZophielLogoProps {
  size?: number;
  className?: string;
}

export default function ZophielLogo({ size = 28, className = '' }: ZophielLogoProps) {
  const id = `zlogo-${Math.random().toString(36).slice(2, 6)}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Zophiel logo"
    >
      <defs>
        <linearGradient id={`${id}-grad`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
        <linearGradient id={`${id}-wave`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {/* Main Z shape — bold strokes */}
      <path
        d="M12 12 H36 L14 36 H38"
        stroke={`url(#${id}-grad)`}
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Wellness wave across the Z — flowing care line */}
      <path
        d="M10 24 C16 18, 22 30, 28 22 C34 14, 40 26, 42 22"
        stroke={`url(#${id}-wave)`}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Subtle dot — representing data/tracking point */}
      <circle
        cx="38"
        cy="12"
        r="3"
        fill={`url(#${id}-grad)`}
        opacity="0.9"
      />
    </svg>
  );
}
