import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export default function GlassCard({
  children,
  className = "",
}: GlassCardProps) {
  return (
    <div
      className={`
        rounded-2xl
        border
        border-white/80
        bg-white/65
        shadow-[0_8px_30px_rgba(15,23,42,0.06)]
        backdrop-blur-xl
        ${className}
      `}
    >
      {children}
    </div>
  );
}