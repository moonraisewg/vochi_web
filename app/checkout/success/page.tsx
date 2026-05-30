"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { CheckoutResult } from "@/components/CheckoutResult";

function Inner() {
  const params = useSearchParams();
  return <CheckoutResult invoice={params.get("invoice")} tone="success" />;
}

export default function CheckoutSuccessPage() {
  return <PageShell>{() => <Suspense fallback={<div className="h-[60vh]" />}><Inner /></Suspense>}</PageShell>;
}
