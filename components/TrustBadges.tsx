import { ShieldCheck, Truck, BadgeCheck, Headphones } from "lucide-react";

const badges = [
  {
    icon: ShieldCheck,
    title: "Compra segura",
    text: "Todos tus pagos protegidos.",
  },
  {
    icon: Truck,
    title: "Envíos a todo Colombia",
    text: "Rápidos y confiables.",
  },
  {
    icon: BadgeCheck,
    title: "Productos garantizados",
    text: "Calidad que te acompaña.",
  },
  {
    icon: Headphones,
    title: "Atención al cliente",
    text: "Siempre disponibles para ayudarte.",
  },
];

export default function TrustBadges() {
  return (
    <section className="border-y border-navy/5 bg-white">
      <div className="container-page grid grid-cols-2 gap-6 py-8 lg:grid-cols-4">
        {badges.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <Icon className="h-6 w-6" />
            </span>
            <div>
              <p className="text-sm font-semibold text-navy">{title}</p>
              <p className="text-xs text-slatebrand">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
