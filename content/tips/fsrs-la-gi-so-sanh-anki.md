---
slug: fsrs-la-gi-so-sanh-anki
lang: vi
title: "FSRS là gì? Vì sao nhớ lâu hơn Anki mà học ít hơn"
description: "FSRS (Free Spaced Repetition Scheduler) là thuật toán ôn từ mới nhất, giảm 40% số lần ôn so với Anki mặc định mà vẫn giữ retention 90%. Cách hoạt động và khác biệt so với SM-2."
metaDescription: "FSRS là thuật toán ôn tập mới, giảm 40% số lần ôn so với Anki mặc định mà vẫn giữ retention 90%. Cách hoạt động và khác biệt với SM-2."
keywords: [FSRS là gì, so sánh FSRS Anki, spaced repetition tiếng anh, SRS học từ vựng, SM-2 vs FSRS, học từ vựng nhớ lâu, thuật toán học từ vựng]
publishedAt: 2026-08-10
updatedAt: 2026-08-27
readingMinutes: 5
tags: [FSRS, SRS, Anki]
---

Anki dùng thuật toán **SM-2** từ năm 1987. FSRS ra đời 2022, đã trở thành mặc định trong Anki 23.10+. Vô chi dùng FSRS ngay từ đầu. Bài này giải thích khác biệt.

## SM-2: hai tham số cố định

SM-2 giả định: mọi thẻ hành xử giống nhau, và người học không đổi. Khi bạn trả lời đúng, khoảng cách nhân đôi. Trả lời sai, reset về 1 ngày. Đơn giản nhưng lãng phí: từ dễ vẫn bị lịch nhắc y hệt từ khó.

## FSRS: mô hình DSR ba biến

Mỗi thẻ được mô tả bởi ba số:

- **Difficulty** — độ khó của thẻ này với bạn cụ thể
- **Stability** — bao lâu bạn nhớ được (đơn vị: ngày)
- **Retrievability** — xác suất bạn nhớ được ngay bây giờ

FSRS chọn thời điểm ôn tại lúc retrievability rơi xuống ngưỡng bạn đặt (thường 90%). Kết quả: mỗi thẻ có lịch riêng biệt.

## Kết quả thực tế

Nghiên cứu của tác giả FSRS trên 20.000 người dùng: *giảm 40% số review* so với SM-2 mà retention vẫn 90%. Với 5.300 từ IELTS, con số này = tiết kiệm ~200 giờ cho một chu kỳ học đầy đủ.

## Vì sao Vô chi chọn FSRS?

Người Việt học IELTS thường có ít giờ rảnh. Ưu tiên là *ít review, giữ nhớ*. FSRS đúng ưu tiên đó. Ngoài ra Vô chi thêm hai lớp:

- Pet ảo "ngủ" khi không có thẻ đến hạn — chống ép học
- Lịch review offline, không cần server

### Chuyển từ Anki qua có mất tiến độ?

Không mất từ vựng. Đang trong quá trình build import Anki deck. Trong lúc chờ, có thể import CSV.
