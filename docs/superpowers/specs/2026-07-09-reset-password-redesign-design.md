# Reset-password page redesign: confirm-password field + duck mascot

## Context

`/reset-password` (`app/reset-password/page.tsx`) is currently a bare, unstyled page (`system-ui` font, inline styles) — one of two auth utility pages (the other being `/verify-email`) that were never given the visual polish the rest of the site has (see `PageShell`, `PetDevice.tsx`, `app/globals.css`'s `--color-*` design tokens). It also only has a single password input, with no "confirm password" field — a user typo produces no feedback until the confusing generic error state.

This redesign brings the page in line with the rest of the site and adds a second password field, using the desktop app's existing "duck" pet as a mascot that reacts to form state.

## Scope

In scope: `/reset-password` page only. Not in scope: `/verify-email` (same bare-style issue, but not requested here — a candidate for a follow-up, not bundled into this change).

## Design

### Layout & style

Wrap the page in `<PageShell>` (adds `Nav` + `Footer`, matching every other page). Replace the ad-hoc inline styles with the site's existing Tailwind design tokens (`--color-accent`, `--color-bg`, `--color-surface`, `--color-tint`, `--shadow-soft`, `--font-display`/`--font-body`) — no new tokens. Card layout modeled on `PetDevice.tsx`'s "device chassis" (white rounded card on the tinted page background): form fields on top, duck mascot centered below.

### Duck mascot (Lottie)

Two animation clips copied from the desktop app's asset set (`vocabochi/public/image/duck/{idle,happy}.json`) into `vochi_web/public/lottie/duck/`. Rendered via the same `dynamic(() => import("lottie-react"), { ssr: false })` pattern already used in `PetDevice.tsx` — no new dependency (`lottie-react` is already installed).

State machine: `idle` while the form is in its default/editing state; switches to `happy` (played once, not looped) when `state === "ok"` (password successfully changed). No animation change for the `error` state — the duck just stays idle.

### Form changes

- Second `<input type="password">` for confirmation, each of the two password fields gets its own independent show/hide toggle (eye icon button). No icon library exists in this codebase (confirmed) — use a small inline SVG (eye / eye-slash), no new dependency.
- Real-time mismatch validation: once both fields are non-empty, if they don't match, show an inline red error message immediately below the fields — do not wait for submit.
- Submit button (`Đổi mật khẩu`) is disabled when: password is under 8 characters, OR the two password fields don't match. (Existing server-side length validation stays as defense in depth — client-side disabling is a UX nicety, not the source of truth.)
- Existing behavior unchanged: reads `?token=` from the URL on mount, submits via `apiUrl("/api/auth/reset")` (already wired to the standalone backend), same `idle | ok | error` state names.

### Testing

Pure validation logic (mismatch check, submit-enabled check) extracted into a plain function (same pattern as `lib/apiBase.ts` — pure, no React, easy to unit test) and covered by tests written test-first (red → green). The Lottie visual swap itself is not meaningfully unit-testable (it's a rendering effect) and is verified manually instead.

## Explicitly out of scope

- `/verify-email`'s matching bare-style issue — not requested, not bundled here.
- Any change to the actual `/api/auth/reset` endpoint or its validation rules (server-side already enforces min-8-chars; this only adds client-side UX around it).
