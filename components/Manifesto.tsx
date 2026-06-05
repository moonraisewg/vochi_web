"use client";

import { motion } from "motion/react";
import Link from "next/link";
import type { Lang } from "./Nav";

const COPY = {
  vi: {
    eyebrow: "Vì sao Vô chi tồn tại",
    pullQuote: [
      "Ta không nhớ những gì",
      "quan trọng nhất.",
      "Ta nhớ những gì",
      "mình gắn bó nhất.",
    ],
    stanzas: [
      [
        "Năm 1996, người ta phát minh ra Tamagotchi,",
        "một sinh vật nhỏ sống trong chiếc máy bé hơn lòng bàn tay.",
      ],
      [
        "Bạn cho nó ăn, chơi với nó, dọn dẹp cho nó.",
        "Nếu quên mất vài ngày, nó sẽ chết.",
      ],
      [
        "Nghe có vẻ vô nghĩa.",
        "Nhưng hàng triệu đứa trẻ đã yêu nó. Mình cũng vậy.",
      ],
      [
        "Đến bây giờ, mình không còn nhớ những bài kiểm tra hồi đó,",
        "nhưng vẫn nhớ cảm giác lo lắng khi Tamagotchi sắp chết.",
      ],
      [
        "Ký ức có một điều kỳ lạ.",
        "Nó không giữ những gì quan trọng nhất,",
        "mà giữ những gì ta gắn bó nhất.",
      ],
      [
        "Rồi một ngày mình tự hỏi:",
        "nếu cảm xúc khiến ta nhớ một con thú ảo suốt hàng chục năm,",
        "liệu nó có giúp ta nhớ từ vựng lâu hơn không?",
      ],
      ["Vô chi bắt đầu từ câu hỏi đó."],
      [
        "Ở đây, bạn không nuôi pet bằng cách bấm nút,",
        "mà bằng những từ mình học được.",
      ],
      [
        "Mỗi từ được ghi nhớ, một chút năng lượng chảy vào thế giới của nó.",
        "Pet lớn lên. Và vốn từ của bạn cũng vậy.",
      ],
      [
        "Không áp lực, không streak, không cảm giác bị ép học.",
        "Chỉ là một sinh vật nhỏ đang đợi bạn quay lại,",
        "và vài từ mới trên đường đi.",
      ],
    ],
    caption:
      "Lấy cảm hứng từ Tamagotchi (1996). Cảm ơn Bandai vì đã vô tình gieo nên ý tưởng này từ rất lâu trước đó.",
  },
  en: {
    eyebrow: "Why Vô chi exists",
    pullQuote: [
      "We don't remember",
      "what was most important.",
      "We remember",
      "what we were most attached to.",
    ],
    stanzas: [
      [
        "In 1996, someone invented Tamagotchi,",
        "a small creature living in a machine smaller than your palm.",
      ],
      [
        "You fed it, played with it, cleaned up after it.",
        "If you forgot for a few days, it died.",
      ],
      [
        "It sounds meaningless.",
        "But millions of children loved it. Including me.",
      ],
      [
        "Today I no longer remember the tests I took back then,",
        "but I still remember the worry of my Tamagotchi being about to die.",
      ],
      [
        "Memory has a strange habit.",
        "It does not keep what is most important,",
        "it keeps what we are most attached to.",
      ],
      [
        "Then one day I asked myself:",
        "if emotion can keep a small creature in my head for decades,",
        "could it help me remember vocabulary longer?",
      ],
      ["Vô chi started from that question."],
      [
        "Here, you do not feed the pet by pressing a button,",
        "you feed it with the words you learn.",
      ],
      [
        "For every word remembered, a little energy flows into its world.",
        "The creature grows. And so does your vocabulary.",
      ],
      [
        "No pressure, no streaks, no feeling of being forced to study.",
        "Just a small creature waiting for you to return,",
        "and a few new words along the way.",
      ],
    ],
    caption:
      "Inspired by Tamagotchi (1996). Thank you, Bandai, for unknowingly planting this idea long before.",
  },
};

export function Manifesto({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  return (
    <section className="relative bg-[var(--color-tint)] px-6 py-20 md:py-28">
      <div className="mx-auto max-w-[1280px]">
        <div className="micro mb-12 text-[var(--color-ink-soft)]">{t.eyebrow}</div>

        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 border-l-2 border-[var(--color-accent)] pl-6 font-display italic text-[28px] leading-[1.2] tracking-tight md:mb-24 md:pl-10 md:text-[44px] md:leading-[1.15] md:max-w-[820px]"
        >
          {t.pullQuote.map((line, i) => (
            <p key={i} className={i >= 2 ? "text-[var(--color-ink-soft)]" : ""}>
              {line}
            </p>
          ))}
        </motion.blockquote>

        <div className="font-display text-[28px] leading-[1.2] tracking-tight md:text-[36px] md:leading-[1.18] space-y-7 md:space-y-10">
          {t.stanzas.map((stanza, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: Math.min(idx, 6) * 0.04, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-1.5"
            >
              {stanza.map((line, i) => (
                <p key={i} className={i === 0 ? "" : "text-[var(--color-ink-soft)]"}>
                  {line}
                </p>
              ))}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10 md:mt-14"
        >
          <Link
            href="/download"
            className="font-display text-[22px] italic tracking-tight text-[var(--color-accent-deep)] underline decoration-[var(--color-accent)]/40 decoration-[1.5px] underline-offset-[6px] transition-colors hover:decoration-[var(--color-accent)] md:text-[28px]"
          >
            {lang === "vi" ? "Mang một em về nuôi →" : "Bring one home →"}
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-20 border-t border-[var(--color-hairline-strong)] pt-6 text-[13px] leading-[1.55] text-[var(--color-ink-muted)] italic"
        >
          {t.caption}
        </motion.div>
      </div>
    </section>
  );
}
