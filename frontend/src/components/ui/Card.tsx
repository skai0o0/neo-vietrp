"use client";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  neon?: "blue" | "pink" | "combined" | "none";
  hoverable?: boolean;
}

export default function Card({
  children,
  className = "",
  neon = "none",
  hoverable = false,
}: CardProps) {
  const neonClass =
    neon === "blue"
      ? "neon-border-blue"
      : neon === "pink"
        ? "neon-border-pink"
        : neon === "combined"
          ? "neon-border-combined"
          : "";

  return (
    <div
      className={`
        rounded-xl border border-border-default bg-bg-surface p-4
        transition-all duration-300 ease-out
        ${neonClass}
        ${
          hoverable
            ? `cursor-pointer
               hover:border-border-accent hover:bg-bg-elevated
               hover:-translate-y-0.5
               hover:shadow-[0_0_12px_rgba(0,255,240,0.08)]
               active:translate-y-0 active:scale-[0.98]`
            : ""
        }
        ${className}
      `}
    >
      {children}
    </div>
  );
}
