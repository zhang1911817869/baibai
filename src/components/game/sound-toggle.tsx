"use client";

import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { getSoundEnabled, playGameSound, setSoundEnabled } from "@/lib/game-audio";

interface SoundToggleProps {
  className?: string;
}

export function SoundToggle({ className }: SoundToggleProps) {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setEnabled(getSoundEnabled()), 0);
    return () => window.clearTimeout(timeoutId);
  }, []);

  const toggleSound = () => {
    const nextEnabled = !enabled;
    setSoundEnabled(nextEnabled);
    setEnabled(nextEnabled);
    if (nextEnabled) playGameSound("toggle");
  };

  return (
    <button
      aria-label={enabled ? "关闭音效" : "开启音效"}
      className={className}
      onClick={toggleSound}
      type="button"
    >
      {enabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
    </button>
  );
}
