"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { clsx } from "clsx";
import { BULBS, GiftBox } from "./NavidadDecor";

const CONFETTI = Array.from({ length: 18 }, (_, i) => ({
  angle: (i / 18) * 360,
  dist: 60 + ((i * 13) % 50),
  color: BULBS[i % BULBS.length],
}));

/** Regalo del banner: al tocarlo se abre, lanza confeti y saluda. */
export default function GiftSurprise({ className, message }: { className?: string; message: string }) {
  const [open, setOpen] = useState(0);

  useEffect(() => {
    if (!open) return;
    const id = setTimeout(() => setOpen(0), 3000);
    return () => clearTimeout(id);
  }, [open]);

  return (
    <div className={clsx("absolute", className)}>
      <button
        type="button"
        onClick={() => setOpen((n) => n + 1)}
        aria-label="Abre el regalo"
        className={clsx(
          "nv-gift-btn relative block rounded-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-brand/60",
          open && "hw-shake"
        )}
      >
        <GiftBox open={open > 0} className="w-20 drop-shadow-[0_0_24px_rgba(255,210,63,0.55)] sm:w-24" />
        {open > 0 && (
          <span key={open} aria-hidden="true" className="absolute left-1/2 top-1/3">
            {CONFETTI.map((c, i) => (
              <span
                key={i}
                className="nv-confetti"
                style={
                  {
                    "--a": `${c.angle}deg`,
                    "--d": `${c.dist}px`,
                    background: c.color,
                  } as CSSProperties
                }
              />
            ))}
          </span>
        )}
      </button>
      {open > 0 && (
        <div key={`m${open}`} className="hw-boo hw-light pointer-events-none absolute -top-14 left-0">
          <span
            role="status"
            className="whitespace-nowrap rounded-2xl bg-white px-3 py-1.5 text-sm font-bold text-navy shadow-lg"
          >
            {message}
          </span>
        </div>
      )}
    </div>
  );
}
