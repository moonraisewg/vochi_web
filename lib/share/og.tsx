/* eslint-disable @next/next/no-img-element */
// Shared rendering for the /api/og/* share images (1200×630). The card sits
// inside a flat, div-drawn "MacBook" so a shared link reads like a product
// screenshot; paper background, dotted grid, lavender accent, mono micro-labels,
// vochi.xyz footer. JSX here is rendered by Satori (not the DOM), so next/image
// does not apply and emoji come from next/og's built-in Twemoji at render time.
import fs from "node:fs/promises";
import path from "node:path";
import type { BadgeMeta } from "./badges";
import type { ShareLang, ShareStats } from "./params";

export const OG_SIZE = { width: 1200, height: 630 } as const;

const ACCENT_DEEP = "#6d52c4";
const INK = "#0f1311";
const INK_SOFT = "#6b7066";
const HAIRLINE = "#d8d6cf";

export interface OgFont {
  name: string;
  data: Buffer;
  weight: 500 | 600;
  style: "normal";
}

// TTFs are committed under assets/fonts/ and fs-read at render time — no
// external fetch per request (see outputFileTracingIncludes in next.config.ts).
export async function loadOgFonts(): Promise<OgFont[]> {
  const dir = path.join(process.cwd(), "assets", "fonts");
  const [display, mono] = await Promise.all([
    fs.readFile(path.join(dir, "BeVietnamPro-SemiBold.ttf")),
    fs.readFile(path.join(dir, "IBMPlexMono-Medium.ttf")),
  ]);
  return [
    { name: "Display", data: display, weight: 600, style: "normal" },
    { name: "Mono", data: mono, weight: 500, style: "normal" },
  ];
}

// Satori has no fs/URL resolution — images must be data URIs.
export async function loadPublicPngDataUri(...segments: string[]): Promise<string> {
  const bytes = await fs.readFile(path.join(process.cwd(), "public", ...segments));
  return `data:image/png;base64,${bytes.toString("base64")}`;
}

const COPY = {
  vi: {
    badgeEyebrow: "Thành tựu mới",
    footer: "Học từ vựng với thú nhỏ",
    statsTitle: "Hành trình học từ vựng của tớ",
    streak: "ngày liên tiếp",
    words: "từ đã học",
    level: "level thú cưng",
  },
  en: {
    badgeEyebrow: "New achievement",
    footer: "Learn vocabulary with a tiny pet",
    statsTitle: "My vocabulary journey",
    streak: "day streak",
    words: "words learned",
    level: "pet level",
  },
} as const;

// A flat "MacBook" drawn entirely with divs (no device-image asset): dark bezel
// + light display holding the card, a tapered silver base, brand top-left,
// vochi.xyz footer.
function Laptop({
  logo,
  footer,
  children,
}: {
  logo: string;
  footer: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#fafaf7",
        fontFamily: "Display",
        color: INK,
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(900px 600px at 100% 100%, rgba(139,111,214,0.18) 0%, rgba(139,111,214,0) 60%)",
          display: "flex",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(15,19,17,0.07) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          display: "flex",
          opacity: 0.5,
        }}
      />

      <div style={{ position: "absolute", top: 40, left: 56, display: "flex", alignItems: "center", gap: 14 }}>
        <img src={logo} width={44} height={44} style={{ borderRadius: 11 }} alt="" />
        <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: -0.6 }}>Vô chi</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div
          style={{
            width: 900,
            background: "#1c1b24",
            borderRadius: 24,
            padding: "18px 16px 16px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxShadow: "0 30px 70px rgba(15,19,17,0.28), 0 6px 16px rgba(15,19,17,0.16)",
          }}
        >
          <div style={{ width: 7, height: 7, borderRadius: 999, background: "#3a3846", display: "flex", marginBottom: 12 }} />
          <div
            style={{
              width: "100%",
              height: 372,
              background: "#faf9f5",
              borderRadius: 12,
              display: "flex",
              overflow: "hidden",
            }}
          >
            {children}
          </div>
        </div>
        <div
          style={{
            width: 1010,
            height: 18,
            background: "linear-gradient(180deg, #dcdae4 0%, #b9b6c6 100%)",
            borderBottomLeftRadius: 14,
            borderBottomRightRadius: 14,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div style={{ width: 150, height: 8, background: "#a7a3b5", borderBottomLeftRadius: 8, borderBottomRightRadius: 8, display: "flex" }} />
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 34,
          display: "flex",
          fontFamily: "Mono",
          fontSize: 15,
          letterSpacing: 2,
          textTransform: "uppercase",
          color: INK_SOFT,
        }}
      >
        {footer} ·<span style={{ color: INK, fontWeight: 700, marginLeft: 8 }}>vochi.xyz</span>
      </div>
    </div>
  );
}

export function BadgeOgImage({ meta, badge, logo, lang }: {
  meta: BadgeMeta;
  badge: string;
  logo: string;
  lang: ShareLang;
}) {
  const copy = COPY[lang];
  return (
    <Laptop logo={logo} footer={copy.footer}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 40, width: "100%", padding: "0 44px" }}>
        <div
          style={{
            width: 220,
            height: 220,
            background: "#ffffff",
            border: `2px solid ${HAIRLINE}`,
            borderRadius: 26,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 4px rgba(15,19,17,0.05), 0 18px 44px rgba(15,19,17,0.1)",
          }}
        >
          <img src={badge} width={172} height={172} alt="" />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 440 }}>
          <div style={{ fontFamily: "Mono", fontSize: 15, letterSpacing: 2, textTransform: "uppercase", color: INK_SOFT, display: "flex" }}>
            🏆 {copy.badgeEyebrow}
          </div>
          <div style={{ fontSize: 52, fontWeight: 600, lineHeight: 1.05, letterSpacing: -1.6, color: ACCENT_DEEP, display: "flex" }}>
            {meta.name[lang]}
          </div>
          <div style={{ fontSize: 26, color: INK_SOFT, display: "flex" }}>{meta.desc[lang]}</div>
        </div>
      </div>
    </Laptop>
  );
}

export function StatsOgImage({ stats, logo, lang, book, level }: {
  stats: ShareStats;
  logo: string;
  lang: ShareLang;
  book: string;
  level: string;
}) {
  const copy = COPY[lang];
  const blocks = [
    { icon: <div style={{ fontSize: 40, display: "flex" }}>🔥</div>, value: stats.streak, label: copy.streak },
    { icon: <img src={book} width={44} height={44} alt="" />, value: stats.words, label: copy.words },
    { icon: <img src={level} width={44} height={44} alt="" />, value: stats.level, label: copy.level },
  ];
  return (
    <Laptop logo={logo} footer={copy.footer}>
      <div style={{ display: "flex", flexDirection: "column", width: "100%", padding: "30px 34px", gap: 22 }}>
        <div style={{ fontSize: 34, fontWeight: 600, letterSpacing: -1, display: "flex" }}>{copy.statsTitle}</div>
        <div style={{ display: "flex", gap: 20 }}>
          {blocks.map((b) => (
            <div
              key={b.label}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                background: "#ffffff",
                border: `2px solid ${HAIRLINE}`,
                borderRadius: 22,
                padding: "24px 16px",
                boxShadow: "0 2px 4px rgba(15,19,17,0.05), 0 16px 40px rgba(15,19,17,0.08)",
              }}
            >
              <div style={{ height: 48, display: "flex", alignItems: "center" }}>{b.icon}</div>
              <div style={{ fontSize: 50, fontWeight: 600, letterSpacing: -1.4, color: ACCENT_DEEP, display: "flex" }}>{b.value}</div>
              <div style={{ fontFamily: "Mono", fontSize: 13, letterSpacing: 1.4, textTransform: "uppercase", color: INK_SOFT, display: "flex" }}>
                {b.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Laptop>
  );
}
