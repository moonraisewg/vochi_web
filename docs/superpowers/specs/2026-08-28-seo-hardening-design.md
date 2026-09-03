# SEO hardening cho vochi.xyz — design

Ngày: 2026-08-28
Trạng thái: đã duyệt, đang làm

## Bối cảnh

Blog đã chạy (PR #9 `feat/seo-multilang-blog`): 21 bài markdown (11 vi / 10 en) dưới
`content/tips/`, `/tips` + `/tips/[slug]`, 4 topic hub, sitemap có hreflang, JSON-LD
`BlogPosting` + `BreadcrumbList`. Việc còn lại không phải dựng blog mà là vá những chỗ
chưa chuẩn và dựng hàng rào để chất lượng không mục dần.

Đo trên nội dung hiện có:

| Chỉ số | Kết quả |
| --- | --- |
| Title > 60 ký tự (bị cắt trên SERP) | 7/21 |
| Description > 160 ký tự (bị cắt) | 9/21 |
| Bài không có internal link nào trong thân | 21/21 |
| Bài có OG image riêng | 0/21 (dùng chung `/og.png`) |

## Phạm vi

### 1. Bỏ những gì đang khai sai với Google

- `app/sitemap.ts` đặt `lastModified: now` cho mọi trang tĩnh. Mỗi lần deploy site khai
  "toàn bộ vừa đổi" → Google học cách bỏ qua `lastmod` của mình. Thay bằng ngày thật khai
  trong `ENTRIES`; bài viết lấy từ frontmatter `updatedAt`/`publishedAt` (đã đúng sẵn).
- JSON-LD của bài khai `wordCount: readingMinutes * 220` — số bịa. Đếm thật từ `bodyHtml`.
- Slug lạ: `generateMetadata` trả `{}` và không có `app/not-found.tsx` → trang 404 vẫn
  index được. Thêm not-found + `robots: { index: false }`.

### 2. Kéo traffic

- **OG riêng từng bài**: mở rộng `scripts/gen-og.tsx` (satori đã có sẵn) sinh
  `public/og/tips/<slug>.png` ở `prebuild`; metadata + JSON-LD trỏ đúng ảnh.
- **Internal link**: cuối mỗi bài hiện 3 bài liên quan (cùng ngôn ngữ, xếp theo số tag
  trùng) + link về topic hub tương ứng. Chọn bằng hàm thuần trong `lib/tips/related.ts`
  nên test được, không phụ thuộc render.
- **`/feed.xml`** (vi) và **`/feed.en.xml`** (en).

### 3. Tách tiêu đề SERP khỏi H1

Thêm frontmatter tuỳ chọn `metaTitle` / `metaDescription`, mặc định lấy `title` /
`description`. Nhờ đó giới hạn độ dài của SERP không ép phải cắt H1 hay lede cho khó đọc.
Chỉ đặt cho những bài đang bị cắt.

### 4. Hàng rào (chạy trong `pnpm check`)

`tests/seo-content.test.ts` fail build khi:

- bài thiếu frontmatter bắt buộc, hoặc trùng slug / title / description
- title hiệu dụng > 60 ký tự, description hiệu dụng ngoài khoảng 70–160
- sitemap có URL trùng, hoặc thiếu bài nào
- canonical của bài lệch với URL bài đó trong sitemap
- bài nào không có internal link nào (kể cả link do khối "bài liên quan" sinh ra)

Không có hàng rào này thì ba tháng nữa ai đó thêm bài thiếu description là hỏng âm thầm.

## Không làm

- **Không** đổi `?lang=en` sang `/en/...`. Đây là điểm yếu cấu trúc lớn nhất còn lại,
  nhưng đổi là phải 301 toàn bộ URL đang có; để riêng một ticket khi lưu lượng EN đủ lớn
  để đáng chịu rủi ro.
- Không thêm CMS. Nội dung vẫn là file `.md` trong repo.
- Không viết lại nội dung 21 bài đang có.

## Kiểm chứng

`pnpm check` (typecheck + lint + vitest + next build) phải xanh, và `next build` phải
sinh đủ 21 trang tĩnh + 21 ảnh OG.
