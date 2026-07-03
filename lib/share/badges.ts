// Badge catalog for the public /share/badge/[key] pages.
//
// SYNC CONSTRAINT: this is a copy of the desktop app's catalog
// (vocabochi: src/i18n/achievementMeta.ts + Rust ACHIEVEMENTS array).
// Adding a badge in the app requires adding it here AND dropping its
// 384px PNG into public/badges/<key>.png.

export interface Loc {
  en: string;
  vi: string;
}

export interface BadgeMeta {
  name: Loc;
  desc: Loc;
}

const BADGES: Record<string, BadgeMeta> = {
  streak_3: {
    name: { en: "Spark", vi: "Nhen lửa" },
    desc: { en: "3-day streak", vi: "Chuỗi 3 ngày" },
  },
  streak_7: {
    name: { en: "Kindling", vi: "Bền lửa" },
    desc: { en: "7-day streak", vi: "Chuỗi 7 ngày" },
  },
  streak_14: {
    name: { en: "Two-week fire", vi: "Lửa hai tuần" },
    desc: { en: "14-day streak", vi: "Chuỗi 14 ngày" },
  },
  streak_30: {
    name: { en: "Monthly flame", vi: "Lửa tháng" },
    desc: { en: "30-day streak", vi: "Chuỗi 30 ngày" },
  },
  streak_100: {
    name: { en: "Century blaze", vi: "Lửa trăm ngày" },
    desc: { en: "100-day streak", vi: "Chuỗi 100 ngày" },
  },
  streak_365: {
    name: { en: "Eternal flame", vi: "Lửa bất diệt" },
    desc: { en: "365-day streak", vi: "Chuỗi 365 ngày" },
  },
  master_1: {
    name: { en: "First seed", vi: "Hạt giống đầu tiên" },
    desc: { en: "Master 1 word", vi: "Thuộc 1 từ" },
  },
  master_10: {
    name: { en: "Sprout", vi: "Chồi non" },
    desc: { en: "Master 10 words", vi: "Thuộc 10 từ" },
  },
  master_50: {
    name: { en: "Little plant", vi: "Cây nhỏ" },
    desc: { en: "Master 50 words", vi: "Thuộc 50 từ" },
  },
  master_100: {
    name: { en: "Grown tree", vi: "Cây trưởng thành" },
    desc: { en: "Master 100 words", vi: "Thuộc 100 từ" },
  },
  master_250: {
    name: { en: "Little grove", vi: "Rừng nhỏ" },
    desc: { en: "Master 250 words", vi: "Thuộc 250 từ" },
  },
  master_500: {
    name: { en: "Vocab master", vi: "Bậc thầy từ vựng" },
    desc: { en: "Master 500 words", vi: "Thuộc 500 từ" },
  },
  review_50: {
    name: { en: "Diligent", vi: "Chăm ôn" },
    desc: { en: "50 reviews", vi: "50 lượt ôn" },
  },
  review_250: {
    name: { en: "Persistent", vi: "Cần mẫn" },
    desc: { en: "250 reviews", vi: "250 lượt ôn" },
  },
  review_1000: {
    name: { en: "Tireless", vi: "Không mệt mỏi" },
    desc: { en: "1000 reviews", vi: "1000 lượt ôn" },
  },
  level_5: {
    name: { en: "Healthy pet", vi: "Thú cưng khoẻ mạnh" },
    desc: { en: "Reach level 5", vi: "Đạt Level 5" },
  },
  level_10: {
    name: { en: "Happy pet", vi: "Thú cưng hạnh phúc" },
    desc: { en: "Reach level 10", vi: "Đạt Level 10" },
  },
  level_20: {
    name: { en: "Legendary pet", vi: "Thú cưng huyền thoại" },
    desc: { en: "Reach level 20", vi: "Đạt Level 20" },
  },
  feed_100: {
    name: { en: "Devoted chef", vi: "Đầu bếp tận tâm" },
    desc: { en: "Feed the pet 100 times", vi: "Cho pet ăn 100 lần" },
  },
  perfect_1: {
    name: { en: "Flawless", vi: "Điểm tuyệt đối" },
    desc: { en: "A perfect session", vi: "1 phiên hoàn hảo" },
  },
  perfect_10: {
    name: { en: "Sharp memory", vi: "Trí nhớ siêu phàm" },
    desc: { en: "10 perfect sessions", vi: "10 phiên hoàn hảo" },
  },
  custom_word_1: {
    name: { en: "Collector", vi: "Nhà sưu tầm" },
    desc: { en: "Add your first word", vi: "Tự thêm từ đầu tiên" },
  },
  custom_word_50: {
    name: { en: "Word hoard", vi: "Kho từ riêng" },
    desc: { en: "Add 50 words", vi: "Tự thêm 50 từ" },
  },
  import_csv: {
    name: { en: "Bulk importer", vi: "Nhập khẩu học liệu" },
    desc: { en: "Import a CSV", vi: "Import CSV lần đầu" },
  },
  deck_complete: {
    name: { en: "Deck conqueror", vi: "Chinh phục bộ từ" },
    desc: { en: "Master a whole deck", vi: "Thuộc hết 1 bộ từ" },
  },
  pro_unlock: {
    name: { en: "Patron", vi: "Nhà bảo trợ" },
    desc: { en: "Upgrade to Pro", vi: "Nâng cấp Pro" },
  },
  early_bird: {
    name: { en: "Early bird", vi: "Chim sâu dậy sớm" },
    desc: { en: "Study before 7am", vi: "Học trước 7h sáng" },
  },
  night_owl: {
    name: { en: "Night owl", vi: "Cú đêm" },
    desc: { en: "Study after 11pm", vi: "Học sau 23h" },
  },
  weekend_warrior: {
    name: { en: "Weekend warrior", vi: "Chiến binh cuối tuần" },
    desc: { en: "Study Sat & Sun", vi: "Học cả T7 & CN" },
  },
  comeback: {
    name: { en: "Comeback", vi: "Trở lại lợi hại" },
    desc: { en: "Return after a break", vi: "Quay lại sau khi nghỉ" },
  },
};

export const BADGE_KEYS = Object.keys(BADGES);

export function isBadgeKey(key: string): boolean {
  return Object.prototype.hasOwnProperty.call(BADGES, key);
}

export function getBadgeMeta(key: string): BadgeMeta {
  const meta = BADGES[key];
  if (!meta) throw new Error(`unknown badge key: ${key}`);
  return meta;
}
