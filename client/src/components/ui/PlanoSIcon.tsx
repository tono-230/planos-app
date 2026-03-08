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

      {/* Store layout planogram shapes — white on gradient bg */}

      {/* Wall A — full-width back wall */}
      <rect x="4" y="4" width="32" height="9" rx="2" fill="white" fillOpacity="0.95" />

      {/* Wall B — left side wall */}
      <rect x="4" y="15" width="8" height="17" rx="2" fill="white" fillOpacity="0.95" />

      {/* Wall C — right side wall */}
      <rect x="28" y="15" width="8" height="17" rx="2" fill="white" fillOpacity="0.95" />

      {/* Island 1 — upper center fixture */}
      <rect x="15" y="15" width="11" height="7" rx="2" fill="white" fillOpacity="0.70" />

      {/* Island 2 — lower center fixture */}
      <rect x="15" y="25" width="11" height="7" rx="2" fill="white" fillOpacity="0.70" />

      {/* Gradient definition */}
      <defs>
        <linearGradient id="planos-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="hsl(var(--primary))" />
          <stop offset="100%" stopColor="hsl(var(--primary) / 0.75)" />
        </linearGradient>
      </defs>
    </svg>
  );
}
