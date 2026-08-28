import type { Metadata } from "next";
import Link from "next/link";

// Trang 404 phải tự khai noindex: Next trả đúng status 404, nhưng một trang lỗi
// lọt vào index vẫn làm loãng site.
export const metadata: Metadata = {
  title: "Không tìm thấy trang · Vô chi",
  robots: { index: false, follow: true },
};

const LINKS = [
  { href: "/", label: "Trang chủ" },
  { href: "/tips", label: "Blog" },
  { href: "/download", label: "Tải app" },
];

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-[720px] flex-col justify-center px-6">
      <p className="micro text-[var(--color-ink-muted)]">404</p>
      <h1 className="mt-3 font-display text-[34px] leading-[1.05] tracking-tight md:text-[48px]">
        Không có trang này
      </h1>
      <p className="mt-4 text-[17px] leading-[1.6] text-[var(--color-ink-soft)]">
        Đường dẫn sai hoặc bài viết đã đổi tên. Thử một trong những trang dưới đây.
      </p>
      <ul className="mt-8 flex flex-wrap gap-4">
        {LINKS.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-[16px] underline decoration-[var(--color-hairline)] underline-offset-4 hover:decoration-[var(--color-ink)]"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
