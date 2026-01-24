import { useContext, type ReactNode } from "react";
import type { ArchetypeId } from "@/lib/archetype-signals";
import { ArchetypeContext } from "./ArchetypeProvider";

interface ArchetypeAdaptiveUIProps {
  archetype?: ArchetypeId | null;
  confidence?: number;
  minConfidence?: number;
  trustBadges?: ReactNode;
  reducedSteps?: ReactNode;
  priceHighlights?: ReactNode;
  calmingCopy?: ReactNode;
  children?: ReactNode;
}

export const ArchetypeAdaptiveUI = ({
  archetype,
  confidence,
  minConfidence = 0.4,
  trustBadges,
  reducedSteps,
  priceHighlights,
  calmingCopy,
  children,
}: ArchetypeAdaptiveUIProps) => {
  const context = useContext(ArchetypeContext);
  const resolvedArchetype = archetype ?? context?.archetype ?? null;
  const resolvedConfidence = confidence ?? context?.confidence ?? 0;

  const shouldApply =
    resolvedArchetype !== null && resolvedConfidence >= minConfidence;

  if (!shouldApply) {
    return <>{children}</>;
  }

  return (
    <div data-archetype={resolvedArchetype}>
      {resolvedArchetype === "security_seeker" && trustBadges}
      {resolvedArchetype === "efficiency_expert" && reducedSteps}
      {resolvedArchetype === "value_hunter" && priceHighlights}
      {resolvedArchetype === "overwhelmed_mover" && calmingCopy}
      {children}
    </div>
  );
};
