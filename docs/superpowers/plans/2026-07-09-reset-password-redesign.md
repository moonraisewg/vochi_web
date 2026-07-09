# Reset-Password Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign `/reset-password` to match the site's visual design system, add a confirm-password field with real-time validation, and add a duck mascot (Lottie) that reacts to form state.

**Architecture:** Extract pure validation logic into a standalone module (testable without React). Rewrite the page component to use `PageShell` + existing Tailwind design tokens, add a second password input with independent show/hide toggles, and a small local `DuckMascot` component that fetches/swaps between two Lottie JSON clips based on form state.

**Tech Stack:** Next.js (App Router), React, Tailwind (CSS custom properties already defined in `app/globals.css`), `lottie-react` (already a dependency), Vitest.

Spec: `docs/superpowers/specs/2026-07-09-reset-password-redesign-design.md`

---

### Task 1: Pure validation logic (TDD)

**Files:**
- Create: `lib/resetPasswordValidation.ts`
- Test: `tests/resetPasswordValidation.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/resetPasswordValidation.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { passwordsMismatch, canSubmitReset } from "../lib/resetPasswordValidation";

describe("passwordsMismatch", () => {
  it("is false when confirm is empty", () => {
    expect(passwordsMismatch("abc12345", "")).toBe(false);
  });

  it("is false when both passwords match", () => {
    expect(passwordsMismatch("abc12345", "abc12345")).toBe(false);
  });

  it("is true when confirm is non-empty and differs from password", () => {
    expect(passwordsMismatch("abc12345", "abc1234")).toBe(true);
  });
});

describe("canSubmitReset", () => {
  it("is false when password is under 8 characters", () => {
    expect(canSubmitReset("short12", "short12")).toBe(false);
  });

  it("is false when passwords do not match", () => {
    expect(canSubmitReset("abc12345", "xyz12345")).toBe(false);
  });

  it("is true when password is at least 8 characters and matches confirm", () => {
    expect(canSubmitReset("abc12345", "abc12345")).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/resetPasswordValidation.test.ts`
Expected: FAIL — `Cannot find module '../lib/resetPasswordValidation'`

- [ ] **Step 3: Write minimal implementation**

Create `lib/resetPasswordValidation.ts`:

```ts
// Pure form-validation helpers for /reset-password — kept free of React so
// they're trivially unit-testable, matching the lib/apiBase.ts pattern.

export function passwordsMismatch(password: string, confirm: string): boolean {
  return confirm.length > 0 && password !== confirm;
}

export function canSubmitReset(password: string, confirm: string): boolean {
  return password.length >= 8 && password === confirm;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run tests/resetPasswordValidation.test.ts`
Expected: PASS (6 tests)

- [ ] **Step 5: Commit**

```bash
git add lib/resetPasswordValidation.ts tests/resetPasswordValidation.test.ts
git commit -m "feat(reset-password): pure validation helpers for confirm-password field"
```

---

### Task 2: Finalize duck Lottie assets

**Files:**
- Delete: `public/lottie/duck/hi.json` (copied during brainstorming, not needed — the chosen design only uses idle/happy)
- Keep: `public/lottie/duck/idle.json`, `public/lottie/duck/happy.json` (already copied from `vocabochi/public/image/duck/` during brainstorming)

- [ ] **Step 1: Remove the unused clip**

```bash
rm public/lottie/duck/hi.json
ls public/lottie/duck/
```

Expected output: only `happy.json` and `idle.json` listed.

- [ ] **Step 2: Commit**

```bash
git add -A public/lottie/duck/
git commit -m "chore(reset-password): drop unused duck hi.json clip"
```

---

### Task 3: Rewrite the reset-password page

**Files:**
- Modify: `app/reset-password/page.tsx` (full rewrite)

- [ ] **Step 1: Replace the entire file contents**

Replace `app/reset-password/page.tsx` with:

```tsx
"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { PageShell } from "@/components/PageShell";
import { apiUrl } from "@/lib/apiBase";
import { passwordsMismatch, canSubmitReset } from "@/lib/resetPasswordValidation";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

function EyeIcon({ off }: { off: boolean }) {
  if (off) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.6 21.6 0 0 1 5.06-6.06M9.9 4.24A10.4 10.4 0 0 1 12 4c7 0 11 8 11 8a21.6 21.6 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function DuckMascot({ happy }: { happy: boolean }) {
  const [animationData, setAnimationData] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    let alive = true;
    fetch(happy ? "/lottie/duck/happy.json" : "/lottie/duck/idle.json")
      .then((r) => r.json())
      .then((d) => alive && setAnimationData(d))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [happy]);

  if (!animationData) return <div className="mx-auto h-[120px] w-[120px]" />;

  return (
    <Lottie
      animationData={animationData}
      loop={!happy}
      autoplay
      style={{ width: 120, height: 120, margin: "0 auto" }}
    />
  );
}

function PasswordField({
  label,
  value,
  onChange,
  show,
  onToggleShow,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggleShow: () => void;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
        {label}
      </span>
      <div className="relative mt-2">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-[var(--color-hairline-strong)] bg-white px-4 py-3 pr-11 text-[14px] outline-none focus:border-[var(--color-accent)]"
        />
        <button
          type="button"
          onClick={onToggleShow}
          aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-muted)]"
        >
          <EyeIcon off={!show} />
        </button>
      </div>
    </label>
  );
}

function ResetPasswordInner() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [state, setState] = useState<"idle" | "ok" | "error">("idle");

  const mismatch = passwordsMismatch(password, confirm);
  const canSubmit = canSubmitReset(password, confirm);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = new URLSearchParams(window.location.search).get("token");
    if (!token || !canSubmit) return setState("error");
    const r = await fetch(apiUrl("/api/auth/reset"), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    setState(r.ok ? "ok" : "error");
  };

  return (
    <section className="relative px-6 py-16 md:py-24">
      <div className="mx-auto max-w-[420px]">
        <div className="rounded-2xl border border-[var(--color-hairline-strong)] bg-[var(--color-surface)] p-6 lift-md">
          <h1 className="font-display text-[28px] tracking-tight">Đặt lại mật khẩu</h1>

          {state === "ok" ? (
            <p className="mt-4 text-[14px] text-[var(--color-ink-soft)]">
              ✅ Đã đổi mật khẩu. Quay lại ứng dụng và đăng nhập.
            </p>
          ) : (
            <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
              <PasswordField
                label="Mật khẩu mới (ít nhất 8 ký tự)"
                value={password}
                onChange={setPassword}
                show={showPassword}
                onToggleShow={() => setShowPassword((v) => !v)}
              />
              <PasswordField
                label="Nhập lại mật khẩu"
                value={confirm}
                onChange={setConfirm}
                show={showConfirm}
                onToggleShow={() => setShowConfirm((v) => !v)}
              />

              {mismatch && <p className="text-[13px] text-red-700">Mật khẩu nhập lại không khớp.</p>}

              {state === "error" && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
                  Liên kết không hợp lệ hoặc mật khẩu quá ngắn.
                </div>
              )}

              <button
                type="submit"
                disabled={!canSubmit}
                className="mt-2 w-full rounded-full bg-[var(--color-ink)] px-5 py-3 text-[14px] font-medium text-[var(--color-surface)] transition-colors hover:bg-[var(--color-accent-deep)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Đổi mật khẩu
              </button>
            </form>
          )}

          <div className="mt-6">
            <DuckMascot happy={state === "ok"} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ResetPasswordPage() {
  return <PageShell>{() => <ResetPasswordInner />}</PageShell>;
}
```

- [ ] **Step 2: Typecheck**

Run: `pnpm typecheck`
Expected: no errors.

- [ ] **Step 3: Lint**

Run: `pnpm lint`
Expected: no errors.

- [ ] **Step 4: Run the full test suite**

Run: `pnpm test`
Expected: all tests pass, including the 6 new ones from Task 1.

- [ ] **Step 5: Commit**

```bash
git add app/reset-password/page.tsx
git commit -m "feat(reset-password): PageShell styling, confirm-password field, duck mascot"
```

---

### Task 4: Manual verification

**Files:** none (verification only)

- [ ] **Step 1: Start the dev server**

```bash
pnpm dev
```

- [ ] **Step 2: Visit the page without a token**

Open `http://localhost:3000/reset-password` in a browser.

Expected:
- Page renders inside the site's normal Nav/Footer chrome (not bare `system-ui`).
- Duck mascot visible below the form, playing its idle animation.
- Two password fields, each with a working eye-icon show/hide toggle.
- Typing a mismatched confirm password shows the red "không khớp" message immediately (no submit needed).
- Submit button is disabled until password ≥ 8 chars and both fields match.

- [ ] **Step 3: Test the success path with a real token**

Trigger a real forgot-password email (see prior session notes: rate-limited to 3/email/hour), open the emailed link, submit a matching password ≥ 8 characters.

Expected: success message renders, duck switches to the "happy" animation (plays once, doesn't loop).

- [ ] **Step 4: Stop the dev server**

```bash
# Ctrl+C, or:
pkill -f "next dev"
```

---

### Task 5: Final full-suite check

**Files:** none (verification only)

- [ ] **Step 1: Run the complete check**

```bash
pnpm typecheck && pnpm lint && pnpm test
```

Expected: all green.

- [ ] **Step 2: Confirm git status is clean**

```bash
git status --short
```

Expected: no uncommitted changes (everything committed in Tasks 1-3).
