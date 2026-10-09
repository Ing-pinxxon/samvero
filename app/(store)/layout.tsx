import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import PromoBar from "@/components/promo/PromoBar";
import CountdownRibbon from "@/components/promo/CountdownRibbon";
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
    // data-season permite ajustar estilos de temporada desde CSS (globals.css).
    <div
      className="flex min-h-screen flex-col"
      data-season={season.halloween ? "halloween" : undefined}
    >
      <PromoBar halloween={season.halloween} />
      <Navbar categories={categories} />
      {season.promoEndsAt && <CountdownRibbon endsAt={season.promoEndsAt} />}
      <main className="flex-1">{children}</main>
      <Footer categories={categories} halloween={season.halloween} />
      <CartDrawer />
    </div>
  );
}
