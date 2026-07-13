# EV-laadmarkt · Omzetpotentie & investeringsmemorandum

Interactief strategierapport dat de bestuursvraag beantwoordt:

> **"Hoe groot is de realistische omzetpotentie van de EV-laadmarkt voor onze
> organisatie gedurende de komende vijf jaar (2026–2030)?"**

Het rapport combineert een marktanalyse (TAM/SAM/SOM, waardeketen, AFIR/PSD3,
OCPP/OCPI/ISO 15118, roaming/eMSP/CPO) met een driver-gebaseerd vijfjaars
omzetmodel, drie scenario's, een Monte Carlo-analyse en een geprioriteerde
strategische agenda — in de vorm van een reproduceerbare, interactieve website.

## Bekijken

Open `index.html` in een moderne browser, of serveer de map statisch:

```bash
python3 -m http.server 8080   # → http://localhost:8080
```

Geen build-stap, geen externe afhankelijkheden.

## Structuur

| Bestand | Rol |
|---|---|
| `index.html` | Rapport (hoofdstukken A–G) + verhalende inhoud |
| `assets/css/styles.css` | Design system (thema-bewust, responsive, WCAG-minded) |
| `assets/js/data.js` | Marktdata, bronnen, aannameregister, scenario's |
| `assets/js/model.js` | Rekenkern (single source of truth voor alle cijfers) |
| `assets/js/charts.js` | Afhankelijkheidsvrije SVG-grafiekbibliotheek |
| `assets/js/montecarlo.js` | Monte Carlo & gevoeligheidsanalyse (seeded) |
| `assets/js/app.js` | Rendering & interactiviteit |
| `docs/METHODOLOGIE.md` | Formules, aannames, onzekerheidsanalyse |

## Belangrijkste features

- **Scenario-switch** (conservatief/basis/ambitieus) — alle KPI's en grafieken rekenen live mee.
- **Schuifregelaars** voor de kernaannames met directe herberekening.
- **Interactieve visualisaties**: lijn-, staaf-, waterfall-, tornado-, histogram-,
  heatmap-, funnel- en donut-grafieken met tooltips en tabel-fallback.
- **Monte Carlo** (5.000 seeded trekkingen) met P10/P50/P90.
- **CSV-export** van het volledige model; licht/donker thema.

Zie [`docs/METHODOLOGIE.md`](docs/METHODOLOGIE.md) voor de volledige onderbouwing.
De cijfers zijn een onderbouwde inschatting op basis van openbare bronnen en
expliciete teamschattingen — geen garantie, en geen vervanging van formele due
diligence.
