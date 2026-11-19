import type { CSSProperties } from "react";
import { BULBS } from "./NavidadDecor";

// Luces de alumbrado que caen despacio (posiciones fijas para que el servidor
// y el navegador dibujen lo mismo).
const LIGHTS = Array.from({ length: 26 }, (_, i) => ({
  left: (i * 37 + 11) % 100,
  size: 4 + ((i * 7) % 6),
  duration: 14 + ((i * 5) % 12),
  delay: -((i * 3.7) % 24),
  color: BULBS[i % BULBS.length],
}));

/**
 * Fondo de toda la tienda en Navidad: noche azul con estrellas, luces de
 * colores cayendo como bokeh de alumbrado y una estrella fugaz de vez en
 * cuando. Va fijo detrás del contenido (z-index negativo dentro del layout).
 */
export default function NavidadAtmosphere() {
  return (
    <div aria-hidden="true" className="nv-atmosphere">
      <div className="hw-stars" />
      <div className="hw-stars hw-stars--b" />
      {LIGHTS.map((l, i) => (
        <span
          key={i}
          className="nv-falling-light"
          style={
            {
              left: `${l.left}%`,
              width: l.size,
              height: l.size,
              "--c": l.color,
              animationDuration: `${l.duration}s`,
              animationDelay: `${l.delay}s`,
            } as CSSProperties
          }
        />
      ))}
      <span className="nv-shooting-star" />
    </div>
  );
}
