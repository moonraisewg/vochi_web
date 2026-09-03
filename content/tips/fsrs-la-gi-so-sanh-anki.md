---
slug: fsrs-la-gi-so-sanh-anki
lang: vi
title: "FSRS là gì? Vì sao nhớ lâu hơn Anki mà học ít hơn"
description: "FSRS (Free Spaced Repetition Scheduler) là thuật toán ôn từ mới nhất, giảm số lần ôn so với Anki mặc định mà vẫn giữ retention cao. Cách hoạt động và khác biệt so với SM-2."
metaDescription: "FSRS là thuật toán ôn tập mới, giảm số lần ôn so với Anki mặc định mà vẫn giữ retention cao. Cách hoạt động và khác biệt với SM-2."
keywords: [FSRS là gì, so sánh FSRS Anki, spaced repetition tiếng anh, SRS học từ vựng, SM-2 vs FSRS, học từ vựng nhớ lâu, thuật toán học từ vựng]
publishedAt: 2026-08-10
updatedAt: 2026-08-28
readingMinutes: 5
tags: [FSRS, SRS, Anki]
---

Anki dùng thuật toán **SM-2** từ năm 1987. FSRS ra đời 2022, và từ bản Anki 23.10 người dùng có thể tự bật FSRS trong Deck Options — nhưng SM-2 vẫn là mặc định khi cài mới, FSRS chỉ là tuỳ chọn. Vô chi thì dùng FSRS ngay từ đầu, không cần bật. Bài này giải thích khác biệt.

## SM-2: hai tham số cố định

SM-2 giả định: mọi thẻ hành xử giống nhau, và người học không đổi. Khi bạn trả lời đúng, khoảng cách nhân đôi. Trả lời sai, reset về 1 ngày. Đơn giản nhưng lãng phí: từ dễ vẫn bị lịch nhắc y hệt từ khó.

## FSRS: mô hình DSR ba biến

Mỗi thẻ được mô tả bởi ba số:

- **Difficulty** — độ khó của thẻ này với bạn cụ thể
- **Stability** — bao lâu bạn nhớ được (đơn vị: ngày)
- **Retrievability** — xác suất bạn nhớ được ngay bây giờ

FSRS chọn thời điểm ôn tại lúc retrievability rơi xuống ngưỡng bạn đặt (thường 90%). Kết quả: mỗi thẻ có lịch riêng biệt.

## Kết quả thực tế

Theo benchmark công khai của dự án open-spaced-repetition (chạy trên số lượng lớn dữ liệu ôn tập thực tế từ Anki), FSRS thường cần *ít hơn khoảng 20-30% số lần ôn* so với SM-2 để giữ cùng mức retention — đây là con số ước lượng chung, không phải cam kết cho mọi bộ thẻ, vì còn phụ thuộc số lượng từ và tần suất ôn của từng người. Bộ càng lớn (như 5.300 từ IELTS/TOEIC), chênh lệch càng rõ, vì SM-2 vẫn kéo những từ bạn đã thuộc lâu về ôn lại theo công thức cố định thay vì đọc đúng mức độ nhớ thật.

## Vì sao Vô chi chọn FSRS?

Người Việt học IELTS thường có ít giờ rảnh. Ưu tiên là *ít review, giữ nhớ*. FSRS đúng ưu tiên đó. Ngoài ra Vô chi thêm hai lớp:

- Pet ảo "ngủ" khi không có thẻ đến hạn — chống ép học
- Lịch review offline, không cần server

### Chuyển từ Anki qua có mất tiến độ?

Không mất từ vựng. Đang trong quá trình build import Anki deck. Trong lúc chờ, có thể import CSV.
