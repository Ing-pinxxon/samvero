"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { clsx } from "clsx";
import Countdown, { useCountdown } from "./Countdown";
import type { Campaign } from "@/lib/season";

const STYLES: Record<Campaign["id"], string> = {
  halloween: "bg-gradient-to-r from-navy via-[#1f2f55] to-witch",
  navidad: "bg-gradient-to-r from-[#0b2a1a] via-[#123f28] to-[#7a1020]",
  blackfriday: "bg-black",
};

/** Cinta bajo el menú: "Las ofertas de {campaña} terminan en…". Desaparece al llegar a cero. */
export default function CountdownRibbon({ campaign }: { campaign: Campaign }) {
  const parts = useCountdown(campaign.endsAt);
  if (parts === null) return null;
  const bf = campaign.id === "blackfriday";

  return (
    <div className={clsx("countdown-ribbon relative overflow-hidden text-white", STYLES[campaign.id])}>
      <div className="container-page flex flex-wrap items-center justify-center gap-x-4 gap-y-2 py-2.5 sm:justify-between">
        <p className={clsx("text-sm font-bold", bf && "uppercase tracking-wider text-[#FFD23F]")}>
          {campaign.emoji} {bf ? "El Black Friday termina en" : `Las ofertas de ${campaign.name} terminan en`}
        </p>
        <div className="flex items-center gap-4">
          <Countdown endsAt={campaign.endsAt} />
          <Link
            href="/ofertas"
            className={clsx(
              "hidden items-center gap-1 rounded-lg px-3 py-2 text-xs font-bold transition-colors sm:inline-flex",
              bf ? "bg-[#FFD23F] text-black hover:bg-[#ffe066]" : "bg-brand text-white hover:bg-brand-600"
            )}
          >
            Ver ofertas <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
