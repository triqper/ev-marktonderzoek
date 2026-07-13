import { SectionHeader } from "@/components/section-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import decisionMatrix from "@/data/decision-matrix.json";

const ADVIES_VARIANT = (advies: string) => {
  if (advies.startsWith("Stop")) return "destructive" as const;
  if (advies.startsWith("Investeren")) return "default" as const;
  if (advies.startsWith("Pilot")) return "secondary" as const;
  return "outline" as const;
};

export function BeslismatrixSection() {
  return (
    <section id="beslismatrix" className="scroll-mt-20 border-b border-border py-16">
      <div className="container">
        <SectionHeader
          eyebrow="Beslismatrix"
          title="Bewijsniveau vs. onzekerheid per metric"
          description="Score 1-5, gekoppeld aan een direct strategisch advies: Stop / Verder valideren / Pilot / Investeren."
        />
        <div className="overflow-x-auto rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[240px]">Metric</TableHead>
                <TableHead>Bewijsniveau</TableHead>
                <TableHead>Onzekerheid</TableHead>
                <TableHead>Strategisch advies</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {decisionMatrix.metrics.map((m) => (
                <TableRow key={m.metric}>
                  <TableCell className="font-medium">{m.metric}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={(m.bewijsniveau / 5) * 100} className="w-16" />
                      <span className="text-xs tabular-nums text-muted-foreground">{m.bewijsniveau}/5</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={(m.onzekerheid / 5) * 100} className="w-16" />
                      <span className="text-xs tabular-nums text-muted-foreground">{m.onzekerheid}/5</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={ADVIES_VARIANT(m.advies)} className="whitespace-normal text-left leading-snug">
                      {m.advies}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
}
