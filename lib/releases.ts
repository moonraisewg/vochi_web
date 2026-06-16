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
    url: "https://pub-473da2442c814f8396ee4d39873e0829.r2.dev/Vochi_0.1.15_universal%20(1).dmg",
    sha256: "9fbdd2f577cb84d6ea63aefeba9bad3cd214c553111851b9c9b89b232f535aa5",
  },
  windows: {
    url: "https://pub-473da2442c814f8396ee4d39873e0829.r2.dev/Vochi_0.1.14_x64_en-US.msi",
    sha256: "534a03e0a4e7b12de507173d489beee11039451f191927b88c6336ea15d18977",
  },
};
