import { NextResponse } from "next/server";
import { ZodError } from "zod";

/// A business-level error with an explicit HTTP status. Use this (not plain
/// Error) for client-correctable conditions so the response carries a 4xx — the
/// desktop client relies on 4xx vs 5xx to decide whether to clear a revoked
/// license (4xx) or keep the offline cache on a transient failure (5xx).
export class ApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function jsonOk<T>(body: T, init?: ResponseInit) {
  return NextResponse.json(body, init);
}

export function jsonError(code: string, message: string, status = 400) {
  return NextResponse.json({ error: { code, message } }, { status });
}

export function parseApiError(error: unknown) {
  if (error instanceof ZodError) {
    return { code: "InvalidInput", message: error.issues[0]?.message ?? "Invalid input", status: 400 };
  }
  if (error instanceof ApiError) {
    return { code: error.code, message: error.message, status: error.status };
  }
  if (error instanceof Error) {
    return { code: "ServerError", message: error.message, status: 500 };
  }
  return { code: "ServerError", message: "Unexpected server error", status: 500 };
}

export function clientIp(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
  return req.headers.get("x-real-ip") ?? "unknown";
}
