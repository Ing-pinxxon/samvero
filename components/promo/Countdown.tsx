"use client";

import { useEffect, useState } from "react";
import { clsx } from "clsx";

type Parts = { days: number; hours: number; minutes: number; seconds: number };

function partsUntil(endsAt: number): Parts | null {
  const ms = endsAt - Date.now();
  if (ms <= 0) return null;
  return {
    days: Math.floor(ms / 864e5),
    hours: Math.floor(ms / 36e5) % 24,
    minutes: Math.floor(ms / 6e4) % 60,
    seconds: Math.floor(ms / 1e3) % 60,
  };
}

/**
 * Cuenta regresiva hasta `endsAt`. Devuelve `undefined` antes de montar (el
 * servidor y el navegador no comparten reloj, así que no se renderiza la hora
 * en el servidor) y `null` cuando la fecha ya pasó.
 */
export function useCountdown(endsAt: string): Parts | null | undefined {
  const [parts, setParts] = useState<Parts | null | undefined>(undefined);
  useEffect(() => {
    const end = new Date(endsAt).getTime();
    const tick = () => setParts(partsUntil(end));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endsAt]);
  return parts;
}

const two = (n: number) => String(n).padStart(2, "0");

/** Casillas dd/hh/mm/ss. Se oculta sola cuando la promoción termina. */
export default function Countdown({
  endsAt,
  variant = "light",
  className,
}: {
  endsAt: string;
  variant?: "light" | "dark";
  className?: string;
}) {
  const parts = useCountdown(endsAt);
  if (parts === null) return null;

  const cells: [string, number | undefined][] = [
    ["días", parts?.days],
    ["h", parts?.hours],
    ["min", parts?.minutes],
    ["s", parts?.seconds],
  ];

  return (
    <span
      role="timer"
      aria-label={
        parts
          ? `Termina en ${parts.days} días, ${parts.hours} horas y ${parts.minutes} minutos`
          : "Cuenta regresiva"
      }
      className={clsx("inline-flex gap-1.5 tabular-nums", className)}
    >
      {cells.map(([label, value]) => (
        <span
          key={label}
          aria-hidden="true"
          className={clsx(
            "inline-flex min-w-[2.6rem] flex-col items-center rounded-lg px-1.5 py-1 leading-none",
            variant === "light" ? "bg-white text-navy" : "bg-navy text-white"
          )}
        >
          <span className="text-base font-extrabold">{value === undefined ? "--" : two(value)}</span>
          <span className="mt-0.5 text-[9px] font-semibold uppercase opacity-60">{label}</span>
        </span>
      ))}
    </span>
  );
}
