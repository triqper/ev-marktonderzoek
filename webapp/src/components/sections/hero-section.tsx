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
          <KpiCard label="NL publieke laadpunten" value="210.000" type="FEIT" sublabel="RVO.nl, 2026" />
          <KpiCard label="NL BEV-park" value="701.149" type="FEIT" sublabel="RVO.nl, 2026" />
          <KpiCard
            label="Geschat NL transactievolume"
            value="~95 mln/jaar"
            type="SCHATTING"
            sublabel="±25% foutmarge"
          />
          <KpiCard
            label="Omzetpotentieel bank (5% aandeel, EMSP-model)"
            value="€2,4-7,1 mln/jr"
            type="SCHATTING"
            sublabel="Zie interactieve scenario's"
          />
        </div>
      </div>
    </section>
  );
}
