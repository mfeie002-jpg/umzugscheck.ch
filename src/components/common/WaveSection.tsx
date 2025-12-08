import { memo } from "react";
import { cn } from "@/lib/utils";

interface WaveSectionProps {
  children: React.ReactNode;
  className?: string;
  wavePosition?: "top" | "bottom" | "both";
  waveColor?: string;
  bgColor?: string;
}

export const WaveSection = memo(function WaveSection({
  children,
  className,
  wavePosition = "both",
  waveColor = "hsl(var(--background))",
  bgColor = "hsl(var(--muted))"
}: WaveSectionProps) {
  const TopWave = () => (
    <svg
      className="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180"
      viewBox="0 0 1440 50"
      preserveAspectRatio="none"
    >
      <path
        d="M0,0 C360,50 1080,50 1440,0 L1440,50 L0,50 Z"
        fill={waveColor}
      />
    </svg>
  );

  const BottomWave = () => (
    <svg
      className="absolute bottom-0 left-0 w-full overflow-hidden leading-none"
      viewBox="0 0 1440 50"
      preserveAspectRatio="none"
    >
      <path
        d="M0,0 C360,50 1080,50 1440,0 L1440,50 L0,50 Z"
        fill={waveColor}
      />
    </svg>
  );

  return (
    <section
      className={cn("relative py-20", className)}
      style={{ backgroundColor: bgColor }}
    >
      {(wavePosition === "top" || wavePosition === "both") && <TopWave />}
      <div className="relative z-10 container">{children}</div>
      {(wavePosition === "bottom" || wavePosition === "both") && <BottomWave />}
    </section>
  );
});
