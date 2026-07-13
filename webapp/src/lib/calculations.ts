/**
 * Businesscase-rekenkern — dit is de enige plek waar de scenario-formules staan.
 * Identiek aan de formules in rapport/RAPPORT.md §6.1, zodat rapport en dashboard
 * nooit uit elkaar kunnen lopen.
 */

/**
 * Totaal NL publieke laadtransacties per jaar (T_totaal) als bandbreedte i.p.v.
 * puntschatting. Onderbouwing: bottom-up check op basis van ~205.000 publieke
 * punten × gemiddelde sessiefrequentie geeft 60-100 mln; 95 mln (het eerdere
 * middenscenario) zit aan de bovenkant van deze range, vandaar midden = 80 mln.
 * Externe kalibratiecheck: Vattenfall InCharge rapporteert ~8 mln publieke
 * sessies/jaar bij één CPO (2025, +68% YoY).
 *
 * Let op: dit transactiemodel is laadpunt-gebaseerd (aantal publieke laadpunten
 * × sessiefrequentie), niet afgeleid van het BEV- of PHEV-park. Het maakt dus
 * geen expliciet onderscheid tussen BEV- en PHEV-laadgedrag; PHEV's laden
 * gemiddeld minder frequent publiek dan BEV's. Zie data/market-data.json
 * (transacties_en_omzet.publieke_transacties_per_jaar) voor de volledige methode.
 */
export const T_TOTAAL = {
  low: 60_000_000,
  mid: 80_000_000,
  high: 100_000_000,
} as const;

export interface ScenarioInput {
  /** Totaal aantal NL publieke laadtransacties per jaar (T_totaal) */
  totaalTransacties: number;
  /** Marktaandeel bank, 0-100 (s) */
  marktaandeelPct: number;
  /** Gemiddelde transactiewaarde in euro (v) */
  gemTransactiewaarde: number;
  /** Take-rate / marge bank, 0-100 (m) */
  margePct: number;
}

export interface ScenarioOutput {
  transactiesBank: number;
  tpv: number;
  omzetBank: number;
}

export function berekenScenario(input: ScenarioInput): ScenarioOutput {
  const s = input.marktaandeelPct / 100;
  const m = input.margePct / 100;

  const transactiesBank = input.totaalTransacties * s;
  const tpv = transactiesBank * input.gemTransactiewaarde;
  const omzetBank = tpv * m;

  return { transactiesBank, tpv, omzetBank };
}

/**
 * Rekent hetzelfde scenario door voor de lage, midden- en hoge T_totaal-waarde,
 * zodat de UI overal laag/midden/hoog kan tonen i.p.v. één puntschatting.
 * `volumeFactor` schaalt alle drie de waarden mee (adoptiegraad/laadfrequentie).
 */
export function berekenScenarioRange(
  input: Omit<ScenarioInput, "totaalTransacties">,
  volumeFactor = 1
): { low: ScenarioOutput; mid: ScenarioOutput; high: ScenarioOutput } {
  const doorrekenen = (totaal: number) =>
    berekenScenario({ ...input, totaalTransacties: totaal * volumeFactor });
  return {
    low: doorrekenen(T_TOTAAL.low),
    mid: doorrekenen(T_TOTAAL.mid),
    high: doorrekenen(T_TOTAAL.high),
  };
}

export const SCENARIO_DEFAULTS: ScenarioInput = {
  totaalTransacties: T_TOTAAL.mid,
  marktaandeelPct: 5,
  gemTransactiewaarde: 10,
  margePct: 1,
};

export const SCENARIO_BOUNDS = {
  marktaandeelPct: { min: 0.5, max: 15, step: 0.5 },
  gemTransactiewaarde: { min: 5, max: 30, step: 0.5 },
  margePct: { min: 0.25, max: 15, step: 0.25 },
  adoptiegraadPct: { min: 5, max: 60, step: 1 },
  laadfrequentiePerMaand: { min: 1, max: 15, step: 0.5 },
};

/**
 * Vaste scenario-tabel (1% / 5% / 10%) zoals in het rapport, bij drie marge-niveaus
 * en telkens de laag/midden/hoog-bandbreedte van T_totaal.
 * Gebruikt dezelfde rekenkern zodat de tabel in de app altijd matcht met RAPPORT.md.
 */
export function standaardScenarios(gemTransactiewaarde: number, volumeFactor = 1) {
  const aandelen = [1, 5, 10];
  const marges = [0.5, 1.0, 1.5];
  return aandelen.map((s) => {
    const range = berekenScenarioRange(
      { marktaandeelPct: s, gemTransactiewaarde, margePct: 1 },
      volumeFactor
    );
    return {
      marktaandeelPct: s,
      transactiesBank: { low: range.low.transactiesBank, mid: range.mid.transactiesBank, high: range.high.transactiesBank },
      tpv: { low: range.low.tpv, mid: range.mid.tpv, high: range.high.tpv },
      omzetPerMarge: marges.map((m) => ({
        margePct: m,
        omzet: {
          low: range.low.tpv * (m / 100),
          mid: range.mid.tpv * (m / 100),
          high: range.high.tpv * (m / 100),
        },
      })),
    };
  });
}
