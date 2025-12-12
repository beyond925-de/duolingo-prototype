"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface StartTooltipProps {
  isFirst: boolean;
  accentColor: string;
  onLevelClick: () => void;
}

export function StartTooltip({
  isFirst,
  accentColor,
  onLevelClick,
}: StartTooltipProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(
      () => {
        setIsFading(true);
      },
      isFirst ? 5000 : 3000
    );

    const hideTimer = setTimeout(
      () => {
        setIsVisible(false);
      },
      isFirst ? 5500 : 3500 // Add 500ms for fade-out duration
    );

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [isFirst]);

  if (!isVisible || !isFirst) return null;

  return (
    <button
      className={cn(
        "absolute -top-12 z-10 animate-bounce whitespace-nowrap rounded-xl border-2 bg-white",
        "px-3 py-2.5 font-bold uppercase tracking-wide opacity-100 ",
        "transition-opacity duration-700",
        isFading ? "opacity-0" : ""
      )}
      style={{
        borderColor: accentColor,
        color: accentColor,
      }}
      onClick={onLevelClick}
    >
      {isFirst ? "Start" : "Weiter"}
      <div
        className="absolute -bottom-2 left-1/2 h-0 w-0 -translate-x-1/2 transform border-x-8 border-t-8 border-x-transparent"
        style={{ borderTopColor: accentColor }}
        aria-hidden
      />
    </button>
  );
}
