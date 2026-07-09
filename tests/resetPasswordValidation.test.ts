import { describe, it, expect } from "vitest";
import { passwordsMismatch, canSubmitReset } from "../lib/resetPasswordValidation";

describe("passwordsMismatch", () => {
  it("is false when confirm is empty", () => {
    expect(passwordsMismatch("abc12345", "")).toBe(false);
  });

  it("is false when both passwords match", () => {
    expect(passwordsMismatch("abc12345", "abc12345")).toBe(false);
  });

  it("is true when confirm is non-empty and differs from password", () => {
    expect(passwordsMismatch("abc12345", "abc1234")).toBe(true);
  });
});

describe("canSubmitReset", () => {
  it("is false when password is under 8 characters", () => {
    expect(canSubmitReset("short12", "short12")).toBe(false);
  });

  it("is false when passwords do not match", () => {
    expect(canSubmitReset("abc12345", "xyz12345")).toBe(false);
  });

  it("is true when password is at least 8 characters and matches confirm", () => {
    expect(canSubmitReset("abc12345", "abc12345")).toBe(true);
  });
});
