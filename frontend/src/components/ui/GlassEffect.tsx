"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { type ReactNode, type CSSProperties, type ButtonHTMLAttributes } from "react";

const CYAN = { r: 0, g: 255, b: 240 };
const PURPLE = { r: 191, g: 95, b: 255 };

function rgba(c: typeof CYAN, a: number) {
  return `rgba(${c.r},${c.g},${c.b},${a})`;
}

/* ─── Keyframes injected once via <style> ─── */
function GlassKeyframes() {
  return (
    <style>{`
      @keyframes _glass-rotate {
        0%   { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes _glass-shimmer {
        0%   { transform: translateX(-100%) skewX(-15deg); }
        100% { transform: translateX(250%) skewX(-15deg); }
      }
      @keyframes _glass-breathe {
        0%, 100% { opacity: 0.35; }
        50%      { opacity: 0.75; }
      }
      @keyframes _glass-btn-shimmer {
        0%   { left: -80%; }
        100% { left: 180%; }
      }
    `}</style>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   GlassBanner — Cyberpunk liquid glass panel
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export function GlassBanner({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const { theme } = useTheme();
  const isOled = theme === "oled";

  if (!isOled) {
    return (
      <section
        className={`relative rounded-2xl border border-border-default bg-bg-surface p-6 sm:p-10 ${className}`}
      >
        {children}
      </section>
    );
  }

  const wrapperStyle: CSSProperties = {
    position: "relative",
    borderRadius: "1rem",
    padding: "1px",
    overflow: "hidden",
  };

  const borderGradientStyle: CSSProperties = {
    position: "absolute",
    inset: "-50%",
    width: "200%",
    height: "200%",
    background: `conic-gradient(
      from 0deg,
      ${rgba(CYAN, 0.6)},
      ${rgba(PURPLE, 0.35)},
      transparent,
      ${rgba(PURPLE, 0.5)},
      ${rgba(CYAN, 0.4)},
      transparent,
      ${rgba(CYAN, 0.6)}
    )`,
    animation: "_glass-rotate 5s linear infinite",
    pointerEvents: "none" as const,
  };

  const innerStyle: CSSProperties = {
    position: "relative",
    borderRadius: "calc(1rem - 1px)",
    background: `
      linear-gradient(135deg, ${rgba(CYAN, 0.05)} 0%, ${rgba(PURPLE, 0.07)} 50%, ${rgba(CYAN, 0.03)} 100%),
      rgba(8, 8, 8, 0.95)
    `,
    overflow: "hidden",
  };

  const specularTopStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    borderRadius: "inherit",
    background: `radial-gradient(ellipse 70% 50% at 25% 15%, ${rgba(CYAN, 0.1)} 0%, transparent 65%)`,
    animation: "_glass-breathe 4s ease-in-out infinite",
    pointerEvents: "none" as const,
  };

  const specularBottomStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    borderRadius: "inherit",
    background: `radial-gradient(ellipse 55% 40% at 75% 80%, ${rgba(PURPLE, 0.08)} 0%, transparent 65%)`,
    animation: "_glass-breathe 4s ease-in-out infinite 2s",
    pointerEvents: "none" as const,
  };

  const shimmerContainerStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    borderRadius: "inherit",
    overflow: "hidden",
    pointerEvents: "none" as const,
  };

  const shimmerStyle: CSSProperties = {
    position: "absolute",
    top: "-50%",
    left: "-50%",
    width: "45%",
    height: "200%",
    background: `linear-gradient(
      90deg,
      transparent 0%,
      rgba(255,255,255,0.03) 35%,
      rgba(255,255,255,0.08) 50%,
      rgba(255,255,255,0.03) 65%,
      transparent 100%
    )`,
    animation: "_glass-shimmer 6s ease-in-out infinite",
    pointerEvents: "none" as const,
  };

  const glossLineStyle: CSSProperties = {
    position: "absolute",
    top: 0,
    left: "10%",
    right: "10%",
    height: "1px",
    background: `linear-gradient(90deg, transparent, ${rgba(CYAN, 0.2)}, ${rgba(PURPLE, 0.15)}, transparent)`,
    pointerEvents: "none" as const,
  };

  const outerGlowStyle: CSSProperties = {
    boxShadow: `
      0 0 15px ${rgba(CYAN, 0.08)},
      0 0 40px ${rgba(PURPLE, 0.04)}
    `,
  };

  return (
    <>
      <GlassKeyframes />
      <section className={className} style={{ ...wrapperStyle, ...outerGlowStyle }}>
        {/* Rotating conic gradient — creates the animated border */}
        <div style={borderGradientStyle} />

        {/* Inner panel */}
        <div style={innerStyle} className="p-6 sm:p-10">
          {/* Specular highlights */}
          <div style={specularTopStyle} />
          <div style={specularBottomStyle} />

          {/* Top gloss line */}
          <div style={glossLineStyle} />

          {/* Shimmer sweep */}
          <div style={shimmerContainerStyle}>
            <div style={shimmerStyle} />
          </div>

          {/* Content */}
          <div style={{ position: "relative", zIndex: 10 }}>{children}</div>
        </div>
      </section>
    </>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   GlassButton — Cyberpunk liquid glass button
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export function GlassButton({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
  className?: string;
}) {
  const { theme } = useTheme();
  const isOled = theme === "oled";

  if (!isOled) {
    const einkClass =
      variant === "ghost"
        ? "border border-border-default text-text-primary hover:border-border-accent"
        : "bg-bg-elevated border border-border-default text-text-primary hover:border-border-accent";
    return (
      <button
        className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${einkClass} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }

  const isPrimary = variant === "primary";

  const btnStyle: CSSProperties = {
    position: "relative",
    overflow: "hidden",
    border: `1px solid ${isPrimary ? rgba(CYAN, 0.3) : rgba(CYAN, 0.15)}`,
    background: isPrimary
      ? `linear-gradient(135deg, ${rgba(CYAN, 0.14)}, ${rgba(PURPLE, 0.10)})`
      : "transparent",
    color: "#f0f0f0",
    boxShadow: isPrimary
      ? `0 0 10px ${rgba(CYAN, 0.12)}, inset 0 1px 0 rgba(255,255,255,0.07)`
      : "none",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  };

  const glossStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    borderRadius: "inherit",
    background: isPrimary
      ? "linear-gradient(165deg, rgba(255,255,255,0.13) 0%, transparent 45%)"
      : "linear-gradient(165deg, rgba(255,255,255,0.06) 0%, transparent 45%)",
    pointerEvents: "none" as const,
  };

  const shimmerStyle: CSSProperties = {
    position: "absolute",
    top: "-60%",
    left: "-80%",
    width: "50%",
    height: "220%",
    background: `linear-gradient(
      90deg,
      transparent 0%,
      rgba(255,255,255,0.08) 40%,
      rgba(255,255,255,0.18) 50%,
      rgba(255,255,255,0.08) 60%,
      transparent 100%
    )`,
    transform: "skewX(-15deg)",
    animation: "_glass-btn-shimmer 4s ease-in-out infinite",
    pointerEvents: "none" as const,
  };

  return (
    <button
      className={`px-5 py-2.5 rounded-xl text-sm font-medium
        hover:shadow-[0_0_16px_rgba(0,255,240,0.2),0_0_32px_rgba(191,95,255,0.1)]
        hover:border-[rgba(0,255,240,0.5)]
        active:scale-[0.97]
        disabled:opacity-35 disabled:pointer-events-none
        ${className}`}
      style={btnStyle}
      {...props}
    >
      {/* Gloss overlay */}
      <div style={glossStyle} />
      {/* Shimmer */}
      <div style={shimmerStyle} />
      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-2 w-full h-full">
        {children}
      </span>
    </button>
  );
}
