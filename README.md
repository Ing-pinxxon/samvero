# SAMVERO — Tienda / Catálogo

Catálogo tipo marketplace para **SAMVERO** (Colombia). Los clientes navegan
productos por categoría, ven precios en COP, agregan al carrito y **finalizan el
pedido por WhatsApp**. Incluye un **panel de administración** con login para
gestionar productos y categorías.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** (tema de marca: navy `#0D1B2A` + naranja `#FF6A00`, fuente Poppins)
- **Prisma ORM + PostgreSQL** (Vercel Postgres / Neon)
- **Zustand** (carrito con persistencia en el navegador)
- **jose** (sesión de admin en cookie httpOnly) + `bcryptjs`

## Requisitos

- Node.js 18+ (probado con Node 24)
- Una base de datos **PostgreSQL** (se crea gratis en 2 clics desde Vercel, ver [DEPLOY.md](DEPLOY.md))

## Puesta en marcha

1. Instala dependencias:

   ```bash
   npm install
   ```

2. Consigue una base de datos Postgres. La forma más simple: créala desde
   **Vercel → Storage → Postgres** (ver [DEPLOY.md](DEPLOY.md) paso 3) y usa la
   misma cadena de conexión tanto en local como en producción — Neon es
   accesible por internet, así que no necesitas instalar nada en tu equipo.

3. Copia `.env.example` a `.env` y ajusta los valores:

   - `DATABASE_URL` → la cadena de conexión de tu base Postgres.
   - `NEXT_PUBLIC_WHATSAPP_NUMBER` → número de la tienda (formato internacional, ej. `573214496014`).
   - `ADMIN_EMAIL` / `ADMIN_PASSWORD` → credenciales del panel.
   - `AUTH_SECRET` → cadena larga y aleatoria.

4. Crea las tablas y carga datos de ejemplo:

   ```bash
   npx prisma db push      # crea el esquema
   npm run db:seed         # 5 categorías + productos demo
   ```

5. Inicia el servidor:

   ```bash
   npm run dev
   ```

   - Tienda: http://localhost:3000
   - Panel admin: http://localhost:3000/admin (login con `ADMIN_EMAIL` / `ADMIN_PASSWORD`)

## Scripts útiles

| Script            | Descripción                              |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Servidor de desarrollo                   |
| `npm run build`   | Build de producción (`prisma generate`)  |
| `npm run db:seed` | Carga categorías y productos de ejemplo  |
| `npm run db:studio` | Explora la BD con Prisma Studio        |

## Contraseña de admin en producción

Para no guardar la contraseña en texto plano, genera un hash y ponlo en
`ADMIN_PASSWORD_HASH` (tiene prioridad sobre `ADMIN_PASSWORD`):

```bash
node scripts/hash-password.mjs "tuClaveSegura"
```

## SEO y posicionamiento

Ya viene optimizado para buscadores:

- **Metadata** por página: títulos, descripciones, `canonical`, OpenGraph y Twitter Cards.
- **`/robots.txt`** dinámico (bloquea `/admin` y `/api`).
- **`/sitemap.xml`** dinámico: incluye home, tienda, ofertas, contacto + todas las
  categorías y productos activos (se regenera cada hora).
- **Datos estructurados JSON-LD**: `Store` y `WebSite` (con caja de búsqueda) en
  todo el sitio, y `Product` (precio, disponibilidad, marca) + `BreadcrumbList`
  en las fichas de producto → habilita resultados enriquecidos en Google.
- **`manifest.webmanifest`** + favicon (`icon.svg`) y `theme-color` de marca.
- Panel `/admin` marcado como `noindex`.

> **Importante para producción:** define `NEXT_PUBLIC_SITE_URL=https://samvero.co`
> en el `.env` del servidor. De ahí salen los `canonical`, el sitemap y las URLs
> de OpenGraph. En local usa `http://localhost:3000`.
>
> Tras desplegar, registra el dominio en [Google Search Console](https://search.google.com/search-console)
> y envía `https://samvero.co/sitemap.xml`.

## Imágenes

- Los productos de ejemplo usan imágenes de Unsplash.
- En desarrollo local, las imágenes subidas desde el panel se guardan en `public/uploads/`.
- En producción (Vercel), se suben automáticamente a **Vercel Blob** en vez de
  disco (el sistema de archivos de Vercel es efímero) — ver [DEPLOY.md](DEPLOY.md).

## Despliegue

Guía completa paso a paso para publicar la tienda en Vercel (base de datos,
imágenes, variables de entorno, dominio): ver [DEPLOY.md](DEPLOY.md).
