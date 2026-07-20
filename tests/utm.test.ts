import { describe, expect, it } from "vitest";
import { getStoredUtm, readUtmFromSearch, storeUtmFirstTouch, TTL_MS, UTM_KEY } from "../lib/utm";

function makeStore(initial: Record<string, string> = {}) {
  const map = new Map(Object.entries(initial));
  return {
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => void map.set(k, v),
    removeItem: (k: string) => void map.delete(k),
    _map: map,
  };
}

describe("readUtmFromSearch", () => {
  it("extracts all five utm params", () => {
    const utm = readUtmFromSearch("?utm_source=tiktok&utm_medium=bio&utm_campaign=launch&utm_term=t&utm_content=c");
    expect(utm).toEqual({ source: "tiktok", medium: "bio", campaign: "launch", term: "t", content: "c" });
  });
  it("returns empty object when no utm params", () => {
    expect(readUtmFromSearch("?foo=bar")).toEqual({});
  });
});

describe("storeUtmFirstTouch", () => {
  it("writes when nothing stored", () => {
    const s = makeStore();
    storeUtmFirstTouch({ source: "tiktok" }, 1000, s);
    expect(JSON.parse(s._map.get(UTM_KEY)!)).toEqual({ utm: { source: "tiktok" }, savedAt: 1000 });
  });
  it("does not overwrite an existing unexpired entry (first-touch)", () => {
    const s = makeStore({ [UTM_KEY]: JSON.stringify({ utm: { source: "first" }, savedAt: 1000 }) });
    storeUtmFirstTouch({ source: "second" }, 2000, s);
    expect(JSON.parse(s._map.get(UTM_KEY)!).utm).toEqual({ source: "first" });
  });
  it("does nothing when the incoming utm is empty", () => {
    const s = makeStore();
    storeUtmFirstTouch({}, 1000, s);
    expect(s._map.has(UTM_KEY)).toBe(false);
  });
  it("overwrites an expired entry", () => {
    const s = makeStore({ [UTM_KEY]: JSON.stringify({ utm: { source: "old" }, savedAt: 0 }) });
    storeUtmFirstTouch({ source: "fresh" }, TTL_MS + 1, s);
    expect(JSON.parse(s._map.get(UTM_KEY)!).utm).toEqual({ source: "fresh" });
  });
});

describe("getStoredUtm", () => {
  it("returns utm within TTL", () => {
    const s = makeStore({ [UTM_KEY]: JSON.stringify({ utm: { source: "x" }, savedAt: 1000 }) });
    expect(getStoredUtm(1000 + TTL_MS - 1, s)).toEqual({ source: "x" });
  });
  it("returns null when expired", () => {
    const s = makeStore({ [UTM_KEY]: JSON.stringify({ utm: { source: "x" }, savedAt: 0 }) });
    expect(getStoredUtm(TTL_MS + 1, s)).toBeNull();
  });
  it("returns null when nothing stored", () => {
    expect(getStoredUtm(1000, makeStore())).toBeNull();
  });
});
