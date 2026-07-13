import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type EpistemicType = "FEIT" | "SCHATTING" | "AANNAME";

const LABELS: Record<EpistemicType, string> = {
  FEIT: "Feit",
  SCHATTING: "Schatting",
  AANNAME: "Aanname",
};

const VARIANTS: Record<EpistemicType, "feit" | "schatting" | "aanname"> = {
  FEIT: "feit",
  SCHATTING: "schatting",
  AANNAME: "aanname",
};

export function EpistemicBadge({ type, className }: { type: EpistemicType; className?: string }) {
  return (
    <Badge variant={VARIANTS[type]} className={cn("font-normal", className)}>
      {LABELS[type]}
    </Badge>
  );
}
