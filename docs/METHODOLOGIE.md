# Methodologie — EV-laadmarkt omzetmodel

Dit document beschrijft de rekenkern (`assets/js/model.js`), de aannames en de
onzekerheidsanalyse, zodat elke uitkomst reproduceerbaar en auditeerbaar is.

## 1. Scope & organisatieprofiel

De omzetpotentie wordt berekend voor een **betaal- en e-mobility-laag**: een
organisatie die verdient aan publieke EV-laadtransacties via (1) betaalverwerking/
acquiring, (2) eMSP/roaming-marge, (3) platform-SaaS voor CPO's en (4) issuing &
embedded finance voor wagenparken. Thuismarkt = Nederland; gefaseerde uitrol naar
Europese kernmarkten (aangeduid als "EU" in het model, EU27 excl. NL).

> Dit profiel is een expliciete, aanpasbare aanname. Wijzig de scenario- en
> driverparameters in `assets/js/data.js` om een ander organisatieprofiel te
> modelleren; alle grafieken en tabellen rekenen automatisch mee.

## 2. Driver tree (per markt g ∈ {NL, EU}, per jaar y)

```
fleet             = MARKET.fleet[g][y] × scenario.fleetMult
publicKwh         = fleet × publicKwhPerBev[g][y]
marketGMV         = publicKwh × pricePerKwh[g][y]
sessions          = publicKwh / avgSessionKwh[g]
share             = scenario.share{NL|EU}[y]
processedSessions = sessions × share
processedGMV      = marketGMV × share
txnRevenue        = processedGMV × takeRate + processedSessions × feePerTxn
platformRevenue   = chargePoints.NL[y] × platformPointsShareNL[y] × platformRevPerPoint
issuingRevenue    = fleetAccounts[y] × interchangePerAccount
revenue           = txnRevenue(NL+EU) + platformRevenue + issuingRevenue
ebitda            = revenue × ebitdaMargin[y]
users             = processedSessions / 70 + fleetAccounts[y]
CAGR              = (revenue₂₀₃₀ / revenue₂₀₂₆)^(1/4) − 1
```

Alle omzet wordt in deze kern berekend; nergens in de UI staan losse,
hardgecodeerde omzetgetallen.

## 3. Marktbasis (geankerd op bronnen)

| Grootheid | NL 2025 | NL 2030 | Bron |
|---|---|---|---|
| BEV-vloot | ~640.000 | ~1,84 mln | EAFO (502k jul-2024) |
| Publiek kWh/BEV/jr | ~2.050 | ~1.860 | Teamschatting o.b.v. ElaadNL-orde |
| Publiek tarief €/kWh | €0,53 | €0,49 | Tap Electric / Eleport |
| (Semi-)publieke laadpunten | ~195.000 | ~330.000 | RVO / NL Times |

EU-vloot: ~11,5 mln (2025) → ~33,5 mln (2030); publiek kWh/BEV ~1.400–1.450;
tarief ~€0,47–0,50. Bronnen: Grand View Research / EAFO. Zie het aannameregister
in de app (hoofdstuk "Aannameregister & bronnen") voor betrouwbaarheid en
onzekerheidsmarges per aanname.

## 4. Scenario's

| Parameter | Conservatief | Basis | Ambitieus |
|---|---|---|---|
| EV-vloeimultiplier | 0,90 | 1,00 | 1,10 |
| Verwerkt aandeel NL 2030 | 10% | 14% | 21,5% |
| Verwerkt aandeel EU 2030 | 0,85% | 1,25% | 2,70% |
| Blended take rate | 3,2% | 3,8% | 4,5% |
| Fee per transactie | €0,06 | €0,08 | €0,10 |
| Fleet-accounts 2030 | 22.000 | 44.000 | 88.000 |
| Interchange/account/jr | €95 | €120 | €145 |
| Platform-SaaS/laadpunt/jr | €42 | €55 | €68 |
| EBITDA-marge 2030 | 24% | 32% | 40% |

## 5. Monte Carlo (`assets/js/montecarlo.js`)

- **RNG:** Mulberry32 met vaste seed (42) → volledig reproduceerbaar.
- **Sampling:** triangulaire verdelingen (min/mode/max) over zeven kern­
  onzekerheden als multipliers op het gekozen scenario: vloeigroei, verwerkt
  aandeel, take rate, publiek kWh/BEV, tarief, fleet/embedded finance, platform.
- **Iteraties:** 5.000. Output: verdeling van de 2030-jaaromzet en cumulatieve
  5-jaarsomzet, met P10/P50/P90.
- **Tornado:** elke parameter afzonderlijk naar min/max (overige op basis),
  effect op de 2030-jaaromzet — identificeert de grootste omzethefbomen.

## 6. Beperkingen

- Publiek kWh/BEV, aandeelramp, take rate en embedded-finance-opbrengsten zijn
  teamschattingen; te kalibreren met primaire data (ElaadNL/RVO) en een pilot.
- Monte Carlo trekt parameters **onafhankelijk**; werkelijke correlaties
  (bv. vloeigroei ↔ tarief) zijn nog niet gemodelleerd.
- Het model bevat (nog) geen volledige kostenkant/kasstroom; EBITDA is een
  marge-benadering. Zie hoofdstuk G "Openstaande verbeterpunten" in de app.

## 7. Reproduceren

Open `index.html` in een browser (of serveer de map statisch). Kies een scenario,
versleep de aannames, en exporteer het model via de CSV-knop. Wijzig
`assets/js/data.js` om aannames structureel aan te passen.
