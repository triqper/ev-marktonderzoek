"use client";

import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { KpiCard } from "@/components/kpi-card";

export function HeroSection() {
  return (
    <section id="samenvatting" className="scroll-mt-20 border-b border-border bg-gradient-to-b from-primary/5 to-transparent py-16 sm:py-24">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Badge variant="outline" className="mb-4 gap-1.5 border-primary/30 text-primary">
            <Zap className="h-3 w-3" /> Strategisch validatiedossier — directieniveau
          </Badge>
          <h1 className="max-w-4xl text-3xl font-bold tracking-tight sm:text-5xl">
            Laden en betalen in de bank-app: kansrijk, maar nog niet bewezen
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            Een geïntegreerde EV-laad- en betaaloplossing in de mobiele bankieren-app kent een
            reële markt en een logische strategische invalshoek — maar de kernaanname dat klanten
            dit ook daadwerkelijk willen, is vandaag onbewezen. Dit dashboard onderbouwt het
            advies: <strong className="text-foreground">eerst valideren, dan pas bouwen.</strong>
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <a href="#businesscase">
                Bekijk de businesscase <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#validatie">Naar het validatiedossier</a>
            </Button>
          </div>
        </motion.div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <KpiCard
            label="NL publieke laadpunten"
            value="210.000"
            type="FEIT"
            sublabel="RVO.nl, 2026"
            tooltip="data_asof: juli 2026 — RVO, Stand van zaken elektrisch vervoer en laadpunten. Uitsplitsing: ~119.000 regulier publiek, ~80.000 semi-publiek, ~6.000 snelladers."
          />
          <KpiCard
            label="NL BEV-park"
            value="701.149"
            type="FEIT"
            sublabel="RVO.nl, 2026"
            tooltip="data_asof: juli 2026 — RVO. Daarnaast 543.355 PHEV's (FEIT, RVO): totaal stekkerpark ~1.244.500."
          />
          <KpiCard
            label="Geschat NL transactievolume"
            value="~60-100 mln/jaar"
            type="SCHATTING"
            sublabel="midden ~80 mln, ±25%"
            tooltip="data_asof: juli 2026 — laadpunt-gebaseerd model (niet BEV/PHEV-specifiek), zie data/market-data.json. Kalibratie: Vattenfall InCharge ~8 mln sessies/jr bij één CPO (2025)."
          />
          <KpiCard
            label="Omzetpotentieel bank (5% aandeel, EMSP-model)"
            value="€1,5-7,5 mln/jr"
            type="SCHATTING"
            sublabel="Zie interactieve scenario's"
            tooltip="data_asof: juli 2026 — doorgerekend over T_totaal 60-100 mln en EMSP-marge 5-15%. Werkelijke jaaromzet kan factor 3-5 afwijken van de middenwaarde."
          />
        </div>
      </div>
    </section>
  );
}
