/* eslint-disable @next/next/no-img-element */
// Shared rendering for the /api/og/* share images (1200×630). Visual language
// mirrors scripts/gen-og.tsx: paper background, dotted grid, lavender mascot
// accent, mono micro-labels, vochi.xyz footer. JSX here is rendered by Satori
// (not the DOM), so next/image does not apply.
import fs from "node:fs/promises";
import path from "node:path";
import type { BadgeMeta } from "./badges";
import type { ShareLang, ShareStats } from "./params";

export const OG_SIZE = { width: 1200, height: 630 } as const;

const ACCENT = "#8b6fd6";
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
    footer: "Học từ vựng với thú nhỏ · Không stress",
    statsPill: "macOS · Windows",
    statsTitle: "Hành trình học từ vựng của tớ",
    streak: "ngày liên tiếp",
    words: "từ đã học",
    level: "level thú cưng",
  },
  en: {
    badgeEyebrow: "New achievement",
    footer: "Learn vocabulary with a tiny pet · No stress",
    statsPill: "macOS · Windows",
    statsTitle: "My vocabulary journey",
    streak: "day streak",
    words: "words learned",
    level: "pet level",
  },
} as const;

function Frame({ logo, pill, footer, children }: {
  logo: string;
  pill: string;
  footer: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
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
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <img src={logo} alt="" width={56} height={56} style={{ borderRadius: 14 }} />
            <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: -0.8 }}>Vô chi</div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 18px",
              border: `1.5px solid ${HAIRLINE}`,
              borderRadius: 999,
              background: "#ffffff",
              fontFamily: "Mono",
              fontSize: 14,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: INK_SOFT,
            }}
          >
            <div style={{ width: 8, height: 8, background: ACCENT, borderRadius: 999, display: "flex" }} />
            {pill}
          </div>
        </div>

        {children}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: `1.5px solid ${HAIRLINE}`,
            paddingTop: 22,
            fontFamily: "Mono",
            fontSize: 16,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: INK_SOFT,
          }}
        >
          <div style={{ display: "flex" }}>{footer}</div>
          <div style={{ display: "flex", color: INK, fontWeight: 700 }}>vochi.xyz</div>
        </div>
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
    <Frame logo={logo} pill={copy.badgeEyebrow} footer={copy.footer}>
      <div style={{ display: "flex", alignItems: "center", gap: 64 }}>
        <div
          style={{
            width: 340,
            height: 340,
            background: "#ffffff",
            border: `2px solid ${HAIRLINE}`,
            borderRadius: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 4px rgba(15,19,17,0.06), 0 24px 60px rgba(15,19,17,0.12)",
          }}
        >
          <img src={badge} alt="" width={260} height={260} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18, flex: 1 }}>
          <div
            style={{
              fontFamily: "Mono",
              fontSize: 16,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: INK_SOFT,
              display: "flex",
            }}
          >
            🏆 {copy.badgeEyebrow}
          </div>
          <div style={{ fontSize: 64, fontWeight: 600, lineHeight: 1.06, letterSpacing: -1.8, color: ACCENT_DEEP, display: "flex" }}>
            {meta.name[lang]}
          </div>
          <div style={{ fontSize: 28, color: INK_SOFT, display: "flex" }}>{meta.desc[lang]}</div>
        </div>
      </div>
    </Frame>
  );
}

export function StatsOgImage({ stats, logo, lang }: {
  stats: ShareStats;
  logo: string;
  lang: ShareLang;
}) {
  const copy = COPY[lang];
  const blocks = [
    { emoji: "🔥", value: stats.streak, label: copy.streak },
    { emoji: "📖", value: stats.words, label: copy.words },
    { emoji: "⭐", value: stats.level, label: copy.level },
  ];
  return (
    <Frame logo={logo} pill={copy.statsPill} footer={copy.footer}>
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        <div style={{ fontSize: 44, fontWeight: 600, letterSpacing: -1.2, display: "flex" }}>
          {copy.statsTitle}
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          {blocks.map((block) => (
            <div
              key={block.label}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
                background: "#ffffff",
                border: `2px solid ${HAIRLINE}`,
                borderRadius: 28,
                padding: "34px 20px",
                boxShadow: "0 2px 4px rgba(15,19,17,0.06), 0 24px 60px rgba(15,19,17,0.10)",
              }}
            >
              <div style={{ fontSize: 44, display: "flex" }}>{block.emoji}</div>
              <div style={{ fontSize: 58, fontWeight: 600, letterSpacing: -1.5, color: ACCENT_DEEP, display: "flex" }}>
                {block.value}
              </div>
              <div
                style={{
                  fontFamily: "Mono",
                  fontSize: 14,
                  letterSpacing: 1.6,
                  textTransform: "uppercase",
                  color: INK_SOFT,
                  display: "flex",
                }}
              >
                {block.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}
