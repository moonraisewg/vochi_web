// Browser-side fetch calls used to hit this app's own bundled /api/* routes
// (same-origin). The backend has moved to a standalone service (vochi-api);
// NEXT_PUBLIC_API_BASE_URL must be set to its origin so these calls reach it
// instead. Empty/unset falls back to same-origin (relative path) — useful
// for local dev against this app's own routes before the full cutover.
export function apiUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
  return `${base.replace(/\/$/, "")}${path}`;
}
