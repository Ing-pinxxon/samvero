# Despliegue de SAMVERO en Vercel

Guía para publicar la tienda en **Vercel** (serverless) con **Postgres nativo
de Vercel** (Neon) e imágenes en **Vercel Blob**. Todo desde el mismo panel,
sin crear cuentas en otros proveedores.

> ¿Por qué así? En Vercel el sistema de archivos es **efímero**: lo que se sube al
> disco se borra. Por eso la base de datos y las imágenes deben vivir fuera del
> servidor. El código ya está preparado para esto.

---

## 1. Sube el código a GitHub

```bash
git init
git add .
git commit -m "SAMVERO tienda"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/samvero.git
git push -u origin main
```

## 2. Importa el proyecto en Vercel

1. Entra a [vercel.com](https://vercel.com) → **Add New → Project** → importa el repo `samvero`.
2. Framework: **Next.js** (se detecta solo). Todavía no despliegues: primero crea la base de datos (paso 3).

## 3. Crea la base de datos Postgres (Neon, integrado en Vercel)

1. En el proyecto de Vercel: pestaña **Storage → Create Database → Postgres** (Neon).
2. Ponle un nombre (ej. `samvero-db`) y **Connect** al proyecto.
3. Vercel agrega automáticamente la variable **`DATABASE_URL`** (y otras
   `POSTGRES_*`) a tu proyecto. No necesitas copiarla a mano.

## 4. Activa Vercel Blob (imágenes)

1. **Storage → Create Database → Blob**.
2. Al conectarlo, Vercel agrega **`BLOB_READ_WRITE_TOKEN`** automáticamente.

> Alternativa sin Blob: en el panel puedes pegar la **URL** de una imagen ya
> alojada en otro lado en vez de subir el archivo.

## 5. Resto de variables de entorno

En **Settings → Environment Variables** añade las que faltan:

| Variable | Valor |
| --- | --- |
| `ADMIN_EMAIL` | `admin@samvero.co` (o el que quieras) |
| `ADMIN_PASSWORD_HASH` | Hash bcrypt (ver paso 6) |
| `AUTH_SECRET` | Cadena larga y aleatoria (32+ caracteres) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Tu número, ej. `573214496014` |
| `NEXT_PUBLIC_SITE_URL` | `https://samvero.co` (tu dominio real) |

(`DATABASE_URL` y `BLOB_READ_WRITE_TOKEN` ya quedaron listas en los pasos 3 y 4.)

## 6. Contraseña de admin para producción

No uses contraseña en texto plano en producción. Genera un hash:

```bash
node scripts/hash-password.mjs "TU_CLAVE_SEGURA"
```

Copia el resultado en `ADMIN_PASSWORD_HASH` (tiene prioridad sobre `ADMIN_PASSWORD`).

## 7. Crea las tablas y datos en la base de producción

Copia el valor de `DATABASE_URL` desde Vercel (**Storage → tu base → .env.local tab**)
y córrelo desde tu equipo una sola vez:

```bash
# Windows PowerShell
$env:DATABASE_URL="postgresql://usuario:clave@host/samvero?sslmode=require"
npx prisma db push        # crea las tablas
npm run db:seed           # opcional: categorías + productos demo
```

## 8. Despliega y verifica

1. En Vercel, dale a **Deploy**. El build corre `prisma generate && next build`
   (ya configurado). El `binaryTargets` de Prisma incluye el motor de Vercel.
2. Abre tu dominio: la tienda debe cargar con productos.
3. Entra a `/admin` con tus credenciales y prueba crear/editar un producto.

## 9. SEO tras el despliegue

1. Confirma que `NEXT_PUBLIC_SITE_URL` sea tu dominio real (de ahí salen los
   `canonical`, el sitemap y las imágenes OpenGraph).
2. Registra el sitio en [Google Search Console](https://search.google.com/search-console)
   y envía `https://samvero.co/sitemap.xml`.

---

## Resumen de dependencias externas

| Necesidad | Servicio | Plan |
| --- | --- | --- |
| Hosting | Vercel | Gratis (Hobby) |
| Base de datos | Vercel Postgres (Neon) | Gratis para empezar |
| Imágenes | Vercel Blob | Gratis (con límites) |

Todo se gestiona **desde el mismo panel de Vercel** — no hace falta crear
cuenta en ningún otro proveedor.
