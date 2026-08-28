---
slug: fsrs-vs-sm2-what-changed
lang: en
title: "FSRS vs SM-2: what changed and why it matters"
description: "SM-2 applies one fixed formula to every card. FSRS trains a model on your real review history to predict memory stability instead. What changed, explained."
keywords: [FSRS vs SM-2, FSRS Anki, spaced repetition algorithm, SM-2 algorithm, Anki default scheduler, FSRS explained, best spaced repetition algorithm]
publishedAt: 2026-08-28
readingMinutes: 7
tags: [FSRS, SRS, Anki]
---

Anki has offered two scheduling algorithms since October 2023: SM-2, which it has used since the beginning, and FSRS, a newer algorithm that tries to predict your memory instead of assuming it. Most explainers of the difference either wave vaguely at "AI-powered scheduling" or repeat the same unverified stat from post to post. Here's what actually changed mechanically, and why it matters more the bigger your vocabulary deck gets.

## What SM-2 actually does

SM-2 — the algorithm SuperMemo published in 1987, which Anki adopted as its default scheduler — keeps two numbers per card: an **ease factor** (starting around 2.5) and an **interval** (days until the next review). Answer correctly, and the next interval is roughly `last_interval × ease_factor`. Answer wrong, and the interval resets to near zero while the ease factor drops.

That's the whole model. The ease factor is the only place SM-2 records "how hard is this card for me," and it moves in fixed steps regardless of how early or late your review was, or what your recall pattern has actually looked like over the card's life. A word you've nailed twenty times in a row and a word you keep mixing up with its neighbor get scheduled by the same multiplication, just with different numbers plugged in.

## What FSRS does differently

FSRS (Free Spaced Repetition Scheduler) — built by Jarrett Ye and the open-spaced-repetition community, and released as open source — replaces the fixed formula with a small model trained on real review logs rather than hand-tuned constants. For every card, it estimates:

- **Difficulty** — how hard this specific card is for you
- **Stability** — how many days it would take for your recall probability to decay to a set threshold
- **Retrievability** — the live probability you could recall the card right now

FSRS schedules the next review for whenever retrievability is forecast to fall to your target (usually 90%). The underlying model's parameters come from fitting recall patterns across large numbers of real reviews, so it isn't just reacting to pass/fail — it's reading how *quickly* you passed or failed, how overdue the review already was, and how that compares to similar cards.

The practical shift: SM-2 applies one formula to every card, uniformly. FSRS fits a curve to how you, specifically, have been forgetting that specific card.

## Is FSRS actually Anki's default now?

Worth clearing up, since a lot of posts get this wrong: not quite. Anki added FSRS as an *optional* scheduler in version 23.10; you switch it on yourself in Deck Options, and a fresh Anki install still uses SM-2 out of the box. There's an open proposal on Anki's GitHub to flip the default, but as of this writing it hasn't shipped — the maintainers are still working through edge cases like new users misreading the "Hard" button. FSRS is what the Anki team and most serious users recommend switching to; it just isn't automatic yet. Vô chi skips the question entirely — FSRS runs from your first review, no setting to find.

## Why it matters for hundreds or thousands of words, not ten

The gap between SM-2 and FSRS barely shows up on a 20-card deck reviewed for a week. It shows up once you're carrying real volume — the kind of vocabulary load HSK or IELTS study actually involves.

With SM-2, a word you've solidly known for months still gets pulled back into review on a schedule that isn't reading your actual retention — just doubling a number. Multiply that across a few hundred "easy" words and you're spending real minutes on cards that didn't need to be reviewed yet. FSRS, tracking stability per card, lets those intervals stretch further before pulling the word back — while pulling shaky cards back *sooner* than a flat multiplier would, because it's watching that card's specific difficulty rather than a global default. Fewer wasted reviews on what you already know, better-timed reviews on what you don't — same underlying principle behind [why spaced repetition speeds up character memorization](/tips/memorize-chinese-characters-faster-srs) in the first place, just scheduled more precisely.

## What the benchmarks actually show

The open-spaced-repetition project benchmarks scheduler accuracy using log loss (how well the algorithm's predicted recall probability matches what actually happened) across tens of thousands of real Anki collections. Comparisons published by FSRS's own maintainers on Anki's GitHub repo show FSRS with default parameters predicting recall more accurately than SM-2 in roughly 92% of collections, rising to around 99% once a user's FSRS parameters are optimized against their own review history. The project's published benchmarks also report FSRS needing roughly 20-30% fewer reviews than SM-2 to hold the same retention target — treat that as an order-of-magnitude figure rather than a guarantee for any single deck, since it depends heavily on deck size and how consistently you review.

## If you're already on Anki

Deck Options → FSRS, turn it on, then hit Optimize after you've logged a few hundred reviews so the model has enough history to fit your parameters. If you're studying Mandarin specifically, [we've broken down the numbers for HSK decks separately](/tips/anki-vs-fsrs-for-chinese-learners) — the gap between the two algorithms widens fast once you're past the first couple hundred characters. Testing this against a real deck, like our [HSK 3 vocabulary list](/tips/hsk-3-vocabulary-list-with-examples), is the fastest way to feel the difference yourself: you'll notice FSRS quietly skipping reviews on words you already have cold.

## Verdict

SM-2 is simple, predictable, and was a reasonable design in 1987. FSRS is more work to build but scales far better once your deck stops being small — which, for anyone working through HSK 1-6 or a serious English vocabulary list, happens fast. Vô chi runs FSRS by default on macOS and Windows, so there's nothing to configure — [download it](/download) and it's already scheduling this way. For more on the mechanics of spaced repetition, see [Learning tips](/learning-tip).
