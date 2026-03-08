import iconPng from "@assets/PLGSPNG_1772936960528.png";

interface PlanoSIconProps {
  size?: number;
  className?: string;
}

export function PlanoSIcon({ size = 40, className = "" }: PlanoSIconProps) {
  return (
    <img
      src={iconPng}
      width={size}
      height={size}
      alt="PlanoS icon"
      className={className}
      style={{ borderRadius: 9 }}
    />
  );
}
