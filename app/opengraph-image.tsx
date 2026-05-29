import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Vô chi · Học từ vựng cùng thú nhỏ vô tư";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background:
            "linear-gradient(135deg, #fafaf7 0%, #f3f0e8 60%, #e8f1ec 100%)",
          fontFamily: "sans-serif",
          color: "#0f1311",
        }}
      >
        {/* top: brand mark */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              background: "#3d9b62",
              color: "#ffffff",
              fontSize: 36,
              fontWeight: 700,
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            V
          </div>
          <div style={{ fontSize: 32, fontWeight: 500, letterSpacing: -0.5 }}>
            Vô chi
          </div>
        </div>

        {/* middle: couplet headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            fontSize: 84,
            lineHeight: 1.05,
            letterSpacing: -2,
            fontWeight: 600,
          }}
        >
          <div>Học vài từ, sống vô tư.</div>
          <div style={{ color: "#6b7066", fontStyle: "italic" }}>
            Nuôi vài thú, sống vô chi.
          </div>
        </div>

        {/* bottom: meta */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            color: "#6b7066",
            borderTop: "1px solid #d8d6cf",
            paddingTop: 28,
          }}
        >
          <div>Pet ảo học từ vựng cho macOS và Windows</div>
          <div style={{ fontFamily: "monospace", fontSize: 18, letterSpacing: 2 }}>
            VOCHI.APP
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
