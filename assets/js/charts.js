/* ============================================================================
   EV Charging Revenue Model — CHART LIBRARY (dependency-free SVG)
   Theme-aware via CSS custom properties, responsive (viewBox), accessible
   (role=img + <title>/<desc>, table fallback handled by app), interactive
   (shared tooltip). Palette per dataviz reference instance.
   ============================================================================ */
(function (EV) {
  "use strict";

  var NS = "http://www.w3.org/2000/svg";
  var C = EV.Charts = {};

  /* --- shared tooltip ----------------------------------------------------- */
  var tip;
  function tooltip() {
    if (!tip) {
      tip = document.createElement("div");
      tip.className = "viz-tooltip";
      tip.setAttribute("role", "status");
      document.body.appendChild(tip);
    }
    return tip;
  }
  function showTip(html, x, y) {
    var t = tooltip();
    t.innerHTML = html;
    t.style.opacity = "1";
    var w = t.offsetWidth, h = t.offsetHeight;
    var left = x + 14, top = y - h - 12;
    if (left + w > window.innerWidth - 8) left = x - w - 14;
    if (top < 8) top = y + 16;
    t.style.left = left + "px";
    t.style.top = top + "px";
  }
  function hideTip() { if (tip) tip.style.opacity = "0"; }
  C.hideTip = hideTip;

  /* --- helpers ------------------------------------------------------------ */
  function el(name, attrs) {
    var e = document.createElementNS(NS, name);
    if (attrs) for (var k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }
  function svgRoot(w, h, title, desc) {
    var s = el("svg", { viewBox: "0 0 " + w + " " + h, width: "100%", role: "img",
      preserveAspectRatio: "xMidYMid meet", "aria-label": title });
    var t = el("title"); t.textContent = title; s.appendChild(t);
    if (desc) { var d = el("desc"); d.textContent = desc; s.appendChild(d); }
    return s;
  }
  function niceMax(v) {
    if (v <= 0) return 1;
    var mag = Math.pow(10, Math.floor(Math.log10(v)));
    var n = v / mag;
    var step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
    return step * mag;
  }
  function ticks(max, n) {
    var out = [], step = max / n;
    for (var i = 0; i <= n; i++) out.push(step * i);
    return out;
  }
  var SERIES = ["--series-1","--series-2","--series-3","--series-4","--series-5","--series-6","--series-7","--series-8"];
  function sColor(i) { return "var(" + SERIES[i % SERIES.length] + ")"; }

  /* ========================================================================
     LINE CHART (multi-series) with crosshair + tooltip
     cfg: { xLabels:[], series:[{name,color,values:[]}], yFmt, valFmt, height }
     ======================================================================== */
  C.line = function (cfg) {
    var W = 720, H = cfg.height || 340;
    var m = { t: 18, r: 18, b: 42, l: 64 };
    var iw = W - m.l - m.r, ih = H - m.t - m.b;
    var allV = [];
    cfg.series.forEach(function (s) { s.values.forEach(function (v) { allV.push(v); }); });
    var max = niceMax(Math.max.apply(null, allV) * 1.05);
    var n = cfg.xLabels.length;
    var xAt = function (i) { return m.l + (n === 1 ? iw / 2 : iw * i / (n - 1)); };
    var yAt = function (v) { return m.t + ih - (v / max) * ih; };

    var svg = svgRoot(W, H, cfg.title || "Lijngrafiek", cfg.desc);
    // gridlines + y ticks
    ticks(max, 4).forEach(function (tv) {
      var y = yAt(tv);
      svg.appendChild(el("line", { x1: m.l, y1: y, x2: W - m.r, y2: y, class: "viz-grid" }));
      var lab = el("text", { x: m.l - 10, y: y + 4, class: "viz-axis", "text-anchor": "end" });
      lab.textContent = cfg.yFmt ? cfg.yFmt(tv) : tv;
      svg.appendChild(lab);
    });
    // x labels
    cfg.xLabels.forEach(function (lb, i) {
      var t = el("text", { x: xAt(i), y: H - 14, class: "viz-axis", "text-anchor": "middle" });
      t.textContent = lb; svg.appendChild(t);
    });
    // series paths
    cfg.series.forEach(function (s, si) {
      var color = s.color || sColor(si);
      var d = s.values.map(function (v, i) { return (i ? "L" : "M") + xAt(i) + " " + yAt(v); }).join(" ");
      if (s.area) {
        var ad = d + " L" + xAt(n - 1) + " " + yAt(0) + " L" + xAt(0) + " " + yAt(0) + " Z";
        var fill = el("path", { d: ad, fill: color, "fill-opacity": "0.10", stroke: "none" });
        svg.appendChild(fill);
      }
      svg.appendChild(el("path", { d: d, fill: "none", stroke: color, "stroke-width": s.dashed ? 2 : 2.5,
        "stroke-linejoin": "round", "stroke-linecap": "round", "stroke-dasharray": s.dashed ? "6 5" : "" }));
      s.values.forEach(function (v, i) {
        svg.appendChild(el("circle", { cx: xAt(i), cy: yAt(v), r: 3.2, fill: color,
          stroke: "var(--surface-1)", "stroke-width": 1.5 }));
      });
    });
    // hover layer
    var focus = el("line", { class: "viz-crosshair", y1: m.t, y2: m.t + ih, x1: -99, x2: -99 });
    svg.appendChild(focus);
    var overlay = el("rect", { x: m.l, y: m.t, width: iw, height: ih, fill: "transparent", style: "cursor:crosshair" });
    svg.appendChild(overlay);
    function move(evt) {
      var pt = localPoint(svg, evt);
      var i = Math.round((pt.x - m.l) / (iw / Math.max(1, n - 1)));
      i = Math.max(0, Math.min(n - 1, i));
      focus.setAttribute("x1", xAt(i)); focus.setAttribute("x2", xAt(i));
      var rows = cfg.series.map(function (s, si) {
        return '<span class="tt-dot" style="background:' + (s.color || sColor(si)) + '"></span>' +
          s.name + ': <b>' + (cfg.valFmt ? cfg.valFmt(s.values[i]) : s.values[i]) + '</b>';
      }).join("<br>");
      showTip('<div class="tt-h">' + cfg.xLabels[i] + '</div>' + rows, evt.clientX, evt.clientY);
    }
    overlay.addEventListener("mousemove", move);
    overlay.addEventListener("mouseleave", function () { hideTip(); focus.setAttribute("x1", -99); focus.setAttribute("x2", -99); });
    overlay.addEventListener("touchstart", function (e) { move(e.touches[0]); }, { passive: true });
    overlay.addEventListener("touchmove", function (e) { move(e.touches[0]); }, { passive: true });
    return svg;
  };

  function localPoint(svg, evt) {
    var rect = svg.getBoundingClientRect();
    var vb = svg.viewBox.baseVal;
    return { x: (evt.clientX - rect.left) / rect.width * vb.width,
             y: (evt.clientY - rect.top) / rect.height * vb.height };
  }

  /* ========================================================================
     STACKED BAR CHART
     cfg: { xLabels, series:[{name,color,values}], yFmt, valFmt, height }
     ======================================================================== */
  C.stackedBar = function (cfg) {
    var W = 720, H = cfg.height || 360;
    var m = { t: 18, r: 18, b: 42, l: 68 };
    var iw = W - m.l - m.r, ih = H - m.t - m.b;
    var n = cfg.xLabels.length;
    var totals = cfg.xLabels.map(function (_, i) {
      return cfg.series.reduce(function (a, s) { return a + s.values[i]; }, 0);
    });
    var max = niceMax(Math.max.apply(null, totals) * 1.08);
    var bw = iw / n * 0.6;
    var xAt = function (i) { return m.l + iw * (i + 0.5) / n; };
    var yAt = function (v) { return m.t + ih - (v / max) * ih; };
    var svg = svgRoot(W, H, cfg.title || "Gestapelde staafgrafiek", cfg.desc);
    ticks(max, 4).forEach(function (tv) {
      var y = yAt(tv);
      svg.appendChild(el("line", { x1: m.l, y1: y, x2: W - m.r, y2: y, class: "viz-grid" }));
      var lab = el("text", { x: m.l - 10, y: y + 4, class: "viz-axis", "text-anchor": "end" });
      lab.textContent = cfg.yFmt ? cfg.yFmt(tv) : tv; svg.appendChild(lab);
    });
    cfg.xLabels.forEach(function (lb, i) {
      var acc = 0;
      cfg.series.forEach(function (s, si) {
        var v = s.values[i]; if (v === 0) return;
        var y0 = yAt(acc), y1 = yAt(acc + v);
        var h = Math.max(0, y0 - y1 - 2);
        var r = el("rect", { x: xAt(i) - bw / 2, y: y1, width: bw, height: h, rx: 2,
          fill: s.color || sColor(si), class: "viz-bar" });
        r.addEventListener("mousemove", function (evt) {
          showTip('<div class="tt-h">' + lb + '</div><span class="tt-dot" style="background:' +
            (s.color || sColor(si)) + '"></span>' + s.name + ': <b>' +
            (cfg.valFmt ? cfg.valFmt(v) : v) + '</b>', evt.clientX, evt.clientY);
        });
        r.addEventListener("mouseleave", hideTip);
        svg.appendChild(r);
        acc += v;
      });
      var tot = el("text", { x: xAt(i), y: yAt(totals[i]) - 6, class: "viz-datalabel", "text-anchor": "middle" });
      tot.textContent = cfg.valFmt ? cfg.valFmt(totals[i]) : totals[i]; svg.appendChild(tot);
      var t = el("text", { x: xAt(i), y: H - 14, class: "viz-axis", "text-anchor": "middle" });
      t.textContent = lb; svg.appendChild(t);
    });
    return svg;
  };

  /* ========================================================================
     GROUPED BAR CHART
     ======================================================================== */
  C.groupedBar = function (cfg) {
    var W = 720, H = cfg.height || 340;
    var m = { t: 18, r: 18, b: 42, l: 68 };
    var iw = W - m.l - m.r, ih = H - m.t - m.b;
    var n = cfg.xLabels.length, k = cfg.series.length;
    var allV = [];
    cfg.series.forEach(function (s) { s.values.forEach(function (v) { allV.push(v); }); });
    var max = niceMax(Math.max.apply(null, allV) * 1.08);
    var group = iw / n * 0.72, bw = group / k;
    var xAt = function (i) { return m.l + iw * (i + 0.5) / n; };
    var yAt = function (v) { return m.t + ih - (v / max) * ih; };
    var svg = svgRoot(W, H, cfg.title || "Staafgrafiek", cfg.desc);
    ticks(max, 4).forEach(function (tv) {
      var y = yAt(tv);
      svg.appendChild(el("line", { x1: m.l, y1: y, x2: W - m.r, y2: y, class: "viz-grid" }));
      var lab = el("text", { x: m.l - 10, y: y + 4, class: "viz-axis", "text-anchor": "end" });
      lab.textContent = cfg.yFmt ? cfg.yFmt(tv) : tv; svg.appendChild(lab);
    });
    cfg.xLabels.forEach(function (lb, i) {
      cfg.series.forEach(function (s, si) {
        var v = s.values[i];
        var x = xAt(i) - group / 2 + bw * si + 1;
        var y = yAt(v), h = Math.max(0, yAt(0) - y);
        var r = el("rect", { x: x, y: y, width: bw - 2, height: h, rx: 2, fill: s.color || sColor(si), class: "viz-bar" });
        r.addEventListener("mousemove", function (evt) {
          showTip('<div class="tt-h">' + lb + '</div><span class="tt-dot" style="background:' +
            (s.color || sColor(si)) + '"></span>' + s.name + ': <b>' +
            (cfg.valFmt ? cfg.valFmt(v) : v) + '</b>', evt.clientX, evt.clientY);
        });
        r.addEventListener("mouseleave", hideTip);
        svg.appendChild(r);
      });
      var t = el("text", { x: xAt(i), y: H - 14, class: "viz-axis", "text-anchor": "middle" });
      t.textContent = lb; svg.appendChild(t);
    });
    return svg;
  };

  /* ========================================================================
     WATERFALL CHART
     cfg: { items:[{label, value, type:'start'|'delta'|'total'}], valFmt, yFmt }
     ======================================================================== */
  C.waterfall = function (cfg) {
    var W = 720, H = cfg.height || 360;
    var m = { t: 24, r: 18, b: 64, l: 72 };
    var iw = W - m.l - m.r, ih = H - m.t - m.b;
    var n = cfg.items.length;
    var cum = 0, maxV = 0;
    var bars = cfg.items.map(function (it) {
      var base, top;
      if (it.type === "start" || it.type === "total") { base = 0; top = it.value; cum = it.value; }
      else { base = cum; top = cum + it.value; cum = top; }
      maxV = Math.max(maxV, base, top);
      return { it: it, base: base, top: top };
    });
    var max = niceMax(maxV * 1.1);
    var bw = iw / n * 0.62;
    var xAt = function (i) { return m.l + iw * (i + 0.5) / n; };
    var yAt = function (v) { return m.t + ih - (v / max) * ih; };
    var svg = svgRoot(W, H, cfg.title || "Waterfall", cfg.desc);
    ticks(max, 4).forEach(function (tv) {
      var y = yAt(tv);
      svg.appendChild(el("line", { x1: m.l, y1: y, x2: W - m.r, y2: y, class: "viz-grid" }));
      var lab = el("text", { x: m.l - 10, y: y + 4, class: "viz-axis", "text-anchor": "end" });
      lab.textContent = cfg.yFmt ? cfg.yFmt(tv) : tv; svg.appendChild(lab);
    });
    bars.forEach(function (b, i) {
      var y1 = yAt(Math.max(b.base, b.top)), y0 = yAt(Math.min(b.base, b.top));
      var h = Math.max(1, y0 - y1);
      var color = b.it.type === "start" ? "var(--series-1)" :
        b.it.type === "total" ? "var(--series-5)" :
        (b.it.value >= 0 ? "var(--series-2)" : "var(--series-6)");
      var r = el("rect", { x: xAt(i) - bw / 2, y: y1, width: bw, height: h, rx: 2, fill: color, class: "viz-bar" });
      r.addEventListener("mousemove", function (evt) {
        showTip('<div class="tt-h">' + b.it.label + '</div><b>' +
          (b.it.value >= 0 || b.it.type !== "delta" ? "" : "") +
          (cfg.valFmt ? cfg.valFmt(b.it.value) : b.it.value) + '</b>', evt.clientX, evt.clientY);
      });
      r.addEventListener("mouseleave", hideTip);
      svg.appendChild(r);
      if (i < n - 1) {
        svg.appendChild(el("line", { x1: xAt(i) + bw / 2, y1: yAt(b.top), x2: xAt(i + 1) - bw / 2, y2: yAt(b.top),
          class: "viz-connector" }));
      }
      var vl = el("text", { x: xAt(i), y: y1 - 6, class: "viz-datalabel", "text-anchor": "middle" });
      vl.textContent = cfg.valFmt ? cfg.valFmt(b.it.value) : b.it.value; svg.appendChild(vl);
      var lab = el("text", { x: xAt(i), y: H - 14, class: "viz-axis", "text-anchor": "middle" });
      lab.textContent = b.it.label; svg.appendChild(lab);
    });
    return svg;
  };

  /* ========================================================================
     TORNADO (sensitivity) — horizontal diverging bars
     cfg: { base, items:[{label, low, high}], valFmt }
     ======================================================================== */
  C.tornado = function (cfg) {
    var items = cfg.items.slice().sort(function (a, b) {
      return Math.abs(b.high - b.low) - Math.abs(a.high - a.low);
    });
    var W = 720, rowH = 34, H = items.length * rowH + 56;
    var m = { t: 16, r: 20, b: 34, l: 210 };
    var iw = W - m.l - m.r;
    var lo = Math.min.apply(null, items.map(function (d) { return Math.min(d.low, d.high, cfg.base); }));
    var hi = Math.max.apply(null, items.map(function (d) { return Math.max(d.low, d.high, cfg.base); }));
    var pad = (hi - lo) * 0.08; lo -= pad; hi += pad;
    var xAt = function (v) { return m.l + iw * (v - lo) / (hi - lo); };
    var svg = svgRoot(W, H, cfg.title || "Tornadodiagram", cfg.desc);
    // base line
    svg.appendChild(el("line", { x1: xAt(cfg.base), y1: m.t - 4, x2: xAt(cfg.base), y2: H - m.b, class: "viz-baseline-strong" }));
    var bl = el("text", { x: xAt(cfg.base), y: H - 12, class: "viz-axis", "text-anchor": "middle" });
    bl.textContent = "basis " + (cfg.valFmt ? cfg.valFmt(cfg.base) : cfg.base); svg.appendChild(bl);
    items.forEach(function (d, i) {
      var y = m.t + i * rowH;
      var xl = xAt(Math.min(d.low, d.high)), xh = xAt(Math.max(d.low, d.high));
      var lowColor = "var(--series-6)", highColor = "var(--series-2)";
      // low side (left of base) red, high side green
      var xb = xAt(cfg.base);
      var leftRect = el("rect", { x: Math.min(xl, xb), y: y + 4, width: Math.abs(xb - xl), height: rowH - 14, rx: 2, fill: lowColor, class: "viz-bar" });
      var rightRect = el("rect", { x: xb, y: y + 4, width: Math.abs(xh - xb), height: rowH - 14, rx: 2, fill: highColor, class: "viz-bar" });
      [ [leftRect, d.low, lowColor], [rightRect, d.high, highColor] ].forEach(function (pair) {
        pair[0].addEventListener("mousemove", function (evt) {
          showTip('<div class="tt-h">' + d.label + '</div>Y5-omzet: <b>' + (cfg.valFmt ? cfg.valFmt(pair[1]) : pair[1]) + '</b>', evt.clientX, evt.clientY);
        });
        pair[0].addEventListener("mouseleave", hideTip);
      });
      svg.appendChild(leftRect); svg.appendChild(rightRect);
      var lab = el("text", { x: m.l - 12, y: y + rowH / 2 + 2, class: "viz-axis", "text-anchor": "end" });
      lab.textContent = d.label; svg.appendChild(lab);
    });
    return svg;
  };

  /* ========================================================================
     HISTOGRAM (Monte Carlo) with P10/P50/P90 markers
     cfg: { values:[], bins, valFmt, markers:[{v,label,color}] }
     ======================================================================== */
  C.histogram = function (cfg) {
    var W = 720, H = cfg.height || 320;
    var m = { t: 18, r: 18, b: 46, l: 52 };
    var iw = W - m.l - m.r, ih = H - m.t - m.b;
    var vals = cfg.values;
    var min = Math.min.apply(null, vals), max = Math.max.apply(null, vals);
    var bins = cfg.bins || 34;
    var bw = (max - min) / bins || 1;
    var counts = new Array(bins).fill(0);
    vals.forEach(function (v) {
      var b = Math.min(bins - 1, Math.floor((v - min) / bw));
      counts[b]++;
    });
    var cmax = Math.max.apply(null, counts);
    var xAt = function (v) { return m.l + iw * (v - min) / (max - min); };
    var yAt = function (c) { return m.t + ih - (c / cmax) * ih; };
    var svg = svgRoot(W, H, cfg.title || "Histogram", cfg.desc);
    counts.forEach(function (c, i) {
      var x = xAt(min + i * bw);
      var w = iw / bins - 1.5;
      var y = yAt(c), h = Math.max(0, yAt(0) - y);
      var r = el("rect", { x: x, y: y, width: Math.max(1, w), height: h, rx: 1.5, fill: "var(--series-1)", "fill-opacity": "0.85", class: "viz-bar" });
      r.addEventListener("mousemove", function (evt) {
        showTip((cfg.valFmt ? cfg.valFmt(min + i * bw) : (min + i * bw).toFixed(1)) + '–' +
          (cfg.valFmt ? cfg.valFmt(min + (i + 1) * bw) : "") + '<br><b>' + c + '</b> simulaties', evt.clientX, evt.clientY);
      });
      r.addEventListener("mouseleave", hideTip);
      svg.appendChild(r);
    });
    // x axis labels
    [min, (min + max) / 2, max].forEach(function (v) {
      var t = el("text", { x: xAt(v), y: H - 22, class: "viz-axis", "text-anchor": "middle" });
      t.textContent = cfg.valFmt ? cfg.valFmt(v) : v.toFixed(1); svg.appendChild(t);
    });
    (cfg.markers || []).forEach(function (mk) {
      var x = xAt(mk.v);
      svg.appendChild(el("line", { x1: x, y1: m.t, x2: x, y2: m.t + ih, stroke: mk.color || "var(--text-primary)",
        "stroke-width": 2, "stroke-dasharray": "5 4" }));
      var t = el("text", { x: x, y: m.t + 12, class: "viz-datalabel", "text-anchor": "middle", fill: mk.color });
      t.textContent = mk.label; svg.appendChild(t);
    });
    return svg;
  };

  /* ========================================================================
     HEATMAP  cfg:{ rows:[], cols:[], matrix:[[]], valFmt, colorFor(v) }
     ======================================================================== */
  C.heatmap = function (cfg) {
    var cw = 84, ch = 40, lm = 150, tm = 30;
    var W = lm + cfg.cols.length * cw + 16, H = tm + cfg.rows.length * ch + 16;
    var svg = svgRoot(W, H, cfg.title || "Heatmap", cfg.desc);
    cfg.cols.forEach(function (c, j) {
      var t = el("text", { x: lm + j * cw + cw / 2, y: tm - 10, class: "viz-axis", "text-anchor": "middle" });
      t.textContent = c; svg.appendChild(t);
    });
    cfg.rows.forEach(function (r, i) {
      var lab = el("text", { x: lm - 10, y: tm + i * ch + ch / 2 + 4, class: "viz-axis", "text-anchor": "end" });
      lab.textContent = r; svg.appendChild(lab);
      cfg.cols.forEach(function (c, j) {
        var v = cfg.matrix[i][j];
        var cell = el("rect", { x: lm + j * cw + 2, y: tm + i * ch + 2, width: cw - 4, height: ch - 4, rx: 4,
          fill: cfg.colorFor(v), class: "viz-cell" });
        cell.addEventListener("mousemove", function (evt) {
          showTip('<div class="tt-h">' + r + ' · ' + c + '</div><b>' + (cfg.valFmt ? cfg.valFmt(v) : v) + '</b>', evt.clientX, evt.clientY);
        });
        cell.addEventListener("mouseleave", hideTip);
        svg.appendChild(cell);
        var vt = el("text", { x: lm + j * cw + cw / 2, y: tm + i * ch + ch / 2 + 4, class: "viz-cell-label", "text-anchor": "middle" });
        vt.textContent = cfg.valFmt ? cfg.valFmt(v) : v; svg.appendChild(vt);
      });
    });
    return svg;
  };

  /* ========================================================================
     FUNNEL (TAM/SAM/SOM)  cfg:{ items:[{label,value,note,color}], valFmt }
     ======================================================================== */
  C.funnel = function (cfg) {
    var W = 720, rowH = 96, H = cfg.items.length * rowH + 20;
    var maxV = cfg.items[0].value;
    var svg = svgRoot(W, H, cfg.title || "Funnel", cfg.desc);
    var cx = W / 2;
    cfg.items.forEach(function (it, i) {
      var w = Math.max(120, (it.value / maxV) * (W - 120));
      var y = 10 + i * rowH;
      var r = el("rect", { x: cx - w / 2, y: y, width: w, height: rowH - 20, rx: 8,
        fill: it.color || sColor(i), "fill-opacity": "0.9", class: "viz-bar" });
      r.addEventListener("mousemove", function (evt) {
        showTip('<div class="tt-h">' + it.label + '</div>' + it.note, evt.clientX, evt.clientY);
      });
      r.addEventListener("mouseleave", hideTip);
      svg.appendChild(r);
      var lab = el("text", { x: cx, y: y + 30, class: "viz-funnel-label", "text-anchor": "middle" });
      lab.textContent = it.label; svg.appendChild(lab);
      var val = el("text", { x: cx, y: y + 54, class: "viz-funnel-value", "text-anchor": "middle" });
      val.textContent = cfg.valFmt ? cfg.valFmt(it.value) : it.value; svg.appendChild(val);
    });
    return svg;
  };

  /* ========================================================================
     DONUT / GAUGE  cfg:{ segments:[{label,value,color}], centerLabel, centerValue }
     ======================================================================== */
  C.donut = function (cfg) {
    var S = 240, r = 92, ir = 60, cx = S / 2, cy = S / 2;
    var total = cfg.segments.reduce(function (a, s) { return a + s.value; }, 0);
    var svg = svgRoot(S, S, cfg.title || "Donut", cfg.desc);
    var a0 = -Math.PI / 2;
    cfg.segments.forEach(function (s, i) {
      var frac = s.value / total, a1 = a0 + frac * Math.PI * 2;
      var large = frac > 0.5 ? 1 : 0;
      var p = ["M", cx + r * Math.cos(a0), cy + r * Math.sin(a0),
        "A", r, r, 0, large, 1, cx + r * Math.cos(a1), cy + r * Math.sin(a1),
        "L", cx + ir * Math.cos(a1), cy + ir * Math.sin(a1),
        "A", ir, ir, 0, large, 0, cx + ir * Math.cos(a0), cy + ir * Math.sin(a0), "Z"].join(" ");
      var path = el("path", { d: p, fill: s.color || sColor(i), stroke: "var(--surface-1)", "stroke-width": 2, class: "viz-bar" });
      path.addEventListener("mousemove", function (evt) {
        showTip('<span class="tt-dot" style="background:' + (s.color || sColor(i)) + '"></span>' + s.label + ': <b>' +
          (cfg.valFmt ? cfg.valFmt(s.value) : s.value) + '</b> (' + (frac * 100).toFixed(0) + '%)', evt.clientX, evt.clientY);
      });
      path.addEventListener("mouseleave", hideTip);
      svg.appendChild(path);
      a0 = a1;
    });
    if (cfg.centerValue) {
      var cv = el("text", { x: cx, y: cy - 2, class: "viz-donut-center", "text-anchor": "middle" });
      cv.textContent = cfg.centerValue; svg.appendChild(cv);
      var cl = el("text", { x: cx, y: cy + 18, class: "viz-axis", "text-anchor": "middle" });
      cl.textContent = cfg.centerLabel || ""; svg.appendChild(cl);
    }
    return svg;
  };

  /* Legend helper (returns DOM) */
  C.legend = function (items) {
    var wrap = document.createElement("div");
    wrap.className = "viz-legend";
    items.forEach(function (it) {
      var s = document.createElement("span");
      s.className = "viz-legend-item";
      s.innerHTML = '<span class="viz-legend-dot" style="background:' + it.color + '"></span>' + it.label;
      wrap.appendChild(s);
    });
    return wrap;
  };

})(window.EV = window.EV || {});
