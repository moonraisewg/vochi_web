import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "../middleware";

const req = (path: string) => new NextRequest(new URL(`https://vochi.xyz${path}`));

// The backend moved to vochi-api; this app's /api/* routes are leftovers running
// a pre-migration Prisma schema against the SAME production DB. One of them (the
// SePay IPN) silently ate a real payment. The middleware is the single choke
// point that keeps the rest from doing the same — including any route file added
// later, which stays dead until someone puts it on the allowlist on purpose.
describe("legacy /api/* is closed", () => {
  it.each([
    "/api/auth/login",
    "/api/sync/pull",
    "/api/checkout/create",
    "/api/license/verify",
    "/api/sepay/ipn",
    "/api/licenses/claim",
    "/api/orders/VOCHI-1",
  ])("410s %s", (path) => {
    expect(middleware(req(path)).status).toBe(410);
  });

  // Still served by this app, still called by things we do not control:
  //   /api/updates/latest — baked into every shipped desktop binary
  //                         (src-tauri/tauri.conf.json updater endpoints)
  //   /api/og/*           — OG images for the vochi.xyz/s/<id> share pages
  it.each(["/api/updates/latest", "/api/og/badge", "/api/og/stats"])(
    "lets %s through",
    (path) => {
      expect(middleware(req(path)).status).not.toBe(410);
    },
  );

  it("still picks the language cookie on normal pages", () => {
    const res = middleware(req("/checkout"));
    expect(res.status).not.toBe(410);
    expect(res.cookies.get("vochi_lang")?.value).toBe("en");
  });
});
