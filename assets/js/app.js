/* ============================================================================
   EV Charging Revenue Model — APP / rendering & interactivity
   ============================================================================ */
(function (EV) {
  "use strict";
  var C = EV.Charts;
  var $ = function (id) { return document.getElementById(id); };
  var fmtEUR = EV.fmtEUR, fmtNum = EV.fmtNum, fmtPct = EV.fmtPct;
  var YEARS = EV.YEARS;

  /* ---- state ---- */
  var state = {
    scenario: "basis",
    sliders: { fleet: 1, share: 1, take: 1, kwh: 1, price: 1, interchange: 1 }
  };

  function overrides() {
    var p = EV.SCENARIOS[state.scenario], s = state.sliders;
    return {
      fleetMult: p.fleetMult * s.fleet,
      shareMult: s.share,
      takeRate: p.takeRate * s.take,
      kwhMult: s.kwh,
      priceMult: s.price,
      interchangeMult: s.interchange
    };
  }
  function model() { return EV.computeModel(state.scenario, overrides()); }

  /* ---- helpers ---- */
  function elem(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }
  function kpi(label, value, sub, accent) {
    return '<div class="kpi' + (accent ? ' accent' : '') + '"><div class="k-label">' + label +
      '</div><div class="k-value">' + value + '</div><div class="k-sub">' + (sub || '') + '</div></div>';
  }
  function makeTable(headers, rows, foot) {
    var wrap = elem("div", "table-wrap");
    var t = document.createElement("table");
    var thead = "<thead><tr>" + headers.map(function (h) { return '<th class="' + (h.num ? "num" : "") + '">' + h.label + '</th>'; }).join("") + "</tr></thead>";
    var tbody = "<tbody>" + rows.map(function (r) {
      return "<tr>" + r.map(function (c, i) { return '<td class="' + (headers[i].num ? "num" : "") + '">' + c + '</td>'; }).join("") + "</tr>";
    }).join("") + "</tbody>";
    t.innerHTML = thead + tbody + (foot || "");
    wrap.appendChild(t);
    return wrap;
  }

  /* sequential blue scale for heatmaps */
  var BLUE = [[205,226,251],[134,182,239],[57,135,229],[24,79,149],[13,54,107]];
  function blueScale(t) {
    t = Math.max(0, Math.min(1, t));
    var pos = t * (BLUE.length - 1), i = Math.floor(pos), f = pos - i;
    var a = BLUE[i], b = BLUE[Math.min(BLUE.length - 1, i + 1)];
    var c = a.map(function (v, k) { return Math.round(v + (b[k] - v) * f); });
    return "rgb(" + c.join(",") + ")";
  }

  /* ============================ RENDER: static tables ==================== */
  function renderReview() {
    var tb = $("reviewTable").querySelector("tbody");
    tb.innerHTML = EV.REVIEW.map(function (r) {
      var rc = /Onvoldoende/.test(r.rating) ? "b-hoog" : /Sterk|Goed|Aangevuld|Verbeterd/.test(r.rating) ? "b-laag" : "b-middel";
      var ic = r.impact === "Hoog" ? "b-hoog" : r.impact === "Middel" ? "b-middel" : "b-laag";
      return "<tr><td><b>" + r.part + "</b></td><td><span class='badge " + rc + "'>" + r.rating +
        "</span></td><td>" + r.why + "</td><td><span class='badge " + ic + "'>" + r.impact +
        "</span></td><td>" + r.fix + "</td></tr>";
    }).join("");
  }
  function renderTopics() {
    var tb = $("topicTable").querySelector("tbody");
    tb.innerHTML = EV.TOPIC_MAP.map(function (t) {
      return "<tr><td>" + t.topic + "</td><td>" + t.chapter + "</td><td><span class='badge b-laag'>✔ " + t.status + "</span></td></tr>";
    }).join("");
  }
  function renderAssumptions() {
    var tb = $("assumptionsTable").querySelector("tbody");
    tb.innerHTML = EV.ASSUMPTIONS.map(function (a) {
      var s = EV.src(a.source) || { label: a.source, url: "" };
      var cc = a.confidence === "Hoog" ? "b-laag" : a.confidence === "Middel" ? "b-middel" : "b-hoog";
      var link = s.url ? '<a href="' + s.url + '" target="_blank" rel="noopener">' + a.source + "</a>" : a.source;
      return "<tr><td><b>" + a.param + "</b></td><td class='mono'>" + a.value + "</td><td>" + link +
        "</td><td><span class='badge " + cc + "'>" + a.confidence + "</span></td><td>" + a.uncertainty +
        "</td><td>" + a.alt + "</td></tr>";
    }).join("");
  }
  function renderSources() {
    $("sourceList").innerHTML = EV.SOURCES.map(function (s) {
      var link = s.url ? '<a href="' + s.url + '" target="_blank" rel="noopener">' + s.label + "</a>" : s.label;
      return "<li><b>[" + s.id + "]</b> " + link + " — <span style='color:var(--text-muted)'>" + s.note + "</span></li>";
    }).join("");
  }

  /* ============================ RENDER: recommendations ================= */
  function renderRecos() {
    function items(list, iconFn) {
      return list.map(function (x, i) {
        var right = x.roi ? '<span class="badge b-laag">ROI ' + x.roi + '</span>' : x.sev ? '<span class="badge b-hoog">' + x.sev + '</span>' : '';
        return '<li class="reco-item"><span class="r-icn">' + iconFn(i, x) + '</span><span><span class="r-t">' + x.t +
          '</span><br><span class="r-d">' + x.d + (x.horizon ? ' · <i>' + x.horizon + '</i>' : '') + '</span></span>' + right + '</li>';
      }).join("");
    }
    $("kansenList").innerHTML = items(EV.RECOMMENDATIONS.kansen, function (i) { return i + 1; });
    $("bedreigingenList").innerHTML = items(EV.RECOMMENDATIONS.bedreigingen, function () { return "!"; });
    $("quickwinList").innerHTML = items(EV.RECOMMENDATIONS.quickWins, function () { return "⚡"; });
    $("noRegretList").innerHTML = EV.RECOMMENDATIONS.noRegret.map(function (x) { return "<li>" + x + "</li>"; }).join("");

    // Prioriteitentabel afgeleid uit kansen + quick wins
    var prio = [
      { p: 1, t: "NL fleet- & roaming-pilot op interoperabele betaalstack", h: "0–12 mnd", roi: "Hoog", type: "No-regret / Quick win" },
      { p: 2, t: "OCPI-roaming-koppeling i.p.v. eigen netwerk", h: "0–9 mnd", roi: "Hoog", type: "Quick win" },
      { p: 3, t: "Fleet issuing & embedded finance uitrollen", h: "6–24 mnd", roi: "Hoog", type: "Groei-investering" },
      { p: 4, t: "Platform-SaaS & laaddata-diensten voor CPO's", h: "6–18 mnd", roi: "Middel", type: "Upsell" },
      { p: 5, t: "Plug&Charge (ISO 15118-20) first-mover", h: "12–36 mnd", roi: "Middel", type: "Optiewaarde" },
      { p: 6, t: "Europese uitrol kernmarkten (DACH/Nordics)", h: "18–48 mnd", roi: "Middel–Hoog", type: "Schaal" },
      { p: 7, t: "Heavy-duty / depot-charging betaaloplossing", h: "36–60 mnd", roi: "Middel", type: "Optiewaarde" }
    ];
    $("prioTable").querySelector("tbody").innerHTML = prio.map(function (r) {
      var rc = r.roi === "Hoog" ? "b-laag" : "b-middel";
      return "<tr><td><b>" + r.p + "</b></td><td>" + r.t + "</td><td>" + r.h + "</td><td><span class='badge " + rc + "'>" + r.roi + "</span></td><td>" + r.type + "</td></tr>";
    }).join("");
  }

  /* ============================ RENDER: risk matrix ==================== */
  function renderRiskMatrix() {
    var host = $("riskHeatmap"); clear(host);
    var grid = elem("div");
    grid.style.cssText = "display:grid;grid-template-columns:auto repeat(4,1fr);gap:5px;min-width:440px;align-items:stretch";
    grid.appendChild(elem("div", null, ""));
    ["Zeer laag", "Laag", "Middel", "Hoog"].forEach(function (l) {
      grid.appendChild(elem("div", "viz-axis", "<div style='text-align:center;padding:2px'>" + l + "</div>"));
    });
    var impLabels = ["Zeer hoog", "Hoog", "Middel", "Laag"];
    for (var imp = 4; imp >= 1; imp--) {
      var lab = elem("div", "viz-axis", "<div style='padding-right:6px;text-align:right;display:flex;align-items:center;justify-content:flex-end;height:100%'>" + impLabels[4 - imp] + "</div>");
      grid.appendChild(lab);
      for (var lik = 1; lik <= 4; lik++) {
        var score = imp * lik;
        var here = EV.RISKS.filter(function (r) { return r.impact === imp && r.likelihood === lik; });
        var t = (score - 1) / 15;
        var col = score >= 12 ? "var(--critical)" : score >= 8 ? "var(--serious)" : score >= 4 ? "var(--warning)" : "var(--good)";
        var cell = elem("div");
        cell.style.cssText = "min-height:58px;border-radius:9px;background:" + col + ";opacity:.9;padding:6px;color:#1a1a19;font-size:.72rem;font-weight:600;display:flex;flex-direction:column;gap:2px;justify-content:center";
        cell.innerHTML = here.map(function (r) { return "• " + r.risk; }).join("<br>");
        if (here.length) cell.title = here.map(function (r) { return r.risk + " (score " + r.impact * r.likelihood + ")"; }).join("\n");
        grid.appendChild(cell);
      }
    }
    host.appendChild(grid);
    var ax = elem("div", "viz-axis", "→ Waarschijnlijkheid · ↑ Impact");
    ax.style.cssText = "margin-top:8px;font-size:.78rem;color:var(--text-muted)";
    host.appendChild(ax);
  }

  /* ============================ RENDER: funnel ========================= */
  function renderFunnel(m) {
    var host = $("funnelChart"); clear(host);
    var s = EV.MARKET_SIZING;
    var som = m.rows[m.rows.length - 1].revenue;
    host.appendChild(C.funnel({
      valFmt: function (v) { return fmtEUR(v); },
      items: [
        { label: "TAM · Europese waardelaag", value: s.tamRevenue, note: "Betaal + roaming + platform + issuing op EU publiek laden (2030).", color: "var(--series-1)" },
        { label: "SAM · bedienbare markten/segmenten", value: s.samRevenue, note: "NL + DACH/Benelux/Nordics; publiek + fleet.", color: "var(--series-2)" },
        { label: "SOM · haalbaar aandeel (" + EV.SCENARIOS[state.scenario].label + ", 2030)", value: som, note: "2030-jaaromzet uit het rekenmodel.", color: "var(--series-5)" }
      ]
    }));
  }

  /* ============================ RENDER: summary ======================== */
  function renderSummary() {
    var all = EV.computeAll();
    var m = model();
    var y5 = m.rows[m.rows.length - 1].revenue;
    var mc = mcCache[state.scenario] || (mcCache[state.scenario] = EV.runMonteCarlo(state.scenario, 5000, 42));

    $("kpiSummary").innerHTML =
      kpi("2030-jaaromzet (" + EV.SCENARIOS[state.scenario].label + ")", fmtEUR(y5), "Alle opbrengststromen", true) +
      kpi("Omzet-CAGR 2026→2030", fmtPct(m.cagr), "Samengestelde jaargroei") +
      kpi("Cumulatieve omzet 5 jr", fmtEUR(m.totalRevenue), "2026–2030 opgeteld") +
      kpi("EBITDA 2030", fmtEUR(m.rows[m.rows.length - 1].ebitda), "Marge " + fmtPct(m.rows[m.rows.length - 1].ebitdaMargin, 0)) +
      kpi("Bandbreedte P10–P90 (2030)", fmtEUR(mc.p10) + " – " + fmtEUR(mc.p90), "Monte Carlo, 80%-interval");

    $("sumY5").textContent = fmtEUR(all.basis.rows[4].revenue);
    $("sumRange").textContent = fmtEUR(all.conservatief.rows[4].revenue) + " – " + fmtEUR(all.ambitieus.rows[4].revenue);
    $("sumCum").textContent = fmtEUR(all.basis.totalRevenue);
    $("sumP10").textContent = fmtEUR((mcCache.basis || (mcCache.basis = EV.runMonteCarlo("basis", 5000, 42))).p10);
    $("sumP90").textContent = fmtEUR(mcCache.basis.p90);

    // summary line chart: 3 scenarios
    var host = $("summaryChart"); clear(host);
    host.appendChild(C.line({
      xLabels: YEARS,
      yFmt: function (v) { return fmtEUR(v); }, valFmt: function (v) { return fmtEUR(v); },
      series: [
        { name: "Conservatief", color: "var(--series-6)", values: all.conservatief.rows.map(function (r) { return r.revenue; }), area: false },
        { name: "Basis", color: "var(--series-1)", values: all.basis.rows.map(function (r) { return r.revenue; }), area: true },
        { name: "Ambitieus", color: "var(--series-2)", values: all.ambitieus.rows.map(function (r) { return r.revenue; }) }
      ]
    }));
    var slg = $("summaryLegend"); clear(slg);
    slg.appendChild(C.legend([
      { label: "Conservatief", color: "var(--series-6)" }, { label: "Basis", color: "var(--series-1)" }, { label: "Ambitieus", color: "var(--series-2)" }
    ]));
    // table
    var tt = $("summaryChartTable"); clear(tt);
    tt.appendChild(makeTable(
      [{ label: "Scenario" }].concat(YEARS.map(function (y) { return { label: y, num: true }; })),
      ["conservatief", "basis", "ambitieus"].map(function (k) {
        return [EV.SCENARIOS[k].label].concat(all[k].rows.map(function (r) { return fmtEUR(r.revenue); }));
      })
    ));
  }

  /* ============================ RENDER: model ========================== */
  function renderModel() {
    var m = model();
    var last = m.rows[m.rows.length - 1], first = m.rows[0];

    $("kpiModel").innerHTML =
      kpi("Aanloopomzet 2026", fmtEUR(first.revenue), "Startjaar", true) +
      kpi("2030-jaaromzet", fmtEUR(last.revenue), fmtPct(m.cagr) + " CAGR") +
      kpi("Verwerkte transacties 2030", fmtNum(last.processedSessions), "Laadsessies/jr") +
      kpi("Verwerkte GMV 2030", fmtEUR(last.processedGMV), "Laadwaarde via ons") +
      kpi("Actieve gebruikers 2030", fmtNum(last.users), "Consument + fleet") +
      kpi("Marktaandeel NL 2030", fmtPct(last.shareNL), "Publieke sessies");

    // composition stacked bar
    var comp = $("compChart"); clear(comp);
    var streams = [
      { name: "Betaalverwerking NL", key: "txnNL", color: "var(--series-1)" },
      { name: "Betaalverwerking EU", key: "txnEU", color: "var(--series-2)" },
      { name: "Platform-SaaS", key: "platform", color: "var(--series-3)" },
      { name: "Issuing / embedded finance", key: "issuing", color: "var(--series-5)" }
    ];
    comp.appendChild(C.stackedBar({
      xLabels: YEARS, yFmt: function (v) { return fmtEUR(v); }, valFmt: function (v) { return fmtEUR(v); },
      series: streams.map(function (s) { return { name: s.name, color: s.color, values: m.rows.map(function (r) { return r.rev[s.key]; }) }; })
    }));
    var lg = $("compLegend"); clear(lg);
    lg.appendChild(C.legend(streams.map(function (s) { return { label: s.name, color: s.color }; })));
    var ct = $("compChartTable"); clear(ct);
    ct.appendChild(makeTable(
      [{ label: "Stroom" }].concat(YEARS.map(function (y) { return { label: y, num: true }; })),
      streams.map(function (s) { return [s.name].concat(m.rows.map(function (r) { return fmtEUR(r.rev[s.key]); })); })
        .concat([["<b>Totaal</b>"].concat(m.rows.map(function (r) { return "<b>" + fmtEUR(r.revenue) + "</b>"; }))])
    ));

    // waterfall 2026 -> 2030
    var wf = $("waterfallChart"); clear(wf);
    var d26 = first.rev, d30 = last.rev;
    wf.appendChild(C.waterfall({
      valFmt: function (v) { return fmtEUR(v); }, yFmt: function (v) { return fmtEUR(v); },
      items: [
        { label: "2026", value: first.revenue, type: "start" },
        { label: "Δ Betaal NL", value: d30.txnNL - d26.txnNL, type: "delta" },
        { label: "Δ Betaal EU", value: d30.txnEU - d26.txnEU, type: "delta" },
        { label: "Δ Platform", value: d30.platform - d26.platform, type: "delta" },
        { label: "Δ Issuing", value: d30.issuing - d26.issuing, type: "delta" },
        { label: "2030", value: last.revenue, type: "total" }
      ]
    }));

    // share, txn, users
    var sh = $("shareChart"); clear(sh);
    sh.appendChild(C.line({ height: 260, xLabels: YEARS, yFmt: function (v) { return (v * 100).toFixed(0) + "%"; }, valFmt: function (v) { return fmtPct(v); },
      series: [{ name: "Aandeel NL", color: "var(--series-1)", values: m.rows.map(function (r) { return r.shareNL; }), area: true }] }));
    var tx = $("txnChart"); clear(tx);
    tx.appendChild(C.groupedBar({ height: 260, xLabels: YEARS, yFmt: function (v) { return fmtNum(v); }, valFmt: function (v) { return fmtNum(v) + " sessies"; },
      series: [{ name: "Verwerkte sessies", color: "var(--series-2)", values: m.rows.map(function (r) { return r.processedSessions; }) }] }));
    var us = $("usersChart"); clear(us);
    us.appendChild(C.line({ height: 260, xLabels: YEARS, yFmt: function (v) { return fmtNum(v); }, valFmt: function (v) { return fmtNum(v); },
      series: [{ name: "Actieve gebruikers", color: "var(--series-5)", values: m.rows.map(function (r) { return r.users; }), area: true }] }));

    // full model table
    var mt = $("modelTable");
    var rowsDef = [
      ["BEV-vloot (NL+EU)", function (r) { return fmtNum(r.fleet); }],
      ["Markt-GMV publiek", function (r) { return fmtEUR(r.marketGMV); }],
      ["Publieke sessies (markt)", function (r) { return fmtNum(r.sessions); }],
      ["Ons aandeel NL", function (r) { return fmtPct(r.shareNL); }],
      ["Verwerkte sessies", function (r) { return fmtNum(r.processedSessions); }],
      ["Verwerkte GMV", function (r) { return fmtEUR(r.processedGMV); }],
      ["Omzet — betaalverwerking", function (r) { return fmtEUR(r.rev.txnNL + r.rev.txnEU); }],
      ["Omzet — platform-SaaS", function (r) { return fmtEUR(r.rev.platform); }],
      ["Omzet — issuing/embedded", function (r) { return fmtEUR(r.rev.issuing); }],
      ["<b>Totale omzet</b>", function (r) { return "<b>" + fmtEUR(r.revenue) + "</b>"; }],
      ["EBITDA-marge", function (r) { return fmtPct(r.ebitdaMargin, 0); }],
      ["<b>EBITDA</b>", function (r) { return "<b>" + fmtEUR(r.ebitda) + "</b>"; }],
      ["Actieve gebruikers", function (r) { return fmtNum(r.users); }]
    ];
    mt.innerHTML = "<thead><tr><th>Regel</th>" + YEARS.map(function (y) { return "<th class='num'>" + y + "</th>"; }).join("") +
      "<th class='num'>CAGR</th></tr></thead><tbody>" +
      rowsDef.map(function (rd) {
        var vals = m.rows.map(function (r) { return "<td class='num'>" + rd[1](r) + "</td>"; }).join("");
        var cagr = "";
        if (/Omzet|GMV|sessies|vloot|gebruikers|EBITDA<\/b>/.test(rd[0]) && !/marge|aandeel/.test(rd[0])) {
          var f = rawVal(m.rows[0], rd[0]), l = rawVal(m.rows[4], rd[0]);
          if (f > 0) cagr = fmtPct(EV.cagr(f, l, 4), 0);
        }
        return "<tr><td>" + rd[0] + "</td>" + vals + "<td class='num'>" + cagr + "</td></tr>";
      }).join("") + "</tbody>";
  }
  function rawVal(r, label) {
    if (/vloot/.test(label)) return r.fleet;
    if (/Markt-GMV/.test(label)) return r.marketGMV;
    if (/Verwerkte GMV/.test(label)) return r.processedGMV;
    if (/Verwerkte sessies/.test(label)) return r.processedSessions;
    if (/Publieke sessies/.test(label)) return r.sessions;
    if (/betaalverwerking/.test(label)) return r.rev.txnNL + r.rev.txnEU;
    if (/platform/.test(label)) return r.rev.platform;
    if (/issuing/.test(label)) return r.rev.issuing;
    if (/Totale omzet/.test(label)) return r.revenue;
    if (/EBITDA<\/b>/.test(label)) return r.ebitda;
    if (/gebruikers/.test(label)) return r.users;
    return 0;
  }

  /* ============================ RENDER: scenario & MC ================== */
  var mcCache = {};
  function renderScenarioSection() {
    var all = EV.computeAll();
    var host = $("scenarioCompare"); clear(host);
    host.appendChild(C.groupedBar({
      xLabels: YEARS, yFmt: function (v) { return fmtEUR(v); }, valFmt: function (v) { return fmtEUR(v); },
      series: [
        { name: "Conservatief", color: "var(--series-6)", values: all.conservatief.rows.map(function (r) { return r.revenue; }) },
        { name: "Basis", color: "var(--series-1)", values: all.basis.rows.map(function (r) { return r.revenue; }) },
        { name: "Ambitieus", color: "var(--series-2)", values: all.ambitieus.rows.map(function (r) { return r.revenue; }) }
      ]
    }));
    var lg = $("scenarioLegend"); clear(lg);
    lg.appendChild(C.legend([{ label: "Conservatief", color: "var(--series-6)" }, { label: "Basis", color: "var(--series-1)" }, { label: "Ambitieus", color: "var(--series-2)" }]));
    var tt = $("scenarioCompareTable"); clear(tt);
    tt.appendChild(makeTable(
      [{ label: "Scenario" }].concat(YEARS.map(function (y) { return { label: y, num: true }; })).concat([{ label: "CAGR", num: true }, { label: "Cum. 5 jr", num: true }]),
      ["conservatief", "basis", "ambitieus"].map(function (k) {
        return [EV.SCENARIOS[k].label].concat(all[k].rows.map(function (r) { return fmtEUR(r.revenue); })).concat([fmtPct(all[k].cagr), fmtEUR(all[k].totalRevenue)]);
      })
    ));

    // Monte Carlo
    var mc = mcCache[state.scenario] || (mcCache[state.scenario] = EV.runMonteCarlo(state.scenario, 5000, 42));
    var mh = $("mcHist"); clear(mh);
    mh.appendChild(C.histogram({
      values: mc.y5, bins: 36, valFmt: function (v) { return fmtEUR(v); },
      markers: [
        { v: mc.p10, label: "P10", color: "var(--series-6)" },
        { v: mc.p50, label: "P50", color: "var(--text-primary)" },
        { v: mc.p90, label: "P90", color: "var(--series-2)" }
      ]
    }));
    $("mcKpi").innerHTML =
      kpi("P10 (2030)", fmtEUR(mc.p10), "10% kans lager", false) +
      kpi("P50 · mediaan", fmtEUR(mc.p50), "Verwacht", true) +
      kpi("P90 (2030)", fmtEUR(mc.p90), "10% kans hoger", false);
    $("mcDesc").textContent = mc.iterations.toLocaleString("nl-NL") + " trekkingen · scenario " + EV.SCENARIOS[state.scenario].label + " · seeded (reproduceerbaar). Markers = P10/P50/P90.";

    // Tornado
    var tor = EV.runTornado(state.scenario);
    var th = $("tornadoChart"); clear(th);
    th.appendChild(C.tornado({ base: tor.base, items: tor.items, valFmt: function (v) { return fmtEUR(v); } }));

    // Sensitivity heatmap: shareMult (rows) x takeRateMult (cols)
    renderSensHeatmap();
  }

  function renderSensHeatmap() {
    var host = $("sensHeatmap"); clear(host);
    var shareMults = [0.6, 0.8, 1.0, 1.2, 1.4];
    var takeMults = [0.8, 0.9, 1.0, 1.1, 1.2];
    var p = EV.SCENARIOS[state.scenario];
    var matrix = shareMults.map(function (sm) {
      return takeMults.map(function (tm) {
        var r = EV.computeModel(state.scenario, { fleetMult: p.fleetMult, shareMult: sm, takeRate: p.takeRate * tm });
        return r.y5Revenue;
      });
    });
    var flat = matrix.reduce(function (a, r) { return a.concat(r); }, []);
    var mn = Math.min.apply(null, flat), mx = Math.max.apply(null, flat);
    host.appendChild(C.heatmap({
      rows: shareMults.map(function (m) { return "aandeel ×" + m.toFixed(1); }),
      cols: takeMults.map(function (m) { return "take ×" + m.toFixed(1); }),
      matrix: matrix,
      valFmt: function (v) { return "€" + (v / 1e6).toFixed(0); },
      colorFor: function (v) { return blueScale((v - mn) / (mx - mn || 1)); }
    }));
  }

  /* ============================ CSV export ============================= */
  function exportCSV() {
    var m = model();
    var header = ["Regel"].concat(YEARS);
    var lines = [header.join(";")];
    var defs = [
      ["BEV-vloot", function (r) { return Math.round(r.fleet); }],
      ["Markt-GMV publiek (EUR)", function (r) { return Math.round(r.marketGMV); }],
      ["Publieke sessies", function (r) { return Math.round(r.sessions); }],
      ["Aandeel NL", function (r) { return (r.shareNL * 100).toFixed(2) + "%"; }],
      ["Verwerkte sessies", function (r) { return Math.round(r.processedSessions); }],
      ["Verwerkte GMV (EUR)", function (r) { return Math.round(r.processedGMV); }],
      ["Omzet betaalverwerking (EUR)", function (r) { return Math.round(r.rev.txnNL + r.rev.txnEU); }],
      ["Omzet platform (EUR)", function (r) { return Math.round(r.rev.platform); }],
      ["Omzet issuing (EUR)", function (r) { return Math.round(r.rev.issuing); }],
      ["Totale omzet (EUR)", function (r) { return Math.round(r.revenue); }],
      ["EBITDA (EUR)", function (r) { return Math.round(r.ebitda); }],
      ["Actieve gebruikers", function (r) { return Math.round(r.users); }]
    ];
    defs.forEach(function (d) { lines.push([d[0]].concat(m.rows.map(function (r) { return d[1](r); })).join(";")); });
    var blob = new Blob(["﻿" + lines.join("\n")], { type: "text/csv;charset=utf-8" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "ev-omzetmodel-" + state.scenario + ".csv";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  /* ============================ orchestration ========================== */
  function renderLight() {
    renderSummary();
    renderModel();
    renderFunnel(model());
    $("cagrPill").textContent = "CAGR " + fmtPct(model().cagr);
  }
  function renderHeavy() { renderScenarioSection(); }
  function renderAll() { renderLight(); renderHeavy(); }

  /* ============================ interactions =========================== */
  function initScenario() {
    var seg = $("scenarioSeg");
    seg.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-sc]"); if (!b) return;
      state.scenario = b.getAttribute("data-sc");
      Array.prototype.forEach.call(seg.children, function (c) { c.setAttribute("aria-pressed", c === b ? "true" : "false"); });
      renderAll();
    });
  }

  var SLIDER_DEFS = [
    { key: "fleet", label: "EV-vloeigroei", min: 0.8, max: 1.2, step: 0.02 },
    { key: "share", label: "Verwerkt aandeel", min: 0.5, max: 1.6, step: 0.05 },
    { key: "take", label: "Take rate (marge)", min: 0.7, max: 1.3, step: 0.02 },
    { key: "kwh", label: "Publiek kWh/BEV", min: 0.8, max: 1.2, step: 0.02 },
    { key: "price", label: "Tarief €/kWh", min: 0.85, max: 1.15, step: 0.01 },
    { key: "interchange", label: "Fleet/embedded finance", min: 0.7, max: 1.4, step: 0.05 }
  ];
  function initSliders() {
    var host = $("sliders");
    host.innerHTML = SLIDER_DEFS.map(function (s) {
      return '<div class="slider-row"><label>' + s.label + ' <output id="out_' + s.key + '">×1,00</output></label>' +
        '<input type="range" id="sl_' + s.key + '" min="' + s.min + '" max="' + s.max + '" step="' + s.step + '" value="1" aria-label="' + s.label + '"></div>';
    }).join("");
    SLIDER_DEFS.forEach(function (s) {
      var inp = $("sl_" + s.key), out = $("out_" + s.key);
      inp.addEventListener("input", function () {
        state.sliders[s.key] = parseFloat(inp.value);
        out.textContent = "×" + parseFloat(inp.value).toFixed(2).replace(".", ",");
        renderLight();
      });
    });
    $("resetSliders").addEventListener("click", function () {
      SLIDER_DEFS.forEach(function (s) { state.sliders[s.key] = 1; $("sl_" + s.key).value = 1; $("out_" + s.key).textContent = "×1,00"; });
      renderLight();
    });
  }

  function initViewToggles() {
    document.querySelectorAll(".view-toggle[data-viewtoggle]").forEach(function (vt) {
      var target = vt.getAttribute("data-viewtoggle");
      vt.addEventListener("click", function (e) {
        var b = e.target.closest("button[data-view]"); if (!b) return;
        var view = b.getAttribute("data-view");
        Array.prototype.forEach.call(vt.children, function (c) { c.setAttribute("aria-pressed", c === b ? "true" : "false"); });
        $(target).classList.toggle("hidden", view !== "chart");
        var tbl = $(target + "Table"); if (tbl) tbl.classList.toggle("hidden", view !== "table");
      });
    });
  }

  function initTheme() {
    var btn = $("themeBtn");
    function setT(t) { document.documentElement.setAttribute("data-theme", t); try { localStorage.setItem("ev-theme", t); } catch (e) {} }
    var saved; try { saved = localStorage.getItem("ev-theme"); } catch (e) {}
    if (saved) setT(saved);
    else if (window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches) setT("dark");
    btn.addEventListener("click", function () {
      var cur = document.documentElement.getAttribute("data-theme");
      setT(cur === "dark" ? "light" : "dark");
      renderAll(); // recolor SVGs via re-render (they read CSS vars, but re-render ensures freshness)
    });
  }

  function initScrollSpy() {
    var links = Array.prototype.slice.call(document.querySelectorAll(".navlink"));
    var map = {};
    links.forEach(function (l) { map[l.getAttribute("href").slice(1)] = l; });
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (l) { l.classList.remove("active"); });
          var l = map[en.target.id]; if (l) l.classList.add("active");
        }
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    document.querySelectorAll("section.block").forEach(function (s) { if (map[s.id]) obs.observe(s); });
  }

  function init() {
    renderReview(); renderTopics(); renderAssumptions(); renderSources(); renderRecos(); renderRiskMatrix();
    initScenario(); initSliders(); initViewToggles(); initTheme(); initScrollSpy();
    $("dlCsv").addEventListener("click", exportCSV);
    renderAll();
    window.addEventListener("resize", function () { C.hideTip(); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

})(window.EV = window.EV || {});
