import type { CSSProperties } from "react";
import { clsx } from "clsx";

/**
 * Ilustraciones de Navidad (estilo colombiano: alumbrados, velitas, pueblo
 * con iglesia y palma de cera). Todas decorativas (aria-hidden); sus
 * animaciones viven en app/navidad.css bajo prefers-reduced-motion.
 */

/** Colores de los bombillos de alumbrado. */
export const BULBS = ["#FF3B3B", "#FFD23F", "#2BD67B", "#3EC1FF", "#FF5FD0", "#FF8A00"];

type Pt = [number, number];
function quad(p0: Pt, p1: Pt, p2: Pt, n: number): Pt[] {
  return Array.from({ length: n }, (_, i) => {
    const t = (i + 0.5) / n;
    const a = (1 - t) ** 2, b = 2 * (1 - t) * t, c = t ** 2;
    return [a * p0[0] + b * p1[0] + c * p2[0], a * p0[1] + b * p1[1] + c * p2[1]];
  });
}

// --- Guirnalda de bombillos (divisor) -------------------------------------
export function LightGarland({ count = 20, className }: { count?: number; className?: string }) {
  const seg = 100;
  let wire = "M0 4";
  for (let i = 0; i < count - 1; i++) wire += ` Q${i * seg + seg / 2} 34 ${(i + 1) * seg} 4`;
  return (
    <div aria-hidden="true" className={clsx("pointer-events-none relative h-9 overflow-x-clip px-1", className)}>
      <svg
        viewBox={`0 0 ${(count - 1) * seg} 40`}
        preserveAspectRatio="none"
        className="absolute left-[7px] right-[7px] top-0 h-5 w-[calc(100%-14px)]"
      >
        <path d={wire} fill="none" stroke="#0f2a1a" strokeWidth="3" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="relative flex justify-between">
        {Array.from({ length: count }, (_, i) => (
          <span
            key={i}
            className="hw-bulb"
            style={{ "--c": BULBS[i % BULBS.length], animationDelay: `${(i % 5) * 0.35}s` } as CSSProperties}
          />
        ))}
      </div>
    </div>
  );
}

// --- Arcos de alumbrado en el cielo ---------------------------------------
const ARCS: { p: [Pt, Pt, Pt]; n: number }[] = [
  { p: [[-40, 60], [720, 300], [1480, 40]], n: 46 },
  { p: [[-40, 170], [500, 330], [1000, 120]], n: 30 },
  { p: [[620, 150], [1100, 330], [1480, 190]], n: 26 },
];
const ARC_DOTS = ARCS.map(({ p, n }) => quad(p[0], p[1], p[2], n));

export function AlumbradoArcs({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 400"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className={clsx("pointer-events-none", className)}
    >
      {ARCS.map(({ p }, i) => (
        <path
          key={i}
          d={`M${p[0][0]} ${p[0][1]} Q${p[1][0]} ${p[1][1]} ${p[2][0]} ${p[2][1]}`}
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1.5"
        />
      ))}
      {ARC_DOTS.map((dots, a) =>
        dots.map(([x, y], i) => (
          <circle
            key={`${a}-${i}`}
            className="hw-twinkle"
            cx={x}
            cy={y}
            r={a === 0 ? 4.5 : 3.5}
            fill={BULBS[(i + a * 2) % BULBS.length]}
            style={{ animationDelay: `${((i * 7) % 11) * 0.22}s` }}
          />
        ))
      )}
    </svg>
  );
}

// --- Estrella de Belén ----------------------------------------------------
export function BethlehemStar({ className }: { className?: string }) {
  const rays = Array.from({ length: 12 }, (_, i) => i * 30);
  return (
    <div aria-hidden="true" className={clsx("pointer-events-none", className)}>
      <svg viewBox="-100 -100 200 200" className="hw-star block h-full w-full overflow-visible">
        <defs>
          <radialGradient id="nv-star-glow">
            <stop offset="0" stopColor="#FFF6C9" stopOpacity=".95" />
            <stop offset=".35" stopColor="#FFD23F" stopOpacity=".45" />
            <stop offset="1" stopColor="#FFD23F" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle r="95" fill="url(#nv-star-glow)" />
        <g className="hw-rays" fill="#FFE9A3" opacity=".55">
          {rays.map((deg) => (
            <path key={deg} d="M-2 0 L0 -96 L2 0 Z" transform={`rotate(${deg})`} />
          ))}
        </g>
        <path
          d="M0 -62 L9 -9 L62 0 L9 9 L0 62 L-9 9 L-62 0 L-9 -9 Z"
          fill="#FFF8DC"
        />
        <path d="M0 -30 L5 -5 L30 0 L5 5 L0 30 L-5 5 L-30 0 L-5 -5 Z" fill="#FFD23F" transform="rotate(45)" />
        <circle r="7" fill="#fff" />
      </svg>
    </div>
  );
}

// --- Farol de velitas -----------------------------------------------------
export function Farol({ color, className, delay = 0 }: { color: string; className?: string; delay?: number }) {
  return (
    <svg viewBox="0 0 40 64" aria-hidden="true" className={clsx("pointer-events-none overflow-visible", className)}>
      <ellipse cx="20" cy="40" rx="26" ry="22" fill={color} opacity=".25" className="hw-flame-glow" style={{ animationDelay: `${delay}s` }} />
      <path d="M14 6 Q20 -2 26 6" fill="none" stroke="#2a2a2a" strokeWidth="1.6" />
      <rect x="11" y="6" width="18" height="5" rx="1.5" fill="#2a2a2a" />
      <path d="M8 11 H32 L35 54 H5 Z" fill={color} />
      <path d="M8 11 H32 L35 54 H5 Z" fill="url(#nv-paper)" />
      <path d="M14 11 L13 54 M20 11 V54 M26 11 L27 54" stroke="rgba(0,0,0,.18)" strokeWidth="1" />
      <ellipse cx="20" cy="38" rx="10" ry="12" fill="#FFF3B0" opacity=".55" className="hw-flame-glow" style={{ animationDelay: `${delay}s` }} />
      <rect x="17" y="40" width="6" height="11" rx="1" fill="#fffaf0" />
      <path className="hw-flame" d="M20 30 Q24 36 20 40 Q16 36 20 30 Z" fill="#FFB020" style={{ animationDelay: `${delay}s` }} />
      <rect x="4" y="54" width="32" height="5" rx="1.5" fill="#2a2a2a" />
      <defs>
        <linearGradient id="nv-paper" x1="0" x2="1">
          <stop offset="0" stopColor="#000" stopOpacity=".2" />
          <stop offset=".5" stopColor="#fff" stopOpacity=".18" />
          <stop offset="1" stopColor="#000" stopOpacity=".25" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const FAROL_COLORS = ["#E63946", "#FFB703", "#2BB673", "#3A86FF", "#FF4FA3", "#FF8A00", "#8338EC"];

export function FarolesRow({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={clsx("pointer-events-none flex items-end justify-around", className)}>
      {FAROL_COLORS.map((c, i) => (
        <Farol
          key={c}
          color={c}
          delay={i * 0.4}
          className={clsx(i % 2 ? "w-7 sm:w-9" : "w-8 sm:w-11", i > 4 && "hidden sm:block")}
        />
      ))}
    </div>
  );
}

// --- Pueblo navideño (silueta) --------------------------------------------
const WINDOWS: [number, number, number, number][] = [
  [82, 186, 20, 22], [134, 186, 20, 22], [212, 160, 18, 24], [252, 160, 18, 24],
  [602, 112, 16, 22], [782, 112, 16, 22], [900, 180, 20, 22], [950, 180, 20, 22],
  [1020, 200, 18, 22], [1060, 200, 18, 22], [1100, 200, 18, 22], [1168, 172, 20, 24],
  [1214, 172, 20, 24], [1340, 205, 16, 18], [1384, 205, 16, 18],
];
const PUEBLO_LIGHTS = [
  ...quad([150, 142], [380, 196], [600, 128], 18),
  ...quad([810, 128], [1040, 196], [1300, 150], 18),
];

function Palma({ x, fill }: { x: number; fill: string }) {
  return (
    <g fill={fill} stroke={fill}>
      <rect x={x - 2.5} y="86" width="5" height="164" stroke="none" />
      <g fill="none" strokeWidth="4" strokeLinecap="round">
        <path d={`M${x} 88 q-26 -10 -44 8`} />
        <path d={`M${x} 88 q26 -10 44 8`} />
        <path d={`M${x} 88 q-18 -26 -34 -22`} />
        <path d={`M${x} 88 q18 -26 34 -22`} />
        <path d={`M${x} 88 q-4 -28 0 -34`} />
        <path d={`M${x} 88 q-30 4 -38 26`} />
        <path d={`M${x} 88 q30 4 38 26`} />
      </g>
    </g>
  );
}

export function PuebloSkyline({ className, fill = "#050c1c" }: { className?: string; fill?: string }) {
  return (
    <svg
      viewBox="0 0 1440 260"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      className={clsx("pointer-events-none block w-full", className)}
    >
      <g fill={fill}>
        <path d="M0 232Q200 206 420 222T860 214T1440 226V260H0z" />
        {/* casas coloniales */}
        <rect x="60" y="170" width="120" height="82" />
        <path d="M48 172L120 132L192 172z" />
        <rect x="190" y="150" width="100" height="102" />
        <rect x="182" y="144" width="116" height="9" />
        <rect x="200" y="186" width="80" height="4" />
        {/* iglesia */}
        <rect x="620" y="150" width="160" height="102" />
        <path d="M610 154L700 112L790 154z" />
        <rect x="586" y="96" width="44" height="156" />
        <rect x="770" y="96" width="44" height="156" />
        <path d="M586 98a22 22 0 0 1 44 0zM770 98a22 22 0 0 1 44 0z" />
        <rect x="606" y="54" width="4" height="22" />
        <rect x="600" y="60" width="16" height="4" />
        <rect x="790" y="54" width="4" height="22" />
        <rect x="784" y="60" width="16" height="4" />
        {/* casas derecha */}
        <rect x="880" y="168" width="110" height="84" />
        <path d="M870 170L935 130L1000 170z" />
        <rect x="1000" y="186" width="130" height="66" />
        <rect x="992" y="180" width="146" height="8" />
        <rect x="1150" y="160" width="100" height="92" />
        <path d="M1140 162L1200 124L1260 162z" />
        <rect x="1320" y="196" width="110" height="56" />
        <path d="M1312 198L1375 170L1438 198z" />
      </g>
      <Palma x={340} fill={fill} />
      <Palma x={1290} fill={fill} />
      {/* puertas y rosetón */}
      <g fill="#140c05">
        <path d="M108 252v-26a12 12 0 0 1 24 0v26z" />
        <path d="M228 252v-30a12 12 0 0 1 24 0v30z" />
        <path d="M686 252v-34a14 14 0 0 1 28 0v34z" />
        <path d="M925 252v-26a10 10 0 0 1 20 0v26z" />
      </g>
      <g fill="#FFC85A">
        <circle className="hw-window" cx="700" cy="140" r="10" />
        {WINDOWS.map(([x, y, w, h], i) => (
          <rect
            key={`${x}-${y}`}
            className="hw-window"
            x={x}
            y={y}
            width={w}
            height={h}
            rx="2"
            style={{ animationDelay: `${(i % 6) * 0.8}s` }}
          />
        ))}
      </g>
      {/* alumbrado entre las casas */}
      <path d="M150 142Q380 196 600 128M810 128Q1040 196 1300 150" fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="1.2" />
      {PUEBLO_LIGHTS.map(([x, y], i) => (
        <circle
          key={i}
          className="hw-twinkle"
          cx={x}
          cy={y}
          r="3.2"
          fill={BULBS[i % BULBS.length]}
          style={{ animationDelay: `${(i % 7) * 0.3}s` }}
        />
      ))}
    </svg>
  );
}

// --- Regalo y moño --------------------------------------------------------
export function Bow({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 80 56" aria-hidden="true" className={clsx("pointer-events-none", className)} style={style}>
      <path d="M40 26 C26 2 2 6 8 22 C12 34 30 30 40 26Z" fill="#E63946" />
      <path d="M40 26 C54 2 78 6 72 22 C68 34 50 30 40 26Z" fill="#E63946" />
      <path d="M40 26 C28 10 12 12 14 20 C16 27 30 27 40 26Z" fill="#B5172A" opacity=".55" />
      <path d="M40 26 C52 10 68 12 66 20 C64 27 50 27 40 26Z" fill="#B5172A" opacity=".55" />
      <path d="M36 28 L24 54 L32 50 L38 54 L40 30Z" fill="#C81D2E" />
      <path d="M44 28 L56 54 L48 50 L42 54 L40 30Z" fill="#C81D2E" />
      <ellipse cx="40" cy="26" rx="8" ry="7" fill="#FF5A67" />
    </svg>
  );
}

export function GiftBox({ open = false, className }: { open?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 80 80" aria-hidden="true" className={clsx("overflow-visible", className)}>
      <rect x="10" y="36" width="60" height="42" rx="4" fill="#E63946" />
      <rect x="10" y="36" width="60" height="42" rx="4" fill="url(#nv-gift-shade)" />
      <rect x="35" y="36" width="10" height="42" fill="#FFD23F" />
      <g className={clsx("hw-gift-lid", open && "is-open")}>
        <rect x="5" y="24" width="70" height="14" rx="3" fill="#FF4D5A" />
        <rect x="35" y="24" width="10" height="14" fill="#FFD23F" />
        <path d="M40 24 C30 6 14 8 18 18 C21 25 32 24 40 24Z" fill="#FFD23F" />
        <path d="M40 24 C50 6 66 8 62 18 C59 25 48 24 40 24Z" fill="#FFD23F" />
        <circle cx="40" cy="23" r="5" fill="#FFB703" />
      </g>
      <defs>
        <linearGradient id="nv-gift-shade" x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".18" />
          <stop offset="1" stopColor="#000" stopOpacity=".2" />
        </linearGradient>
      </defs>
    </svg>
  );
}
