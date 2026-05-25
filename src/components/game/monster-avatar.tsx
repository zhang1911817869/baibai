"use client";

import { motion } from "framer-motion";

interface MonsterAvatarProps {
  monsterId: string;
  size?: number;
  defeated?: boolean;
  interactive?: boolean;
  className?: string;
}

const colors: Record<string, { body: string; belly: string }> = {
  procrastinate: { body: "#7EC8A0", belly: "#B8E8CE" },
  stress: { body: "#9B7BBD", belly: "#C9AADF" },
  overload: { body: "#E8AA42", belly: "#F5D08A" },
  brain_fog: { body: "#7DB8D4", belly: "#A8D4E8" },
  social: { body: "#E27B98", belly: "#F0A8BC" },
  low_energy: { body: "#5B8DB8", belly: "#8AB4D4" },
};

export function MonsterAvatar({
  monsterId,
  size = 180,
  defeated = false,
  interactive = false,
  className,
}: MonsterAvatarProps) {
  const color = colors[monsterId] ?? colors.procrastinate;

  return (
    <motion.svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      animate={interactive && !defeated ? { y: [0, -3, 0], rotate: [-1, 1, -1] } : undefined}
      transition={{ repeat: Infinity, duration: 2.6, ease: "easeInOut" }}
    >
      {[16, 30, 44, 58, 72, 84].map((cx) => (
        <circle key={cx} cx={cx} cy="79" r="11" fill={color.body} />
      ))}
      <circle cx="13" cy="57" r="12" fill={color.body} />
      <circle cx="87" cy="57" r="12" fill={color.body} />
      <circle cx="24" cy="30" r="12" fill={color.body} />
      <circle cx="76" cy="30" r="12" fill={color.body} />
      <ellipse cx="50" cy="57" rx="38" ry="31" fill={color.body} />
      <ellipse cx="50" cy="34" rx="29" ry="27" fill={color.body} />
      <ellipse cx="50" cy="62" rx="20" ry="13" fill={color.belly} opacity="0.78" />
      {monsterId === "stress" && (
        <>
          <path d="M34 16 25 3l3 18M66 16 75 3l-3 18" fill={color.body} stroke="#2C2C2C" strokeWidth="2" />
          <text x="46" y="12" fontSize="13" fontWeight="bold" fill="#E27B66">!</text>
        </>
      )}
      {monsterId === "brain_fog" && (
        <>
          <circle cx="35" cy="14" r="9" fill="white" opacity=".8" />
          <circle cx="48" cy="10" r="11" fill="white" opacity=".8" />
          <circle cx="61" cy="14" r="9" fill="white" opacity=".8" />
          <text x="44" y="16" fontSize="12" fontWeight="bold" fill="#8E8677">?</text>
        </>
      )}
      {monsterId === "overload" && (
        <>
          <rect x="60" y="9" width="22" height="27" rx="2" fill="#FFFDF7" stroke="#2C2C2C" strokeWidth="1.5" transform="rotate(6 71 22)" />
          <path d="M64 17h12M64 21h12M64 25h8" stroke="#2C2C2C" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="22" cy="18" r="7" fill="#D96B6B" stroke="#2C2C2C" strokeWidth="1" />
          <text x="17" y="21" fontSize="6" fontWeight="bold" fill="white">99</text>
        </>
      )}
      {monsterId === "social" && (
        <>
          <circle cx="24" cy="53" r="6" fill="#F0A8BC" />
          <circle cx="76" cy="53" r="6" fill="#F0A8BC" />
          <path d="M27 48q-4 8 0 12q4-4 0-12" fill="#A8D8EA" />
        </>
      )}
      {monsterId === "low_energy" && (
        <>
          <rect x="37" y="55" width="26" height="14" rx="3" fill="white" stroke="#2C2C2C" strokeWidth="1.5" />
          <rect x="63" y="59" width="4" height="6" rx="1" fill="#2C2C2C" />
          <rect x="39" y="57" width="5" height="10" rx="1" fill="#D96B6B" />
          <text x="47" y="64.5" fontSize="6" fontWeight="bold" fill="#5F594F">LOW</text>
        </>
      )}
      {defeated ? (
        <>
          <path d="M31 38l10 10m0-10L31 48m28-10 10 10m0-10L59 48" stroke="#2C2C2C" strokeWidth="3" strokeLinecap="round" />
          <path d="M38 65q12 8 24 0" fill="none" stroke="#2C2C2C" strokeWidth="2.5" strokeLinecap="round" />
          <text x="10" y="27" fontSize="13">⭐</text>
          <text x="78" y="30" fontSize="13">⭐</text>
        </>
      ) : (
        <>
          <ellipse cx="37" cy="41" rx="9" ry="11" fill="white" stroke="#2C2C2C" strokeWidth="2" />
          <ellipse cx="63" cy="41" rx="9" ry="11" fill="white" stroke="#2C2C2C" strokeWidth="2" />
          <circle cx="38" cy="43" r="5" fill="#2C2C2C" />
          <circle cx="64" cy="43" r="5" fill="#2C2C2C" />
          <circle cx="40" cy="40" r="2" fill="white" />
          <circle cx="66" cy="40" r="2" fill="white" />
          <path d="M39 62q11-7 22 0" fill="none" stroke="#2C2C2C" strokeWidth="2.5" strokeLinecap="round" />
        </>
      )}
    </motion.svg>
  );
}
