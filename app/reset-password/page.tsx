"use client";
import { useState } from "react";
import { apiUrl } from "@/lib/apiBase";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [state, setState] = useState<"idle" | "ok" | "error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = new URLSearchParams(window.location.search).get("token");
    if (!token || password.length < 8) return setState("error");
    const r = await fetch(apiUrl("/api/auth/reset"), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    setState(r.ok ? "ok" : "error");
  };

  return (
    <main style={{ maxWidth: 420, margin: "80px auto", fontFamily: "system-ui" }}>
      <h1>Đặt lại mật khẩu</h1>
      {state === "ok" ? (
        <p>✅ Đã đổi mật khẩu. Quay lại ứng dụng và đăng nhập.</p>
      ) : (
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            type="password"
            placeholder="Mật khẩu mới (ít nhất 8 ký tự)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {state === "error" && (
            <p style={{ color: "crimson" }}>Liên kết không hợp lệ hoặc mật khẩu quá ngắn.</p>
          )}
          <button type="submit">Đổi mật khẩu</button>
        </form>
      )}
    </main>
  );
}
