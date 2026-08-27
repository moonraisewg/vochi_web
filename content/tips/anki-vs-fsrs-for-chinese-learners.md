---
slug: anki-vs-fsrs-for-chinese-learners
lang: en
title: "Anki vs FSRS for Chinese learners: which schedule wins?"
description: "SM-2 (classic Anki) vs FSRS (default in Anki 23.10+ and Vô chi) on HSK vocabulary. How many review hours you save, and when the difference actually shows up."
keywords: [Anki vs FSRS, FSRS Chinese, SM-2 vs FSRS, spaced repetition Chinese, best SRS for Chinese, HSK study algorithm, Anki settings Chinese]
publishedAt: 2026-08-26
readingMinutes: 5
tags: [FSRS, Anki, HSK]
---

If you use Anki with the default (SM-2), you are reviewing more than you need. FSRS ships as the default in Anki 23.10+ (and in Vô chi). For Chinese learners, the difference is significant — because you have 3,000+ characters to move through, not 300.

## What SM-2 assumes

Every card behaves the same. Every learner reviews the same way. Correct → interval doubles. Wrong → back to day 1. Cheap to compute, expensive on your time.

## What FSRS models

Each card has three numbers:

- **Difficulty** — how hard the card is for you specifically
- **Stability** — how many days until you would forget
- **Retrievability** — probability you can recall it right now

FSRS schedules the review right when retrievability drops to the target (usually 90%). Each card lives on its own schedule.

## On HSK vocab, how much do you save?

- HSK 1–3 (~1,200 words): SM-2 ~ 2,800 reviews / 3 months. FSRS ~ 1,700 for the same retention.
- HSK 6 (~5,000 cumulative): SM-2 ~ 12,000 reviews / year. FSRS ~ 7,200.

That is 4,800 fewer reviews for HSK 6. At 5 seconds/review, that is a saved ~6.6 hours per year — with the same retention.

## When the gap matters most

- Long decks (HSK 4–6)
- Learners who cannot review 7 days/week (FSRS handles gaps better)
- Working adults with 15-minute daily windows

## When you might not notice

- HSK 1 alone, first 30 days — decks are short, SM-2 is fine
- If you cram in bursts and skip weeks — no algorithm survives that

## Migrating

- In Anki 23.10+: Settings → Deck → FSRS on. Optimize weights after 400+ reviews.
- In Vô chi: FSRS is default. Nothing to configure.

## Verdict

For anyone past HSK 2, FSRS beats SM-2. The gap widens as the deck grows. If you are starting HSK 4, switch today.

### Try FSRS on your desktop

Vô chi is free on macOS and Windows, FSRS by default. HSK 1–3 decks ship in the app.
