// Single source of truth for downloadable app artifacts.
//
// While artifacts are not built yet, keep `url` and `sha256` as `null` — the
// download page renders those cards as "coming soon" (disabled) instead of a
// dead `href="#"`. After a build:
//   1. Upload the DMG / MSI (e.g. a GitHub release asset).
//   2. Fill in `url` and the real SHA-256 digest below.
// Nothing else needs to change — the page reads everything from here.

export type ReleaseArtifact = {
  /** Absolute download URL, or `null` until the artifact is published. */
  url: string | null;
  /** Hex SHA-256 of the artifact, or `null` until known. */
  sha256: string | null;
};

export type Releases = {
  mac: ReleaseArtifact;
  windows: ReleaseArtifact;
};

export const RELEASES: Releases = {
  mac: {
    url: "https://pub-473da2442c814f8396ee4d39873e0829.r2.dev/Vochi_0.1.18_universal.dmg",
    sha256: "fc299b512bdcf34637ea94975271999c79ce18818dbe5a79cfcd3fe7b74b802d",
  },
  windows: {
    url: "https://pub-473da2442c814f8396ee4d39873e0829.r2.dev/Vochi_0.1.18_x64-setup.exe",
    sha256: "4d7522f7f510d7cd73ae328aba2c9bb2e64f1d21a93eb56544fa13030f39d4fd",
  },
};
