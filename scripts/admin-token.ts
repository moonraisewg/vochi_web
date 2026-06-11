import { adminToken } from "../lib/server/auth";

// Prints the bearer token the /api/admin/license/issue endpoint expects.
// Run with the SAME LICENSE_KEY_ENCRYPTION_SECRET as production so the derived
// token matches:
//   pnpm admin:token
//
// Then call the endpoint:
//   curl -X POST "$APP_BASE_URL/api/admin/license/issue" \
//     -H "authorization: Bearer $(pnpm -s admin:token)" \
//     -H "content-type: application/json" \
//     -d '{"plan":"lifetime","email":"someone@example.com"}'
//
// The token is one-way (HMAC) — the source secret never leaves this machine.
process.stdout.write(`${adminToken()}\n`);
