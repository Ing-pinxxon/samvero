import type { CSSProperties } from "react";
import { clsx } from "clsx";

/**
 * Ilustraciones de Halloween en SVG. Todas son decorativas (aria-hidden) y sus
 * animaciones viven en app/halloween.css, siempre bajo prefers-reduced-motion.
 */

const BAT_PATH =
  "M32 8c2-4 4-6 4-6l1 5c3 0 6 2 8 5 4-6 12-8 19-6-5 2-8 6-9 11-3-2-7-2-9 1-2-3-5-3-7 0-1-2-4-3-7-3s-6 1-7 3c-2-3-5-3-7 0-2-3-6-3-9-1C11 13 8 9 3 7c7-2 15 0 19 6 2-3 5-5 8-5l1-5s2 2 4 6z";

export function Bat({
  className,
  delay = 0,
  style,
}: {
  className?: string;
  delay?: number;
  style?: CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 64 30"
      aria-hidden="true"
      className={clsx("hw-flap pointer-events-none absolute", className)}
      style={{ animationDelay: `${delay}s`, ...style }}
    >
      <path d={BAT_PATH} fill="currentColor" />
    </svg>
  );
}

/** Murciélagos que salen volando desde un punto (la luna) hacia afuera. */
export function BatSwarm({ className }: { className?: string }) {
  const bats = [
    { dx: "-520px", dy: "-60px", d: 0, s: 1 },
    { dx: "-380px", dy: "120px", d: 1.6, s: 0.8 },
    { dx: "-640px", dy: "40px", d: 3.1, s: 1.15 },
    { dx: "-260px", dy: "-120px", d: 4.4, s: 0.7 },
    { dx: "-460px", dy: "200px", d: 5.8, s: 0.9 },
    { dx: "-720px", dy: "-20px", d: 7.2, s: 1.05 },
  ];
  return (
    <div aria-hidden="true" className={clsx("pointer-events-none absolute", className)}>
      {bats.map((b, i) => (
        <span
          key={i}
          className="hw-bat-escape absolute left-0 top-0 block"
          style={
            {
              "--dx": b.dx,
              "--dy": b.dy,
              "--s": b.s,
              animationDelay: `${b.d}s`,
            } as CSSProperties
          }
        >
          <svg viewBox="0 0 64 30" className="hw-flap block w-12 text-[#05070f]">
            <path d={BAT_PATH} fill="currentColor" />
          </svg>
        </span>
      ))}
    </div>
  );
}

export function Pumpkin({ className, lit = true }: { className?: string; lit?: boolean }) {
  return (
    <svg viewBox="0 0 64 56" aria-hidden="true" className={clsx("pointer-events-none", className)}>
      <defs>
        <radialGradient id="hw-pumpkin-body" cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#FFA24D" />
          <stop offset=".6" stopColor="#F26A0C" />
          <stop offset="1" stopColor="#B84300" />
        </radialGradient>
      </defs>
      <path d="M30 10c0-5 2-8 6-9l2 3c-3 1-4 3-4 6z" fill="#3F6B1F" />
      <path d="M36 6c5-4 11-3 13 0-5 0-8 1-11 4z" fill="#5C8F2B" />
      <ellipse cx="19" cy="33" rx="16" ry="20" fill="url(#hw-pumpkin-body)" />
      <ellipse cx="45" cy="33" rx="16" ry="20" fill="url(#hw-pumpkin-body)" />
      <ellipse cx="32" cy="33" rx="15" ry="21" fill="url(#hw-pumpkin-body)" />
      <path d="M32 13v40M22 15q-6 18 0 36M42 15q6 18 0 36" stroke="#B84300" strokeOpacity=".35" fill="none" />
      <g className={lit ? "hw-candle" : undefined} fill={lit ? "#FFD27A" : "#2A1100"}>
        <path d="M18 27l8 6H16zM46 27l2 6h-10z" />
        <path d="M18 40c5 6 23 6 28 0l-4 1-2 4-4-3-4 4-4-4-4 3-2-4z" />
      </g>
    </svg>
  );
}

export function Ghost({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 40 50" aria-hidden="true" className={clsx("pointer-events-none", className)} style={style}>
      <path
        d="M20 2C9 2 2 11 2 22v26l6-5 6 5 6-5 6 5 6-5 6 5V22C38 11 31 2 20 2z"
        fill="#F4EEFF"
        fillOpacity=".92"
      />
      <ellipse cx="14" cy="20" rx="3" ry="4.2" fill="#1b1430" />
      <ellipse cx="26" cy="20" rx="3" ry="4.2" fill="#1b1430" />
      <ellipse cx="20" cy="31" rx="4" ry="5" fill="#1b1430" />
    </svg>
  );
}

export function Spider({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={clsx("hw-spider pointer-events-none flex-col items-center", className)}>
      <span className="hw-spider-thread" />
      <svg viewBox="0 0 40 34" className="hw-spider-body">
        <g stroke="#0b0b12" strokeWidth="2.2" fill="none" strokeLinecap="round">
          <path d="M14 15L4 6M14 18L2 16M14 21L4 28M15 23L8 33" />
          <path d="M26 15l10-9M26 18l12-2M26 21l10 7M25 23l7 10" />
        </g>
        <ellipse cx="20" cy="19" rx="8" ry="9" fill="#0b0b12" />
        <circle cx="20" cy="9" r="5" fill="#0b0b12" />
        <circle cx="18" cy="8.5" r="1.2" fill="#FF6A00" />
        <circle cx="22" cy="8.5" r="1.2" fill="#FF6A00" />
      </svg>
    </div>
  );
}

export function Cobweb({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" className={clsx("pointer-events-none absolute", className)}>
      <g fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M0 0L120 44M0 0L88 88M0 0L44 120M0 0L120 10M0 0L10 120" />
        <path d="M24 9Q19 19 9 24M48 18Q37 37 18 48M72 26Q54 54 26 72M96 35Q71 71 35 96" />
      </g>
    </svg>
  );
}

/** Luna llena con cráteres y halo. */
export function Moon({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={clsx("hw-moon pointer-events-none absolute rounded-full", className)} />
  );
}

/** Bruja en escoba (silueta) cruzando el cielo. */
export function Witch({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 50" aria-hidden="true" className={clsx("pointer-events-none", className)}>
      <g fill="#05070f">
        <path d="M6 36L86 26l1 3-80 10z" />
        <path d="M80 22l18-8 2 26-20-8z" />
        <path d="M40 30l-6-16h12l8 14z" />
        <path d="M36 16l-18 6 14 4z" />
        <circle cx="41" cy="12" r="5" />
        <path d="M32 9h18l-1 2H33z" />
        <path d="M36 9l10-14 1 14z" />
        <path d="M46 30l6 8-3 1-6-7z" />
      </g>
    </svg>
  );
}

// --- Baba que chorrea (divisor bajo el banner) ---------------------------
const DRIPS: [number, number, number][] = [
  [70, 26, 22], [180, 48, 26], [260, 18, 16], [390, 62, 30], [520, 30, 20],
  [610, 44, 24], [760, 22, 18], [860, 70, 32], [990, 34, 22], [1100, 52, 26],
  [1210, 20, 16], [1320, 58, 28], [1400, 28, 18],
];

function dripPath() {
  const base = 14;
  let d = `M0 0H1440V${base}`;
  for (const [cx, len, w] of [...DRIPS].sort((a, b) => b[0] - a[0])) {
    const r = cx + w / 2;
    const l = cx - w / 2;
    const y = base + len;
    d += `L${r} ${base}C${r} ${base + len * 0.6} ${r} ${y} ${cx} ${y}C${l} ${y} ${l} ${base + len * 0.6} ${l} ${base}`;
  }
  return `${d}L0 ${base}Z`;
}

export function SlimeDrip({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={clsx("pointer-events-none relative -mt-px", className)}>
      <svg viewBox="0 0 1440 90" preserveAspectRatio="none" className="block h-12 w-full sm:h-16">
        <defs>
          <linearGradient id="hw-slime" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#FF6A00" />
            <stop offset="1" stopColor="#FF9A3D" />
          </linearGradient>
        </defs>
        <path d={dripPath()} fill="url(#hw-slime)" />
        {DRIPS.filter((_, i) => i % 3 === 1).map(([cx, len], i) => (
          <circle
            key={cx}
            className="hw-drop"
            cx={cx}
            cy={14 + len + 6}
            r="5"
            fill="#FF8A2B"
            style={{ animationDelay: `${i * 0.9}s` }}
          />
        ))}
      </svg>
    </div>
  );
}

// --- Horizonte embrujado: cementerio, árbol seco, reja y casa ------------
function tomb(x: number, w: number, h: number, g: number) {
  const r = w / 2;
  return `M${x} ${g}V${g - h + r}A${r} ${r} 0 0 1 ${x + w} ${g - h + r}V${g}Z`;
}

const TOMBS: [number, number, number][] = [
  [110, 34, 46], [176, 26, 34], [236, 38, 54], [520, 30, 40], [586, 40, 58], [660, 28, 36], [760, 34, 44],
];
const CROSSES = [300, 700];
const FENCE = Array.from({ length: 13 }, (_, i) => 880 + i * 16);
const WINDOWS: [number, number, number, number][] = [
  [1172, 140, 18, 22], [1214, 140, 18, 22], [1256, 140, 18, 22], [1300, 92, 14, 20], [1300, 132, 14, 20],
];

export function HauntedSkyline({ className, fill = "#05070f" }: { className?: string; fill?: string }) {
  const g = 214;
  return (
    <svg
      viewBox="0 0 1440 240"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      className={clsx("pointer-events-none block w-full", className)}
    >
      <g fill={fill}>
        <path d="M0 206Q240 176 480 198T960 192T1440 202V240H0z" />
        {TOMBS.map(([x, w, h]) => (
          <path key={x} d={tomb(x, w, h, g)} />
        ))}
        {CROSSES.map((x) => (
          <g key={x}>
            <rect x={x} y={g - 52} width="8" height="52" />
            <rect x={x - 12} y={g - 40} width="32" height="8" />
          </g>
        ))}
        {/* árbol seco */}
        <path d="M372 214l10-80-4-30 9 28 3-40 6 44 14-30-8 40 4 68z" />
        <g stroke={fill} strokeLinecap="round" fill="none">
          <path d="M386 120q-30-20-52-14M384 140q-40 0-60 18M392 100q10-30 34-40M398 128q30-10 56 6M380 108q-16-30-8-56" strokeWidth="5" />
          <path d="M334 106q-8-10-4-22M454 134q12-4 18-16M426 60q8-8 20-6" strokeWidth="3" />
        </g>
        {/* reja */}
        {FENCE.map((x) => (
          <path key={x} d={`M${x} ${g}V${g - 34}l3-8 3 8V${g}z`} />
        ))}
        <rect x="876" y={g - 26} width="210" height="4" />
        {/* casa embrujada */}
        <rect x="1150" y="120" width="140" height="94" />
        <path d="M1136 124l84-62 84 62z" />
        <rect x="1288" y="70" width="40" height="144" />
        <path d="M1280 74l28-56 28 56z" />
        <rect x="1176" y="70" width="14" height="30" />
        <path d="M1206 214v-32a12 12 0 0 1 24 0v32z" fill="#140d24" />
      </g>
      <g fill="#FFB347">
        {WINDOWS.map(([x, y, w, h], i) => (
          <rect key={x + y} className="hw-window" x={x} y={y} width={w} height={h} rx="2" style={{ animationDelay: `${i * 0.7}s` }} />
        ))}
      </g>
    </svg>
  );
}
