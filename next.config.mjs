/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "loremflickr.com" },
      // Imágenes subidas desde el admin a Vercel Blob.
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Evita que el sitio se incruste en iframes de otros dominios (clickjacking).
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // Evita que el navegador "adivine" tipos de contenido (sniffing).
          { key: "X-Content-Type-Options", value: "nosniff" },
          // No filtra la URL completa a sitios externos.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Desactiva APIs sensibles del navegador que la tienda no usa.
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
