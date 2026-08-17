import { describe, expect, it } from "vitest";
import {
  REF_KEY,
  REF_TTL_MS,
  getStoredRef,
  normalizeRefCode,
  readRefFromSearch,
  storeRefFirstTouch,
} from "../lib/referral";

function fakeStore(initial: Record<string, string> = {}) {
  const map = new Map(Object.entries(initial));
  return {
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => void map.set(k, v),
    removeItem: (k: string) => void map.delete(k),
    _map: map,
  };
}

describe("normalizeRefCode", () => {
  it("viết hoa và bỏ dấu gạch, khoảng trắng", () => {
    expect(normalizeRefCode(" ab2-4cd ")).toBe("AB24CD");
  });

  it("bỏ mọi ký tự ngoài 0-9A-Z, nên payload rác không sống sót", () => {
    expect(normalizeRefCode("<script>")).toBe("SCRIPT");
    expect(normalizeRefCode("AB2#4C@D")).toBe("AB24CD");
  });

  it("từ chối chuỗi quá ngắn hoặc quá dài", () => {
    expect(normalizeRefCode("AB")).toBe("");
    expect(normalizeRefCode("A".repeat(40))).toBe("");
  });

  it("trả rỗng khi không có gì dùng được", () => {
    expect(normalizeRefCode("")).toBe("");
    expect(normalizeRefCode("!!!!")).toBe("");
  });
});

describe("readRefFromSearch", () => {
  it("đọc và chuẩn hoá tham số ref", () => {
    expect(readRefFromSearch("?ref=ab24cd")).toBe("AB24CD");
  });

  it("bỏ qua khi không có ref", () => {
    expect(readRefFromSearch("?utm_source=tiktok")).toBe("");
  });

  it("bỏ qua ref rác", () => {
    expect(readRefFromSearch("?ref=--")).toBe("");
  });
});

describe("storeRefFirstTouch / getStoredRef", () => {
  const now = 1_700_000_000_000;

  it("lưu mã hợp lệ và đọc lại được", () => {
    const s = fakeStore();
    storeRefFirstTouch("AB24CD", now, s);
    expect(getStoredRef(now, s)).toBe("AB24CD");
  });

  it("lần chạm đầu tiên thắng — mã sau không ghi đè", () => {
    const s = fakeStore();
    storeRefFirstTouch("AB24CD", now, s);
    storeRefFirstTouch("ZZ99ZZ", now + 1000, s);
    expect(getStoredRef(now + 1000, s)).toBe("AB24CD");
  });

  it("không lưu mã rỗng", () => {
    const s = fakeStore();
    storeRefFirstTouch("", now, s);
    expect(getStoredRef(now, s)).toBeNull();
  });

  it("hết hạn sau TTL", () => {
    const s = fakeStore();
    storeRefFirstTouch("AB24CD", now, s);
    expect(getStoredRef(now + REF_TTL_MS - 1, s)).toBe("AB24CD");
    expect(getStoredRef(now + REF_TTL_MS, s)).toBeNull();
  });

  it("hết hạn rồi thì mã mới ghi đè được", () => {
    const s = fakeStore();
    storeRefFirstTouch("AB24CD", now, s);
    storeRefFirstTouch("ZZ99ZZ", now + REF_TTL_MS, s);
    expect(getStoredRef(now + REF_TTL_MS, s)).toBe("ZZ99ZZ");
  });

  it("bản ghi hỏng coi như không có, không ném lỗi", () => {
    const s = fakeStore({ [REF_KEY]: "{khong-phai-json" });
    expect(getStoredRef(now, s)).toBeNull();
  });
});
