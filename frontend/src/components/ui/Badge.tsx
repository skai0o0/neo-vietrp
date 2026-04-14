interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "accent";
  className?: string;
}

export default function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium
        border transition-colors
        ${
          variant === "accent"
            ? "bg-badge-bg text-badge-text border-badge-border"
            : "bg-bg-surface text-text-secondary border-border-default"
        }
        ${className}
      `}
    >
      {children}
    </span>
  );
}
