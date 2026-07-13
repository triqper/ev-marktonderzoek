import { TooltipProvider } from "@/components/ui/tooltip";
import { SiteNav } from "@/components/nav/site-nav";
import { HeroSection } from "@/components/sections/hero-section";
import { MarktSection } from "@/components/sections/markt-section";
import { PersonaSection } from "@/components/sections/persona-section";
import { KetenSection } from "@/components/sections/keten-section";
import { ConcurrentieSection } from "@/components/sections/concurrentie-section";
import { KansenRisicoSection } from "@/components/sections/kansen-risico-section";
import { BusinesscaseSection } from "@/components/sections/businesscase-section";
import { ValidatieSection } from "@/components/sections/validatie-section";
import { RoadmapSection } from "@/components/sections/roadmap-section";
import { BeslismatrixSection } from "@/components/sections/beslismatrix-section";
import { OnbekendSection } from "@/components/sections/onbekend-section";
import { BronnenSection } from "@/components/sections/bronnen-section";

export default function Home() {
  return (
    <TooltipProvider delayDuration={150}>
      <SiteNav />
      <main>
        <HeroSection />
        <MarktSection />
        <PersonaSection />
        <KetenSection />
        <ConcurrentieSection />
        <KansenRisicoSection />
        <BusinesscaseSection />
        <ValidatieSection />
        <RoadmapSection />
        <BeslismatrixSection />
        <OnbekendSection />
        <BronnenSection />
      </main>
      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        Strategisch validatiedossier EV-laadmarkt — directiedashboard. Volledig rapport:{" "}
        <code className="rounded bg-muted px-1.5 py-0.5">rapport/RAPPORT.md</code>
      </footer>
    </TooltipProvider>
  );
}
