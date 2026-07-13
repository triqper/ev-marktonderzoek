"use client";

import { SectionHeader } from "@/components/section-header";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Card, CardContent } from "@/components/ui/card";
import { EpistemicBadge } from "@/components/epistemic-badge";
import competitors from "@/data/competitors.json";

export function ConcurrentieSection() {
  return (
    <section id="concurrentie" className="scroll-mt-20 border-b border-border py-16">
      <div className="container">
        <SectionHeader
          eyebrow="Onderdeel 6"
          title="Concurrentielandschap"
          description="De belangrijkste CPO's, EMSP's en energiebedrijven in de Europese laadmarkt. Klik/hover op een partij voor details."
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {competitors.concurrenten.map((c) => (
            <HoverCard key={c.naam} openDelay={100}>
              <HoverCardTrigger asChild>
                <Card className="cursor-default transition-colors hover:border-primary/50">
                  <CardContent className="flex h-full flex-col justify-between gap-2 p-4">
                    <span className="text-sm font-semibold">{c.naam}</span>
                    <span className="text-xs text-muted-foreground">{c.rol}</span>
                  </CardContent>
                </Card>
              </HoverCardTrigger>
              <HoverCardContent className="w-80 text-sm">
                <div className="space-y-2">
                  <div className="font-semibold">{c.naam}</div>
                  <p><span className="font-medium text-foreground">Rol: </span><span className="text-muted-foreground">{c.rol}</span></p>
                  <p><span className="font-medium text-foreground">Verdienmodel: </span><span className="text-muted-foreground">{c.verdienmodel}</span></p>
                  <p><span className="font-medium text-foreground">Betaalopties: </span><span className="text-muted-foreground">{c.betaalopties}</span></p>
                  <p><span className="font-medium text-foreground">Roaming-dekking: </span><span className="text-muted-foreground">{c.roaming_dekking}</span></p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-muted-foreground">{c.geschat_marktaandeel}</span>
                    <EpistemicBadge type={c.marktaandeel_type as any} />
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          ))}
        </div>
      </div>
    </section>
  );
}
