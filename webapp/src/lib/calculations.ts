/**
 * Businesscase-rekenkern — dit is de enige plek waar de scenario-formules staan.
 * Identiek aan de formules in rapport/RAPPORT.md §6.1, zodat rapport en dashboard
 * nooit uit elkaar kunnen lopen.
 */

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

export const SCENARIO_DEFAULTS: ScenarioInput = {
  totaalTransacties: 95_000_000,
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
 * Vaste scenario-tabel (1% / 5% / 10%) zoals in het rapport, bij drie marge-niveaus.
 * Gebruikt dezelfde rekenkern zodat de tabel in de app altijd matcht met RAPPORT.md.
 */
export function standaardScenarios(totaalTransacties: number, gemTransactiewaarde: number) {
  const aandelen = [1, 5, 10];
  const marges = [0.5, 1.0, 1.5];
  return aandelen.map((s) => {
    const base = berekenScenario({
      totaalTransacties,
      marktaandeelPct: s,
      gemTransactiewaarde,
      margePct: 1,
    });
    return {
      marktaandeelPct: s,
      transactiesBank: base.transactiesBank,
      tpv: base.tpv,
      omzetPerMarge: marges.map((m) => ({
        margePct: m,
        omzet: base.tpv * (m / 100),
      })),
    };
  });
}
