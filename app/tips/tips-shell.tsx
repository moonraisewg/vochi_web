"use client";

import { PageShell } from "@/components/PageShell";

// Server pages under /tips render their body into this client shell so Nav +
// Footer keep their lang-toggle behavior. Body is passed as pre-rendered JSX;
// the render-function form of PageShell would not cross the RSC boundary.
export function TipsShell({ children }: { children: React.ReactNode }) {
  return <PageShell>{() => <>{children}</>}</PageShell>;
}
