interface PlanoSIconProps {
  size?: number;
  className?: string;
}

export function PlanoSIcon({ size = 40, className = "" }: PlanoSIconProps) {
  return (
    <img
      src="/planos-icon-128.png"
      width={size}
      height={size}
      className={className}
      alt="PlanoS"
      style={{ objectFit: "contain" }}
    />
  );
}
