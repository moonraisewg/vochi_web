import { describe, expect, it } from "vitest";
import { POPUP_MOBILE_DELAY_MS, popupDelayMs, shouldShowPopup } from "../lib/subscribePopup";

describe("shouldShowPopup", () => {
  it("hiện khi chưa từng đăng ký", () => {
    expect(shouldShowPopup(null)).toBe(true);
  });

  it("không hiện khi đã đăng ký thành công", () => {
    expect(shouldShowPopup("1")).toBe(false);
  });
});

describe("popupDelayMs", () => {
  it("desktop hiện ngay", () => {
    expect(popupDelayMs(false)).toBe(0);
  });

  it("mobile chờ để tránh án phạt intrusive interstitial của Google", () => {
    expect(popupDelayMs(true)).toBe(POPUP_MOBILE_DELAY_MS);
    expect(POPUP_MOBILE_DELAY_MS).toBeGreaterThanOrEqual(5000);
  });
});
