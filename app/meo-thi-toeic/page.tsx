import type { Metadata } from "next";
import { TopicHub } from "@/components/TopicHub";
import { buildTopicMetadata, getTopic } from "@/lib/tips/topics";
import { TipsShell } from "../tips/tips-shell";

const topic = getTopic("meo-thi-toeic");

export const metadata: Metadata = buildTopicMetadata(topic);

export default function Page() {
  return (
    <TipsShell>
      <TopicHub topic={topic} />
    </TipsShell>
  );
}
