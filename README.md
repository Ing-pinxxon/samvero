# SAMVERO — Tienda / Catálogo

Catálogo tipo marketplace para **SAMVERO** (Colombia). Los clientes navegan
productos por categoría, ven precios en COP, agregan al carrito y **finalizan el
pedido por WhatsApp**. Incluye un **panel de administración** con login para
gestionar productos y categorías.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** (tema de marca: navy `#0D1B2A` + naranja `#FF6A00`, fuente Poppins)
- **Prisma ORM + MySQL**
- **Zustand** (carrito con persistencia en el navegador)
- **jose** (sesión de admin en cookie httpOnly) + `bcryptjs`

## Requisitos

- Node.js 18+ (probado con Node 24)
- **MySQL** corriendo en local (o Docker)

## Estado actual (ya configurado)

En este equipo ya quedó montada una instancia **portable de MySQL 8.0** en
`C:\Users\Daniel\mysql-portable`, con la base `samvero` creada y poblada
(5 categorías + 18 productos demo). El `.env` ya apunta a ella
(`mysql://root:@127.0.0.1:3306/samvero`, root sin contraseña, solo para local).

MySQL portable NO es un servicio de Windows: si reinicias el PC, vuelve a
levantarlo con:

```bash
powershell -ExecutionPolicy Bypass -File scripts\start-mysql.ps1
```

Deja esa ventana abierta y en otra terminal corre `npm run dev`. Si quieres
que MySQL arranque solo con Windows, se puede instalar como servicio
(`mysqld --install`, requiere permisos de administrador).

## Puesta en marcha

1. Instala dependencias:

   ```bash
   npm install
   ```

2. Crea la base de datos en MySQL (una vez):

   ```sql
   CREATE DATABASE samvero CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

3. Copia `.env.example` a `.env` y ajusta los valores:

   - `DATABASE_URL` → usuario, contraseña y puerto de tu MySQL.
   - `NEXT_PUBLIC_WHATSAPP_NUMBER` → número de la tienda (formato internacional, ej. `573001234567`).
   - `ADMIN_EMAIL` / `ADMIN_PASSWORD` → credenciales del panel.
   - `AUTH_SECRET` → cadena larga y aleatoria.

4. Crea las tablas y carga datos de ejemplo:

   ```bash
   npm run db:migrate      # crea el esquema
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
- Las imágenes subidas desde el panel se guardan en `public/uploads/`.
- Para despliegues serverless (p. ej. Vercel), migra la subida a un servicio
  como Cloudinary o S3, ya que el sistema de archivos es efímero.
