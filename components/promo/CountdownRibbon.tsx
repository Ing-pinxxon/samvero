"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Countdown, { useCountdown } from "./Countdown";

/** Cinta bajo el menú: "Las ofertas de Halloween terminan en…". Desaparece al llegar a cero. */
export default function CountdownRibbon({ endsAt }: { endsAt: string }) {
  const parts = useCountdown(endsAt);
  if (parts === null) return null;

  return (
    <div className="countdown-ribbon relative overflow-hidden bg-gradient-to-r from-navy via-[#1f2f55] to-witch text-white">
      <div className="container-page flex flex-wrap items-center justify-center gap-x-4 gap-y-2 py-2.5 sm:justify-between">
        <p className="text-sm font-bold">🎃 Las ofertas de Halloween terminan en</p>
        <div className="flex items-center gap-4">
          <Countdown endsAt={endsAt} />
          <Link
            href="/ofertas"
            className="hidden items-center gap-1 rounded-lg bg-brand px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-brand-600 sm:inline-flex"
          >
            Ver ofertas <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
