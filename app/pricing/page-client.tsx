"use client";

import { PageShell } from "@/components/PageShell";
import { PricingTeaser } from "@/components/PricingTeaser";
import { FAQ } from "@/components/FAQ";

export default function PricingPage() {
  return (
    <PageShell>
      {(lang) => (
        <>
          <PricingTeaser lang={lang} titleAs="h1" />
          <FAQ lang={lang} />
        </>
      )}
    </PageShell>
  );
}
