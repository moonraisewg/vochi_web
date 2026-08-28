/** Cờ localStorage đánh dấu người dùng ĐÃ đăng ký thành công. Chỉ ghi khi submit
 *  thành công — đóng popup bằng X hay Esc thì không ghi, nên lần sau vào trang
 *  chủ popup vẫn hiện. Đó là chủ ý, không phải thiếu sót. */
export const SUBSCRIBED_KEY = "vochi_sub";

/** Google phạt "intrusive interstitial" với popup che nội dung ngay khi vào trang
 *  trên mobile. Trên desktop không có án phạt này nên hiện ngay. */
export const POPUP_MOBILE_DELAY_MS = 5000;

export function shouldShowPopup(storedFlag: string | null): boolean {
  return storedFlag === null;
}

export function popupDelayMs(isMobile: boolean): number {
  return isMobile ? POPUP_MOBILE_DELAY_MS : 0;
}
