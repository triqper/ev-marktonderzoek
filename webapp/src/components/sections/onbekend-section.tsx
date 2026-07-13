import { SectionHeader } from "@/components/section-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { HelpCircle } from "lucide-react";

const hiaten = [
  "Primair klantonderzoek onder daadwerkelijke bankklanten die EV rijden (kwantitatief en kwalitatief).",
  "Exacte, geverifieerde transactiedata van Nederlandse CPO's/EMSP's (bv. via een data-partnerschap met ElaadNL of een CPO).",
  "Onderhandelde marge-condities met een concreet kandidaat-partnerplatform.",
  "Formele juridische opinie over de PSD3/AFIR-positionering van een bank als laadbetaal-intermediair.",
  "IT-architectuur-assessment van de daadwerkelijke bank-systemen voor reële integratie-doorlooptijd en -kosten.",
  "Concurrentiereactie-scenario's: hoe reageren bestaande EMSP's/CPO's als een grootbank deze markt betreedt?",
];

export function OnbekendSection() {
  return (
    <section id="kennishiaten" className="scroll-mt-20 border-b border-border py-16">
      <div className="container">
        <SectionHeader eyebrow="Kennishiaten" title="Wat weten we nog niet?" description="Cruciale data die nog ontbreekt voor een definitieve miljoeneninvestering." />
        <Alert variant="warning">
          <HelpCircle className="h-4 w-4" />
          <AlertTitle>Dit rapport is het fundament, niet het eindpunt</AlertTitle>
          <AlertDescription>
            <ul className="mt-2 list-inside list-disc space-y-1.5">
              {hiaten.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      </div>
    </section>
  );
}
