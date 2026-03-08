interface PlanoSIconProps {
  size?: number;
  className?: string;
}

export function PlanoSIcon({ size = 40, className = "" }: PlanoSIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 22.68 22.68"
      width={size}
      height={size}
      className={className}
      aria-label="PlanoS icon"
    >
      <rect fill="#231815" x="-0.12" y="0.05" width="22.68" height="22.68" rx="4.84" ry="4.84"/>
      <g>
        <g>
          <rect fill="#231815" x="3.72" y="5.14" width="8.37" height="4.09"/>
          <path fill="#fff" d="M12.09,9.67H3.72c-.24,0-.44-.2-.44-.44v-4.09c0-.24.2-.44.44-.44h8.37c.24,0,.44.2.44.44v4.09c0,.24-.2.44-.44.44ZM4.16,8.79h7.49v-3.22h-7.49v3.22Z"/>
        </g>
        <g>
          <rect fill="#231815" x="10.29" y="11.5" width="8.43" height="6.15"/>
          <path fill="#fff" d="M18.72,18.08h-8.43c-.24,0-.44-.2-.44-.44v-6.15c0-.24.2-.44.44-.44h8.43c.24,0,.44.2.44.44v6.15c0,.24-.2.44-.44.44ZM10.72,17.21h7.56v-5.27h-7.56v5.27Z"/>
        </g>
        <g>
          <rect fill="#231815" x="3.72" y="11.5" width="4.22" height="6.15"/>
          <path fill="#fff" d="M7.94,18.08H3.72c-.24,0-.44-.2-.44-.44v-6.15c0-.24.2-.44.44-.44h4.22c.24,0,.44.2.44.44v6.15c0,.24-.2.44-.44.44ZM4.16,17.21h3.34v-5.27h-3.34v5.27Z"/>
        </g>
        <g>
          <rect fill="#231815" x="14.29" y="5.14" width="4.42" height="4.09"/>
          <path fill="#fff" d="M18.72,9.67h-4.42c-.24,0-.44-.2-.44-.44v-4.09c0-.24.2-.44.44-.44h4.42c.24,0,.44.2.44.44v4.09c0,.24-.2.44-.44.44ZM14.73,8.79h3.55v-3.22h-3.55v3.22Z"/>
        </g>
      </g>
    </svg>
  );
}
