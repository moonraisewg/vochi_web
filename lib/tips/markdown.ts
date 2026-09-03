// Zero-dep frontmatter + markdown → HTML for the tips blog.
// Scope is deliberately narrow: content we author, not arbitrary user input.
//
// Supported:
//   Frontmatter (--- fences) with `key: value`, `key: "quoted"`, `key: [a, b]`,
//     and multi-line array (`- item`) blocks.
//   Headings h2/h3 (# is reserved for the page title elsewhere).
//   Paragraphs, blank-line separated.
//   Unordered lists (- or *), ordered lists (1.).
//   Inline: **bold**, *em*, `code`, [text](url).
//   Simple pipe tables (| a | b | / |---|---| / | 1 | 2 |).
//
// Not supported: nested lists, blockquotes, code fences, images, HTML passthrough.

const ESC_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};
function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ESC_MAP[c]);
}

function stripQuotes(v: string): string {
  const t = v.trim();
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
    return t.slice(1, -1);
  }
  return t;
}

function parseScalar(v: string): string | number {
  const t = stripQuotes(v);
  if (/^-?\d+(\.\d+)?$/.test(t)) return Number(t);
  return t;
}

// Parses [a, b, "c d"] into ["a", "b", "c d"].
function parseInlineArray(v: string): string[] {
  const inner = v.trim().slice(1, -1);
  if (!inner.trim()) return [];
  const out: string[] = [];
  let buf = "";
  let quote: '"' | "'" | null = null;
  for (const ch of inner) {
    if (quote) {
      if (ch === quote) quote = null;
      else buf += ch;
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      continue;
    }
    if (ch === ",") {
      out.push(buf.trim());
      buf = "";
      continue;
    }
    buf += ch;
  }
  if (buf.trim()) out.push(buf.trim());
  return out.map((s) => stripQuotes(s));
}

export type Frontmatter = Record<string, string | number | string[]>;

export function parseFrontmatter(src: string): {
  data: Frontmatter;
  body: string;
} {
  if (!src.startsWith("---")) return { data: {}, body: src };
  const end = src.indexOf("\n---", 3);
  if (end === -1) return { data: {}, body: src };
  const headerBlock = src.slice(3, end).replace(/^\n/, "").replace(/\n$/, "");
  const body = src.slice(end + 4).replace(/^\n/, "");
  const data: Frontmatter = {};
  const lines = headerBlock.split("\n");
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const m = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!m) {
      i++;
      continue;
    }
    const [, key, rest] = m;
    if (rest === "") {
      // Multi-line array block: gather following `- item` lines.
      const arr: string[] = [];
      i++;
      while (i < lines.length && /^\s*-\s+/.test(lines[i])) {
        arr.push(stripQuotes(lines[i].replace(/^\s*-\s+/, "")));
        i++;
      }
      data[key] = arr;
      continue;
    }
    if (rest.startsWith("[") && rest.endsWith("]")) {
      data[key] = parseInlineArray(rest);
    } else {
      data[key] = parseScalar(rest);
    }
    i++;
  }
  return { data, body };
}

function renderInline(text: string): string {
  let out = escapeHtml(text);
  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, label, href) => {
    return `<a href="${href}">${label}</a>`;
  });
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
  out = out.replace(/`([^`]+)`/g, "<code>$1</code>");
  return out;
}

function isTableSep(line: string): boolean {
  return /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)+\|?\s*$/.test(line);
}

function splitRow(line: string): string[] {
  const t = line.trim().replace(/^\|/, "").replace(/\|$/, "");
  return t.split("|").map((c) => c.trim());
}

export function renderMarkdown(md: string): string {
  const lines = md.split("\n");
  const out: string[] = [];
  let i = 0;
  const flushPara = (buf: string[]) => {
    if (!buf.length) return;
    out.push(`<p>${renderInline(buf.join(" ").trim())}</p>`);
    buf.length = 0;
  };
  const para: string[] = [];

  while (i < lines.length) {
    const line = lines[i];

    if (/^\s*$/.test(line)) {
      flushPara(para);
      i++;
      continue;
    }

    const h = line.match(/^(#{2,3})\s+(.*)$/);
    if (h) {
      flushPara(para);
      const tag = h[1].length === 2 ? "h2" : "h3";
      out.push(`<${tag}>${renderInline(h[2])}</${tag}>`);
      i++;
      continue;
    }

    if (/^\s*[-*]\s+/.test(line)) {
      flushPara(para);
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*]\s+/, ""));
        i++;
      }
      out.push(
        `<ul>${items.map((it) => `<li>${renderInline(it)}</li>`).join("")}</ul>`,
      );
      continue;
    }

    if (/^\s*\d+\.\s+/.test(line)) {
      flushPara(para);
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, ""));
        i++;
      }
      out.push(
        `<ol>${items.map((it) => `<li>${renderInline(it)}</li>`).join("")}</ol>`,
      );
      continue;
    }

    // Pipe table: header row + separator + body rows.
    if (line.includes("|") && i + 1 < lines.length && isTableSep(lines[i + 1])) {
      flushPara(para);
      const header = splitRow(line);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && lines[i].includes("|") && lines[i].trim() !== "") {
        rows.push(splitRow(lines[i]));
        i++;
      }
      const thead = `<thead><tr>${header.map((c) => `<th>${renderInline(c)}</th>`).join("")}</tr></thead>`;
      const tbody = `<tbody>${rows
        .map(
          (r) => `<tr>${r.map((c) => `<td>${renderInline(c)}</td>`).join("")}</tr>`,
        )
        .join("")}</tbody>`;
      out.push(`<table>${thead}${tbody}</table>`);
      continue;
    }

    para.push(line);
    i++;
  }
  flushPara(para);
  return out.join("\n");
}

/** Số từ thật của bài, đếm từ HTML đã render. JSON-LD trước đây khai
 *  readingMinutes * 220 — một con số bịa gửi thẳng cho Google. */
export function wordCount(bodyHtml: string): number {
  const text = bodyHtml
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;|&#\d+;/gi, " ");
  return text.split(/\s+/).filter(Boolean).length;
}
