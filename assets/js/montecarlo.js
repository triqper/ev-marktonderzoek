/* ============================================================================
   EV Charging Revenue Model — MONTE CARLO & GEVOELIGHEID (Stap 5)
   Seeded RNG (reproduceerbaar), triangular/normal sampling over de kern-
   onzekerheden, en een tornado-sensitiviteit op de Y5-omzet.
   ============================================================================ */
(function (EV) {
  "use strict";

  // Mulberry32 — deterministische seed voor reproduceerbaarheid
  function rng(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  // Triangular sample (min, mode, max)
  function tri(r, a, c, b) {
    var u = r(), fc = (c - a) / (b - a);
    if (u < fc) return a + Math.sqrt(u * (b - a) * (c - a));
    return b - Math.sqrt((1 - u) * (b - a) * (b - c));
  }

  /* Onzekere parameters als multipliers t.o.v. het gekozen scenario.
     Elk: {min, mode, max} triangulair. Onderbouwd in het aannameregister. */
  EV.MC_PARAMS = [
    { key: "fleetMult",       label: "EV-vloeigroei",            min: 0.82, mode: 1.00, max: 1.15 },
    { key: "shareMult",       label: "Ons verwerkt aandeel",     min: 0.60, mode: 1.00, max: 1.45 },
    { key: "takeRateMult",    label: "Take rate (marge)",        min: 0.75, mode: 1.00, max: 1.25 },
    { key: "kwhMult",         label: "Publiek kWh per BEV",      min: 0.80, mode: 1.00, max: 1.20 },
    { key: "priceMult",       label: "Tarief €/kWh",             min: 0.88, mode: 1.00, max: 1.12 },
    { key: "interchangeMult", label: "Fleet/embedded finance",   min: 0.70, mode: 1.00, max: 1.35 },
    { key: "platformMult",    label: "Platform-SaaS",            min: 0.70, mode: 1.00, max: 1.30 }
  ];

  function toOverrides(scenarioKey, samp) {
    var p = EV.SCENARIOS[scenarioKey];
    return {
      fleetMult: p.fleetMult * samp.fleetMult,
      shareMult: samp.shareMult,
      takeRate: p.takeRate * samp.takeRateMult,
      kwhMult: samp.kwhMult,
      priceMult: samp.priceMult,
      interchangeMult: samp.interchangeMult,
      platformMult: samp.platformMult
    };
  }

  EV.runMonteCarlo = function (scenarioKey, iterations, seed) {
    iterations = iterations || 5000;
    var r = rng(seed || 42);
    var y5 = [], cum = [];
    for (var i = 0; i < iterations; i++) {
      var samp = {};
      EV.MC_PARAMS.forEach(function (pp) { samp[pp.key] = tri(r, pp.min, pp.mode, pp.max); });
      var res = EV.computeModel(scenarioKey, toOverrides(scenarioKey, samp));
      y5.push(res.y5Revenue);
      cum.push(res.totalRevenue);
    }
    y5.sort(function (a, b) { return a - b; });
    cum.sort(function (a, b) { return a - b; });
    function pct(arr, q) { return arr[Math.min(arr.length - 1, Math.floor(q * arr.length))]; }
    return {
      y5: y5, cum: cum,
      p10: pct(y5, 0.10), p50: pct(y5, 0.50), p90: pct(y5, 0.90),
      mean: y5.reduce(function (a, b) { return a + b; }, 0) / y5.length,
      cumP10: pct(cum, 0.10), cumP50: pct(cum, 0.50), cumP90: pct(cum, 0.90),
      iterations: iterations
    };
  };

  /* Tornado: vary één parameter naar min/max (mode elders), meet Y5-omzet. */
  EV.runTornado = function (scenarioKey) {
    var base = EV.computeModel(scenarioKey).y5Revenue;
    var items = EV.MC_PARAMS.map(function (pp) {
      var lowSamp = {}, highSamp = {};
      EV.MC_PARAMS.forEach(function (q) { lowSamp[q.key] = 1; highSamp[q.key] = 1; });
      lowSamp[pp.key] = pp.min; highSamp[pp.key] = pp.max;
      var low = EV.computeModel(scenarioKey, toOverrides(scenarioKey, lowSamp)).y5Revenue;
      var high = EV.computeModel(scenarioKey, toOverrides(scenarioKey, highSamp)).y5Revenue;
      return { label: pp.label, low: low, high: high };
    });
    return { base: base, items: items };
  };

})(window.EV = window.EV || {});
