import { Resend } from "resend";
import { prisma } from "./prisma";
import { openString } from "./crypto";
import { serverEnv } from "./env";

export async function processEmailOutboxOnce(limit = 10) {
  const env = serverEnv();
  const pending = await prisma.emailOutbox.findMany({
    where: { status: { in: ["pending", "failed"] }, attempts: { lt: 5 } },
    orderBy: { createdAt: "asc" },
    take: limit,
  });

  const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;
  let sent = 0;

  for (const item of pending) {
    await prisma.emailOutbox.update({
      where: { id: item.id },
      data: { status: "sending", attempts: { increment: 1 }, lastError: null },
    });

    try {
      if (!resend) throw new Error("RESEND_API_KEY is not configured");
      if (item.type === "license_issued") {
        const payload = item.payload as {
          plan: string;
          encryptedLicenseKey: string;
          expiresAt: string | null;
        };
        const licenseKey = openString(payload.encryptedLicenseKey);
        await resend.emails.send({
          from: env.RESEND_FROM_EMAIL,
          to: item.recipient,
          subject: "Your Vô chi license",
          text: [
            "Thanks for adopting a Vô chi pet.",
            "",
            `Plan: ${payload.plan}`,
            `License key: ${licenseKey}`,
            payload.expiresAt ? `Expires: ${payload.expiresAt}` : "Expires: never",
            "",
            "Paste this key in the Vô chi desktop app to unlock your plan.",
            "Need help? Reply to this email or write hi@vochi.app.",
          ].join("\n"),
        });
      } else if (item.type === "batch_license_issued") {
        const payload = item.payload as {
          plan: string;
          encryptedLicenseKeys: string[];
          expiresAt: string | null;
        };
        const keys = payload.encryptedLicenseKeys.map((k) => openString(k));
        await resend.emails.send({
          from: env.RESEND_FROM_EMAIL,
          to: item.recipient,
          subject: `Your Vô chi licenses (${keys.length} keys)`,
          text: [
            "Thanks for adopting Vô chi pets.",
            "",
            `Plan: ${payload.plan}`,
            payload.expiresAt ? `Expires: ${payload.expiresAt}` : "Expires: never",
            "",
            `Your ${keys.length} license keys:`,
            "",
            ...keys.map((k, i) => `${String(i + 1).padStart(2, " ")}. ${k}`),
            "",
            "Paste any key in the Vô chi desktop app to unlock your plan.",
            "Need help? Reply to this email or write hi@vochi.app.",
          ].join("\n"),
        });
      } else if (item.type === "account_verify_email") {
        const payload = item.payload as { verifyUrl: string };
        await resend.emails.send({
          from: env.RESEND_FROM_EMAIL,
          to: item.recipient,
          subject: "Xác nhận email Vô chi",
          text: [
            "Chào bạn,",
            "",
            "Nhấn vào liên kết dưới đây để xác nhận email và kích hoạt tài khoản Vô chi:",
            payload.verifyUrl,
            "",
            "Liên kết có hiệu lực trong 24 giờ. Nếu bạn không tạo tài khoản, hãy bỏ qua email này.",
          ].join("\n"),
        });
      } else if (item.type === "account_reset_password") {
        const payload = item.payload as { resetUrl: string };
        await resend.emails.send({
          from: env.RESEND_FROM_EMAIL,
          to: item.recipient,
          subject: "Đặt lại mật khẩu Vô chi",
          text: [
            "Chào bạn,",
            "",
            "Nhấn vào liên kết dưới đây để đặt lại mật khẩu Vô chi:",
            payload.resetUrl,
            "",
            "Liên kết có hiệu lực trong 1 giờ. Nếu bạn không yêu cầu, hãy bỏ qua email này.",
          ].join("\n"),
        });
      } else {
        throw new Error(`Unsupported email type: ${item.type}`);
      }

      await prisma.emailOutbox.update({
        where: { id: item.id },
        data: {
          status: "sent",
          sentAt: new Date(),
        },
      });
      sent += 1;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      await prisma.emailOutbox.update({
        where: { id: item.id },
        data: { status: "failed", lastError: message },
      });
      console.error(JSON.stringify({ event: "email_outbox_failed", outboxId: item.id, error: message }));
    }
  }

  return { processed: pending.length, sent };
}
