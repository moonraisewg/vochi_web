import { describe, expect, it } from "vitest";
import { POST } from "../app/api/sepay/ipn/route";

// The SePay IPN handler moved to vochi-api (POST /api/sepay/ipn on
// api.vochi.xyz). This route stays only as a tombstone: if the SePay dashboard
// is ever pointed back here it must fail LOUDLY (410) instead of silently
// half-processing a payment against a schema this app no longer matches. The
// handler takes no Request on purpose — it cannot read a payload, so it cannot
// act on one.
describe("retired SePay IPN route", () => {
  it("answers 410 Gone and points at the new endpoint", async () => {
    const res = POST();

    expect(res.status).toBe(410);
    await expect(res.json()).resolves.toEqual({
      error: { code: "Gone", message: "SePay IPN moved to https://api.vochi.xyz/api/sepay/ipn" },
    });
  });
});
