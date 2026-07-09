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
