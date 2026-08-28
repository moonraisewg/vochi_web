"use client";

import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Method } from "@/components/Method";
import { Manifesto } from "@/components/Manifesto";
import { PricingTeaser } from "@/components/PricingTeaser";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";
import { ScrollDots } from "@/components/ScrollDots";
import { SubscribePopup } from "@/components/SubscribePopup";
import { ReferralCodeNotice } from "@/components/ReferralCodeNotice";
import { useLang } from "@/components/LangProvider";

export default function Home() {
  const { lang, setLang } = useLang();

  return (
    <main className="relative">
      <Nav lang={lang} onLangChange={setLang} />
      {/* Chỉ render khi khách tới từ link mời có ?ref=; bình thường là null.
          Đặt trên fold vì đây là thứ người được mời cần thấy trước tiên —
          container khớp Hero để lề trái thẳng hàng với tiêu đề. */}
      <div className="mx-auto max-w-[1280px] px-6">
        <ReferralCodeNotice lang={lang} />
      </div>
      <Hero lang={lang} />
      <Features lang={lang} />
      <Manifesto lang={lang} />
      <Method lang={lang} />
      <PricingTeaser lang={lang} />
      <FAQ lang={lang} />
      <Footer lang={lang} />
      <ScrollDots lang={lang} />
      <FloatingActions />
      <SubscribePopup lang={lang} />
    </main>
  );
}
