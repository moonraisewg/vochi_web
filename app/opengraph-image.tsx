import { ImageResponse } from "next/og";
import { BIRD_OG } from "./_bird-data";

export const runtime = "edge";
export const alt = "Vô chi · Học từ vựng cùng thú nhỏ vô tư";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadFont(family: string, weight = 400, style: "normal" | "italic" = "normal") {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:ital,wght@${style === "italic" ? 1 : 0},${weight}&display=swap`,
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Safari/605.1.15",
      },
    },
  ).then((r) => r.text());
  const match = css.match(/src: url\((.+?)\) format/);
  if (!match) throw new Error(`Font ${family} not found`);
  const fontData = await fetch(match[1]).then((r) => r.arrayBuffer());
  return fontData;
}

export default async function OG() {
  const [displayRegular, displayItalic, mono] = await Promise.all([
    loadFont("Bricolage Grotesque", 600).catch(() => null),
    loadFont("Bricolage Grotesque", 500, "italic").catch(() => null),
    loadFont("Geist Mono", 500).catch(() => null),
  ]);

  const fonts = [
    displayRegular && {
      name: "Display",
      data: displayRegular,
      weight: 600 as const,
      style: "normal" as const,
    },
    displayItalic && {
      name: "Display",
      data: displayItalic,
      weight: 500 as const,
      style: "italic" as const,
    },
    mono && {
      name: "Mono",
      data: mono,
      weight: 500 as const,
      style: "normal" as const,
    },
  ].filter(Boolean) as Array<{
    name: string;
    data: ArrayBuffer;
    weight: 500 | 600;
    style: "normal" | "italic";
  }>;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#fafaf7",
          fontFamily: "Display",
          color: "#0f1311",
          position: "relative",
        }}
      >
        {/* soft moss radial wash bottom-right */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(900px 600px at 100% 100%, rgba(61,155,98,0.18) 0%, rgba(61,155,98,0) 60%)",
            display: "flex",
          }}
        />

        {/* dot grid backdrop */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle, rgba(15,19,17,0.07) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            display: "flex",
            opacity: 0.5,
          }}
        />

        {/* main content */}
        <div
          style={{
            position: "relative",
            display: "flex",
            width: "100%",
            height: "100%",
            padding: 64,
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* TOP — brand row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  background: "#3d9b62",
                  color: "#ffffff",
                  fontSize: 34,
                  fontWeight: 700,
                  borderRadius: 14,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 8px 24px rgba(61,155,98,0.35)",
                }}
              >
                V
              </div>
              <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: -0.8 }}>
                Vô chi
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 18px",
                border: "1.5px solid #d8d6cf",
                borderRadius: 999,
                background: "#ffffff",
                fontFamily: "Mono",
                fontSize: 14,
                letterSpacing: 2,
                textTransform: "uppercase",
                color: "#6b7066",
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  background: "#3d9b62",
                  borderRadius: 999,
                  display: "flex",
                }}
              />
              Beta · macOS · Windows
            </div>
          </div>

          {/* MIDDLE — device + couplet */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 64,
            }}
          >
            {/* device */}
            <div
              style={{
                width: 320,
                height: 360,
                background: "#ffffff",
                border: "2px solid #d8d6cf",
                borderRadius: 28,
                padding: 22,
                display: "flex",
                flexDirection: "column",
                boxShadow:
                  "0 2px 4px rgba(15,19,17,0.06), 0 24px 60px rgba(15,19,17,0.12)",
              }}
            >
              {/* top hud row */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontFamily: "Mono",
                  fontSize: 11,
                  letterSpacing: 2,
                  color: "#6b7066",
                  textTransform: "uppercase",
                  marginBottom: 14,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div
                    style={{
                      width: 7,
                      height: 7,
                      background: "#3d9b62",
                      borderRadius: 999,
                      display: "flex",
                    }}
                  />
                  Live
                </div>
                <div style={{ display: "flex" }}>Lvl 04</div>
              </div>

              {/* screen */}
              <div
                style={{
                  flex: 1,
                  borderRadius: 16,
                  background:
                    "linear-gradient(180deg, #f3f0e8 0%, #e6e2d4 100%)",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                {/* creature: bird mascot — fills the screen, rounded to blend the
                    cream backdrop into the device screen's warm gradient */}
                <img
                  src={BIRD_OG}
                  width={236}
                  height={236}
                  alt="Vô chi"
                  style={{ objectFit: "cover", borderRadius: 12 }}
                />
              </div>

              {/* hunger bar */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginTop: 14,
                }}
              >
                <div
                  style={{
                    fontFamily: "Mono",
                    fontSize: 10,
                    letterSpacing: 1.6,
                    color: "#6b7066",
                    textTransform: "uppercase",
                    display: "flex",
                  }}
                >
                  Hunger
                </div>
                <div
                  style={{
                    flex: 1,
                    height: 6,
                    background: "#e8e7e2",
                    borderRadius: 999,
                    display: "flex",
                  }}
                >
                  <div
                    style={{
                      width: "72%",
                      background: "#3d9b62",
                      borderRadius: 999,
                      display: "flex",
                    }}
                  />
                </div>
                <div
                  style={{
                    fontFamily: "Mono",
                    fontSize: 12,
                    display: "flex",
                  }}
                >
                  72
                </div>
              </div>
            </div>

            {/* couplet */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
                fontSize: 78,
                lineHeight: 1.05,
                letterSpacing: -2.4,
                flex: 1,
              }}
            >
              <div style={{ fontWeight: 600 }}>Học vài từ,</div>
              <div style={{ fontWeight: 600 }}>sống vô tư.</div>
              <div
                style={{
                  fontStyle: "italic",
                  fontWeight: 500,
                  color: "#6b7066",
                  marginTop: 14,
                }}
              >
                Nuôi vài thú,
              </div>
              <div
                style={{
                  fontStyle: "italic",
                  fontWeight: 500,
                  color: "#6b7066",
                }}
              >
                sống vô chi.
              </div>
            </div>
          </div>

          {/* BOTTOM — meta */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderTop: "1.5px solid #d8d6cf",
              paddingTop: 22,
              fontFamily: "Mono",
              fontSize: 16,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "#6b7066",
            }}
          >
            <div style={{ display: "flex" }}>
              Học từ vựng với thú nhỏ · Không streak · Không stress
            </div>
            <div style={{ display: "flex", color: "#0f1311", fontWeight: 700 }}>
              vochi.app
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
