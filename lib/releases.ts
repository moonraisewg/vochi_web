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
    url: "https://pub-473da2442c814f8396ee4d39873e0829.r2.dev/Vochi_0.2.0_universal.dmg",
    sha256: "4c9af74069c81a0426a5bc2ee6a757d4a198c1ddeecad8d2d6c0db5f5788523b",
  },
  windows: {
    url: "https://pub-473da2442c814f8396ee4d39873e0829.r2.dev/Vochi_0.2.0_x64-setup.exe",
    sha256: "9a659a490abe304be79f213d9da66803f3883df644053896e166cd4595d31a36",
  },
};
