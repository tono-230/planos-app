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
      <rect width="40" height="40" rx="9" fill="#111318" />

      {/* Row 1 — single full-width block */}
      <rect x="6" y="6" width="28" height="8" rx="2" fill="white" />

      {/* Row 2 — two blocks */}
      <rect x="6" y="17" width="16" height="8" rx="2" fill="white" />
      <rect x="25" y="17" width="9" height="8" rx="2" fill="white" />

      {/* Row 3 — three blocks */}
      <rect x="6" y="28" width="7" height="6" rx="2" fill="white" />
      <rect x="16" y="28" width="9" height="6" rx="2" fill="white" />
      <rect x="28" y="28" width="6" height="6" rx="2" fill="white" />
    </svg>
  );
}
