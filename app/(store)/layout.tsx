import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import PromoBar from "@/components/promo/PromoBar";
import CountdownRibbon from "@/components/promo/CountdownRibbon";
import HalloweenAtmosphere from "@/components/promo/HalloweenAtmosphere";
import NavidadAtmosphere from "@/components/promo/NavidadAtmosphere";
import { getCategories } from "@/lib/data";
import { getSeason } from "@/lib/season";

// Se obtienen las categorías para la navegación; si la BD no está disponible
// el sitio sigue renderizando con una lista vacía.
async function safeCategories() {
  try {
    const cats = await getCategories();
    return cats.map((c) => ({ name: c.name, slug: c.slug }));
  } catch (e) {
    console.error("No se pudieron cargar las categorías:", e);
    return [];
  }
}

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await safeCategories();
  const season = getSeason();

  return (
    // data-season activa el estilo de temporada (app/season-night.css +
    // halloween.css / navidad.css) y data-campaign el de Black Friday.
    // "isolate" crea el contexto donde la atmósfera queda detrás del contenido.
    <div
      className="relative isolate flex min-h-screen flex-col"
      data-season={season.theme ?? undefined}
      data-campaign={season.campaign?.id}
    >
      {season.theme === "halloween" && <HalloweenAtmosphere />}
      {season.theme === "navidad" && <NavidadAtmosphere />}
      <PromoBar
        seasonMessages={season.messages}
        theme={season.theme}
        campaignId={season.campaign?.id ?? null}
      />
      <Navbar categories={categories} />
      {season.campaign && <CountdownRibbon campaign={season.campaign} />}
      <main className="flex-1">{children}</main>
      <Footer categories={categories} theme={season.theme} />
      <CartDrawer />
    </div>
  );
}
