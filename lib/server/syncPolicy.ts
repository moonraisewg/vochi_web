import { z } from "zod";

export const SYNC_PUSH_MAX_BATCH = 1000;
export const CLOCK_SKEW_LIMIT_MS = 5 * 60 * 1000;

const syncEvent = z
  .object({
    eventId: z.string().min(1).max(200),
    eventType: z.enum(["review", "master", "unmaster"]),
    cardUid: z.string().min(1).max(200),
    // Accept 1..4 or omitted; the review/non-review pairing is enforced below.
    rating: z.number().int().min(1).max(4).optional(),
    occurredAt: z.string().datetime(), // ISO-8601, validated
  })
  .refine((e) => (e.eventType === "review") === (e.rating !== undefined), {
    message: "rating must be present iff eventType is 'review'",
    path: ["rating"],
  });

export const pushEventsSchema = z.object({
  events: z.array(syncEvent).min(1).max(SYNC_PUSH_MAX_BATCH),
});

export type PushEventInput = z.infer<typeof syncEvent>;

export const pullChangesSchema = z.object({
  since: z.number().int().min(0),
});
