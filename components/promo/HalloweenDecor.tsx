import { clsx } from "clsx";

/** Adornos de Halloween en SVG: puramente decorativos, ocultos a lectores de pantalla. */

const BAT_PATH =
  "M32 8c2-4 4-6 4-6l1 5c3 0 6 2 8 5 4-6 12-8 19-6-5 2-8 6-9 11-3-2-7-2-9 1-2-3-5-3-7 0-1-2-4-3-7-3s-6 1-7 3c-2-3-5-3-7 0-2-3-6-3-9-1C11 13 8 9 3 7c7-2 15 0 19 6 2-3 5-5 8-5l1-5s2 2 4 6z";

export function Bat({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <svg
      viewBox="0 0 64 30"
      aria-hidden="true"
      className={clsx("pointer-events-none absolute motion-safe:animate-bat", className)}
      style={{ animationDelay: `${delay}s` }}
    >
      <path d={BAT_PATH} fill="currentColor" />
    </svg>
  );
}

export function Pumpkin({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 56" aria-hidden="true" className={clsx("pointer-events-none absolute", className)}>
      <path d="M30 10c0-5 2-8 6-9l2 3c-3 1-4 3-4 6z" fill="#3F6B1F" />
      <ellipse cx="20" cy="33" rx="16" ry="20" fill="#E85D04" />
      <ellipse cx="44" cy="33" rx="16" ry="20" fill="#E85D04" />
      <ellipse cx="32" cy="33" rx="15" ry="21" fill="#FF7A1A" />
      <path d="M21 27l6 5h-8zM43 27l2 5h-8z" fill="#2A1100" />
      <path d="M20 40c4 5 20 5 24 0l-3 1-2 3-3-3-4 3-3-3-3 3-2-3z" fill="#2A1100" />
    </svg>
  );
}

export function Cobweb({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" className={clsx("pointer-events-none absolute", className)}>
      <g fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M0 0L120 44M0 0L88 88M0 0L44 120" />
        <path d="M30 11Q24 24 11 30M60 22Q46 46 22 60M90 33Q68 68 33 90" />
      </g>
    </svg>
  );
}

export function Moon({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={clsx(
        "pointer-events-none absolute rounded-full bg-moon shadow-[0_0_80px_24px_rgba(245,230,200,0.22)]",
        className
      )}
    />
  );
}
