# EV-Marktonderzoek — Strategisch Validatiedossier & Interactief Dashboard

Strategisch validatiedossier en interactief directiedashboard voor de vraag of het
commercieel en strategisch interessant is voor een Nederlandse grootbank om samen
met een partner een geïntegreerde laad- en betaaloplossing aan te bieden voor
publieke EV-laadpunten, rechtstreeks vanuit de mobiele bankieren-app.

## Inhoud van deze repository

```
.
├── rapport/
│   └── RAPPORT.md          # Volledig strategisch rapport (12 onderzoeksonderdelen)
├── data/
│   ├── market-data.json         # Marktcijfers NL/EU/kernlanden — met FEIT/SCHATTING/AANNAME-labels
│   ├── personas.json            # Laadpersona's
│   ├── competitors.json         # Concurrentielandschap
│   ├── risk-matrix.json         # Aanname- en risicoregister (Impact × Onzekerheid)
│   ├── validation-plan.json     # Concreet validatieplan per top-aanname
│   └── decision-matrix.json     # Beslismatrix (bewijsniveau vs. onzekerheid)
└── webapp/                 # Interactief Next.js-directiedashboard
    ├── src/app/             # Next.js App Router
    ├── src/components/      # UI-componenten (shadcn/ui-stijl), grafieken, secties
    ├── src/data/             # Kopie van /data voor de dashboard-build
    └── src/lib/calculations.ts  # Enige plek met de businesscase-formules
```

Alle cijfers in zowel het rapport als het dashboard zijn afkomstig uit dezelfde
`data/*.json`-bestanden en dezelfde rekenkern (`webapp/src/lib/calculations.ts`),
zodat rapport en dashboard nooit tegenstrijdige getallen kunnen tonen.

## Het rapport lezen

Open [`rapport/RAPPORT.md`](rapport/RAPPORT.md). Elke cijfermatige claim is
gelabeld als **Feit** (harde bron), **Schatting** (berekend, met foutmarge) of
**Aanname** (te valideren) — zie de leeswijzer bovenaan het rapport.

## Het dashboard draaien

Vereisten: Node.js 20+ en npm.

```bash
cd webapp
npm install
npm run dev
```

Open <http://localhost:3000>. Voor een productie-build:

```bash
npm run build
npm run start
```

### Verificatie

```bash
cd webapp
npm run typecheck   # TypeScript strict-mode check
npm run build        # Productie-build (statische export van de Next.js-app)
```

Beide commando's zijn onderdeel van de zelfcontrole van dit dossier en zijn
succesvol doorlopen bij oplevering (zie "Zelfcontrole" hieronder).

## Dashboard-functionaliteit

- **Sticky navigatie** met actieve-sectie-highlighting, mobiel menu (Sheet) en
  een zoekfunctie/command palette (⌘K of `/`) om direct naar een sectie te springen.
- **Interactieve scenario-sliders** (marktaandeel, transactiewaarde, marge,
  EV-adoptiegraad, laadfrequentie) die de businesscase-grafieken en KPI's
  realtime herberekenen — gebaseerd op dezelfde formules als hoofdstuk 6 van het
  rapport.
- **Recharts-visualisaties**: horizontale bar charts, gegroepeerde bar charts,
  een treemap, een risico-scatterplot en een handmatige heatmap — elke grafiek
  heeft een downloadknop (CSV) en een epistemisch statuslabel (Feit/Schatting/Aanname).
- **Volledig responsive**, licht/donker thema (volgt systeeminstelling, met
  handmatige toggle), opgebouwd met shadcn/ui-stijl componenten (Card, Tabs,
  Accordion, Badge, Tooltip, Alert, Table, Slider, Progress, Separator,
  ScrollArea, Popover, Sheet, HoverCard, Dialog, Command) op basis van Radix UI.

## Zelfcontrole (uitgevoerd bij oplevering)

- [x] Alle 12 onderzoeksonderdelen en de outputstructuur uit de opdracht zijn uitgewerkt in `rapport/RAPPORT.md`.
- [x] Cijfers zijn voorzien van in-line bronvermelding of expliciet gelabeld als schatting/aanname met foutmarge.
- [x] De businesscase-formules zijn identiek geïmplementeerd in het rapport (§6.1) en in `webapp/src/lib/calculations.ts`, en handmatig doorgerekend geverifieerd (bv. 5% → 10% marktaandeel verdubbelt TPV en omzet).
- [x] Feiten, schattingen en aannames zijn doorgaand van elkaar onderscheiden (badges in de app, labels in de JSON-data en het rapport).
- [x] `npm run typecheck` en `npm run build` slagen zonder fouten.
- [x] Het dashboard is end-to-end getest in een browser (Playwright): light/dark mode, navigatie, en de scenario-sliders zijn functioneel geverifieerd (een slider-wijziging van 5%→10% marktaandeel verdubbelde de weergegeven omzet correct van €475K naar €950K).
- [x] Een reële bug (twee overlappende datapunten in de risicomatrix-scatter, en een SSR/CSR-hydratatiemismatch in de compacte getalnotatie) is gevonden tijdens het testen en opgelost.

## Belangrijkste beperking

Dit dossier is samengesteld uit publiek toegankelijke bronnen (RVO, ACEA, EAFO,
het Nationaal Laadonderzoek (VER/RUG/RVO), de NAL Voortgangsrapportage 2025,
CBS StatLine en prijsvergelijkers) geraadpleegd in juli 2026, aangevuld met transparant
onderbouwde macro-schattingen waar directe brondata ontbrak. Er is **geen**
primair klantonderzoek, geen toegang tot betaalde consultancyrapporten en geen
geverifieerde CPO/EMSP-transactiedata gebruikt. Zie hoofdstuk 10 van het rapport
("Wat weten we nog niet?") voor de volledige lijst kennishiaten die vóór een
definitieve investeringsbeslissing moeten worden ingevuld.
