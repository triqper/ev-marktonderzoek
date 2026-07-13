import { SectionHeader } from "@/components/section-header";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EpistemicBadge } from "@/components/epistemic-badge";

const ASCII_SCHEMA = `  EV-RIJDER
     |  (1) start sessie via app/pas/contactloos
     v
  LAADPAS / APP  <--------------------------------+
     |  (2) authenticatie + sessiestart              |
     v                                               |
  EMSP  ---(3) roaming-verzoek (indien niet eigen paal)---> ROAMINGPLATFORM (OCPI)
     |                                                          |
     |                                                (4) routeert naar juiste CPO
     v                                                          v
  FACTURATIE EMSP <-----------------------------------------  CPO (fysieke laadpaal)
     |  (5) kWh x tarief + evt. sessiefee                       |
     v                                                (6) levert stroom, meet kWh
  PSP / BETAALPROVIDER                                          |
     |  (7) incasseert bedrag van klantrekening/kaart           |
     v                                                          |
  BANK / KAARTUITGEVER  ------------------------(8) interchange-fee-----+
     |
     v
  UITBETALING RICHTING EMSP  --(9) na aftrek PSP- en roamingmarges-->  CPO ontvangt
                                                                        kWh-opbrengst
                                                                        (na aftrek eigen
                                                                        marge aan EMSP)

  Geldstroom:  Rijder -> PSP/Bank -> EMSP -> (roamingfee) -> CPO
  Datastroom:  App/Pas -> EMSP -> OCPI-hub -> CPO -> (meterstand terug via dezelfde route)`;

const ketenRollen = [
  { rol: "CPO", functie: "Exploiteert de fysieke laadpaal, koopt stroom in, onderhoudt hardware", marge: "kWh-marge + exploitatiefee vastgoedeigenaar/gemeente" },
  { rol: "EMSP", functie: "Levert de laadpas/app aan de eindgebruiker, factureert de klant", marge: "Marge op doorverkoop kWh (typisch enkele % tot ~15%)" },
  { rol: "Roamingplatform (OCPI-hub)", functie: "Koppelt CPO's en EMSP's technisch aan elkaar", marge: "Transactiefee per roaming-sessie" },
  { rol: "PSP", functie: "Verwerkt de daadwerkelijke geldtransactie", marge: "Transactiefee (interchange + PSP-marge)" },
  { rol: "Bank/kaartuitgever", functie: "Faciliteert de onderliggende rekening/kaart", marge: "Interchange fee (klein, EU-gereguleerd)" },
];

export function KetenSection() {
  return (
    <section id="keten" className="scroll-mt-20 border-b border-border py-16">
      <div className="container">
        <SectionHeader
          eyebrow="Onderdeel 5"
          title="De betaalketen & technische architectuur"
          description="Hoe een publieke laadtransactie technisch en financieel verloopt — en waar een bank in dit schema zou landen."
        />
        <Card>
          <CardContent className="p-6">
            <div className="overflow-x-auto rounded-md bg-muted/50 p-4">
              <pre className="min-w-[640px] font-mono text-xs leading-relaxed text-foreground sm:text-sm">{ASCII_SCHEMA}</pre>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Een bank die &ldquo;laden in de app&rdquo; aanbiedt, positioneert zich in de praktijk als een
              <strong className="text-foreground"> EMSP-laag bovenop een bestaand roamingnetwerk</strong> (witlabel) —
              ze vervangt niet de CPO of het roamingplatform, maar wordt een nieuwe voordeur naast/in
              plaats van bestaande EMSP-apps.
            </p>
          </CardContent>
        </Card>

        <div className="mt-6 overflow-x-auto rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rol</TableHead>
                <TableHead>Functie</TableHead>
                <TableHead>Typische marge/verdienmodel</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ketenRollen.map((r) => (
                <TableRow key={r.rol}>
                  <TableCell className="font-medium">{r.rol}</TableCell>
                  <TableCell className="text-muted-foreground">{r.functie}</TableCell>
                  <TableCell className="text-muted-foreground">{r.marge}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-3 flex justify-end">
          <EpistemicBadge type="FEIT" />
        </div>
      </div>
    </section>
  );
}
