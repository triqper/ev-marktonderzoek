"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { EpistemicBadge, type EpistemicType } from "@/components/epistemic-badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function KpiCard({
  label,
  value,
  sublabel,
  type,
  icon: Icon,
  tooltip,
  className,
}: {
  label: string;
  value: string;
  sublabel?: string;
  type: EpistemicType;
  icon?: LucideIcon;
  tooltip?: string;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35 }}
    >
      <Card className={cn("h-full", className)}>
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-medium text-muted-foreground">{label}</span>
            <div className="flex items-center gap-1.5">
              {tooltip && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" aria-label="Toelichting" className="text-muted-foreground/70 hover:text-foreground">
                      <Info className="h-3.5 w-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>{tooltip}</TooltipContent>
                </Tooltip>
              )}
              {Icon && <Icon className="h-4 w-4 text-muted-foreground/70" />}
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-semibold tabular-nums tracking-tight">{value}</span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            {sublabel ? <span className="text-xs text-muted-foreground">{sublabel}</span> : <span />}
            <EpistemicBadge type={type} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
