import { afterEach, describe, expect, it } from "vitest";
import { apiUrl } from "../lib/apiBase";

describe("apiUrl", () => {
  const ORIGINAL = process.env.NEXT_PUBLIC_API_BASE_URL;

  afterEach(() => {
    if (ORIGINAL === undefined) delete process.env.NEXT_PUBLIC_API_BASE_URL;
    else process.env.NEXT_PUBLIC_API_BASE_URL = ORIGINAL;
  });

  it("falls back to a same-origin relative path when unset", () => {
    delete process.env.NEXT_PUBLIC_API_BASE_URL;
    expect(apiUrl("/api/checkout/create")).toBe("/api/checkout/create");
  });

  it("prefixes the configured base URL", () => {
    process.env.NEXT_PUBLIC_API_BASE_URL = "https://vochibe-dev.up.railway.app";
    expect(apiUrl("/api/checkout/create")).toBe("https://vochibe-dev.up.railway.app/api/checkout/create");
  });

  it("tolerates a trailing slash on the configured base URL", () => {
    process.env.NEXT_PUBLIC_API_BASE_URL = "https://vochibe-dev.up.railway.app/";
    expect(apiUrl("/api/auth/reset")).toBe("https://vochibe-dev.up.railway.app/api/auth/reset");
  });
});
