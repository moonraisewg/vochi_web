import React from "react";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import fs from "node:fs/promises";
import path from "node:path";

const SIZE = { width: 1200, height: 630 } as const;
const OUT = path.join(process.cwd(), "public", "og.png");

// Brand accent (matches the husky mascot — lavender/violet).
const ACCENT = "#8b6fd6";
const ACCENT_DEEP = "#6d52c4";

async function loadTtf(url: string): Promise<ArrayBuffer> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.arrayBuffer();
}

async function build() {
  // Full static TTFs from the Google Fonts repo. Single file = complete glyph
  // coverage (latin + latin-ext + vietnamese), readable by opentype.js (and
  // therefore Satori). Variable fonts + Google Fonts CSS subsets both fail
  // here: Satori's fork rejects WOFF2 and can't cross-font fallback per
  // subset.
  const [displayBold, mono] = await Promise.all([
    loadTtf(
      "https://github.com/google/fonts/raw/main/ofl/bevietnampro/BeVietnamPro-SemiBold.ttf",
    ),
    loadTtf(
      "https://github.com/google/fonts/raw/main/ofl/ibmplexmono/IBMPlexMono-Medium.ttf",
    ),
  ]);

  // The mascot logo, embedded as a data URI (Satori has no fs access).
  const logoBytes = await fs.readFile(
    path.join(process.cwd(), "design", "icon-web-source.png"),
  );
  const logo = `data:image/png;base64,${logoBytes.toString("base64")}`;

  const fonts = [
    {
      name: "Display",
      data: displayBold,
      weight: 600 as const,
      style: "normal" as const,
    },
    {
      name: "Mono",
      data: mono,
      weight: 500 as const,
      style: "normal" as const,
    },
  ];

  const element = (
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
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(900px 600px at 100% 100%, rgba(139,111,214,0.18) 0%, rgba(139,111,214,0) 60%)`,
          display: "flex",
        }}
      />
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
        {/* top: brand row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <img
              src={logo}
              width={56}
              height={56}
              style={{ borderRadius: 14 }}
            />
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
                background: ACCENT,
                borderRadius: 999,
                display: "flex",
              }}
            />
            Beta · macOS · Windows
          </div>
        </div>

        {/* middle: device + couplet */}
        <div style={{ display: "flex", alignItems: "center", gap: 64 }}>
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
                    background: ACCENT,
                    borderRadius: 999,
                    display: "flex",
                  }}
                />
                Live
              </div>
              <div style={{ display: "flex" }}>Lvl 04</div>
            </div>

            <div
              style={{
                flex: 1,
                borderRadius: 16,
                background:
                  "linear-gradient(180deg, #efeafb 0%, #ddd2f4 100%)",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <img src={logo} width={190} height={190} />
            </div>

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
                    background: ACCENT,
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

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              fontSize: 56,
              lineHeight: 1.08,
              letterSpacing: -1.8,
              flex: 1,
            }}
          >
            <div style={{ fontWeight: 600 }}>Học ngoại ngữ</div>
            <div style={{ fontWeight: 600 }}>bằng cách</div>
            <div style={{ fontWeight: 600, color: ACCENT_DEEP, marginTop: 14 }}>
              nuôi một
            </div>
            <div style={{ fontWeight: 600, color: ACCENT_DEEP }}>thú nhỏ.</div>
          </div>
        </div>

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
            vochi.xyz
          </div>
        </div>
      </div>
    </div>
  );

  const svg = await satori(element, {
    width: SIZE.width,
    height: SIZE.height,
    fonts: fonts as never,
  });

  const png = new Resvg(svg, {
    fitTo: { mode: "width", value: SIZE.width },
  })
    .render()
    .asPng();

  await fs.mkdir(path.dirname(OUT), { recursive: true });
  await fs.writeFile(OUT, png);
  console.log(`wrote ${OUT} (${png.length} bytes)`);
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
