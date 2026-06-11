import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  SEPAY_ENV: z.enum(["sandbox", "production"]).default("sandbox"),
  SEPAY_MERCHANT_ID: z.string().min(1),
  SEPAY_SECRET_KEY: z.string().min(1),
  SEPAY_IPN_SECRET_KEY: z.string().min(1),
  APP_BASE_URL: z.string().url(),
  RESEND_API_KEY: z.string().min(1).optional(),
  RESEND_FROM_EMAIL: z.string().email().default("Vô chi <licenses@vochi.app>"),
  LICENSE_SIGNING_PRIVATE_KEY: z.string().min(32),
  LICENSE_PUBLIC_KEY: z.string().min(32),
  LICENSE_KEY_ENCRYPTION_SECRET: z.string().min(32),
  JOB_SECRET: z.string().min(24).optional(),
});

let cachedEnv: z.infer<typeof envSchema> | null = null;

export function serverEnv() {
  if (cachedEnv) return cachedEnv;
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const details = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
    throw new Error(`Invalid server environment: ${details}`);
  }
  cachedEnv = parsed.data;
  return cachedEnv;
}

export function appUrl(path: string) {
  const base = serverEnv().APP_BASE_URL.replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function isSameOrigin(origin: string | null) {
  if (!origin) return false;
  return origin === new URL(serverEnv().APP_BASE_URL).origin;
}
