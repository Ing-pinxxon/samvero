# Despliegue de SAMVERO en Vercel

Guía para publicar la tienda en **Vercel** (serverless) con **MySQL gestionado**
e imágenes en **Vercel Blob**.

> ¿Por qué así? En Vercel el sistema de archivos es **efímero**: lo que se sube al
> disco se borra. Por eso la base de datos y las imágenes deben vivir fuera del
> servidor. El código ya está preparado para esto.

---

## 1. Base de datos MySQL gestionada

Elige un proveedor con plan gratuito y crea una base MySQL:

- **[Railway](https://railway.app)** — simple, plan gratis. Crea un servicio "MySQL".
- **[Aiven](https://aiven.io)** — plan gratis de MySQL.
- **[TiDB Cloud](https://tidbcloud.com)** o **PlanetScale** — compatibles con MySQL.

Copia la **cadena de conexión** que te den. Debe quedar así:

```
mysql://usuario:clave@host:puerto/samvero?connection_limit=5
```

El `?connection_limit=5` evita agotar conexiones en serverless.

## 2. Sube el código a GitHub

```bash
git init
git add .
git commit -m "SAMVERO tienda"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/samvero.git
git push -u origin main
```

## 3. Importa el proyecto en Vercel

1. Entra a [vercel.com](https://vercel.com) → **Add New → Project** → importa el repo.
2. Framework: **Next.js** (se detecta solo).
3. Antes de desplegar, agrega las **Environment Variables** (paso 4).

## 4. Variables de entorno en Vercel

En **Settings → Environment Variables** añade:

| Variable | Valor |
| --- | --- |
| `DATABASE_URL` | La cadena de conexión del paso 1 |
| `ADMIN_EMAIL` | `admin@samvero.co` (o el que quieras) |
| `ADMIN_PASSWORD_HASH` | Hash bcrypt (ver paso 6) |
| `AUTH_SECRET` | Cadena larga y aleatoria (32+ caracteres) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Tu número, ej. `573001234567` |
| `NEXT_PUBLIC_SITE_URL` | `https://samvero.co` (tu dominio real) |

## 5. Activa Vercel Blob (imágenes)

1. En el proyecto: **Storage → Create Database → Blob**.
2. Al conectarlo, Vercel agrega **`BLOB_READ_WRITE_TOKEN`** automáticamente.
3. Con eso, las imágenes que subas desde el panel se guardan en la nube.

> Alternativa sin Blob: en el panel puedes pegar la **URL** de una imagen ya
> alojada en otro lado en vez de subir el archivo.

## 6. Contraseña de admin para producción

No uses contraseña en texto plano en producción. Genera un hash:

```bash
node scripts/hash-password.mjs "TU_CLAVE_SEGURA"
```

Copia el resultado en `ADMIN_PASSWORD_HASH` (tiene prioridad sobre `ADMIN_PASSWORD`).

## 7. Crea las tablas y datos en la base de producción

Desde tu equipo, apuntando a la base de producción (una sola vez):

```bash
# Windows PowerShell
$env:DATABASE_URL="mysql://usuario:clave@host:puerto/samvero"
npx prisma db push        # crea las tablas
npm run db:seed           # opcional: categorías + productos demo
```

(O corre estos comandos desde el proveedor si ofrece consola.)

## 8. Despliega y verifica

1. Vercel construye con `prisma generate && next build` (ya configurado).
   El `binaryTargets` de Prisma incluye el motor de Vercel (`rhel-openssl-3.0.x`).
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
| Base de datos | Railway / Aiven / TiDB | Gratis para empezar |
| Imágenes | Vercel Blob | Gratis (con límites) |
