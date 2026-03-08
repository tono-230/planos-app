interface PlanoSIconProps {
  size?: number;
  className?: string;
}

export function PlanoSIcon({ size = 40, className = "" }: PlanoSIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="PlanoS icon"
    >
      {/* Rounded square background */}
      <rect width="40" height="40" rx="10" fill="url(#planos-grad)" />

      {/* Wall A — full-width back wall, 8px padding from edges */}
      <rect x="8" y="8" width="24" height="6" rx="1.5" fill="white" fillOpacity="0.95" />

      {/* Wall B — left side wall, 2px gap below Wall A */}
      <rect x="8" y="16" width="6" height="16" rx="1.5" fill="white" fillOpacity="0.95" />

      {/* Wall C — right side wall, mirrors Wall B */}
      <rect x="26" y="16" width="6" height="16" rx="1.5" fill="white" fillOpacity="0.95" />

      {/* Island 1 — upper center, 2px gap from walls on all sides */}
      <rect x="16" y="16" width="8" height="6" rx="1.5" fill="white" fillOpacity="0.65" />

      {/* Island 2 — lower center, 2px gap below Island 1 */}
      <rect x="16" y="24" width="8" height="6" rx="1.5" fill="white" fillOpacity="0.65" />

      <defs>
        <linearGradient id="planos-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="hsl(var(--primary))" />
          <stop offset="100%" stopColor="hsl(var(--primary) / 0.72)" />
        </linearGradient>
      </defs>
    </svg>
  );
}
