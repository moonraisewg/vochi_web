// Bắt mã mời từ `?ref=` trên link chia sẻ của người giới thiệu
// (`referral-policy.ts` phía server dựng link dạng https://vochi.xyz/?ref=CODE).
//
// Web KHÔNG tự đổi mã lấy quyền lợi — việc đó do app làm sau khi người dùng tạo
// tài khoản. Ở đây chỉ giữ mã lại rồi hiện ở trang tải app, để người được mời
// không phải đi xin lại mã. Cố ý không đẩy mã qua đường resolve của UTM: đường
// đó khớp theo (platform + cửa sổ 20 phút + intent mới nhất), không ràng buộc
// danh tính — sai người thì mất quyền lợi của người khác và mở đường farm.
//
// Cùng khuôn hàm thuần với lib/utm.ts: store + now được tiêm vào để test không
// cần global.

export const REF_KEY = "vochi_ref";

/** Đủ dài để đi từ lúc bấm link tới lúc cài xong app, đủ ngắn để một mã cũ không
 *  nằm lại hàng quý rồi bám vào tài khoản chẳng liên quan. */
export const REF_TTL_MS = 30 * 24 * 60 * 60 * 1000;

const MIN_LEN = 4;
const MAX_LEN = 12;

type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

interface Stored {
  code: string;
  savedAt: number;
}

/** Cùng phép chuẩn hoá server dùng (`normalizeCode` trong referral-policy.ts) và
 *  app dùng (`ReferralPanel.tsx`): người ta dán mã kèm gạch ngang, khoảng trắng,
 *  chữ thường. Sau bước này chuỗi chỉ còn [0-9A-Z] nên render ra trang là an
 *  toàn. Chặn thêm độ dài để không lưu cả một URL vào localStorage.
 *
 *  Khoảng 4–12 thay vì đúng 6 (CODE_LENGTH hiện tại) là cố ý: web nằm ở repo
 *  khác server, siết cứng độ dài ở đây nghĩa là hôm nào server đổi độ dài mã thì
 *  mọi link mời im lặng chết. */
export function normalizeRefCode(raw: string): string {
  const code = raw.toUpperCase().replace(/[^0-9A-Z]/g, "");
  if (code.length < MIN_LEN || code.length > MAX_LEN) return "";
  return code;
}

export function readRefFromSearch(search: string): string {
  const raw = new URLSearchParams(search).get("ref");
  return raw ? normalizeRefCode(raw) : "";
}

function readStored(store: StorageLike): Stored | null {
  const raw = store.getItem(REF_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Stored;
    if (typeof parsed?.savedAt === "number" && typeof parsed?.code === "string") return parsed;
  } catch {
    // Bản ghi hỏng — coi như không có.
  }
  return null;
}

/** Chỉ ghi khi chưa có mã còn hạn: người mời đầu tiên thắng, giống first-touch
 *  của UTM. Nếu không, ai gửi link cuối cùng sẽ cướp công người mời thật. */
export function storeRefFirstTouch(code: string, now: number, store: StorageLike): void {
  const normalized = normalizeRefCode(code);
  if (!normalized) return;
  const existing = readStored(store);
  if (existing && now - existing.savedAt < REF_TTL_MS) return;
  store.setItem(REF_KEY, JSON.stringify({ code: normalized, savedAt: now } satisfies Stored));
}

export function getStoredRef(now: number, store: StorageLike): string | null {
  const existing = readStored(store);
  if (!existing) return null;
  if (now - existing.savedAt >= REF_TTL_MS) return null;
  return existing.code;
}
