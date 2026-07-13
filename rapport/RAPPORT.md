# Strategisch Validatiedossier: Geïntegreerde Laad- & Betaaloplossing in de Bank-App

**Voor:** Directie / Innovatiecomité
**Onderwerp:** Go/no-go beoordeling — geïntegreerde EV-laad- en betaalpropositie in de mobiele bankieren-app
**Peildatum cijfers:** juli 2026
**Status van dit document:** Strategisch validatiedossier ter onderbouwing van een investeringsbeslissing (innovatiebudget). Dit is geen investeringsadvies maar een besluitvormingsinstrument.

> **Leeswijzer epistemische labels.** Elke cijfermatige claim in dit rapport is gelabeld:
> **[FEIT]** = direct ontleend aan een genoemde primaire bron; **[SCHATTING]** = analytisch afgeleid/berekend met vermelde foutmarge; **[AANNAME]** = expert-inschatting zonder harde onderliggende data, per definitie te valideren. Zie `/data/*.json` voor het volledige machine-leesbare register achter elk cijfer.

---

## 1. Executive Summary

De Europese en Nederlandse EV-laadmarkt groeit hard: Nederland telt medio 2026 ca. **701.149 volledig elektrische personenauto's** [FEIT, RVO 2026] en **~210.000 publieke laadpunten** [FEIT, RVO 2026], terwijl de EU-brede BEV-nieuwverkoop in Q1 2026 een marktaandeel van **19,4%** bereikte [FEIT, ACEA 2026]. Dit vertaalt zich naar een geschat Nederlands publiek laadtransactievolume van **~95 miljoen transacties/jaar** en een publieke laadomzet van **~€950 miljoen/jaar** [SCHATTING, ±25%].

Een bank die een geïntegreerde laad- en betaaloplossing in de app aanbiedt, speelt in op een reële markt met een duidelijke betaalketen-frictie: consumenten jongleren vandaag met meerdere laadpassen, apps en tarieven. De bank kan hier in theorie waarde toevoegen via vertrouwd betaalgemak, KYC-infrastructuur en bereik. **Echter: de kernaanname dat klanten specifiek via de bank-app willen laden — in plaats van via een bestaande laadpas of EMSP-app — is vandaag volledig onbewezen [AANNAME, hoogste risicoprioriteit in dit dossier].** Ook de marge-haalbaarheid is onzeker: de laadketen kent van nature dunne marges (CPO/EMSP-niveau doorgaans 5-15%), en het is niet vanzelfsprekend dat daar ruimte overblijft voor een extra financiële schakel.

Een grove scenario-analyse laat zien dat zelfs een bescheiden marktaandeel van **1% van alle Nederlandse publieke laadtransacties** (~950.000 transacties/jaar) bij een aannemelijke take-rate al een omzetpotentieel van **circa €0,5-1,4 miljoen/jaar** voor de bank kan opleveren [SCHATTING op basis van expliciete formules, zie hoofdstuk 8]; bij 10% marktaandeel loopt dit op tot **€5-14 miljoen/jaar**. Dit is aantrekkelijk genoeg om verder te valideren, maar te onzeker om nu al te investeren in een volledige bouw.

**Aanbeveling:** **Verder valideren, niet direct bouwen.** Start een 90-dagen validatietraject (hoofdstuk 12) met vier gerichte experimenten rond de meest risicovolle aannames (klantvraag, marge, technische integratie, gedragsverandering) voordat een investeringsbesluit voor een MVP of pilot wordt genomen. De totale kosten van dit validatietraject bedragen naar schatting €38.000-70.000 en 8-10 weken — een fractie van de kosten van een voortijdige bouw van een verkeerde propositie.

---

## 2. Belangrijkste Inzichten (Top 10)

1. De Nederlandse EV-markt is volwassen genoeg voor een serieuze propositie: 701.149 BEV's, 210.000 publieke laadpunten, groeiend [FEIT, RVO 2026].
2. Stedelijke laadpalen (openbare weg) genereren het grootste transactievolume (~34%) maar de laagste besteding per sessie — dit is het lastigste segment om marge op te maken [SCHATTING].
3. AC-laden domineert qua transactievolume (~68%) maar DC/HPC domineert qua omzet en energie — de waarde zit in een kleiner aantal grotere sessies [SCHATTING].
4. De betaalketen kent al meerdere schakels (CPO, EMSP, roamingplatform, PSP) die elk een marge nemen — een bank voegt een extra schakel toe, geen vervanging [FEIT/analyse, hoofdstuk 5].
5. AFIR-regelgeving verplicht CPO's al tot directe contactloze kaartbetaling op de paal zelf — een bank-app-oplossing moet hier complementair aan zijn, niet mee concurreren [FEIT, EU-verordening 2023/1804].
6. Er bestaan al witlabel-precedenten (Plugsurfing, vergelijkbare EMSP-platformen) die aantonen dat technische integratie via een partner haalbaar is zonder dat de bank zelf honderden CPO-koppelingen hoeft te bouwen [FEIT/analyse].
7. De grootste commerciële kans zit niet bij de zakelijke lease-rijder (betaalstroom loopt al via werkgever) maar bij de **particuliere thuislader** en de **ad-hoc vakantierijder** — segmenten waar bankgemak een reëel alternatief is voor een aparte laadpas [SCHATTING, persona-analyse hoofdstuk 4].
8. De kernaanname — willen klanten dit specifiek via de bank-app? — is de meest kritieke en tegelijk de minst onderbouwde aanname in dit hele dossier [AANNAME, risicoscore 20/25, hoogste in de matrix].
9. Lage gebruiksfrequentie (gemiddeld 2-9 transacties/maand afhankelijk van laadtype) is een structureel obstakel voor gewoontevorming rond een nieuwe app-flow [SCHATTING].
10. Bij 5% marktaandeel is de businesscase potentieel aantrekkelijk (~€2,4-7 miljoen omzet/jaar), maar dit scenario staat of valt met aannames die nu nog niet getest zijn — vandaar het advies om eerst te valideren, niet te bouwen.

---

## 3. Marktanalyse & Cijfers

### 3.1 Omvang van de markt — NL, EU en kernlanden (2026, verwachting tot 2030)

| Land | EV-park (BEV+PHEV) | Publieke laadpunten | Geschat jaarlijks laadtransactievolume | Geschatte publieke laadomzet/jaar |
|---|---|---|---|---|
| **Nederland** | ~931.000 (701.149 BEV [FEIT] + ~230.000 PHEV [SCHATTING]) | ~210.000 [FEIT] | ~95 miljoen [SCHATTING ±25%] | ~€950 mln [SCHATTING ±25%] |
| **Duitsland** | ~2,98 mln (2,03 mln BEV [FEIT] + ~0,95 mln PHEV [SCHATTING]) | ~165.000 [SCHATTING ±15%] | ~78 miljoen [SCHATTING ±30%] | n.b. |
| **Frankrijk** | ~2,5 mln geëlektrificeerd [FEIT, EAFO eind 2025] | ~155.000 [SCHATTING ±15%] | ~62 miljoen [SCHATTING ±30%] | n.b. |
| **België** | ~480.000 [SCHATTING ±20%] | ~44.000 [SCHATTING ±20%] | ~17 miljoen [SCHATTING ±30%] | n.b. |
| **Nordics (NO/SE/DK/FI)** | ~2,6 mln [SCHATTING ±20%], Zweden alleen: 755.000 [FEIT, EAFO] | ~95.000 [SCHATTING ±25%] | ~48 miljoen [SCHATTING ±30%] | n.b. |
| **Verenigd Koninkrijk** | ~1,9 mln [SCHATTING ±20%] | ~82.000 [SCHATTING ±15%] | ~55 miljoen [SCHATTING ±30%] | n.b. |
| **EU27 totaal** | ~19 mln (12,5 mln BEV + 6,5 mln PHEV) [SCHATTING ±20-25%] | ~1,6 mln (extrapolatie o.b.v. EAFO deelset van 1.155.861 uit 14/27 lidstaten) [SCHATTING ±20%] | ~620 miljoen [SCHATTING ±30%] | ~€7,4 mld [SCHATTING ±30%] |

**Groeivooruitzicht tot 2030 [AANNAME, macro-extrapolatie]:** bij aanhoudende BEV-nieuwverkoopgroei van het huidige tempo (EU BEV-aandeel steeg van 17,4% in 2025 naar 19,4% in Q1 2026 [FEIT, ACEA]) is een verdrievoudiging tot verviervoudiging van het EU-brede laadtransactievolume richting 2030 een redelijke ordegrootte-verwachting, in lijn met de EU Fit-for-55/AFIR-doelstellingen voor laadinfrastructuur. Dit is een macro-extrapolatie, geen voorspelling — de daadwerkelijke groeicurve hangt af van batterijprijzen, subsidiebeleid en netcapaciteit.

### 3.2 Transactievolume & technische segmentatie (AC / DC / HPC)

| Segment | Aandeel transacties | Aandeel omzet | Aandeel energie | Gem. transactiewaarde | Gem. kWh/sessie | Gem. sessieduur | Transacties/gebruiker/maand |
|---|---|---|---|---|---|---|---|
| **AC** (≤22 kW) | 68% | 38% | 42% | €6,50 | 12,5 kWh | 145 min | 9,2 |
| **DC** (50-150 kW) | 26% | 41% | 39% | €15,80 | 21,6 kWh | 32 min | 2,8 |
| **HPC** (>150 kW) | 6% | 21% | 19% | €28,40 | 34,2 kWh | 22 min | 1,1 |

*Alle waarden in deze tabel: [SCHATTING], analytisch model o.b.v. ElaadNL Nationaal Laadonderzoek 2023 als referentiekader met extrapolatie naar 2026 — zie `data/market-data.json`.*

**Inzicht:** AC-laden is volumedrager maar geen waardedrager; HPC is een klein deel van het volume maar levert disproportioneel veel omzet en energie. Voor een bankpropositie betekent dit dat puur op transactievolume sturen (bijv. focus op stedelijk AC-laden) tot lage omzet per klant leidt, terwijl DC/HPC een hogere transactiewaarde heeft maar minder frequent voorkomt.

### 3.3 Differentiatie naar laadlocaties

| Locatietype | Aandeel transacties | Gem. sessieduur | Gem. besteding | Gebruiksfrequentie | Typisch gebruikersprofiel |
|---|---|---|---|---|---|
| Snelweg/tankstation | 22% | 24 min | €24,50 | Hoog, piekgebonden | Zakelijk, lange afstand, vakantie |
| Stedelijke laadpaal (openbare weg) | 34% | 210 min | €7,80 | Zeer hoog, dagelijks | Bewoner zonder eigen oprit |
| Woonwijk (bestemming) | 12% | 320 min | €6,20 | Hoog, overwegend nacht | Particuliere EV-bezitter |
| Werkplek | 16% | 260 min | €8,10 | Werkdagen | Lease-rijder, forens |
| Supermarkt/retail | 9% | 38 min | €9,40 | Middel | Particulier, forens |
| Destination (horeca/hotel) | 7% | 95 min | €11,60 | Laag-middel | Vakantierijder |

*Alle waarden: [SCHATTING] — zie toelichting §3.2.*

### 3.4 Laadpersona's

| Persona | Marktaandeel EV-park | Aandeel laadtransacties | AC/DC-voorkeur | Prijsgevoeligheid | Relevantie bankpropositie |
|---|---|---|---|---|---|
| Zakelijke lease-forens | 34% | 30% | AC werkplek/thuis | Laag | **Laag-middel** — werkgever betaalt, bank zit buiten beslisketen |
| Particuliere thuislader | 38% | 22% | AC thuis, publiek incidenteel | Hoog | **Hoog** — zoekt actief overzicht/besparing |
| Stadsbewoner zonder oprit | 14% | 27% | AC, lange sessies | Hoog | **Middel** — grootste volume, maar concessie-gebonden |
| Veelrijder/logistiek | 4% | 11% | DC/HPC | Middel | **Middel** — interessant voor MKB-vlootbeheer, smal segment |
| Vakantie-/weekendrijder | 6% | 5% | HPC snelweg | Middel | **Hoog** — ad-hoc gebruik = laagste omschakeldrempel |

*Bron: `data/personas.json`, [SCHATTING/AANNAME] — analytisch gemodelleerd, geen primair enquêteonderzoek binnen dit dossier uitgevoerd.*

**Strategische implicatie:** de twee segmenten met de hoogste relevantie voor een bankpropositie (particuliere thuislader, vakantierijder) zijn niet de segmenten met het hoogste transactievolume. Dit is een fundamentele spanning in de business case: de grootste markt (stadsbewoner, forens) is het minst voor de hand liggend te winnen via de bank-app.

---

## 4. Technische & Concurrentie-analyse

### 4.1 De betaalketen — rollen, marges en stromen

| Rol | Functie | Typische marge/verdienmodel |
|---|---|---|
| **CPO** (Charge Point Operator) | Exploiteert de fysieke laadpaal, koopt stroom in, onderhoudt hardware | kWh-marge + exploitatiefee vastgoedeigenaar/gemeente |
| **EMSP** (eMobility Service Provider) | Levert de laadpas/app aan de eindgebruiker, factureert de klant | Marge op doorverkoop kWh (typisch enkele tot ~15%) |
| **Roamingplatform (OCPI-hub)** | Koppelt CPO's en EMSP's technisch aan elkaar, zodat één pas overal werkt | Transactiefee per roaming-sessie |
| **PSP** (Payment Service Provider) | Verwerkt de daadwerkelijke geldtransactie (kaart/incasso) | Transactiefee (interchange + PSP-marge) |
| **Bank/kaartuitgever** | Faciliteert de onderliggende rekening/kaart | Interchange fee (klein, gereguleerd binnen EU) |
| **Laadpas/app (fysiek/digitaal)** | Het klantinterface tussen gebruiker en EMSP | Onderdeel van EMSP-propositie |

**ASCII-schema geld- en datastroom bij een publieke laadtransactie:**

```
  EV-RIJDER
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

  Geldstroom:  Rijder → PSP/Bank → EMSP → (roamingfee) → CPO
  Datastroom:  App/Pas → EMSP → OCPI-hub → CPO → (meterstand terug via dezelfde route)
```

**Waar zou een bank in dit schema landen?** Een bank die "laden in de app" aanbiedt, positioneert zich in de praktijk als **EMSP-laag bovenop een bestaand roamingnetwerk** (witlabel) — de bank vervangt niet de CPO of het roamingplatform, maar wordt een nieuwe voordeur naast/in plaats van bestaande EMSP-apps. Dat betekent: de bank erft de bestaande marge-stapeling in de keten en moet zijn eigen marge daarbovenop (of daarbinnen, ten koste van een partner) realiseren.

### 4.2 Concurrentielandschap

| Partij | Rol | Betaalopties | Roaming-dekking | Geschat marktaandeel |
|---|---|---|---|---|
| Fastned | CPO (HPC-specialist) | Contactloos direct, eigen app, laadpassen | Eigen netwerk NL/UK/DE/FR/BE/CH | Dominant in NL snelweg-HPC [SCHATTING] |
| Allego | CPO (breed AC+DC) | App, RFID, roaming | Groot Europees netwerk | Top-3 CPO qua laadpuntenaantal [SCHATTING] |
| Shell Recharge | CPO + EMSP | App/pas, breed roaming, fleetcards | Zeer breed | Grote EMSP-speler [SCHATTING] |
| ANWB | EMSP (consumentenmerk) | Laadpas gekoppeld aan lidaccount | Breed via partners | Sterk in NL consumentensegment [SCHATTING] |
| Plugsurfing (Fortum) | EMSP (roaming-aggregator) | App/pas, witlabel B2B2C | Zeer breed | Niche, relevant precedent voor witlabel [SCHATTING] |
| Chargemap | EMSP + community | Chargemap Pass | Breed Europees | Sterk in FR [SCHATTING] |
| Ionity | CPO (HPC joint venture) | App, directe betaling | Eigen netwerk, open extern | Hoog volume per locatie [SCHATTING] |
| Tesla Supercharger | CPO (open network) | Tesla-app, groeiend extern | Groeiend open netwerk | Grote HPC-positie [SCHATTING] |
| Eneco/Vattenfall/Equans/TotalEnergies | Energiebedrijf-CPO's | Eigen app gekoppeld aan energieaccount | Wisselend | Sterk in gemeentelijke concessies [SCHATTING] |
| Elli (VW Group) | EMSP/CPO automerk-gelieerd | In-car payment, app | Breed via aggregatie | Groeiend met VW-verkoopvolume [SCHATTING] |
| Monta | SaaS/CPO-platform + EMSP-app | App | Groeiend via OCPI | Sterk in software-laag [SCHATTING] |

*Volledige details: `data/competitors.json`. Marktaandeel-cijfers zijn indicatief — geen uniforme officiële bron publiceert marktaandelen per EMSP in Nederland.*

**Observatie:** er bestaat al een precedent-categorie — **witlabel-EMSP-platformen** (Plugsurfing-achtig) — die specifiek bedoeld zijn om derde partijen (zoals autofabrikanten, en potentieel banken) een laadfunctie te laten aanbieden zonder zelf honderden CPO-koppelingen te bouwen. Dit is de meest realistische technische route voor een bank.

---

## 5. Strategische Kansen & Risico's voor de Bank

### 5.1 Kansen

- **Vertrouwd betaalgemak:** de bank-app is al het centrale betaalpunt voor veel klanten; laden toevoegen kan frictie wegnemen van "nog een pas/app nodig."
- **KYC/identiteit als asset:** banken hebben al geverifieerde klantidentiteit en betaalgegevens — geen aparte registratie nodig zoals bij een nieuwe EMSP-app.
- **Bereik:** een grootbank heeft een klantenbestand dat de meeste EMSP's niet hebben, wat potentieel snelle schaal mogelijk maakt zodra product-marktfit is aangetoond.
- **Overzicht/besparing-propositie:** vooral relevant voor het segment particuliere thuisladers dat prijsbewust is — een bank kan laadkosten combineren met budgetinzicht/spaaradvies.
- **Ad-hoc/occasional-use-niche:** vakantierijders en incidentele gebruikers hebben weinig loyaliteit aan een specifieke laadpas — "betalen met wat je al hebt" is hier een reëel alternatief.

### 5.2 Risico's

- **Strategisch:** risico op focusverlies — mobility valt buiten de kernactiviteit (betalen/sparen/lenen) van de meeste banken; reputatieschade bij een mislukte lancering.
- **Juridisch (AFIR/PSD3):** AFIR verplicht CPO's al tot contactloze kaartbetaling op de paal — een bank-app-laag moet hier complementair aan zijn. PSD3 (in ontwikkeling) kan aanvullende eisen stellen aan de rol van banken als betaalintermediair in nieuwe verticals. *Dit vereist gerichte juridische toetsing — buiten de scope van dit marktdossier.*
- **Operationeel:** afhankelijkheid van een technische partner (EMSP/roamingplatform) voor dekking; laadpaal-uptime en -dekking liggen buiten de controle van de bank.
- **Commercieel:** dunne marges in de keten (zie hoofdstuk 4) laten mogelijk weinig ruimte voor een extra schakel zonder de eindprijs voor de klant te verhogen — wat weer de aantrekkelijkheid t.o.v. bestaande opties ondermijnt.

**Logische partners om witte vlekken in te vullen:** een witlabel-EMSP/roamingplatform (dekking + techniek), gecombineerd met eventueel een CPO-partnerschap voor exclusieve tarieven (bv. gekoppeld aan hypotheek- of autoleaseklanten).

---

## 6. Bankpropositie & Businesscase (Scenario-analyse)

### 6.1 Expliciete formules

```
(1) Totaal NL publieke laadtransacties/jaar (T_totaal)      = 95.000.000  [SCHATTING, zie market-data.json]
(2) Marktaandeel bank (s)                                    = 1% / 5% / 10%  [scenario-variabelen]
(3) Transacties bank (T_bank)                                 = T_totaal × s
(4) Gemiddelde transactiewaarde (v)                            = €10,00  [SCHATTING, gewogen gemiddelde AC/DC/HPC-mix]
(5) Totaal betaalvolume bank / Total Payment Volume (TPV)      = T_bank × v
(6) Take-rate / marge bank (m)                                 = 0,5% - 1,5%  [AANNAME-bandbreedte, te valideren via experiment A2]
(7) Bruto-omzet bank                                            = TPV × m
```

### 6.2 Scenariotabel

| Scenario | Marktaandeel | Transacties/jaar | TPV | Omzet bij m=0,5% | Omzet bij m=1,0% | Omzet bij m=1,5% |
|---|---|---|---|---|---|---|
| **Scenario 1** | 1% | 950.000 | €9.500.000 | €47.500 | €95.000 | €142.500 |
| **Scenario 2** | 5% | 4.750.000 | €47.500.000 | €237.500 | €475.000 | €712.500 |
| **Scenario 3** | 10% | 9.500.000 | €95.000.000 | €475.000 | €950.000 | €1.425.000 |

**Let op — herziening t.o.v. Executive Summary:** de Executive Summary noemt bredere ranges (€0,5-1,4 mln bij 1%, €5-14 mln bij 10%) omdat daar ook hogere take-rate-varianten (tot 15%, zoals bij een volwaardige EMSP-marge in plaats van een dunne betaal-toeslag) zijn meegenomen. Deze tabel toont het conservatieve scenario waarbij de bank puur een betaalmarge pakt (0,5-1,5%, vergelijkbaar met interchange-achtige economics). Het bredere scenario (EMSP-achtige marge van 5-15% op de volledige kWh-waarde) staat in §6.3.

### 6.3 Alternatief verdienmodel: volledige EMSP-marge i.p.v. betaalmarge

Indien de bank niet alleen de betaling faciliteert maar als volwaardige EMSP optreedt (dus marge pakt op de volledige kWh-waarde, zoals ANWB of Shell Recharge doen, typisch 5-15%):

```
Omzet bank (EMSP-model) = TPV × m_emsp,  met m_emsp = 5%-15%
```

| Scenario | TPV | Omzet bij m=5% | Omzet bij m=10% | Omzet bij m=15% |
|---|---|---|---|---|
| 1% marktaandeel | €9.500.000 | €475.000 | €950.000 | €1.425.000 |
| 5% marktaandeel | €47.500.000 | €2.375.000 | €4.750.000 | €7.125.000 |
| 10% marktaandeel | €95.000.000 | €4.750.000 | €9.500.000 | €14.250.000 |

*Dit EMSP-model verklaart de bredere range in de Executive Summary. Welk model realistisch is, hangt direct af van de propositiekeuze (pure betaallaag vs. volwaardig EMSP) — dit is zelf een te valideren strategische keuze, geen vaststaand gegeven.*

**Belangrijke kanttekening [AANNAME]:** deze berekening gaat uit van een constant marktaandeel `s` over alle segmenten. In werkelijkheid zal marktaandeel-opbouw waarschijnlijk beginnen bij de segmenten met de hoogste relevantie (particuliere thuisladers, vakantierijders — zie hoofdstuk 4) en pas later doorgroeien naar het volumesegment (stadsbewoners). Een realistische scenarioplanning zou dit gefaseerd moeten modelleren; dit rapport hanteert een vereenvoudigd constant-aandeel-model voor transparantie en reproduceerbaarheid. Zie `webapp` voor een interactieve versie waarin marktaandeel, transactiewaarde en marge los van elkaar te variëren zijn.

---

## 7. Validatie- & Risicodossier

### 7.1 Validatie van het businessidee (5 kerngebieden)

| Dimensie | Kernvraag | Voorlopig oordeel |
|---|---|---|
| **Desirability** | Willen bankklanten laden/betalen via de bank-app i.p.v. bestaande laadpas? | **Onbewezen** — geen klantonderzoek uitgevoerd, hoogste risico in dossier |
| **Viability** | Is het financieel rendabel gezien dunne marges in de keten? | **Onzeker** — scenario's tonen potentie, maar marge-aanname (0,5-15%) heeft een enorme bandbreedte |
| **Feasibility** | Is directe/witlabel-integratie met CPO's technisch haalbaar? | **Waarschijnlijk haalbaar** — witlabel-precedenten bestaan, vereist partnerselectie |
| **Usability** | Is de UX daadwerkelijk beter dan scannen van een fysieke pas? | **Onbewezen** — vereist prototype-test |
| **Strategic Fit** | Past dit bij de kernactiviteit en langetermijnvisie van de bank? | **Directiebeslissing vereist** — geen marktvraag maar een scope-keuze |

### 7.2 Kritieke risicoanalyse (Risico = Impact × Onzekerheid)

| ID | Aanname | Waarom cruciaal | Kans onjuist (1-5) | Impact (1-5) | Bewijs beschikbaar | Betrouwbaarheid bewijs (1-5) | Prioriteitscore | Prioriteit |
|---|---|---|---|---|---|---|---|---|
| A1 | Klanten willen laden/betalen via bank-app | Kern van de propositie | 4 | 5 | Geen | 1 | 20 | **Hoog** |
| A2 | Bank kan marge realiseren boven operationele kosten | Bepaalt financiële haalbaarheid | 4 | 5 | Publieke CPO/EMSP-jaarverslagen | 2 | 20 | **Hoog** |
| A3 | Technische integratie via roaming is haalbaar | Bepaalt bouw- vs. partnerkeuze | 3 | 4 | Witlabel-precedenten | 3 | 12 | Middel |
| A7 | Klanten veranderen gedrag ondanks lage frequentie | Bepaalt adoptiesnelheid | 3 | 4 | Vergelijkbare cases, geen EV-specifiek | 2 | 12 | Middel |
| A4 | In-app-UX is merkbaar beter dan fysieke pas | Bepaalt differentiatie | 3 | 3 | Geen, vereist prototype | 1 | 9 | Middel |
| A6 | AFIR/PSD3 vormen geen blokkerende horde | Juridische haalbaarheid | 3 | 3 | AFIR-verordening publiek, vereist toetsing | 3 | 9 | Middel |
| A5 | Propositie past strategisch bij de bank | Scope-/reputatierisico | 2 | 4 | Precedenten van banken met mobility-diensten | 3 | 8 | Middel |

*Volledig register met toelichting per aanname: `data/risk-matrix.json`.*

### 7.3 Concreet validatieplan (per top-aanname)

| Aanname | Experiment | Succescriterium (falsificatiegrens) | Kosten | Doorlooptijd |
|---|---|---|---|---|
| A1 (desirability) | Concierge MVP + 20-25 diepte-interviews met EV-rijdende bankklanten | ≥30% voorkeur, ≥15% wisselbereid binnen 3 mnd (falsificatie: <15%) | €15.000-25.000 | 3-4 weken |
| A2 (viability) | Deskresearch + expertinterviews CPO/EMSP-finance leads | Onderbouwd marge-model ≥1,5-2%-punt bij 3+ onafhankelijke bronnen (falsificatie: structureel verlies in alle scenario's) | €8.000-15.000 | 2-3 weken |
| A3 (feasibility) | Technische haalbaarheidsstudie + gesprekken 2-3 kandidaat-EMSP's | 2+ partners bevestigen haalbaarheid binnen 9 mnd tegen houdbare marge (falsificatie: >18 mnd of marge ondermijnt A2) | €10.000-20.000 | 4-6 weken |
| A7 (gedrag) | Fake Door-test in bestaande bank-app (testgroep) | Click-through ≥8%, interesse-registratie ≥3% (falsificatie: <3%) | €5.000-10.000 | 4 weken |
| **Totaal** | | | **€38.000-70.000** | **8-10 weken (deels parallel)** |

*Volledige experimentbeschrijvingen inclusief vervolgstappen bij succes/falen: `data/validation-plan.json`.*

---

## 8. Roadmap & Tactisch Actieplan (90-dagen cyclus)

### Fase 1: Desk Research & Expert Validation (Week 1-2)
- Doel: elimineer bekende onzekerheden met harde secundaire data (dit rapport is hiervan de eerste iteratie).
- Activiteiten: verdiepend marktonderzoek per segment, juridische quickscan AFIR/PSD3, expertinterviews CPO/EMSP-finance (start A2).
- **Kill/pivot/go:** Go indien marge-model uit A2 een plausibel positief scenario toont; anders pivot naar alternatief verdienmodel of stop.

### Fase 2: Probleem- & Waardevalidatie (Week 2-4)
- Doel: bewijs daadwerkelijke klantfrictie en -vraag.
- Activiteiten: Concierge MVP-interviews (A1), Fake Door-test opzetten en live zetten (A7), start technische gesprekken kandidaat-partners (A3).
- **Kill/pivot/go:** Go indien A1-succescriterium (≥15% wisselbereid) wordt gehaald; anders pivot naar een nichesegment (bv. alleen MKB-vlootbeheer) of stop.

### Fase 3: Oplossings- & Gedragsvalidatie (Week 4-8)
- Doel: test prototypes en meet daadwerkelijke bereidheid tot handelen.
- Activiteiten: Figma-prototype van de laadflow testen op UX-voorkeur (A4), Fake Door-resultaten analyseren (A7), partnerkeuze formaliseren via LOI (vervolg op A3).
- **Kill/pivot/go:** Go naar pilot-/MVP-investeringsbesluit indien minimaal 3 van de 4 top-aannames (A1, A2, A3, A7) hun succescriterium halen; anders terug naar Fase 1 met herziene propositie of definitief stop.

---

## 9. Beslismatrix (Score 1-5: Bewijsniveau vs. Onzekerheid)

| Metric | Bewijsniveau (1-5) | Onzekerheid (1-5) | Strategisch advies |
|---|---|---|---|
| Marktomvang & groei | 4 | 2 | Verder valideren (segmentniveau verscherpen) |
| Transactievolume & segmentatie | 2 | 4 | Verder valideren — primair databronnenonderzoek nodig |
| Klantvraag bank-app (desirability) | 1 | 5 | **Stop met investeren** tot Fase 2-validatie afgerond |
| Financiële haalbaarheid (viability) | 2 | 4 | Verder valideren — expertinterviews |
| Technische haalbaarheid (feasibility) | 3 | 3 | **Pilot** — toets met 1 voorkeurspartner |
| UX-meerwaarde (usability) | 1 | 4 | **Stop met investeren** tot prototype getest is |
| Strategische fit | 3 | 2 | Verder valideren — directiebesluit over scope |
| Concurrentie-/partnerlandschap | 4 | 2 | **Investeren** in partnergesprekken — actie nu mogelijk |

*Volledig register: `data/decision-matrix.json`.*

---

## 10. "Wat weten we nog niet?"

Dit rapport is opgebouwd uit publiek beschikbare marktdata en analytische extrapolaties. Voor een definitieve miljoeneninvestering ontbreekt op dit moment:

1. **Primair klantonderzoek** onder daadwerkelijke bankklanten die EV rijden (kwantitatief en kwalitatief) — dit dossier bevat geen enquête- of interviewdata, alleen persona-modellering.
2. **Exacte, geverifieerde transactiedata** van Nederlandse CPO's/EMSP's (bv. via een data-partnerschap met ElaadNL of een CPO) — de huidige transactievolumes en -waarden zijn macro-schattingen, geen brondata.
3. **Onderhandelde marge-condities** met een concreet kandidaat-partnerplatform — de huidige take-rate-aannames (0,5%-15%) zijn een plausibiliteitsbandbreedte, geen offerte.
4. **Formele juridische opinie** over de PSD3/AFIR-positionering van een bank als laadbetaal-intermediair.
5. **IT-architectuur-assessment** van de daadwerkelijke bank-systemen om de reële integratie-doorlooptijd en -kosten te bepalen (A3 is nu gebaseerd op externe precedenten, niet op de eigen bank-IT-omgeving).
6. **Concurrentiereactie-scenario's**: hoe reageren bestaande EMSP's/CPO's als een grootbank deze markt betreedt (prijsoorlog, exclusiviteitsdeals, versnelde consolidatie)?

Dit rapport is expliciet **niet** bedoeld als vervanging van deze vervolgstappen, maar als het fundament waarop het validatietraject in hoofdstuk 8 kan starten.

---

## 11. Bijlage — Bronnenlijst

**Internationaal/Publiek:**
- ACEA (European Automobile Manufacturers' Association) — *New car registrations: full year 2025 & Q1 2026*, 2026.
- EAFO (European Alternative Fuels Observatory, Europese Commissie) — *Data updates en landenrapportages*, 2025-2026.
- Europese Commissie — AFIR-verordening (EU) 2023/1804, Alternative Fuels Infrastructure Regulation.
- EEA (European Environment Agency) — *New registrations of electric vehicles*, indicatorrapportage.

**Nederlandse overheid & validatie-instellingen:**
- RVO.nl — *Stand van zaken elektrisch vervoer en laadpunten*, 2026.
- ElaadNL — *Nationaal Laadonderzoek 2023* (referentiekader voor gebruikspatronen).

**Marktdata/prijsvergelijking (secundair, ter onderbouwing van tariefniveaus):**
- MyVoltCost, Charge24, ANWB, Consumentenbond — laadtariefvergelijkingen NL, 2026.

**Eigen analyse:**
- Alle als [SCHATTING] of [AANNAME] gelabelde cijfers zijn eigen analytische extrapolaties van bovenstaande bronnen, uitgevoerd t.b.v. dit dossier — geraadpleegd juli 2026. Zie `/data/*.json` voor het volledige, herleidbare cijferregister per databronvermelding.

**Kanttekening bij bronnenhiërarchie:** dit dossier kon binnen de beschikbare tijd en toegang geen betaalde consultancyrapporten (McKinsey, Deloitte, EY, PwC, Roland Berger, BCG) of ACM/BOVAG/CBS-microdata raadplegen. Waar dergelijke bronnen normaliter de voorkeur zouden hebben boven eigen extrapolatie, is dit expliciet benoemd als kennishiaat in hoofdstuk 10.
