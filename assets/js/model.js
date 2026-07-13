/* ============================================================================
   EV Charging Revenue Model — REKENKERN / MODEL ENGINE
   Driver-based, fully reproducible. Alle omzetcijfers worden hier berekend en
   nergens anders hard ingetypt. Zie docs/METHODOLOGIE.md voor de formules.

   Driver tree per markt (g ∈ {NL, EU}) en jaar y:
     fleet            = MARKET.fleet[g][y] × scenario.fleetMult
     publicKwh        = fleet × publicKwhPerBev[g][y]
     marketGMV        = publicKwh × pricePerKwh[g][y]
     sessions         = publicKwh / avgSessionKwh[g]
     processedSessions= sessions × ourShare[g][y]
     processedGMV     = marketGMV × ourShare[g][y]
     txnRevenue       = processedGMV × takeRate + processedSessions × feePerTxn
     platformRevenue  = chargePoints × platformPointsShare × platformRevPerPoint (NL)
     issuingRevenue   = fleetAccounts × interchangePerAccount
     revenue          = txnRevenue + platformRevenue + issuingRevenue
     ebitda           = revenue × ebitdaMargin[y]
   ============================================================================ */
(function (EV) {
  "use strict";

  function pick(obj, y) { return obj[y]; }

  /* Bereken één markt-segment voor één jaar */
  function segment(g, y, p, overrides) {
    var M = EV.MARKET;
    var o = overrides || {};
    var fleetMult = o.fleetMult != null ? o.fleetMult : p.fleetMult;
    var fleet = M.fleet[g][y] * fleetMult;
    var kwhPerBev = M.publicKwhPerBev[g][y] * (o.kwhMult != null ? o.kwhMult : 1);
    var price = M.pricePerKwh[g][y] * (o.priceMult != null ? o.priceMult : 1);
    var publicKwh = fleet * kwhPerBev;
    var marketGMV = publicKwh * price;
    var sessions = publicKwh / M.avgSessionKwh[g];

    var shareTable = g === "NL" ? p.shareNL : p.shareEU;
    var share = pick(shareTable, y) * (o.shareMult != null ? o.shareMult : 1);
    var processedSessions = sessions * share;
    var processedGMV = marketGMV * share;

    var takeRate = (o.takeRate != null ? o.takeRate : p.takeRate);
    var feePerTxn = (o.feePerTxn != null ? o.feePerTxn : p.feePerTxn);
    var txnRevenue = processedGMV * takeRate + processedSessions * feePerTxn;

    return {
      fleet: fleet, marketGMV: marketGMV, sessions: sessions, share: share,
      processedSessions: processedSessions, processedGMV: processedGMV,
      txnRevenue: txnRevenue
    };
  }

  /* Volledig model voor een scenario. overrides = optionele multipliers voor
     Monte Carlo / gevoeligheid (fleetMult, kwhMult, priceMult, shareMult,
     takeRate, feePerTxn, interchangeMult, platformMult). */
  EV.computeModel = function (scenarioKey, overrides) {
    var p = EV.SCENARIOS[scenarioKey];
    var o = overrides || {};
    var rows = EV.YEARS.map(function (y) {
      var nl = segment("NL", y, p, o);
      var eu = segment("EU", y, p, o);

      var platformNL = EV.MARKET.chargePoints.NL[y] * pick(p.platformPointsShareNL, y) *
        p.platformRevPerPoint * (o.platformMult != null ? o.platformMult : 1);

      var issuing = pick(p.fleetAccounts, y) * p.interchangePerAccount *
        (o.interchangeMult != null ? o.interchangeMult : 1);

      var txnRevenue = nl.txnRevenue + eu.txnRevenue;
      var revenue = txnRevenue + platformNL + issuing;
      var ebitda = revenue * pick(p.ebitdaMargin, y);

      // Gebruikers: actieve laadaccounts (consument) + fleet-accounts.
      // Benadering: verwerkte sessies / gem. sessies per actieve gebruiker per jaar (~70).
      var consumerUsers = (nl.processedSessions + eu.processedSessions) / 70;
      var users = consumerUsers + pick(p.fleetAccounts, y);

      return {
        year: y,
        fleet: nl.fleet + eu.fleet,
        fleetNL: nl.fleet, fleetEU: eu.fleet,
        marketGMV: nl.marketGMV + eu.marketGMV,
        processedGMV: nl.processedGMV + eu.processedGMV,
        sessions: nl.sessions + eu.sessions,
        processedSessions: nl.processedSessions + eu.processedSessions,
        shareNL: nl.share, shareEU: eu.share,
        users: users,
        rev: {
          txnNL: nl.txnRevenue,
          txnEU: eu.txnRevenue,
          platform: platformNL,
          issuing: issuing
        },
        txnRevenue: txnRevenue,
        platformRevenue: platformNL,
        issuingRevenue: issuing,
        revenue: revenue,
        ebitda: ebitda,
        ebitdaMargin: pick(p.ebitdaMargin, y)
      };
    });

    // Afgeleide totalen
    var totalRev = rows.reduce(function (a, r) { return a + r.revenue; }, 0);
    var totalEbitda = rows.reduce(function (a, r) { return a + r.ebitda; }, 0);
    var y1 = rows[0].revenue, y5 = rows[rows.length - 1].revenue;
    var cagr = y1 > 0 ? Math.pow(y5 / y1, 1 / (rows.length - 1)) - 1 : 0;

    return {
      scenario: scenarioKey,
      rows: rows,
      totalRevenue: totalRev,
      totalEbitda: totalEbitda,
      cagr: cagr,
      y5Revenue: y5,
      y5Ebitda: rows[rows.length - 1].ebitda
    };
  };

  EV.cagr = function (first, last, periods) {
    if (first <= 0) return 0;
    return Math.pow(last / first, 1 / periods) - 1;
  };

  /* Alle scenario's ineens (voor vergelijking) */
  EV.computeAll = function () {
    return {
      conservatief: EV.computeModel("conservatief"),
      basis: EV.computeModel("basis"),
      ambitieus: EV.computeModel("ambitieus")
    };
  };

})(window.EV = window.EV || {});
