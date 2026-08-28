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
    url: "https://pub-473da2442c814f8396ee4d39873e0829.r2.dev/Vochi_0.3.0_universal.dmg",
    sha256: "f7e15d9f820897884b4d768d78fc94e75ce9aad37ae3b11bb13c5642fa0f666b",
  },
  windows: {
    url: "https://pub-473da2442c814f8396ee4d39873e0829.r2.dev/Vochi_0.3.0_x64-setup.exe",
    sha256: "d89c4cb72b420d8110569d862352537f61665ba2c7a11d7d6fbab776d67f9e82",
  },
};
