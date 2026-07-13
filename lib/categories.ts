import {
  Cpu,
  Home,
  Lightbulb,
  Package,
  Gift,
  Box,
  ShoppingBag,
  type LucideIcon,
} from "lucide-react";

/** Mapa de iconKey (guardado en la BD) -> icono de lucide-react. */
export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  cpu: Cpu,
  home: Home,
  lightbulb: Lightbulb,
  package: Package,
  gift: Gift,
  box: Box,
  bag: ShoppingBag,
};

export function getCategoryIcon(iconKey: string): LucideIcon {
  return CATEGORY_ICONS[iconKey] ?? Box;
}

/** Opciones disponibles para el selector de ícono en el panel admin. */
export const ICON_OPTIONS = Object.keys(CATEGORY_ICONS);
