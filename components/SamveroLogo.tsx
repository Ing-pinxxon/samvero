import { clsx } from "clsx";

type Props = {
  /** Color del texto según el fondo. */
  variant?: "light" | "dark";
  className?: string;
  /** Muestra solo el símbolo (sin el texto). */
  markOnly?: boolean;
};

/** Símbolo "S" de SAMVERO: navy + naranja. */
function Mark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      role="img"
      aria-label="SAMVERO"
    >
      <rect width="48" height="48" rx="12" fill="#0D1B2A" />
      <path
        d="M32 15.5c-1.8-1.7-4.3-2.7-7-2.7-4.7 0-8 2.7-8 6.4 0 3.4 2.6 5 6.7 5.9"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="3.6"
        strokeLinecap="round"
      />
      <path
        d="M16 32.5c1.8 1.7 4.3 2.7 7 2.7 4.7 0 8-2.7 8-6.4 0-3.4-2.6-5-6.7-5.9"
        fill="none"
        stroke="#FF6A00"
        strokeWidth="3.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function SamveroLogo({
  variant = "dark",
  className,
  markOnly = false,
}: Props) {
  return (
    <span className={clsx("inline-flex items-center gap-2", className)}>
      <Mark className="h-9 w-9 shrink-0" />
      {!markOnly && (
        <span className="text-2xl font-bold leading-none tracking-tight">
          <span className={variant === "light" ? "text-white" : "text-navy"}>
            SAM
          </span>
          <span className="text-brand">VERO</span>
        </span>
      )}
    </span>
  );
}
