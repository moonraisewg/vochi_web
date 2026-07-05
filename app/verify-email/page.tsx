"use client";
import { useEffect, useState } from "react";

export default function VerifyEmailPage() {
  const [state, setState] = useState<"working" | "ok" | "error">("working");

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) return setState("error");
    fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((r) => setState(r.ok ? "ok" : "error"))
      .catch(() => setState("error"));
  }, []);

  return (
    <main style={{ maxWidth: 420, margin: "80px auto", textAlign: "center", fontFamily: "system-ui" }}>
      {state === "working" && <p>Đang xác nhận email…</p>}
      {state === "ok" && <p>✅ Đã xác nhận email. Quay lại ứng dụng Vô chi và đăng nhập.</p>}
      {state === "error" && <p>❌ Liên kết không hợp lệ hoặc đã hết hạn.</p>}
    </main>
  );
}
