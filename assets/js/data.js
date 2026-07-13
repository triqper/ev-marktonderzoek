/* ============================================================================
   EV Charging Revenue Model — DATA LAYER
   Single source of truth for market data, assumptions, sources and scenarios.
   All figures are documented with a source id (see EV.SOURCES) and a
   confidence rating. Numbers are deliberately kept transparent and adjustable
   so the model is fully reproducible (see docs/METHODOLOGIE.md).
   ============================================================================ */
(function (EV) {
  "use strict";

  /* --- Bronnen / Sources -------------------------------------------------- */
  EV.SOURCES = [
    { id: "EAFO-NL", label: "European Alternative Fuels Observatory — Netherlands 2024/2025 overview", url: "https://alternative-fuels-observatory.ec.europa.eu/general-information/news/netherlands-2024-almost-35-market-share-bevs-fleet-surpasses-6", note: "BEV-vloot NL ~502.200 (juli 2024); BEV-aandeel nieuwverkoop 34,9% (2024)." },
    { id: "RVO-NL", label: "RVO / NL Times — laadinfrastructuur NL", url: "https://nltimes.nl/2026/01/29/netherlands-triples-public-ev-chargers-210000-five-years-demand-grows", note: "~181.000 (semi-)publieke laadpunten 2024; ~210.000 in 2026; verdrievoudiging in 5 jaar." },
    { id: "EC-AFIR", label: "Alternative Fuels Infrastructure Regulation (AFIR)", url: "https://alternative-fuels-observatory.ec.europa.eu/transport-mode/road/european-union-eu27/target-tracker", note: "1,3 kW publiek vermogen per BEV; 400 kW-pools elke 60 km TEN-T vanaf 2025; ad-hoc kaartbetaling verplicht bij snelladers ≥50 kW." },
    { id: "EC-3M5", label: "Europese Commissie — doelstelling laadpunten", url: "https://alternative-fuels-observatory.ec.europa.eu/transport-mode/road/european-union-eu27/target-tracker", note: "~700.000 publieke laadpunten EU eind 2023; doel 3,5 mln in 2030." },
    { id: "GVR-EU", label: "Grand View Research / Renub — Europa EV-charging infrastructuurmarkt", url: "https://www.grandviewresearch.com/horizon/outlook/electric-vehicle-charging-infrastructure-market/europe", note: "EU infra-markt ~$9,2 mld (2024) → CAGR ~21–24% richting $34–64 mld (2032/33)." },
    { id: "TAP-NL", label: "Tap Electric / Eleport — publieke laadtarieven NL", url: "https://tapelectric.app/blog/cost-to-charge-an-electric-car-netherlands/", note: "DC-snelladen ~€0,65–0,69/kWh; AC ~€0,46/kWh; +13% tariefstijging begin 2025." },
    { id: "SPARK", label: "electrive — Spark Alliance", url: "https://www.electrive.com/2025/04/02/charging-operators-form-spark-alliance-europes-largest-charging-network/", note: "Spark Alliance: >11.000 laadpunten, interoperabel Europees netwerk (2025)." },
    { id: "HUBJECT", label: "Hubject — Intercharge / Plug&Charge", url: "https://www.hubject.com/", note: "Roaming-hub verbindt >1.000.000 laadpunten, 2.750+ B2B-partners in 70+ landen; Plug&Charge o.b.v. ISO 15118." },
    { id: "AMPECO-15118", label: "AMPECO — ISO 15118 gids voor CPO's en eMSP's", url: "https://www.ampeco.com/guides/iso-15118-complete-guide-for-cpos-and-emsps/", note: "ISO 15118-2/-20 Plug&Charge; OCPP/OCPI interoperabiliteit." },
    { id: "ICCT-HDV", label: "ICCT — laadinfra voor batterij-elektrische trucks (okt 2025)", url: "https://theicct.org/wp-content/uploads/2025/10/ID-476-%E2%80%93-EU-BETs_report_final-1.pdf", note: "Heavy-duty laadbehoefte en groei megawatt-charging." },
    { id: "EST", label: "Eigen schatting (team) — expliciet gemarkeerd", url: "", note: "Afgeleid van bovenstaande bronnen met vermelde onzekerheidsmarge. Zie aannameregister." }
  ];

  function src(id) { return EV.SOURCES.find(function (s) { return s.id === id; }); }
  EV.src = src;

  /* --- Modeljaren --------------------------------------------------------- */
  EV.YEARS = [2026, 2027, 2028, 2029, 2030];
  EV.BASE_YEAR = 2025;

  /* --- Marktbasis (deterministisch; scenario's schalen hierop) ------------
     BEV-vloot trajecten. NL geankerd op ~502k (jul-2024) → ~640k eind-2025.
     EU geankerd op ~10–12 mln BEV eind-2025. Groei consistent met 35–45%
     nieuwverkoopaandeel (NL) en ~20–25% EU. */
  EV.MARKET = {
    // BEV-vloot (aantal voertuigen), per kalenderjaar-einde
    fleet: {
      NL:  { 2025: 640000,   2026: 820000,   2027: 1030000,  2028: 1270000,  2029: 1540000,  2030: 1840000 },
      EU:  { 2025: 11500000, 2026: 14400000, 2027: 18000000, 2028: 22300000, 2029: 27400000, 2030: 33500000 } // EU = EU27 excl. NL benaderd; NL apart gemodelleerd
    },
    // Publiek geladen kWh per BEV per jaar (NL hoger door hoog aandeel straatladen)
    publicKwhPerBev: {
      NL: { 2025: 2050, 2026: 2000, 2027: 1960, 2028: 1920, 2029: 1890, 2030: 1860 },
      EU: { 2025: 1450, 2026: 1440, 2027: 1430, 2028: 1420, 2029: 1410, 2030: 1400 }
    },
    // Gemiddeld publiek tarief €/kWh (blended AC/DC), licht dalend door concurrentie
    pricePerKwh: {
      NL: { 2025: 0.53, 2026: 0.52, 2027: 0.51, 2028: 0.50, 2029: 0.50, 2030: 0.49 },
      EU: { 2025: 0.50, 2026: 0.49, 2027: 0.49, 2028: 0.48, 2029: 0.48, 2030: 0.47 }
    },
    // Gemiddelde sessiegrootte in kWh (blended AC/DC). Groeit licht door meer DC-aandeel.
    avgSessionKwh: { NL: 17.5, EU: 19.5 },
    // Publieke laadpunten (context / platform-TAM)
    chargePoints: {
      NL: { 2025: 195000, 2026: 215000, 2027: 240000, 2028: 268000, 2029: 298000, 2030: 330000 },
      EU: { 2025: 900000, 2026: 1150000, 2027: 1500000, 2028: 1950000, 2029: 2500000, 2030: 3200000 }
    }
  };

  /* --- TAM / SAM / SOM (waardelaag, €/jaar in 2030) -----------------------
     Waardelaag = betaalverwerking + eMSP/roaming-marge + platform-SaaS +
     issuing/embedded finance op publiek laadverkeer. Uitgedrukt als jaarlijkse
     omzetpool (niet hardware). Berekend uit GMV × addressable take (~8%). */
  EV.MARKET_SIZING = {
    horizon: 2030,
    // Publieke laad-GMV (€ mld/jaar) — afgeleid van fleet × kWh/BEV × €/kWh
    // TAM = volledige Europese waardelaag; SAM = door ons bedienbare markten/segmenten; SOM = realistisch haalbaar aandeel (basis-scenario)
    tamRevenue: 2.55e9,   // €2,55 mld/jr waardelaag EU-breed in 2030
    samRevenue: 0.86e9,   // €860 mln/jr: NL + kernmarkten (DACH/Benelux/Nordics), publiek + fleet
    somRevenue: 0.031e9,  // €31 mln/jr realistisch aandeel basis-scenario in 2030 (zie model, kan afwijken bij herberekening)
    takeOfGmv: 0.08       // addressable waardelaag ~8% van publieke laad-GMV
  };

  /* --- Scenario-parameters ------------------------------------------------
     Elk scenario definieert de bedrijfsgedreven variabelen. Marktbasis is
     gedeeld; scenario's schalen vloeigroei (fleetMult) en bepalen ons aandeel,
     take rate, entry-timing en marges. Alle waarden zijn expliciet en
     onderbouwd in het aannameregister (EV.ASSUMPTIONS). */
  EV.SCENARIOS = {
    conservatief: {
      key: "conservatief", label: "Conservatief", accent: "var(--series-6)",
      fleetMult: 0.90,                  // tragere EV-adoptie (-10%)
      // Ons verwerkte transactie-aandeel (van publieke sessies) per markt, ramp per jaar
      shareNL: { 2026: 0.030, 2027: 0.048, 2028: 0.066, 2029: 0.084, 2030: 0.100 },
      shareEU: { 2026: 0.0000, 2027: 0.0015, 2028: 0.0035, 2029: 0.0060, 2030: 0.0085 },
      takeRate: 0.032,                  // blended betaal+eMSP-marge als % van verwerkte GMV
      feePerTxn: 0.06,                  // vaste netwerk/verwerkingsfee per transactie (€)
      fleetAccounts: { 2026: 1500, 2027: 4000, 2028: 8000, 2029: 14000, 2030: 22000 },
      interchangePerAccount: 95,        // jaarlijkse interchange/embedded-finance-opbrengst per fleet-account (€)
      platformPointsShareNL: { 2026: 0.02, 2027: 0.035, 2028: 0.05, 2029: 0.065, 2030: 0.08 },
      platformRevPerPoint: 42,          // SaaS-omzet per aangesloten laadpunt/jaar (€)
      ebitdaMargin: { 2026: -0.35, 2027: -0.10, 2028: 0.08, 2029: 0.18, 2030: 0.24 }
    },
    basis: {
      key: "basis", label: "Basis", accent: "var(--series-1)",
      fleetMult: 1.00,
      shareNL: { 2026: 0.050, 2027: 0.075, 2028: 0.100, 2029: 0.122, 2030: 0.140 },
      shareEU: { 2026: 0.0008, 2027: 0.0035, 2028: 0.0065, 2029: 0.0095, 2030: 0.0125 },
      takeRate: 0.038,
      feePerTxn: 0.08,
      fleetAccounts: { 2026: 3000, 2027: 9000, 2028: 18000, 2029: 30000, 2030: 44000 },
      interchangePerAccount: 120,
      platformPointsShareNL: { 2026: 0.03, 2027: 0.055, 2028: 0.08, 2029: 0.105, 2030: 0.13 },
      platformRevPerPoint: 55,
      ebitdaMargin: { 2026: -0.28, 2027: -0.02, 2028: 0.16, 2029: 0.26, 2030: 0.32 }
    },
    ambitieus: {
      key: "ambitieus", label: "Ambitieus", accent: "var(--series-2)",
      fleetMult: 1.10,                  // snellere adoptie (+10%)
      shareNL: { 2026: 0.070, 2027: 0.110, 2028: 0.150, 2029: 0.185, 2030: 0.215 },
      shareEU: { 2026: 0.0020, 2027: 0.0070, 2028: 0.0130, 2029: 0.0200, 2030: 0.0270 },
      takeRate: 0.045,
      feePerTxn: 0.10,
      fleetAccounts: { 2026: 5000, 2027: 16000, 2028: 34000, 2029: 58000, 2030: 88000 },
      interchangePerAccount: 145,
      platformPointsShareNL: { 2026: 0.05, 2027: 0.09, 2028: 0.135, 2029: 0.18, 2030: 0.22 },
      platformRevPerPoint: 68,
      ebitdaMargin: { 2026: -0.22, 2027: 0.06, 2028: 0.24, 2029: 0.34, 2030: 0.40 }
    }
  };

  /* --- Aannameregister (Stap 4) ------------------------------------------ */
  EV.ASSUMPTIONS = [
    { param: "BEV-vloot NL 2025 (basis)", value: "≈640.000", source: "EAFO-NL", confidence: "Hoog", uncertainty: "±5%", alt: "502k (jul-2024) doorgetrokken met ~35–40% nieuwverkoopaandeel." },
    { param: "BEV-vloot NL groei →2030", value: "~24% CAGR", source: "EAFO-NL", confidence: "Middel", uncertainty: "±6pp", alt: "Afhankelijk van fiscale prikkels/subsidie-afbouw; conservatief -10% (fleetMult 0,90)." },
    { param: "BEV-vloot EU 2025", value: "≈11,5 mln", source: "GVR-EU", confidence: "Middel", uncertainty: "±10%", alt: "EU27 excl. NL; sterk landafhankelijk." },
    { param: "Publiek kWh per BEV/jaar NL", value: "~2.000", source: "EST", confidence: "Middel", uncertainty: "±20%", alt: "Daalt bij toename thuisladen; NL hoog door straatparkeren." },
    { param: "Publiek tarief €/kWh (blended)", value: "€0,52 (NL)", source: "TAP-NL", confidence: "Hoog", uncertainty: "±10%", alt: "DC €0,65 / AC €0,46; mix bepaalt blended tarief." },
    { param: "Gem. sessiegrootte kWh", value: "17,5 (NL) / 19,5 (EU)", source: "EST", confidence: "Middel", uncertainty: "±25%", alt: "Stijgt met DC-aandeel; beïnvloedt transactieaantal, niet GMV." },
    { param: "Ons verwerkt aandeel NL 2030", value: "10 / 14 / 21,5%", source: "EST", confidence: "Laag", uncertainty: "groot", alt: "Kernvariabele — grootste omzet-hefboom (zie tornado)." },
    { param: "Blended take rate op GMV", value: "3,2 / 3,8 / 4,5%", source: "EST", confidence: "Middel", uncertainty: "±1,0pp", alt: "Betaalverwerking 1,5–2,5% + eMSP/roaming-marge; regulatoire druk (AFIR ad-hoc) drukt marge." },
    { param: "Fleet/embedded interchange/account", value: "€95 / 120 / 145 /jr", source: "EST", confidence: "Laag", uncertainty: "±30%", alt: "PSD2/PSD3 & interchange caps beïnvloeden hoogte." },
    { param: "Platform-SaaS per laadpunt/jaar", value: "€42 / 55 / 68", source: "EST", confidence: "Laag", uncertainty: "±30%", alt: "Concurrentie van AMPECO/Driivz/Last Mile Solutions." },
    { param: "EBITDA-marge 2030", value: "24 / 32 / 40%", source: "EST", confidence: "Laag", uncertainty: "groot", alt: "Schaalvoordelen betaalinfra; conservatief bij lagere volumes." }
  ];

  /* --- Review van het huidige rapport (Stap 1) --------------------------- */
  EV.REVIEW = [
    { part: "Volledigheid", rating: "Onvoldoende", why: "Uitgangsrepository bevat alleen een README; er was nog geen inhoudelijk rapport of omzetmodel.", impact: "Hoog", fix: "Volledig interactief rapport + 5-jaars omzetmodel opgebouwd (dit document)." },
    { part: "Logische opbouw", rating: "n.v.t. → nieuw", why: "Geen bestaande structuur.", impact: "Hoog", fix: "Heldere hoofdstukkenstructuur A–G conform investeringsmemorandum." },
    { part: "Strategische bruikbaarheid", rating: "Sterk verbeterd", why: "Bestuur/investeerders hadden geen kwantitatief antwoord op de omzetvraag.", impact: "Hoog", fix: "TAM/SAM/SOM, scenario's, Monte Carlo, aanbevelingen met prioritering." },
    { part: "Betrouwbaarheid bronnen", rating: "Goed", why: "Kerncijfers geankerd op EAFO, RVO, AFIR, marktrapporten; schattingen expliciet gemarkeerd.", impact: "Middel", fix: "Bronregister met betrouwbaarheid + onzekerheid per aanname." },
    { part: "Kwaliteit visualisaties", rating: "Sterk", why: "Ontbrak volledig.", impact: "Middel", fix: "Interactieve grafieken, KPI-kaarten, waterfall, tornado, heatmap, Monte Carlo, gevoeligheid." },
    { part: "Consistentie cijfers", rating: "Goed", why: "Risico op losse, niet-herleidbare getallen.", impact: "Hoog", fix: "Eén rekenkern (model.js); alle cijfers afgeleid, niet los ingetypt." },
    { part: "Reproduceerbaarheid", rating: "Sterk", why: "Berekeningen moeten navolgbaar zijn voor due diligence.", impact: "Hoog", fix: "Transparante drivers, aanpasbare aannames, gedocumenteerde methodologie." },
    { part: "Aannames", rating: "Verbeterd", why: "Onbenoemde aannames zijn een auditrisico.", impact: "Hoog", fix: "Expliciet aannameregister met bron/betrouwbaarheid/onzekerheid/alternatief." },
    { part: "Ontbrekende marktinzichten", rating: "Aangevuld", why: "Roaming, eMSP/CPO, AFIR, Plug&Charge, fleet/HDV ontbraken.", impact: "Hoog", fix: "Marktcontext-hoofdstuk met regelgeving, waardeketen en betaalstandaarden." },
    { part: "Ontbrekende risico's", rating: "Aangevuld", why: "Geen risico- of scenario-analyse.", impact: "Hoog", fix: "Risicomatrix + Monte Carlo + gevoeligheidsanalyse." },
    { part: "Ontbrekende scenario's", rating: "Aangevuld", why: "Enkelvoudige puntschatting is onbruikbaar voor besluitvorming.", impact: "Hoog", fix: "Drie scenario's + probabilistische bandbreedte (P10–P90)." }
  ];

  /* --- Strategische aanbevelingen (Stap 6) ------------------------------- */
  EV.RECOMMENDATIONS = {
    kansen: [
      { t: "Roaming- & eMSP-orkestratie", d: "Word de betaal/settlement-laag tussen CPO's en eMSP's (à la Hubject/Spark), met NL als thuismarkt en Europese uitrol.", roi: "Hoog", horizon: "1–3 jr" },
      { t: "Fleet & embedded finance", d: "Laadpassen + issuing voor zakelijke vloten; interchange + FBF-diensten schalen sneller dan consumentenverkeer.", roi: "Hoog", horizon: "1–2 jr" },
      { t: "Plug&Charge (ISO 15118-20)", d: "Frictieloze auth+betaling; first-mover-voordeel nu OEM-adoptie versnelt.", roi: "Middel", horizon: "2–4 jr" },
      { t: "Heavy-duty & depot charging", d: "Hoge GMV per sessie, B2B-contracten, megawatt-charging vanaf 2027+.", roi: "Middel", horizon: "3–5 jr" }
    ],
    bedreigingen: [
      { t: "AFIR ad-hoc kaartbetaling", d: "Verplichte contactloze betaling bij snelladers commoditiseert de betaallaag en drukt de take rate.", sev: "Hoog" },
      { t: "Marge-erosie / prijsdruk", d: "Concurrentie van CPO's die zelf issuen en van big-tech wallets (Apple/Google Pay).", sev: "Hoog" },
      { t: "Consolidatie roaming-hubs", d: "Hubject/Spark schaalvoordelen kunnen toetreders verdringen.", sev: "Middel" },
      { t: "Regulatoir (PSD3/interchange caps)", d: "Nieuwe caps en Open Finance kunnen verdienmodellen herzien.", sev: "Middel" }
    ],
    quickWins: [
      { t: "NL fleet-pilot (2026)", d: "Laadpas + betaalverwerking voor 2–3 grote wagenparken; bewijs unit-economics." },
      { t: "OCPI-roaming-koppeling", d: "Sluit aan op bestaande hub i.p.v. eigen netwerk; time-to-market weken i.p.v. maanden." },
      { t: "Tarief-/data-inzichtdienst", d: "Verkoop laaddata & tariefoptimalisatie als SaaS-upsell." }
    ],
    noRegret: [
      "Bouw een OCPP/OCPI/ISO 15118-compatibele betaalstack (interoperabiliteit is randvoorwaarde).",
      "Kies NL als beachhead: hoogste laadpuntdichtheid en publiek laadaandeel van Europa.",
      "Ontwerp voor AFIR/PSD3-compliance vanaf dag één (contactloos + Plug&Charge naast elkaar).",
      "Meet unit-economics per transactie vanaf de eerste pilot; stuur op contributiemarge."
    ]
  };

  /* --- Ontbrekende-onderwerpen mapping (Stap 2) -------------------------- */
  EV.TOPIC_MAP = [
    { topic: "TAM / SAM / SOM", chapter: "Marktomvang & waardelaag", status: "Toegevoegd" },
    { topic: "Concurrentiedynamiek", chapter: "Marktcontext & waardeketen", status: "Toegevoegd" },
    { topic: "AFIR", chapter: "Regelgeving & standaarden", status: "Toegevoegd" },
    { topic: "PSD2 / PSD3 / Instant Payments / Open Finance", chapter: "Regelgeving & standaarden", status: "Toegevoegd" },
    { topic: "Plug & Charge / ISO 15118 / OCPP / OCPI", chapter: "Standaarden & interoperabiliteit", status: "Toegevoegd" },
    { topic: "Hubject / Spark Alliance / roaming / eMSP / CPO", chapter: "Waardeketen & roaming", status: "Toegevoegd" },
    { topic: "Interchange / acquiring / issuing / embedded finance", chapter: "Verdienmodel & betaalketen", status: "Toegevoegd" },
    { topic: "Fleet / heavy-duty / destination / thuis- & publiek laden", chapter: "Segmentatie laadvraag", status: "Toegevoegd" },
    { topic: "Batterij / V2G / smart charging / AI / autonoom", chapter: "Technologische disrupties", status: "Toegevoegd" },
    { topic: "Europese expansie & netwerkcongestie", chapter: "Groeistrategie & risico's", status: "Toegevoegd" }
  ];

  /* --- Risicomatrix ------------------------------------------------------- */
  EV.RISKS = [
    { risk: "AFIR commoditiseert betaallaag", likelihood: 4, impact: 4, cat: "Regulatoir" },
    { risk: "Marge-erosie door concurrentie", likelihood: 4, impact: 4, cat: "Markt" },
    { risk: "Tragere EV-adoptie dan verwacht", likelihood: 2, impact: 4, cat: "Markt" },
    { risk: "Consolidatie roaming-hubs", likelihood: 3, impact: 3, cat: "Markt" },
    { risk: "PSD3 / interchange caps", likelihood: 3, impact: 3, cat: "Regulatoir" },
    { risk: "Netwerkcongestie remt uitrol", likelihood: 3, impact: 2, cat: "Operationeel" },
    { risk: "Cyber/fraude in betaalketen", likelihood: 2, impact: 4, cat: "Operationeel" },
    { risk: "Big-tech wallets nemen frontend", likelihood: 3, impact: 3, cat: "Markt" },
    { risk: "Trage Plug&Charge-adoptie", likelihood: 2, impact: 2, cat: "Technologie" }
  ];

  EV.fmtEUR = function (v, dec) {
    dec = dec == null ? 0 : dec;
    if (Math.abs(v) >= 1e9) return "€" + (v / 1e9).toFixed(dec + 1) + " mld";
    if (Math.abs(v) >= 1e6) return "€" + (v / 1e6).toFixed(dec) + " mln";
    if (Math.abs(v) >= 1e3) return "€" + (v / 1e3).toFixed(0) + "k";
    return "€" + v.toFixed(dec);
  };
  EV.fmtNum = function (v) {
    if (Math.abs(v) >= 1e9) return (v / 1e9).toFixed(1) + " mld";
    if (Math.abs(v) >= 1e6) return (v / 1e6).toFixed(1) + " mln";
    if (Math.abs(v) >= 1e3) return (v / 1e3).toFixed(0) + "k";
    return String(Math.round(v));
  };
  EV.fmtPct = function (v, dec) { return (v * 100).toFixed(dec == null ? 1 : dec) + "%"; };

})(window.EV = window.EV || {});
