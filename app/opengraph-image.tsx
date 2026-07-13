import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "SAMVERO — Todo lo que necesitas, en un solo lugar";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const markSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="104" height="104"><rect width="48" height="48" rx="12" fill="#16293C" stroke="#FF6A00" stroke-width="1.5"/><path d="M32 15.5c-1.8-1.7-4.3-2.7-7-2.7-4.7 0-8 2.7-8 6.4 0 3.4 2.6 5 6.7 5.9" fill="none" stroke="#FFFFFF" stroke-width="3.6" stroke-linecap="round"/><path d="M16 32.5c1.8 1.7 4.3 2.7 7 2.7 4.7 0 8-2.7 8-6.4 0-3.4-2.6-5-6.7-5.9" fill="none" stroke="#FF6A00" stroke-width="3.6" stroke-linecap="round"/></svg>`;

const categories = ["Tecnología", "Hogar", "Iluminación", "Organización", "Regalos"];

export default function OpengraphImage() {
  const mark = `data:image/svg+xml;base64,${btoa(markSvg)}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0D1B2A",
          backgroundImage:
            "radial-gradient(circle at 85% 15%, rgba(255,106,0,0.35), transparent 45%), radial-gradient(circle at 15% 90%, rgba(255,106,0,0.15), transparent 40%)",
          padding: "64px 72px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Marca */}
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={mark} width={104} height={104} alt="SAMVERO" />
          <div style={{ display: "flex", fontSize: 68, fontWeight: 700 }}>
            <span style={{ color: "#FFFFFF" }}>SAM</span>
            <span style={{ color: "#FF6A00" }}>VERO</span>
          </div>
        </div>

        {/* Titular */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 60,
              fontWeight: 700,
              color: "#FFFFFF",
              lineHeight: 1.1,
              maxWidth: 900,
            }}
          >
            Todo lo que necesitas, en un solo lugar.
          </div>
          <div style={{ fontSize: 30, color: "#94A3B8" }}>
            Tecnología · Hogar · Innovación · Envíos a todo Colombia
          </div>
        </div>

        {/* Categorías + dominio */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", gap: 14 }}>
            {categories.map((c) => (
              <div
                key={c}
                style={{
                  display: "flex",
                  fontSize: 24,
                  color: "#FFFFFF",
                  backgroundColor: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: 999,
                  padding: "10px 22px",
                }}
              >
                {c}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", fontSize: 28, fontWeight: 600, color: "#FF6A00" }}>
            samvero.co
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
