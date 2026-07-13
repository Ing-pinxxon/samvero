import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { getCategories } from "@/lib/data";

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

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar categories={categories} />
      <main className="flex-1">{children}</main>
      <Footer categories={categories} />
      <CartDrawer />
    </div>
  );
}
