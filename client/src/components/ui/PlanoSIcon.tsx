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
      {/* Dark rounded square background */}
      <rect width="40" height="40" rx="9" fill="#111318" />

      {/* Top-left block — wide */}
      <rect x="5" y="5" width="17" height="13" rx="2.5" fill="white" />

      {/* Top-right block — narrow */}
      <rect x="25" y="5" width="10" height="13" rx="2.5" fill="white" />

      {/* Bottom-left block — narrow */}
      <rect x="5" y="21" width="10" height="14" rx="2.5" fill="white" />

      {/* Bottom-right block — wide */}
      <rect x="18" y="21" width="17" height="14" rx="2.5" fill="white" />
    </svg>
  );
}
