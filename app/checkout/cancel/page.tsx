"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { CheckoutResult } from "@/components/CheckoutResult";

function Inner() {
  const params = useSearchParams();
  return <CheckoutResult invoice={params.get("invoice")} tone="cancel" />;
}

export default function CheckoutCancelPage() {
  return <PageShell>{() => <Suspense fallback={<div className="h-[60vh]" />}><Inner /></Suspense>}</PageShell>;
}
