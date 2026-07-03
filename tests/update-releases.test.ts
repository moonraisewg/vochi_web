import { describe, expect, it } from "vitest";
import { updateReleases } from "../scripts/update-releases";

const SAMPLE = `export const RELEASES: Releases = {
  mac: {
    url: "https://cdn.example/Vochi_0.1.19_universal.dmg",
    sha256: "OLDMACHASH",
  },
  windows: {
    url: "https://cdn.example/Vochi_0.1.19_x64-setup.exe",
    sha256: "OLDWINHASH",
  },
};
`;

describe("updateReleases", () => {
  it("swaps both urls and hashes while KEEPING the mac:/windows: keys", () => {
    const out = updateReleases(SAMPLE, {
      dmgUrl: "https://cdn.example/Vochi_0.1.20_universal.dmg",
      dmgSha: "NEWMACHASH",
      exeUrl: "https://cdn.example/Vochi_0.1.20_x64-setup.exe",
      exeSha: "NEWWINHASH",
    });
    // regression: the old script destroyed the `mac:`/`windows:` keys.
    expect(out).toContain("mac: {");
    expect(out).toContain("windows: {");
    expect(out).toContain('url: "https://cdn.example/Vochi_0.1.20_universal.dmg"');
    expect(out).toContain('sha256: "NEWMACHASH"');
    expect(out).toContain('url: "https://cdn.example/Vochi_0.1.20_x64-setup.exe"');
    expect(out).toContain('sha256: "NEWWINHASH"');
    expect(out).not.toContain("0.1.19");
    expect(out).not.toContain("OLDMACHASH");
    expect(out).not.toContain("OLDWINHASH");
  });

  it("leaves a platform untouched when its values are omitted (mac-only build)", () => {
    const out = updateReleases(SAMPLE, {
      dmgUrl: "https://cdn.example/Vochi_0.1.20_universal.dmg",
      dmgSha: "NEWMACHASH",
    });
    expect(out).toContain('url: "https://cdn.example/Vochi_0.1.20_universal.dmg"');
    // windows stays at 0.1.19
    expect(out).toContain('url: "https://cdn.example/Vochi_0.1.19_x64-setup.exe"');
    expect(out).toContain('sha256: "OLDWINHASH"');
  });

  it("treats the string 'null' and empty as skip", () => {
    const out = updateReleases(SAMPLE, { dmgUrl: "null", dmgSha: "", exeUrl: undefined });
    expect(out).toBe(SAMPLE);
  });
});
