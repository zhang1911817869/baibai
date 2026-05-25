interface CoinIconProps {
  className?: string;
}

export function CoinIcon({ className }: CoinIconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle cx="12" cy="12" r="9" fill="#F6C453" stroke="#2C2C2C" strokeWidth="2" />
      <circle cx="12" cy="12" r="6" stroke="#D18C2D" strokeWidth="1.3" strokeDasharray="1.4 1.2" />
      <path d="M8.8 8.5h6.4M12 8.5v7M9.4 11.1h5.2M9.3 15.5h5.4" stroke="#A76522" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
