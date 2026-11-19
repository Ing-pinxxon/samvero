"use client";

import { useEffect, useState } from "react";
import { clsx } from "clsx";
import { Ghost, Pumpkin } from "./HalloweenDecor";

/** Calabaza del banner: al tocarla tiembla y sale un fantasma diciendo "¡Buu!". */
export default function BooPumpkin({ className }: { className?: string }) {
  const [boo, setBoo] = useState(0);

  useEffect(() => {
    if (!boo) return;
    const id = setTimeout(() => setBoo(0), 2600);
    return () => clearTimeout(id);
  }, [boo]);

  return (
    <div className={clsx("absolute", className)}>
      <button
        type="button"
        onClick={() => setBoo((n) => n + 1)}
        aria-label="Toca la calabaza"
        className={clsx(
          "hw-pumpkin-btn block rounded-full focus:outline-none focus-visible:ring-4 focus-visible:ring-brand/60",
          boo && "hw-shake"
        )}
      >
        <Pumpkin className="w-24 drop-shadow-[0_0_28px_rgba(255,140,40,0.55)] sm:w-28" />
      </button>
      {boo > 0 && (
        <div key={boo} className="hw-boo hw-light pointer-events-none absolute -top-24 left-0 flex flex-col items-start">
          <span
            role="status"
            className="whitespace-nowrap rounded-2xl bg-white px-3 py-1.5 text-sm font-bold text-navy shadow-lg"
          >
            ¡Buu! 👻 Corre a las ofertas
          </span>
          <Ghost className="ml-6 mt-1 w-12" />
        </div>
      )}
    </div>
  );
}
