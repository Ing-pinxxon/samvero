import { Bat, Ghost, Spider } from "./HalloweenDecor";

/**
 * Fondo de toda la tienda en temporada: cielo nocturno con estrellas, niebla,
 * bandadas de murciélagos y un fantasma. Va fijo detrás del contenido
 * (z-index negativo dentro del layout, que aísla su propio contexto), así que
 * nunca tapa textos ni botones. La araña cuelga por delante, en el borde.
 */
export default function HalloweenAtmosphere() {
  return (
    <>
      <div aria-hidden="true" className="hw-atmosphere">
        <div className="hw-stars" />
        <div className="hw-stars hw-stars--b" />
        <div className="hw-flock">
          <Bat className="left-0 top-0 w-10 text-[#1a1236]" />
          <Bat className="left-14 top-6 w-7 text-[#1a1236]" delay={0.3} />
          <Bat className="left-24 -top-4 w-8 text-[#1a1236]" delay={0.6} />
          <Bat className="left-36 top-10 w-6 text-[#1a1236]" delay={0.2} />
        </div>
        <Ghost className="hw-ghost-drift absolute w-16" />
        <div className="hw-fog" />
        <div className="hw-fog hw-fog--b" />
      </div>
      {/* En el margen izquierdo, colgando junto a la telaraña del banner */}
      <Spider className="fixed left-1 top-0 z-30 hidden lg:flex 2xl:left-8" />
    </>
  );
}
