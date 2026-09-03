---
slug: anki-vs-fsrs-for-chinese-learners
lang: en
title: "Anki vs FSRS for Chinese learners: which schedule wins?"
description: "SM-2 (classic Anki) vs FSRS (opt-in since Anki 23.10, default in Vô chi) on HSK vocabulary. Where the review-count savings actually show up as your deck grows."
keywords: [Anki vs FSRS, FSRS Chinese, SM-2 vs FSRS, spaced repetition Chinese, best SRS for Chinese, HSK study algorithm, Anki settings Chinese]
publishedAt: 2026-08-26
updatedAt: 2026-08-28
readingMinutes: 5
tags: [FSRS, Anki, HSK]
---

If you use Anki with the default (SM-2), you are reviewing more than you need. Anki added FSRS as an opt-in scheduler in 23.10 — you switch it on yourself in Deck Options, a fresh install still ships with SM-2 — and Vô chi runs FSRS by default with nothing to enable. For Chinese learners, the difference is significant either way — because you have 3,000+ characters to move through, not 300.

For the mechanics of why FSRS schedules differently in the first place, see [FSRS vs SM-2: what changed and why it matters](/tips/fsrs-vs-sm2-what-changed) — this post focuses specifically on what that means for HSK-sized vocabulary.

## What SM-2 assumes

Every card behaves the same. Every learner reviews the same way. Correct → interval doubles. Wrong → back to day 1. Cheap to compute, expensive on your time.

## What FSRS models

Each card has three numbers:

- **Difficulty** — how hard the card is for you specifically
- **Stability** — how many days until you would forget
- **Retrievability** — probability you can recall it right now

FSRS schedules the review right when retrievability drops to the target (usually 90%). Each card lives on its own schedule.

## On HSK vocab, how much do you save?

The open-spaced-repetition project's published benchmarks put FSRS at roughly 20–30% fewer reviews than SM-2 for the same retention target — treat that as an order-of-magnitude figure, not a guarantee for any specific deck, since it depends on deck size and how consistently you review. The savings barely register on a 150-word HSK 1 deck. They compound once you're carrying HSK 4–6 volume: thousands of cards, many of which you've already known solidly for months, where SM-2 keeps pulling them back on a fixed multiplier instead of reading how well you actually still know them.

## When the gap matters most

- Long decks (HSK 4–6)
- Learners who cannot review 7 days/week (FSRS handles gaps better)
- Working adults with 15-minute daily windows

## When you might not notice

- HSK 1 alone, first 30 days — decks are short, SM-2 is fine
- If you cram in bursts and skip weeks — no algorithm survives that

## Migrating

- In Anki 23.10+: it's off by default — go to Deck Options → FSRS and turn it on yourself. Optimize weights after 400+ reviews.
- In Vô chi: FSRS is the default. Nothing to configure.

## Verdict

For anyone past HSK 2, FSRS beats SM-2. The gap widens as the deck grows. If you are starting HSK 4, switch today.

### Try FSRS on your desktop

Vô chi is free on macOS and Windows, FSRS by default. HSK 1–3 decks ship in the app.
