import { describe, expect, it } from "vitest";
import { parseUpdaterManifest } from "../lib/server/updater";

const validManifest = JSON.stringify({
  version: "0.1.16",
  pub_date: "2026-06-25T05:06:37Z",
  platforms: {
    "darwin-x86_64": { signature: "sig", url: "https://r2/Vochi.app.tar.gz" },
    "windows-x86_64": { signature: "sig", url: "https://r2/Vochi_0.1.16_x64-setup.exe" },
  },
});

describe("parseUpdaterManifest", () => {
  it("returns the manifest object for a valid manifest", () => {
    const m = parseUpdaterManifest(validManifest);
    expect(m.version).toBe("0.1.16");
    expect(m.platforms["darwin-x86_64"]).toBeDefined();
  });

  it("throws on non-JSON input", () => {
    expect(() => parseUpdaterManifest("<html>nope</html>")).toThrow();
  });

  it("throws when version is missing", () => {
    expect(() => parseUpdaterManifest(JSON.stringify({ platforms: {} }))).toThrow();
  });

  it("throws when platforms is missing", () => {
    expect(() => parseUpdaterManifest(JSON.stringify({ version: "0.1.16" }))).toThrow();
  });

  it("throws when platforms is null", () => {
    expect(() =>
      parseUpdaterManifest(JSON.stringify({ version: "0.1.16", platforms: null })),
    ).toThrow();
  });
});
